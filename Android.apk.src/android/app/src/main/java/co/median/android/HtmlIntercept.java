package co.median.android;

import android.app.Activity;
import android.os.Build;
import android.text.TextUtils;
import android.util.DisplayMetrics;
import android.webkit.WebResourceResponse;

import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import co.median.median_core.AppConfig;
import co.median.median_core.GNLog;
import co.median.median_core.GoNativeWebviewInterface;

/**
 * Created by weiyin on 1/29/16.
 */

public class HtmlIntercept {
    private static final String TAG = HtmlIntercept.class.getName();
    private String interceptUrl;
    private String JSBridgeScript;
    private int deviceWidth = 0;

    // track whether we have intercepted a page at all. We will always try to intercept the first time,
    // because interceptUrl may not have been set if restoring from a bundle.
    private boolean hasIntercepted = false;

    HtmlIntercept(Activity activity) {
        // Device width in CSS pixels (used for initialZoom)
        DisplayMetrics metrics = activity.getResources().getDisplayMetrics();
        int widthPx = metrics.widthPixels;
        float density = metrics.density;
        this.deviceWidth = (int) (widthPx / density);
    }

    public void setInterceptUrl(String interceptUrl) {
        this.interceptUrl = interceptUrl;
    }

    public WebResourceResponse interceptHtml(Activity activity, GoNativeWebviewInterface view, String url, String referer) {

        AppConfig appConfig = AppConfig.getInstance(activity);

        // Ignore intercept for Google Pay URLs to ensure payment flow works
        List<Pattern> googlePaySafeUrlRegex = appConfig.googlePaySafeUrlRegexes;
        if (googlePaySafeUrlRegex != null) {
            for (Pattern pattern: googlePaySafeUrlRegex) {
                if (pattern.matcher(url).matches()) {
                    return null;
                }
            }
        }

        float initialZoom = appConfig.initialZoom;
        double forceViewportWidth = appConfig.forceViewportWidth;
        boolean hasCustomHeaders = appConfig.customHeaders != null && !appConfig.customHeaders.isEmpty();
        boolean hasViewportOverride = initialZoom > 0 || !Double.isNaN(forceViewportWidth);

        if (!appConfig.interceptHtml && !hasCustomHeaders && !hasViewportOverride) {
            return null;
        }

        if (!hasIntercepted) {
            interceptUrl = url;
            hasIntercepted = true;
        }
        if (!urlMatches(interceptUrl, url)) {
            return null;
        }

        InputStream is = null;
        ByteArrayOutputStream baos = null;

        try {
            URL parsedUrl = new URL(url);
            String protocol = parsedUrl.getProtocol();
            if (!protocol.equalsIgnoreCase("http") && !protocol.equalsIgnoreCase("https")) return null;

            HttpURLConnection connection = (HttpURLConnection)parsedUrl.openConnection();

            // Disable automatic redirects to handle them manually.
            connection.setInstanceFollowRedirects(false);

            String customUserAgent = appConfig.userAgentForUrl(parsedUrl.toString());
            if (customUserAgent != null) {
                connection.setRequestProperty("User-Agent", customUserAgent);
            } else {
                if (!TextUtils.isEmpty(appConfig.userAgent)) {
                    connection.setRequestProperty("User-Agent", appConfig.userAgent);
                } else {
                    // create a userAgent with the device userAgent plus additional string
                    connection.setRequestProperty("User-Agent", view.getDefaultUserAgent() + " " + appConfig.userAgentAdd);
                }
            }
            connection.setRequestProperty("Cache-Control", "no-cache");

            if (referer != null) {
                connection.setRequestProperty("Referer", referer);
            }

            connection.setRequestProperty("Accept-Language", Locale.getDefault().toLanguageTag());

            Map<String, String> customHeaders = CustomHeaders.getCustomHeaders(activity);
            if (customHeaders != null) {
                for (Map.Entry<String, String> entry : customHeaders.entrySet()) {
                    connection.setRequestProperty(entry.getKey(), entry.getValue());
                }
            }

            connection.connect();
            int responseCode = connection.getResponseCode();

            if (responseCode == HttpURLConnection.HTTP_MOVED_PERM ||
                    responseCode == HttpURLConnection.HTTP_MOVED_TEMP ||
                    responseCode == HttpURLConnection.HTTP_SEE_OTHER ||
                    responseCode == 307) {
                // This block executes only if automatic redirects are disabled (setInstanceFollowRedirects(false)).
                // Retrieve the redirect URL from the 'Location' header for manual handling.
                String location = connection.getHeaderField("Location");

                // close the current connection
                connection.disconnect();

                // validate location as URL
                try {
                    new URL(location);
                } catch (MalformedURLException ex) {
                    URL base = new URL(url);
                    location = new URL(base, location).toString();
                }

                if (!TextUtils.isEmpty(location)) {
                    // Follow the redirect by calling interceptHtml with the new location.
                    return interceptHtml(activity, view, location, url);
                } else {
                    // If 'location' is empty or invalid, return null to let WebView handle it.
                    return null;
                }
            }

            String mimetype = connection.getContentType();
            if (mimetype == null) {
                try {
                    is = new BufferedInputStream(connection.getInputStream());
                } catch (IOException e) {
                    is = new BufferedInputStream(connection.getErrorStream());
                }
                mimetype = HttpURLConnection.guessContentTypeFromStream(is);
            }

            // if not html, then return null so that webview loads directly.
            if (mimetype == null || !mimetype.startsWith("text/html"))
                return null;

            // get and intercept the data
            String characterEncoding = getCharset(mimetype);
            if (characterEncoding == null) {
                characterEncoding = "UTF-8";
            } else if (characterEncoding.toLowerCase().equals("iso-8859-1")) {
                // windows-1252 is a superset of ios-8859-1 that supports the euro symbol €.
                // The html5 spec actually maps "iso-8859-1" to windows-1252 encoding
                characterEncoding = "windows-1252";
            }

            if (is == null) {
                try {
                    is = new BufferedInputStream(connection.getInputStream());
                } catch (IOException e) {
                    is = new BufferedInputStream(connection.getErrorStream());
                }
            }

            int initialLength = connection.getContentLength();
            if (initialLength < 0)
                initialLength = UrlNavigation.DEFAULT_HTML_SIZE;

            baos = new ByteArrayOutputStream(initialLength);
            IOUtils.copy(is, baos);

            Charset charset = Charset.forName(characterEncoding);

            String html;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                html = baos.toString(charset);
            } else {
                html = new String(baos.toByteArray(), charset);
            }

            // Apply initialZoom and forceViewport
            double viewportWidth = !Double.isNaN(forceViewportWidth)
                    ? forceViewportWidth
                    : (initialZoom > 0 ? deviceWidth / initialZoom : Double.NaN);

            // Only modify if we actually have something valid
            if (initialZoom > 0 || !Double.isNaN(viewportWidth)) {
                html = modifyViewport(html, initialZoom, viewportWidth);
            }

            return new WebResourceResponse(
                    "text/html",
                    StandardCharsets.UTF_8.name(),
                    new ByteArrayInputStream(html.getBytes(StandardCharsets.UTF_8))
            );
        } catch (Exception e) {
            GNLog.getInstance().logError(TAG, e.toString(), e);
            return null;
        } finally {
            IOUtils.close(is);
            IOUtils.close(baos);
        }
    }

    private String modifyViewport(String html, float initialScale, double width) {
        if (html == null || (initialScale <= 0 && Double.isNaN(width))) {
            return html;
        }

        Pattern pattern = Pattern.compile(
                "<meta[^>]*name=[\"']viewport[\"'][^>]*>",
                Pattern.CASE_INSENSITIVE
        );

        Matcher matcher = pattern.matcher(html);

        if (!matcher.find()) return html;

        String metaTag = matcher.group();

        if (initialScale > 0) {
            if (metaTag.contains("initial-scale")) {
                metaTag = metaTag.replaceAll(
                        "initial-scale\\s*=\\s*[^,\"]+",
                        "initial-scale=" + initialScale
                );
            } else {
                metaTag = insertIntoContent(metaTag, "initial-scale=" + initialScale);
            }
        }

        if (!Double.isNaN(width)) {
            String widthValue = (width == (int) width)
                    ? String.valueOf((int) width)
                    : String.valueOf(width);

            if (metaTag.contains("width")) {
                metaTag = metaTag.replaceAll(
                        "width\\s*=\\s*[^,\"]+",
                        "width=" + widthValue
                );
            } else {
                metaTag = insertIntoContent(metaTag, "width=" + widthValue);
            }
        }

        return matcher.replaceFirst(metaTag);
    }

    private String insertIntoContent(String metaTag, String newValue) {
        return metaTag.replaceFirst(
                "content\\s*=\\s*\"([^\"]*)\"",
                "content=\"$1, " + newValue + "\""
        );
    }

    // Do these urls match, ignoring trailing slash in path
    private static boolean urlMatches(String url1, String url2) {
        if (url1 == null || url2 == null) return false;

        try {
            URL u1 = new URL(url1);
            URL u2 = new URL(url2);

            if (!equalsIgnoreCase(u1.getProtocol(), u2.getProtocol())) return false;

            if (!equalsIgnoreCase(u1.getHost(), u2.getHost())) return false;

            int port1 = (u1.getPort() != -1) ? u1.getPort() : u1.getDefaultPort();
            int port2 = (u2.getPort() != -1) ? u2.getPort() : u2.getDefaultPort();
            if (port1 != port2) return false;

            if (!equalsNullable(u1.getQuery(), u2.getQuery())) return false;

            String path1 = normalizePath(u1.getPath());
            String path2 = normalizePath(u2.getPath());

            return path1.equals(path2);
        } catch (MalformedURLException e) {
            return false;
        }
    }

    private static String normalizePath(String path) {
        if (path == null || path.isEmpty()) return "/";

        if (path.endsWith("/") && path.length() > 1) {
            return path.substring(0, path.length() - 1);
        }

        return path;
    }

    private static boolean equalsNullable(String a, String b) {
        return Objects.equals(a, b);
    }

    private static boolean equalsIgnoreCase(String a, String b) {
        return (a == null) ? (b == null) : a.equalsIgnoreCase(b);
    }

    private static String getCharset(String contentType) {
        if (contentType == null || contentType.isEmpty()) {
            return null;
        }

        String[] tokens = contentType.split("; *");
        for (String s : tokens) {
            if (s.startsWith("charset=")) {
                return s.substring("charset=".length());
            }
        }

        return null;
    }
}

# 🔒 Security Policy — Taeafi (تعافي)

## Reporting a Vulnerability

We take the security of **Taeafi** seriously. If you discover any security vulnerability, we appreciate your help in disclosing it responsibly.

### 📧 How to Report

| Method | Details |
|--------|---------|
| **Email** | Contact the developer directly |
| **Telegram** | [@wsl_iq](https://t.me/wsl_iq) |
| **GitHub** | Use private reporting (if enabled) |

> ⚠️ **DO NOT** open a public issue for security vulnerabilities.

### 📋 What to Include

When reporting, please provide:

| Information | Description |
|-------------|-------------|
| **Vulnerability Type** | XSS, CSRF, data exposure, etc. |
| **Affected Component** | Which file/function/page |
| **Steps to Reproduce** | Detailed steps to trigger the bug |
| **Impact** | Potential damage or data exposure |
| **Suggested Fix** | (Optional) Your proposed solution |
| **Environment** | Browser, OS, device details |

### ⏱️ Response Timeline

| Stage | Timeframe |
|-------|-----------|
| **Acknowledgment** | Within 48 hours |
| **Status Update** | Within 5 business days |
| **Security Patch** | Within 30 days of confirmation |
| **Public Disclosure** | After patch is released |

### 🏆 Recognition

With your permission, you will be:
- Credited in the security advisory
- Listed in our **Security Hall of Fame**
- Notified when the fix is deployed

---

## 🛡 Security Practices

### Data Storage & Privacy

| Practice | Implementation |
|----------|---------------|
| **Local Storage Only** | All user data stored in browser LocalStorage |
| **No External Servers** | Zero data transmission to any server |
| **No Analytics** | No tracking, no cookies, no fingerprinting |
| **No Authentication** | No login required — no credentials stored |
| **Offline First** | Fully functional without internet |

### Data Stored Locally

| Data Type | Storage Location | Encrypted |
|-----------|-----------------|-----------|
| User Name | LocalStorage | No (user can use alias) |
| Age | LocalStorage | No |
| Gender | LocalStorage | No |
| Recovery Date | LocalStorage | No |
| Recovery Progress | LocalStorage | No |
| Tasbih Count | LocalStorage | No |
| Theme Preference | LocalStorage | No |
| Notification Settings | LocalStorage | No |

> 📝 **Note:** Data is stored in plain text JSON in the browser's LocalStorage. This is acceptable because:
> 1. No sensitive personal data is collected
> 2. Users can use aliases
> 3. Data never leaves the device
> 4. One-click deletion is available

### What We NEVER Collect

- ❌ Passwords ❌ Credit card info
- ❌ Email addresses ❌ Phone numbers
- ❌ Real names ❌ Addresses
- ❌ Location data ❌ IP addresses
- ❌ Browsing history ❌ Device fingerprints
- ❌ Cookies ❌ Any PII (Personally Identifiable Information)


---

## 🔐 Code Security

### Dependencies

| Aspect | Status |
|--------|--------|
| **External Libraries** | Font Awesome (CDN), Google Fonts (CDN) |
| **JavaScript Libraries** | None — pure vanilla JS |
| **NPM Packages** | None — no package.json |
| **Framework** | None — no framework |
| **Runtime Dependencies** | None |

### Content Security

| Measure | Implementation |
|---------|---------------|
| **XSS Prevention** | No user-generated content, no innerHTML from user input |
| **CSRF** | Not applicable — no server communication |
| **CORS** | Not applicable — no API calls |
| **eval()** | Not used anywhere in the code |
| **innerHTML** | Used only for trusted app-generated content |
| **Sanitization** | Content is hardcoded in JS files |

### Service Worker Security

| Measure | Implementation |
|---------|---------------|
| **Scope** | Limited to app directory |
| **Caching** | Static assets only, no user data cached |
| **HTTPS Required** | Yes (browser requirement for SW) |
| **Update Mechanism** | Automatic via browser |

---

## 🚨 Known Security Limitations

### LocalStorage Limitations

| Limitation | Impact | Mitigation |
|-----------|--------|------------|
| **No Encryption** | Data readable if device compromised | Use device-level encryption, use alias |
| **Browser Storage** | Data lost if browser data cleared | Warn users in documentation |
| **Same-Origin** | Accessible by scripts on same domain | No third-party scripts included |
| **Size Limit** | ~5-10MB per origin | App uses minimal storage (<100KB) |

### PWA Limitations

| Limitation | Impact | Mitigation |
|-----------|--------|------------|
| **Service Worker** | Requires HTTPS in production | GitHub Pages provides HTTPS |
| **Notification API** | Requires user permission | Optional, can be declined |
| **LocalStorage** | Not available in private browsing (some browsers) | Detect and notify user |

---

## ✅ Security Checklist

- [x] No server-side code — no backend vulnerabilities
- [x] No database — no SQL injection risk
- [x] No user authentication — no credential theft risk
- [x] No file uploads — no malware injection risk
- [x] No third-party scripts (except CDN fonts/icons)
- [x] No eval() or Function() constructors
- [x] No cookies — no cookie theft risk
- [x] Content Security Policy compatible
- [x] HTTPS enforced (via GitHub Pages)
- [x] Minimal data collection
- [x] One-click data deletion
- [x] Full source code transparency

---

## 🔄 Security Updates

### Version History

| Version | Date | Security Changes |
|---------|------|-----------------|
| 1.0.0 | 2026 | Initial secure release |

### Update Policy

- Security patches are prioritized over feature updates
- Critical vulnerabilities are patched within 48 hours
- Users are notified via app notifications (if enabled)
- All changes are documented in release notes

---

## 👥 Responsible Disclosure

We follow the principle of **responsible disclosure**:

1. 🔍 **Discover** — Security researcher finds vulnerability
2. 📧 **Report** — Private report to developer
3. ⏳ **Wait** — Allow time for fix development
4. 🔧 **Fix** — Developer creates and tests patch
5. 📢 **Disclose** — Coordinated public announcement
6. 🏆 **Credit** — Researcher receives recognition

---

## 📞 Contact for Security Issues

| Channel | Link |
|---------|------|
| **Telegram** | [@wsl_iq](https://t.me/wsl_iq) |
| **Instagram** | [@g6xs0r](https://www.instagram.com/g6xs0r/) |
| **GitHub** | [wsl-iq](https://github.com/wsl-iq) |

> 🔒 **PGP Key:** Not available yet — will be added in future releases.

---

## 📚 References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web App Security Best Practices](https://developer.mozilla.org/en-US/docs/Web/Security)
- [PWA Security Considerations](https://web.dev/progressive-web-apps/)
- [LocalStorage Security](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage#security)

---

## 📄 Related Documents

| Document | Link |
|----------|------|
| Privacy Policy | [PRIVACY_POLICY.md](PRIVACY_POLICY.md) |
| Terms of Service | [TERMS_OF_SERVICE.md](TERMS_OF_SERVICE.md) |
| Code of Conduct | [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) |
| Contributing | [CONTRIBUTING.md](CONTRIBUTING.md) |
| License | [LICENSE](LICENSE) |

---

<p align="center">
  <strong>Security is a shared responsibility. Thank you for helping keep Taeafi safe! 🛡</strong>
</p>

<p align="center">
  <sub>Last updated: 2026</sub>
</p>

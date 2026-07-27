# 🔒 Privacy Policy — Taeafi (تعافي)

**Last Updated:** 2026

---

## 📋 Table of Contents

- [Introduction](#-introduction)
- [Information We Collect](#-information-we-collect)
- [How We Use Information](#-how-we-use-information)
- [Data Storage](#-data-storage)
- [Notifications](#-notifications)
- [Service Worker](#-service-worker)
- [Third-Party Services](#-third-party-services)
- [Data Security](#-data-security)
- [User Rights](#-user-rights)
- [Children's Privacy](#-childrens-privacy)
- [Changes to This Policy](#-changes-to-this-policy)
- [Open Source Transparency](#-open-source-transparency)
- [Contact Us](#-contact-us)

---

## 📖 Introduction

**Taeafi** ("تعافي" — Arabic for "Recovery") is a Progressive Web Application (PWA) designed to help individuals overcome harmful habits through education, psychological support, and spiritual guidance.

This Privacy Policy explains how we handle your information when you use Taeafi. We are committed to protecting your privacy and being transparent about our data practices.

### Our Privacy Philosophy

> **"Your data is yours. It stays on your device. We don't want it, we don't collect it, we don't see it."**

| Principle | Implementation |
|-----------|---------------|
| 🔒 **Local First** | All data stored on your device only |
| 🚫 **No Servers** | We have no backend servers to collect data |
| 👁️ **No Tracking** | Zero analytics, zero cookies, zero tracking |
| 🎛️ **User Control** | Full control: view, edit, delete anytime |
| 📖 **Transparent** | Source code is open for anyone to inspect |

---

## 📊 Information We Collect

### Information You Provide (Optional)

When you first use the app, you are asked to provide:

| Data | Required | Purpose | Can Use Alias? |
|------|----------|---------|----------------|
| **Name** | ❌ No | Personalization & greeting | ✅ Yes |
| **Age** | ❌ No | Content customization | ✅ Approximate |
| **Gender** | ❌ No | Gender-specific health content | — |

> 💡 **You can skip all fields or use a pseudonym. The app works perfectly without any personal information.**

### Information Stored Locally

All the following data is stored **exclusively on your device** using the browser's LocalStorage API:

| Data Category | Specific Data | Storage Location |
|---------------|---------------|-----------------|
| **Profile** | Name, age, gender | LocalStorage |
| **Recovery** | Start date, habit type, relapse history | LocalStorage |
| **Tasbih** | Prayer counts, completion history | LocalStorage |
| **Settings** | Theme preference, notification preferences | LocalStorage |
| **Permissions** | Notification permission status | LocalStorage |
| **Progress** | Last visited page, app version | LocalStorage |

### Information We DO NOT Collect

| Category | Status |
|----------|--------|
| 📍 **Location / GPS** | ❌ Not collected |
| 🌐 **IP Address** | ❌ Not collected |
| 📱 **Device Information** | ❌ Not collected |
| 🔍 **Browsing History** | ❌ Not collected |
| 📧 **Email Address** | ❌ Not collected |
| 📞 **Phone Number** | ❌ Not collected |
| 💳 **Payment Information** | ❌ Not collected |
| 🍪 **Cookies (Tracking)** | ❌ Not used |
| 📊 **Analytics Data** | ❌ Not collected |
| 👤 **Personal Identifiers** | ❌ Not collected |

---

## 🎯 How We Use Information

### All Data Usage is Local

| Data | Usage | Where Processing Happens |
|------|-------|------------------------|
| Name | Display greeting on home screen | Your device |
| Age | Tailor content age-appropriateness | Your device |
| Gender | Show male/female-specific health info | Your device |
| Recovery Date | Calculate recovery duration | Your device |
| Relapse History | Track recovery progress | Your device |
| Tasbih Count | Display prayer completion | Your device |
| Theme Setting | Apply light/dark/auto theme | Your device |
| Notification Setting | Enable/disable reminders | Your device |

### What We DON'T Do With Your Data
❌ Sell your data
❌ Share with third parties
❌ Use for advertising
❌ Upload to cloud servers
❌ Analyze for research
❌ Profile your behavior
❌ Send marketing communications
❌ Transfer outside your device

---

## 💾 Data Storage

### LocalStorage Details

| Property | Details |
|----------|---------|
| **Technology** | Browser LocalStorage API |
| **Location** | Your device's browser storage |
| **Encryption** | Not encrypted (see note below) |
| **Persistence** | Until you clear browser data |
| **Size Used** | Less than 100KB typically |
| **Access** | Only by Taeafi app on same domain |

> ⚠️ **Note on Encryption:** LocalStorage data is stored in plain text. However, since:
> 1. No sensitive personal data is collected
> 2. You can use aliases
> 3. Data never leaves your device
> 4. You can delete all data with one click
> 
> This is an acceptable security level for this type of application.

### Data Structure Example

```json
{
  "taafi_user_data": {
    "value": {
      "name": "User Alias",
      "age": 25,
      "gender": "male",
      "createdAt": "2026-01-01T00:00:00.000Z"
    },
    "timestamp": 1700000000000
  },
  "taafi_recovery_data": {
    "value": {
      "startDate": "2026-01-01T00:00:00.000Z",
      "habitType": "masturbation",
      "relapses": []
    },
    "timestamp": 1700000000000
  }
}
```

### Data Keys Used

| Storage Key | Content |
|-------------|---------|
| taafi_user_data | User profile information |
| taafi_recovery_data | Recovery tracking data |
| taafi_settings | App settings & preferences |
| taafi_progress | App usage progress |
| taafi_last_visit | Last visit timestamp |
| taafi_tasbih_data | Prayer counter data |

---

## 🔔 Notifications

Taeafi can send optional notifications for:

| Notification Type | Purpose | Frequency |
|-------------------|---------|-----------|
| Daily Reminder | Remind of spiritual practices | Once daily |
| Motivational | Encourage recovery progress | Periodic |
| Recovery Milestone | Celebrate recovery achievements | On milestones |
| Tasbih Reminder | Remind of prayer beads | Optional |

### Notification Permissions

| Aspect | Details |
|--------|---------|
| Request Timing | Only after you complete onboarding |
| Permission Type | Browser Notification API |
| Opt-out | Decline at prompt or disable in Settings |
| Revoke | Can be changed anytime in browser settings |
| Data Used | Only your notification preference (yes/no) |

### How Notifications Work

1. App requests permission ──→ You accept or decline
2. If accepted ──→ Notifications stored locally
3. Service Worker ──→ Shows notifications even when app is closed
4. You ──→ Can disable anytime in Settings
5. No data ──→ Sent to any server during notifications

---

## ⚙ Service Worker

Taeafi uses a Service Worker for:

| Function | Purpose | Data Access |
|----------|---------|-------------|
| Offline Caching | Cache app files for offline use | Static files only |
| Push Notifications | Display notification prompts | Notification content only |
| Background Sync | Not used | N/A |

### Service Worker Data

| What's Cached | What's NOT Cached |
|---------------|------------------|
| HTML files | User data |
| CSS files | Recovery data |
| JavaScript files | Tasbih counts |
| Font files | Settings |
| Icon files | Any personal info |

---

## 🔗 Third-Party Services

### External Resources

| Service | Purpose | Data Shared |
|---------|---------|-------------|
| Google Fonts | Load Amiri, Cairo, Tajawal fonts | IP address (standard HTTP) |
| Font Awesome CDN | Load icon library | IP address (standard HTTP) |
| GitHub Pages | Host the application | None beyond hosting |

### What Third Parties Receive

Service | Information Received
---|---
Google Fonts | Standard HTTP request (IP, user agent)
Font Awesome | Standard HTTP request (IP, user agent)
GitHub Pages | Standard web server logs

📝 Note: These are standard HTTP requests that occur when loading any website. No personal data from the app is shared with these services.

### Self-Hosting Option

For maximum privacy, you can self-host the fonts and icons:
- Download font files and host locally
- Download Font Awesome and host locally
- Update HTML to use local paths

---

## 🛡 Data Security

### Security Measures

| Measure | Implementation |
|---------|----------------|
| Local Storage | Data never transmitted over network |
| HTTPS | Required for PWA (provided by GitHub Pages) |
| No Database | No server-side vulnerabilities |
| No API | No API endpoints to exploit |
| No Authentication | No credentials to steal |
| Input Validation | Minimal user input, all sanitized |
| CSP Compatible | Can work with strict Content Security Policy |

### User Responsibilities

| Responsibility | Why |
|----------------|-----|
| Device Security | Keep your device locked/password-protected |
| Browser Updates | Use latest browser version |
| Clear Data | Clear browser data before selling/giving away device |
| Public Computers | Don't use on shared/public devices |
| Alias Usage | Use a pseudonym if desired |

---

## ✋ User Rights

| Your Data Rights | How to Exercise |
|------------------|------------------|
| 🔍 Access | All data visible in app interface |
| ✏️ Rectify | Edit from Settings page |
| 🗑️ Delete | "Delete All Data" button in Settings |
| 🚫 Restrict | Decline notifications, skip personal info |
| 📤 Export | Data in JSON format in LocalStorage |
| ❌ Object | Stop using the app, delete all data |

### How to Delete Your Data

Method 1: Within the App
- Settings → Danger Zone → Delete All Data → Confirm

Method 2: Browser Settings
- Browser Settings → Privacy & Security → Clear Browsing Data → Local Storage

Method 3: Developer Console
```javascript
// Open Console (F12) and run:
localStorage.clear();
location.reload();
```

---

## 👶 Children's Privacy

| Aspect | Details |
|--------|---------|
| Age Restriction | No minimum age requirement |
| Content Rating | Educational, spiritual — appropriate for all ages |
| Data Collection | Same minimal collection for all users |
| Parental Consent | Not required (no data leaves device) |
| COPPA Compliance | No personal data collected from anyone |

---

## 🔄 Changes to This Policy

### Update Process

Step | Action
---|---
1 | Policy updated in repository
2 | "Last Updated" date changed
3 | Users notified via app (if notifications enabled)
4 | Changelog updated

### Version History

Version | Date | Changes
---|---|---
1.0 | 2026 | Initial privacy policy

---

## 📖 Open Source Transparency

Taeafi is 100% open source under the MIT License.

| Benefit | Details |
|---------|---------|
| 🔍 Auditable | Anyone can inspect the code |
| 🛡 Verifiable | Verify no hidden data collection |
| 🤝 Community | Community can flag privacy issues |
| 📂 Repository | github.com/wsl-iq/taeafi |

### Verify Our Claims

You can personally verify our privacy claims by:
- Inspecting the Code: All source code is on GitHub
- Network Tab: Open DevTools → Network — no data sent to servers
- Application Tab: DevTools → Application → LocalStorage — see all stored data
- Service Worker: DevTools → Application → Service Workers — inspect caching

---

## ❓ FAQ

Q: Can you see my recovery data?
A: No. All data is stored locally on your device. We have no servers, no databases, and no way to access your data.

Q: What happens if I clear my browser data?
A: All Taeafi data will be deleted. This includes your profile, recovery progress, and settings. You'll start fresh on next visit.

Q: Is my data backed up?
A: No. There is no cloud backup. If you clear browser data or switch devices, your data is lost. Consider this a privacy feature.

Q: Can I transfer data to a new device?
A: Not automatically. Since data is local-only, you'd need to start fresh on a new device.

Q: Do you use cookies?
A: No tracking cookies. The app uses LocalStorage (not cookies) for essential functionality only.

Q: Is the app GDPR compliant?
A: Yes. Since we collect no personal data and process everything locally, GDPR requirements are inherently satisfied.

Q: Can I use the app completely anonymously?
A: Absolutely. Skip the name field, use an approximate age, and you're anonymous.

---

## 📞 Contact Us

If you have questions about this Privacy Policy:

Channel | Details
---|---
Telegram | @wsl_iq
Instagram | @g6xs0r
GitHub Issues | Open an Issue
GitHub Discussions | Start Discussion

---

## 📄 Related Documents

Document | Link
---|---
Terms of Service | TERMS_OF_SERVICE.md
Security Policy | SECURITY.md
Code of Conduct | CODE_OF_CONDUCT.md
Contributing | CONTRIBUTING.md
License | LICENSE

---

## ✅ Your Consent

By using Taeafi, you acknowledge that:

- ☑ You have read and understood this Privacy Policy
- ☑ You understand data is stored locally on your device
- ☑ You know how to delete your data
- ☑ You understand no data is sent to external servers
- ☑ You can stop using the app at any time

<p align="center"> <strong>🔒 Your privacy is our priority. Your data is yours alone.</strong> </p>
<p align="center"> <em>No servers. No tracking. No data collection. Just you and your journey to recovery.</em> </p>
<p align="center"> <sub>© 2026 Taeafi. All rights reserved.</sub> </p>

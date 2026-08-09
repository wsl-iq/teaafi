# Taeafi (تعافي) - Recovery & Spiritual Wellness App

<p align="center">
  <img src="icon.png" alt="Taeafi Icon" width="120" />
</p>

**Your Journey to Recovery, Healing, and Spiritual Growth**

[About](#-about) • [Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Project Structure](#-project-structure) • [Pages Overview](#-pages-overview) • [Contributing](#-contributing) • [License](#-license)

![Version](https://img.shields.io/badge/version-1.1.2-blue.svg) ![License](https://img.shields.io/badge/license-MIT-green.svg) ![Platform](https://img.shields.io/badge/platform-web%20%7C%20mobile%20%7C%20desktop-orange.svg) ![PWA](https://img.shields.io/badge/PWA-ready-purple.svg) ![Language](https://img.shields.io/badge/language-Arabic%20%7C%20RTL-red.svg)

---

# *About*

**Taeafi** (تعافي) — Arabic for **"Recovery"** — is a comprehensive Progressive Web Application (PWA) designed to help individuals overcome harmful habits and build a healthier, more fulfilling lifestyle.

The application combines:
- **Scientifically-backed information**
- **Psychological & behavioral support**
- **Spiritual strengthening**
- **Complete privacy** (all data stored locally)

# *Mission*

To provide a **safe, private, and effective digital companion** for anyone seeking to break free from destructive habits — offering evidence-based content, progress tracking, and spiritual fortification.

# *Core Philosophy*

| Principle | Description |
|-----------|-------------|
| **Science-Based** | All health & psychological information is documented and referenced |
| **Compassionate** | Calm, respectful language — no fear-mongering or shaming |
| **Holistic** | Addresses psychological, physical, social, and spiritual dimensions |
| **Private** | All data stored locally — nothing leaves your device |
| **Inclusive** | Content tailored for both men and women |
| **Open Source** | Transparent, auditable, community-driven |

---

# *Features*

### Core Features

| Category | Features |
|----------|----------|
| **Habit Education** | Detailed info on masturbation, pornography, and smoking |
| **Gender-Specific** | Separate health content for males and females |
| **Recovery Tracker** | Live counter (seconds → years) with motivational messages |
| **Milestone System** | Stage-by-stage recovery improvements & challenges |
| **Spiritual Section** | Quranic verses, supplications, Ahlulbayt (AS) teachings |
| **Digital Tasbih** | Interactive Tasbih of Fatima Al-Zahra (AS) counter |
| **Theme Support** | Light / Dark / Auto |
| **Notifications** | Optional daily reminders & motivational alerts |
| **Cross-Device** | Responsive for mobile, tablet, and desktop |
| **Offline Ready** | Full PWA with Service Worker caching |

# *Technical Features*

| Feature | Implementation |
|---------|---------------|
| **PWA** | Installable, works offline |
| **Service Worker** | Caching + push notifications |
| **LocalStorage** | All data stored locally |
| **No Dependencies** | Pure HTML5, CSS3, vanilla JavaScript ES6+ |
| **RTL Support** | Full right-to-left Arabic |
| **Touch Optimized** | Mobile-first design |
| **Responsive** | 3 breakpoints (mobile, tablet, desktop) |

---

# *Tech Stack*

| Technology | Usage |
|------------|-------|
| **HTML5** | Semantic markup, PWA manifest, metadata |
| **CSS3** | Custom properties, Flexbox, Grid, animations |
| **JavaScript ES6+** | Classes, LocalStorage API, Notification API |
| **Font Awesome 6.5** | UI icons |
| **Google Fonts** | Amiri, Cairo, Tajawal |
| **JSON** | Content data & settings storage |
| **Service Worker** | Offline caching, push notifications |

# *Browser Support*

| Browser | Status |
|---------|--------|
| Chrome | ✅ Full |
| Firefox | ✅ Full |
| Safari | ✅ Full (iOS 12+) |
| Edge | ✅ Full |
| Samsung Internet | ✅ Full |
| Opera | ✅ Full |

---

# *Installation*

### Method 1: Direct Use (Recommended)

1. Visit: `https://username.github.io/taeafi/`
2. Click **"Install"** or **"Add to Home Screen"**
3. App installs as standalone PWA

### Method 2: Local Installation

```bash
# Clone repository
git clone https://github.com/username/taeafi.git

# Navigate to folder
cd taeafi

# Serve locally
# Python
python -m http.server 8000

# Node.js
npx http-server

# VS Code
# Right-click index.html → "Open with Live Server"
```

### Method 3: GitHub Pages

1. Fork repository
2. Go to Settings → Pages
3. Set Branch: `main` and Folder: `/ (root)`
4. Click Save

---

## Pages Overview

1. **Splash Screen**
   - Animated welcome screen with logo and loading indicator.

2. **Welcome Screen (First Run)**
   - Three-step onboarding:
     - Name (optional, alias accepted)
     - Age (for content customization)
     - Gender (for personalized health info)

3. **Home Dashboard**
   - Personalized greeting
   - Active recovery counter
   - Quick access cards

4. **Habits Section**
   - Habit: Masturbation, Pornography, Smoking
   - Icon, content, and recovery guidance

   **Gender-Specific Content**

   | Habit | Male Focus | Female Focus |
   |-------|------------|--------------|
   | Masturbation | Prostate health, testosterone, erectile function | Menstrual cycle, pelvic health, female hormones |
   | Pornography | Performance anxiety, body comparison | Body image, self-esteem, expectations |
   | Smoking | Sperm quality, testosterone | Fertility, pregnancy risks, early menopause |

   - Toggle feature: Users can switch between male/female content for educational purposes.

5. **Spiritual Section (التحصين الإيماني)**

   | Section | Content |
   |---------|---------|
   | Prophet's Sayings | Hadith from Prophet Muhammad (PBUH & his household) |
   | Imam Ali's Wisdom | Sayings from Nahj al-Balagha |
   | Ahlulbayt Duas | Supplications from Sahifa al-Sajjadiyya & others |
   | Quranic Verses | Key verses with sources |
   | Morning Adhkar | Daily morning remembrances |
   | Evening Adhkar | Daily evening remembrances |
   | Repentance Duas | Prayers for forgiveness |
   | Steadfastness Duas | Prayers for firmness in faith |
   | Protection Duas | Prayers for divine protection |
   | Willpower Tips | Practical advice from Ahlulbayt teachings |

6. **Digital Tasbih (التسبيح)**

   Tasbih of Fatima Al-Zahra (AS):

   | Dhikr | Count | Color |
   |-------|-------|-------|
   | Allahu Akbar (الله أكبر) | 34 | 🟢 Green |
   | Alhamdulillah (الحمد لله) | 33 | 🔵 Blue |
   | Subhan Allah (سبحان الله) | 33 | 🟠 Orange |

   - Tap counter (mobile vibration support)
   - Auto-advance to next dhikr
   - Visual progress bar
   - Completion celebration
   - Reset/undo options
   - History log (last 10 completions)

7. **Recovery Tracker**

   - Live counter display: seconds, minutes, hours, days, weeks, months, years
   - Total hours elapsed
   - Motivational system with messages changing based on recovery duration
   - Separate message sets for each habit type
   - Manual refresh for new message

   **Recovery Stages**

   | Stage | Time | Key Improvements |
   |-------|------|------------------|
   | 🚀 Beginning | Day 1 | Decision to change |
   | 🔥 Critical Phase | Day 3 | Peak withdrawal |
   | 🏆 First Victory | Week 1 | Improved mood & focus |
   | 📈 Stability | Week 2 | Withdrawal symptoms fade |
   | 🥇 Month 1 | 30 days | Psychological stability |
   | 💎 Advanced | 60 days | New positive habits |
   | 👑 Full Recovery | 90 days | Complete behavioral freedom |
   | 🌟 Milestone | 180 days | New identity formed |
   | 🎖️ Annual | 365 days | One year of freedom |

8. **Policies Page**
   - Privacy Policy — Data handling & user rights
   - Terms of Service — Usage rules & disclaimers
   - MIT License — Open source terms
   - Code of Conduct — Community standards
   - Contributing Guide — How to help
   - Security Policy — Vulnerability reporting

9. **Settings**

   - Theme: Light / Dark / Auto
   - Notifications: Enable/disable + daily reminders
   - About App: Mission & goals
   - About Developer: Mohammed Al-Baqer + social links
   - Danger Zone: Reset/delete all data

   **Theme System**

   | Theme | Best For | Preview |
   |-------|----------|---------|
   | Light | Daytime, bright environments | White backgrounds, dark text |
   | Dark | Night, low light, battery saving | Dark backgrounds, light text |
   | Auto | Follows system preference | Automatic switching |

   ```css
   /* Theme implementation via CSS custom properties */
   :root {
       --surface: #FFFFFF;
       --background: #F0F2F5;
       --text-primary: #1A1C1E;
   }

   .theme-dark {
       --surface: #1E1E1E;
       --background: #121212;
       --text-primary: #E0E0E0;
   }
   ```

---

## Privacy & Security

**Data Storage Philosophy**

"Your data never leaves your device."

| Aspect | Implementation |
|--------|----------------|
| Storage | Browser LocalStorage only |
| External Servers | None — zero data transmission |
| Analytics | No tracking scripts |
| Cookies | None (except essential storage) |
| Offline | Fully functional without internet |

**Data Collected**

| Data | Purpose | Required |
|------|---------|----------|
| Name | Personalization | ❌ No (alias OK) |
| Age | Content tailoring | ❌ No |
| Gender | Health content | ❌ No |
| Recovery Date | Progress tracking | For recovery feature |
| Tasbih Count | Spiritual tracking | For tasbih feature |
| Theme | UI preference | Auto (default: light) |

**What We NEVER Collect**

- ❌ Location
- ❌ Browsing history
- ❌ Contacts
- ❌ Device info
- ❌ IP address
- ❌ Any identifiers

**User Rights**

| Right | How | Access |
|-------|-----|--------|
| All data visible | In app |
| Correct | Edit from settings |
| Delete | One-click data wipe |
| Refuse | Decline notifications, use alias |
| Audit | Full source code available |

---

## Contributing

We welcome contributions! See `CONTRIBUTING.md` for full guidelines.

### Quick Start

```bash
# Fork & clone
git clone https://github.com/your-username/taeafi.git

# Create branch
git checkout -b feature/amazing-feature

# Commit changes
git commit -m 'إضافة: وصف الميزة'

# Push
git push origin feature/amazing-feature

# Open Pull Request
```

### Contribution Areas

| Area | Examples |
|------|----------|
| 🐛 Bugs | Report & fix issues |
| ✨ Features | New functionality |
| 📝 Content | Improve accuracy, add references |
| 🎨 UI/UX | Design improvements |
| 🌍 Translation | Add language support |
| ♿ Accessibility | Improve a11y |
| ⚡ Performance | Optimize code |

### Commit Convention

| Prefix | Meaning |
|--------|---------|
| إضافة: | New feature |
| تصحيح: | Bug fix |
| تحديث: | Update |
| تحسين: | Improvement |
| توثيق: | Documentation |

---

## License

This project is licensed under the MIT License.

MIT License

Copyright (c) 2026 Mohammed Al-Baqer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

| Permissions | Action | Status |
|-------------|--------|--------|
| Commercial use | ✅ Allowed |
| Modification | ✅ Allowed |
| Distribution | ✅ Allowed |
| Private use | ✅ Allowed |
| Sublicensing | ✅ Allowed |
| Liability | ❌ None |
| Warranty | ❌ None |

---

## Developer

**Mohammed Al-Baqer**

_Software Developer | Desktop & Web Applications_

- [Instagram](https://www.instagram.com/g6xs0r/)
- [Telegram](https://t.me/wsl_iq)
- [GitHub](https://github.com/wsl-iq)

---

## Dedication

> This application was created as an ongoing charity (صدقة جارية) for myself and my parents. I ask Allah to benefit everyone who uses it and to make it a means of guidance, reformation, and assistance in abandoning harmful habits.

---

## Screenshots

- Mobile
- Tablet
- Desktop

Home • Dashboard
Habits • Sidebar
Recovery • Content
Settings • Settings

Screenshots coming soon

---

## Changelog

**v1.0.0 (2026) — Initial Release**

- ✅ Complete habit information system
- ✅ Recovery tracker with live counter
- ✅ Spiritual content section
- ✅ Digital tasbih counter
- ✅ Dark/light/auto theme support
- ✅ PWA with offline functionality
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Notification system
- ✅ Privacy controls
- ✅ Gender-specific content
- ✅ Motivational message system

---

## Acknowledgments

### Resource Usage

- Font Awesome — Icon library
- Google Fonts — Amiri, Cairo, Tajawal fonts
- Ahlulbayt (AS) — Spiritual teachings & supplications
- All Contributors — Helping improve this app

### Support

- Bug Reports: GitHub Issues
- Discussions: GitHub Discussions
- Security: See `SECURITY.md`

If you find this project useful, please consider giving it a star ⭐

**Made with ❤️ for the betterment of humanity**

© 2026 Mohammed Al-Baqer. All rights reserved.

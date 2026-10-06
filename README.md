### *Taeafi* **(تعافي)** — *Recovery & Spiritual Wellness App*

<p align="center">
  <img src="icon.png" alt="Taeafi Icon" width="120" />
</p>

**Your Journey to Recovery, Healing, and Spiritual Growth**

[About](#-about) • [Features](#-features) • [How It Works](#-how-it-works) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Project Structure](#-project-structure) • [Pages Overview](#-pages-overview) • [Privacy](#-privacy-and-security) • [Contributing](#-contributing) • [License](#-license)

![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-web%20%7C%20mobile%20%7C%20desktop-orange.svg)
![PWA](https://img.shields.io/badge/PWA-ready-purple.svg)
![Language](https://img.shields.io/badge/language-English%20%7C%20Arabic%20%7C%20RTL-red.svg)

---

## About

**Taeafi (تعافي)** — Arabic for **"Recovery"** — is a comprehensive Progressive Web Application (PWA) designed to help individuals overcome harmful habits and build a healthier, more fulfilling lifestyle.

The application combines:

- Scientifically backed information
- Psychological and behavioral support
- Spiritual strengthening
- Complete privacy, with all personal data stored locally

### Mission

To provide a safe, private, and effective digital companion for anyone seeking to break free from destructive habits — offering evidence-based content, progress tracking, and spiritual fortification.

### Core Philosophy

| Principle | Description |
| :-------- | :---------- |
| Science-Based | Health and psychological information is documented and referenced |
| Compassionate | Calm, respectful language — no fear-mongering or shaming |
| Holistic | Addresses psychological, physical, social, and spiritual dimensions |
| Private | All personal data is stored locally — nothing leaves your device |
| Inclusive | Content tailored for both men and women |
| Open Source | Transparent, auditable, community-driven |

---

## What Taeafi Is

Taeafi is not a single-purpose tool. It is a complete environment for someone who is walking a recovery journey. Every screen, every action, and every piece of content is designed around one goal: helping the user understand their habit, track their progress, and stay on the path.

The application serves three audiences at once:

1. **Someone who wants to understand a habit.** Taeafi explains what the habit is, how it affects the body and mind, what the scientific and religious positions are, and how to begin recovery. The content covers 22 habits across three categories:
   - Physical health (smoking, alcohol, drugs, poor nutrition, inactivity, sleep disorders, caffeine)
   - Psychological and behavioral health (masturbation, pornography, gaming, social media, smartphone, procrastination, gambling, nail biting, adultery)
   - Social habits (lying, anger, bullying, overspending, isolation)

2. **Someone who is actively recovering.** Taeafi provides a live counter that runs every second, a milestone system that shows what to expect at each stage, relapse tracking with a full analysis engine, a 21-day discipline challenge, an XP and leveling system, achievements, and a leaderboard of personal records.

3. **Someone who wants spiritual support.** Taeafi includes Quranic verses, sayings of the Prophet Muhammad (PBUH) and his household, supplications from Ahlulbayt (AS), morning and evening adhkar, a digital tasbih in two modes, a personal prayer box, and a prayer assistant.

Everything is available in one place, with a consistent design, full Arabic RTL support, and complete privacy.

---

## Features

### Core Features

| Category | Features |
| :------- | :------- |
| Habit Education | Detailed, referenced information on 22 harmful habits |
| Gender-Specific Content | Separate health content for males and females, with a toggle to switch views |
| Multi-Habit Recovery | Independent counters, relapses, and statistics for up to 4 habits simultaneously |
| Recovery Tracker | Live counter (seconds to years) with motivational messages that change with progress |
| Milestone System | Stage-by-stage improvements and challenges from day one to one year |
| Relapse Analysis | Optional modal on each relapse collecting trigger, feeling, and lesson, with a full report page |
| Habit Deep Dive | 60-day heatmap, dangerous hours, dangerous days, monthly comparison, and personal notes per habit |
| Spiritual Section | Quranic verses, Prophet's sayings, Imam Ali's wisdom, Ahlulbayt duas, morning and evening adhkar |
| Digital Tasbih | Two modes: Tasbih of Fatima Al-Zahra (34 + 33 + 33) and Open Tasbih with custom dhikr |
| XP System | 10 levels with an inline progress bar and rewards for recovery actions |
| Quick Actions | Floating button with 5 quick actions: tasbih, quick note, breathing exercise, relapse log, emergency mode |
| 21-Day Challenge | Structured daily discipline program with tasks, scoring, history, and relapse tracking |
| Journal | Daily mood tracking and free-form notes with statistics |
| Quiz | 100-question self-assessment with random selection, category breakdown, and history |
| Calendar | Monthly visual view of clean days and relapses |
| Nutrition and Exercise | Daily meal plans, weekly exercise routines, and a food conflict checker |
| Prayer Assistant | Step-by-step prayer tracker for recording rukuh and sujud |
| Prayer Box | Save personal duas and revisit them anytime |
| Leaderboard | Personal records, weekly challenges, and level progress |
| Duas and Ziyarat | A library of classic supplications and pilgrimages |
| Themes | 5 themes (green, pink, desert, ocean, ramadan) with light, dark, and auto modes |
| App Lock | 6-digit PIN with encrypted recovery code |
| Notifications | Optional daily reminders and motivational alerts |
| Backup and Restore | Export and import all user data as a JSON file |
| Search | Full-text search across habits, duas, adhkar, and verses |
| Cross-Device | Responsive for mobile, tablet, and desktop |
| Offline Ready | Full PWA with Service Worker caching |

### Technical Features

| Feature | Implementation |
| :------ | :------------- |
| PWA | Installable and works offline |
| Service Worker | Caching and push notifications |
| LocalStorage | All primary application data is stored locally |
| IndexedDB | Backup persistence for user data |
| WebAssembly Module | Optional optimization module: memory pool, RLE compression, binary search, quick sort, hashing, and LRU cache |
| Unified Dialog System | All confirmations and alerts use a single CSS-based dialog engine |
| No Dependencies | Pure HTML5, CSS3, and vanilla JavaScript ES6+ |
| RTL Support | Full right-to-left Arabic interface |
| Touch Optimized | Mobile-first design |
| Responsive | 3 breakpoints (mobile, tablet, desktop) |

---

## How It Works

### Onboarding

When a user opens Taeafi for the first time, they are guided through a short onboarding flow that asks for a name (optional), age, gender, and the first habit they want to recover from. They also pick a theme and accept a recovery pact. All of this information stays on the device and can be edited later from settings.

### Daily Use

The home screen is the central hub. From there the user can:

- See how long they have been in recovery.
- Check their XP and level.
- Open any section of the app.
- Use the Quick Actions button for immediate support.

### Recovery Tracking

When a user starts a recovery journey, a live counter begins. It runs continuously and shows the elapsed time from seconds to years. If a user records a relapse, the counter resets and a new journey begins, while the previous journey is preserved in the statistics and relapse analysis.

Multiple habits can be tracked at once. Each habit has its own counter, relapses, and analytics.

### Relapse Analysis

When a relapse occurs, the user is offered a short optional modal that asks three questions:

1. What triggered the relapse (12 options including stress, loneliness, boredom, late night, phone, family, financial, provocative content, sleep loss, anger, sadness, and other).
2. How they feel now (regret, frustrated, neutral, determined).
3. What lesson they learned (free text, optional).

The analysis page then shows a full report with summary cards, bar charts for triggers and hours, a distribution of feelings, and the lessons learned. The purpose is not to judge, but to help the user identify personal patterns.

### Habit Deep Dive

Every habit page includes a Deep Dive section at the bottom. It shows a 60-day heatmap of clean days and relapses, the hours of the day when relapses are most common, the days of the week when they are most common, a comparison with the previous month, and a personal notes area with auto-save. This turns a habit page into a personal analytical dashboard.

### Spiritual Support

The spiritual section is designed to strengthen the user's inner resolve through content from the Quran, the Prophet Muhammad (PBUH) and his household, and classical supplications. The tasbih counter provides a tactile way to engage with dhikr, and the two-mode design (Tasbih of Fatima and Open Tasbih) lets the user either follow the classical practice or freely count any dhikr they choose.

### Progression

The XP system rewards the user for recovery actions such as writing a journal entry, completing a quiz, reading duas, completing breathing exercises, or unlocking achievements. XP accumulates into 10 levels, from beginner to a top tier. Achievements unlock automatically based on real data, and the leaderboard tracks personal records rather than competition with other users.

### Privacy

Every action happens locally. No account is required. No personal data is sent anywhere. The user can export all their data as a JSON file and import it later. The user can also wipe all data with a single button, and the app lock can protect access with a 6-digit PIN.

---

## Tech Stack

| Technology | Usage |
| :--------- | :---- |
| HTML5 | Semantic markup, PWA manifest, metadata |
| CSS3 | Custom properties, Flexbox, Grid, animations |
| JavaScript ES6+ | Classes, LocalStorage API, Notification API, Promises |
| WebAssembly (Emscripten) | Optional optimization module |
| Font Awesome 6.5 | UI icons |
| Google Fonts | Amiri, Cairo, Tajawal |
| JSON | Content data and settings storage |
| Service Worker | Offline caching and push notifications |

### Browser Support

| Browser | Status |
| :------ | :----- |
| Chrome | Full |
| Firefox | Full |
| Safari | Full (iOS 12+) |
| Edge | Full |
| Samsung Internet | Full |
| Opera | Full |

---

## Installation

### Method 1: Direct Use (Recommended)

1. Visit: `https://wsl-iq.github.io/teaafi/`
2. Click **Install** or **Add to Home Screen**.
3. The app installs as a standalone PWA.

### Method 2: Local Installation

```bash
# Clone the repository
git clone https://github.com/wsl-iq/teaafi.git

# Navigate into the folder
cd taeafi

# Serve locally with Python
python -m http.server 8000

# Or use Node.js
npx http-server

# Or use VS Code Live Server
```

---

## Project Structure

```text
taeafi/
├── css/
│   ├── components.css
│   └── ...
├── data/
│   ├── ...
│   └── content data and application resources
├── js/
│   ├── backup.js
│   ├── habit-controls.js
│   ├── multi-habit-recovery.js
│   ├── quick-actions.js
│   └── ...
├── pages/
│   ├── 21-day.js
│   ├── Forgetfulness.js
│   ├── habit-detail.js
│   ├── home.js
│   ├── journal.js
│   ├── nutrition.js
│   ├── prayer-box.js
│   ├── recovery.js
│   ├── settings.js
│   ├── tasbih.js
│   └── ...
├── wasm/
│   ├── ...
│   └── WebAssembly optimization sources
├── index.html
├── manifest.json
├── service-worker.js
├── version.txt
├── Note.md
├── CONTRIBUTING.md
├── SECURITY.md
└── README.md
```

---

## Pages Overview

1. **Splash Screen** — Animated welcome screen with logo and loading indicator.
2. **Welcome Screen (First Run)** — A 9-step onboarding flow that includes intro, name, age, gender, first habit, review, theme picker, recovery pact, and a final success screen.
3. **Home Dashboard** — Personalized greeting, active recovery counter, XP bar, dual date display (Hijri and Gregorian), and quick access to every feature.
4. **Habits Section** — 22 habits organized into physical, psychological, and social categories. Each habit page includes common content, gender-specific content, and a Habit Deep Dive section.
5. **Spiritual Section** — Prophet's sayings, Imam Ali's wisdom, Ahlulbayt supplications, Quranic verses, morning and evening adhkar, repentance and steadfastness duas, protection duas, and willpower tips.
6. **Digital Tasbih** — Two tabs:
   - Tasbih of Fatima Al-Zahra (34 + 33 + 33) with progress bar, auto-advance, and a completion modal.
   - Open Tasbih with a custom dhikr input, suggestion chips, an unlimited counter, and a reset with history.
7. **Recovery Tracker** — Live counter, motivational messages, recovery milestones, and per-habit statistics.
8. **Relapse Analysis** — Summary cards, bar charts for triggers and hours, feelings distribution, lessons learned, and filters by habit and period.
9. **Habit Deep Dive** — Streak cards, 60-day heatmap, dangerous hours, dangerous days, month comparison, and personal notes.
10. **21-Day Challenge** — Introduction, dashboard, daily tasks, relapse tracking, progress, and history.
11. **Nutrition and Exercise** — Daily meal plans, weekly exercise routines, and a food conflict checker.
12. **Leaderboard** — Personal records, weekly challenges, and level progress.
13. **Journal** — Daily mood tracking and personal notes.
14. **Quiz** — 100 questions with random selection, category breakdown, and history.
15. **Prayer Box** — Save personal duas and revisit them.
16. **Prayer Assistant** — Step-by-step tracker for recording rukuh and sujud during prayer.
17. **Calendar** — Monthly view of clean days and relapses.
18. **Settings** — Themes, notifications, app lock, profile editing, updates, rating, changelog, and data management.
19. **Policies** — Privacy policy, terms of service, MIT license, code of conduct, contributing guide, and security policy.

---

## Privacy and Security

### Data Storage Philosophy

> **"Your data never leaves your device."**

| **Aspect**       | **Implementation**                 |
| :--------------- | :--------------------------------- |
| Storage          | Browser LocalStorage and IndexedDB |
| External Servers | None — zero personal data transmission |
| Analytics        | No tracking scripts                |
| Cookies          | None, except essential browser storage |
| Offline          | Fully functional without internet  |

### Data Collected

| **Data**      | **Purpose**        | **Required**          |
| :------------ | :----------------- | :-------------------- |
| Name          | Personalization    | No (alias accepted)   |
| Age           | Content tailoring  | No                    |
| Gender        | Health content     | No                    |
| Recovery Date | Progress tracking  | For recovery feature  |
| Tasbih Count  | Spiritual tracking | For tasbih feature    |
| Theme         | UI preference      | Auto (default: light) |

### What Taeafi Never Collects

- Location
- Browsing history
- Contacts
- Device identifiers
- IP address

### User Rights

| **Right**     | **How**                             |
| :------------ | :---------------------------------- |
| View all data | Directly in the app                 |
| Correct       | Edit from settings                  |
| Delete        | One-click data wipe                 |
| Refuse        | Decline notifications, use an alias |
| Audit         | Full source code available          |

---

## Contributing

We welcome contributions. See `CONTRIBUTING.md` for full guidelines.

### Quick Start

```bash
# Fork and clone
git clone https://github.com/your-username/taeafi.git

# Create a branch
git checkout -b feature/amazing-feature

# Commit changes
git commit -m "Add: describe the feature"

# Push
git push origin feature/amazing-feature

# Open a Pull Request
```

### Contribution Areas

| **Area**      | **Examples**                        |
| :------------ | :---------------------------------- |
| Bugs          | Report and fix issues               |
| Features      | New functionality                   |
| Content       | Improve accuracy and add references |
| UI and UX     | Design improvements                 |
| Translation   | Add language support                |
| Accessibility | Improve accessibility               |
| Performance   | Optimize code                       |

### Commit Convention

| **Prefix** | **Meaning**      |
| :--------- | :--------------- |
| `Add:`     | New feature      |
| `Fix:`     | Bug fix          |
| `Update:`  | Update           |
| `Improve:` | Improvement      |
| `Docs:`    | Documentation     |

---

## License

This project is licensed under the MIT License.

```text
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
```

| **Permissions** | **Action** | **Status** |
| :-------------- | :--------- | :--------- |
| Commercial use  | Allowed    | Yes        |
| Modification    | Allowed    | Yes        |
| Distribution    | Allowed    | Yes        |
| Private use     | Allowed    | Yes        |
| Sublicensing    | Allowed    | Yes        |
| Liability       | None       | No         |
| Warranty        | None       | No         |

---

## Developer

**Mohammed Al-Baqer**

*Software Developer | Desktop, Web, and Mobile Applications*

- [Website](https://wsl-iq.github.io/)
- [Instagram](https://www.instagram.com/g6xs0r/)
- [Telegram](https://t.me/wsl_iq)
- [GitHub](https://github.com/wsl-iq)

---

## Dedication

> This application was created as an ongoing charitable work for myself and my parents. I ask Allah to benefit everyone who uses it and to make it a means of guidance, self-improvement, and assistance in abandoning harmful habits.

---

## Acknowledgments

### Resources

- Font Awesome — Icon library
- Google Fonts — Amiri, Cairo, and Tajawal fonts
- Emscripten — WebAssembly toolchain
- Ahlulbayt (AS) — Spiritual teachings and supplications
- All contributors — Helping improve this app

### Support

- Bug reports: GitHub Issues
- Discussions: GitHub Discussions
- Security: See `SECURITY.md`

If you find this project useful, please consider giving it a star.

**Made for the betterment of humanity**

© 2026 Mohammed Al-Baqer. All rights reserved.

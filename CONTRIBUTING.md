# 🤝 Contributing Guide — Taeafi (تعافي)

Thank you for your interest in contributing to **Taeafi**! We welcome all contributions that help improve this application and make it more beneficial for users seeking recovery and spiritual growth.

---

## 📋 Table of Contents

- [Ways to Contribute](#-ways-to-contribute)
- [Getting Started](#-getting-started)
- [Development Setup](#-development-setup)
- [Project Structure](#-project-structure)
- [Code Guidelines](#-code-guidelines)
- [Commit Convention](#-commit-convention)
- [Pull Request Process](#-pull-request-process)
- [Content Guidelines](#-content-guidelines)
- [Design Guidelines](#-design-guidelines)
- [Testing](#-testing)
- [Communication](#-communication)

---

## 🎯 Ways to Contribute

| Type | Description | Effort |
|------|-------------|--------|
| 🐛 **Bug Reports** | Report bugs and issues | Low |
| 💡 **Suggestions** | Propose new features or improvements | Low |
| 📝 **Content** | Improve or add educational content | Medium |
| 🎨 **Design** | UI/UX improvements | Medium |
| 💻 **Code** | Fix bugs or add features | High |
| 🌍 **Translation** | Add support for new languages | High |
| 📚 **Documentation** | Improve README, comments, guides | Medium |
| ♿ **Accessibility** | Improve a11y | Medium |
| ⚡ **Performance** | Optimize code and loading | High |
| 🔒 **Security** | Identify and fix vulnerabilities | High |

---

## 🚀 Getting Started

### Prerequisites

| Tool | Required | Purpose |
|------|----------|---------|
| **Web Browser** | Chrome/Firefox/Safari | Testing |
| **Code Editor** | VS Code recommended | Development |
| **Git** | Latest version | Version control |
| **Local Server** | Python/Node/Live Server | Development |
| **GitHub Account** | Free | Contribution |

### Step-by-Step Setup

```bash
# 1. Fork the repository
# Click "Fork" button on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR-USERNAME/taeafi.git

# 3. Navigate to project
cd taeafi

# 4. Add upstream remote
git remote add upstream https://github.com/wsl-iq/taeafi.git

# 5. Create a branch
git checkout -b feature/your-feature-name

# 6. Start developing!
# Use any local server to run the app
python -m http.server 8000
# or
npx http-server
# or use VS Code Live Server extension
```

---

# *Keeping Your Fork Updated*
```bash
# Fetch upstream changes
git fetch upstream

# Merge into your main branch
git checkout main
git merge upstream/main

# Push to your fork
git push origin main
```

---

# * Code Guidelines*
``` html
<!-- ✅ DO: Semantic HTML5 elements -->
<main class="main-content">
  <article class="card">
    <header class="card-header">
      <h2 class="card-title">Title</h2>
    </header>
    <p class="card-description">Description</p>
  </article>
</main>

<!-- ❌ DON'T: Div soup without semantics -->
<div class="content">
  <div class="box">
    <div class="title">Title</div>
    <div class="text">Description</div>
  </div>
</div>
```

### HTML Checklist
□ Use semantic elements (<main>, <nav>, <article>, <section>)
□ All text in Arabic (RTL)
□ Proper heading hierarchy (h1 → h2 → h3)
□ Accessible ARIA labels where needed
□ Alt text for images
□ Valid HTML5 markup

``` css
/* ✅ DO: Use CSS custom properties */
.card {
    background: var(--surface);
    color: var(--text-primary);
    border-radius: var(--radius-xl);
    padding: var(--space-6);
}

/* ❌ DON'T: Hardcode values */
.card {
    background: #FFFFFF;
    color: #1A1C1E;
    border-radius: 20px;
    padding: 24px;
}

/* ✅ DO: Support dark theme */
.theme-dark .card {
    background: var(--surface);  /* Already dark via variables */
}

/* ✅ DO: Responsive design */
@media (max-width: 767px) {
    .card { padding: var(--space-4); }
}
```

### CSS Checklist
□ Use CSS variables from variables.css
□ Support dark theme (.theme-dark class)
□ Mobile-first responsive approach
□ RTL compatible (use right/left correctly)
□ No !important unless overriding inline styles
□ Proper Flexbox/Grid usage

``` JavaScript
// ✅ DO: ES6+ class syntax
class StorageManager {
    static #privateField;
    
    static getData() {
        return this.#privateField;
    }
}

// ✅ DO: Async/await for async operations
async function fetchData() {
    const data = await getFromStorage();
    return data;
}

// ✅ DO: Template literals for HTML
const html = `
    <div class="card">
        <h2>${title}</h2>
        <p>${description}</p>
    </div>
`;

// ❌ DON'T: Use var
var data = 'old style';

// ❌ DON'T: Use eval()
eval('alert("danger")');

// ❌ DON'T: Use innerHTML with user input
element.innerHTML = userInput; // XSS risk!
```

### JavaScript Checklist
□ Use const and let (never var)
□ ES6+ features (classes, arrow functions, template literals)
□ No eval() or Function() constructors
□ Proper error handling with try/catch
□ Comments in Arabic for complex logic
□ No external JS dependencies
□ All data from trusted sources (hardcoded in files)

## Commit Convention
We use **Arabic commit messages** with specific prefixes:

### Prefix Table

| Prefix | Meaning | Example |
|--------|---------|---------|
| `إضافة:` | New feature | `إضافة: عداد التسبيح الرقمي` |
| `تصحيح:` | Bug fix | `تصحيح: إصلاح العداد المتوقف` |
| `تحديث:` | Update | `تحديث: تحسين محتوى العادة السرية` |
| `تحسين:` | Improvement | `تحسين: زيادة سرعة التحميل` |
| `توثيق:` | Documentation | `توثيق: إضافة README.md` |
| `حذف:` | Removal | `حذف: إزالة الكود غير المستخدم` |
| `إصلاح:` | Hotfix | `إصلاح: مشكلة الأيقونات في الوضع الداكن` |
| `تنظيف:` | Refactor | `تنظيف: إعادة هيكلة ملفات CSS` |

### Commit Examples

```bash
# Feature
git commit -m "إضافة: نظام الرسائل التحفيزية حسب مدة التعافي"

# Bug fix
git commit -m "تصحيح: العداد لا يعمل بعد تسجيل الانتكاسة"

# Content
git commit -m "تحديث: إضافة محتوى خاص بالنساء لقسم التدخين"

# Docs
git commit -m "توثيق: إضافة دليل المساهمة CONTRIBUTING.md"
```

---

## 🔄 Pull Request Process

### Before Submitting

| Step | Action |
|------|--------|
| 1 | Test your changes thoroughly |
| 2 | Check all responsive breakpoints |
| 3 | Verify dark theme compatibility |
| 4 | Test PWA functionality |
| 5 | Run through accessibility checks |
| 6 | Update documentation if needed |
| 7 | Rebase on latest main branch |

### PR Template

```markdown
## وصف التغييرات
[شرح واضح للتغييرات التي قمت بها]

## نوع التغيير
- [ ] إضافة ميزة جديدة
- [ ] تصحيح خطأ
- [ ] تحسين
- [ ] توثيق
- [ ] أخرى: [حدد]

## الاختبارات
- [ ] تم الاختبار على Chrome
- [ ] تم الاختبار على Firefox
- [ ] تم الاختبار على Safari
- [ ] تم الاختبار على الموبايل
- [ ] تم اختبار الوضع الداكن
- [ ] تم اختبار اللغة العربية (RTL)

## لقطات شاشة
[أضف لقطات إذا كانت التغييرات بصرية]

## ملاحظات إضافية
[أي معلومات إضافية]
```

### Review Process

| Stage | Timeframe | Action |
|-------|-----------|--------|
| Submission | Day 0 | PR opened |
| Initial Review | 1-3 days | Maintainer reviews |
| Feedback | 1-2 days | Changes requested (if any) |
| Re-review | 1-2 days | Updated code reviewed |
| Merge | After approval | Merged to main |

---

## 📚 Content Guidelines

### Health Information

| Guideline | Description |
|-----------|-------------|
| Accuracy | All medical/health claims must be verifiable |
| Sources | Cite references where possible |
| Language | Use clear, respectful Arabic |
| Balance | Present both risks and solutions |
| No Extremism | Avoid fear-mongering or extreme claims |

### Religious Content

| Guideline | Description |
|-----------|-------------|
| Authenticity | Use verified sources (Quran, authentic hadith) |
| Respect | Respect all Islamic schools of thought |
| Inclusivity | Content from both Sunni and Shia traditions |
| Accuracy | Verify text of verses and supplications |
| Sources | Always cite the source (book, chapter, narrator) |

### Data Structure for Content

```javascript
// Example: Adding a new habit section
const HABIT_CONTENT = {
    'habit-name': {
        title: 'العنوان بالعربية',
        icon: 'fa-icon-name',         // Font Awesome icon
        color: '#HEX_COLOR',          // Theme color
        common: [                     // Shared content for both genders
            {
                id: 'unique-id',
                title: 'عنوان القسم',
                type: 'info',         // 'info', 'danger', 'warning', 'success'
                content: 'محتوى القسم...'
            }
        ],
        male: [                       // Male-specific content
            {
                id: 'male-unique-id',
                title: 'أضرار خاصة بالرجال',
                type: 'danger',
                content: 'محتوى خاص بالرجال...'
            }
        ],
        female: [                     // Female-specific content
            {
                id: 'female-unique-id',
                title: 'أضرار خاصة بالنساء',
                type: 'danger',
                content: 'محتوى خاص بالنساء...'
            }
        ]
    }
};
```

---

## 🎨 Design Guidelines

### Color Palette

| Variable | Light Value | Dark Value | Usage |
|----------|-------------|------------|--------|
| `--primary` | `#0D6B6E` | `#0D6B6E` | Main brand color |
| `--surface` | `#FFFFFF` | `#1E1E1E` | Card backgrounds |
| `--background` | `#F0F2F5` | `#121212` | Page background |
| `--text-primary` | `#1A1C1E` | `#E0E0E0` | Main text |
| `--accent-green` | `#4CAF50` | `#4CAF50` | Success |
| `--accent-red` | `#F44336` | `#F44336` | Danger/warnings |
| `--accent-orange` | `#FF9800` | `#FF9800` | Warnings |

### Typography

| Font | Usage | Weight |
|------|-------|--------|
| **Cairo** | Headings (h1-h6) | 600-800 |
| **Tajawal** | Body text, UI | 300-700 |
| **Amiri** | Quranic text, supplications | 400-700 |

### Responsive Breakpoints

| Breakpoint | Target | Layout |
|------------|--------|--------|
| `< 768px` | 📱 Mobile | Single column, bottom nav |
| `768-1023px` | 📱 Tablet | 2-column grid, bottom nav |
| `≥ 1024px` | 💻 Desktop | 3-column grid, sidebar |

---

## 🧪 Testing

### Manual Testing Checklist

| Category | Tests |
|----------|-------|
| Navigation | All pages load, bottom nav works, sidebar works |
| Welcome Flow | Onboarding completes, data saved |
| Recovery | Counter starts, milestones appear, relapse tracking |
| Tasbih | Counter increments, auto-advances, completion detected |
| Themes | Light, dark, auto — all elements visible |
| PWA | Install prompt, offline functionality |
| Notifications | Permission request, daily reminders |
| Data | Save, load, reset, delete all |
| Responsive | Mobile, tablet, desktop layouts |

### Browser Testing

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest | Test |
| Firefox | Latest | Test |
| Safari | Latest | Test |
| Edge | Latest | Test |

---

## 📞 Communication

| Channel | Purpose |
|---------|---------|
| GitHub Issues | Bug reports, feature requests |
| GitHub Discussions | General questions, ideas |
| Pull Requests | Code contributions |
| Telegram | Direct contact with maintainer |

### Language

- **Code Comments**: Arabic (preferred) or English
- **Commits**: Arabic with prefixes
- **Issues/PRs**: Arabic or English
- **Documentation**: Arabic or English

---

## 🏆 Recognition
All contributors will be:

| Recognition | Details |
|-------------|---------|
| 📝 **Listed in README** | Contributors section |
| 🎖️ **Commit History** | Permanent record in git |
| 💬 **Mentioned** | In release notes for significant contributions |
| 🌟 **Thanked** | Personally by the maintainer |

---

## 📄 Related Documents

| Document | Link |
|----------|------|
| Code of Conduct | [CODE_OF_CONDUCT.md](https://code_of_conduct.md/) |
| Security Policy | [SECURITY.md](https://security.md/) |
| Privacy Policy | [PRIVACY_POLICY.md](https://privacy_policy.md/) |
| Terms of Service | [TERMS_OF_SERVICE.md](https://terms_of_service.md/) |
| License | [LICENSE](https://license/) |

---

## ❓ FAQ

### Q: I'm new to open source. Can I still contribute?
**A:** Absolutely! Look for issues labeled `good first issue` or start with documentation improvements.

### Q: Can I add a new feature without opening an issue first?
**A:** For small changes, yes. For larger features, please open an issue for discussion first.

### Q: What if my PR is not accepted?
**A:** We'll provide feedback explaining why. You can always revise and resubmit.

### Q: Can I contribute content even if I'm not a developer?
**A:** Yes! Content accuracy and religious authenticity are just as important as code.

### Q: Is there a minimum/maximum contribution size?
**A:** No! Even fixing a typo is valuable.

---

<p align="center"><strong>🚀 Every contribution, no matter how small, makes a difference. Thank you!</strong></p>
<p align="center"><sub>Last updated: 2026</sub></p>


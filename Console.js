// 1. تأكد من القيمة
console.log('isDark:', ThemesManager.isDark());

// 2. تأكد من الكلاسات
console.log('Body classes:', document.body.className);

// 3. تأكد من localStorage
console.log('Storage:', localStorage.getItem('taafi_settings'));

// 4. بعد التحميل
console.log('After reload - isDark:', ThemesManager.isDark());
console.log('After reload - Body:', document.body.className);
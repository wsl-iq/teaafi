function renderSettingsPage() {
    const mainContent = document.getElementById('main-content');
    const settings = StorageManager.getSettings();
    const currentTheme = settings.theme || 'light';
    
    mainContent.innerHTML = `
        <div class="animate-fade-in">
            <h1 class="heading-underline">الإعدادات</h1>
            
            <!-- ============ قسم المظهر ============ -->
            <div class="settings-group">
                <h3 style="padding: 16px 24px; border-bottom: 1px solid var(--border-light);">
                    <i class="fas fa-palette" style="margin-left: 8px; color: #9C27B0;"></i>
                    المظهر والسمات
                </h3>
                
                <!-- المظهر الفاتح -->
                <div class="settings-item" onclick="switchTheme('light')" style="cursor: pointer;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: #FFF8E1; display: flex; align-items: center; justify-content: center; border: 2px solid ${currentTheme === 'light' ? '#0D6B6E' : '#E5E7EB'}; transition: all 0.3s ease;">
                            <i class="fas fa-sun" style="font-size: 20px; color: #FF9800;"></i>
                        </div>
                        <div>
                            <span style="font-weight: 600;">المظهر الفاتح</span>
                            <p style="font-size: 12px; color: var(--text-tertiary); margin-top: 2px;">مظهر مريح للعين في الإضاءة الطبيعية</p>
                        </div>
                    </div>
                    ${currentTheme === 'light' ? 
                        '<i class="fas fa-check-circle" style="color: #0D6B6E; font-size: 20px;"></i>' : 
                        '<i class="far fa-circle" style="color: #D1D5DB; font-size: 20px;"></i>'}
                </div>
                
                <!-- المظهر الداكن -->
                <div class="settings-item" onclick="switchTheme('dark')" style="cursor: pointer;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: #263238; display: flex; align-items: center; justify-content: center; border: 2px solid ${currentTheme === 'dark' ? '#0D6B6E' : '#E5E7EB'}; transition: all 0.3s ease;">
                            <i class="fas fa-moon" style="font-size: 20px; color: #FFD54F;"></i>
                        </div>
                        <div>
                            <span style="font-weight: 600;">المظهر الداكن</span>
                            <p style="font-size: 12px; color: var(--text-tertiary); margin-top: 2px;">مريح للعين في الإضاءة المنخفضة ويوفر البطارية</p>
                        </div>
                    </div>
                    ${currentTheme === 'dark' ? 
                        '<i class="fas fa-check-circle" style="color: #0D6B6E; font-size: 20px;"></i>' : 
                        '<i class="far fa-circle" style="color: #D1D5DB; font-size: 20px;"></i>'}
                </div>
                
                <!-- المظهر التلقائي -->
                <div class="settings-item" onclick="switchTheme('auto')" style="cursor: pointer; border-bottom: none;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: linear-gradient(135deg, #FFF8E1 50%, #263238 50%); display: flex; align-items: center; justify-content: center; border: 2px solid ${currentTheme === 'auto' ? '#0D6B6E' : '#E5E7EB'}; transition: all 0.3s ease;">
                            <i class="fas fa-circle-half-stroke" style="font-size: 20px; color: #0D6B6E;"></i>
                        </div>
                        <div>
                            <span style="font-weight: 600;">تلقائي</span>
                            <p style="font-size: 12px; color: var(--text-tertiary); margin-top: 2px;">يتغير تلقائياً حسب إعدادات النظام</p>
                        </div>
                    </div>
                    ${currentTheme === 'auto' ? 
                        '<i class="fas fa-check-circle" style="color: #0D6B6E; font-size: 20px;"></i>' : 
                        '<i class="far fa-circle" style="color: #D1D5DB; font-size: 20px;"></i>'}
                </div>
            </div>
            
            <!-- ============ قسم الإشعارات ============ -->
            <div class="settings-group">
                <h3 style="padding: 16px 24px; border-bottom: 1px solid var(--border-light);">
                    <i class="fas fa-bell" style="margin-left: 8px; color: var(--primary);"></i>
                    الإشعارات
                </h3>
                <div class="settings-item">
                    <span>تفعيل الإشعارات</span>
                    <label class="toggle-switch">
                        <input type="checkbox" ${settings.notifications ? 'checked' : ''} 
                               onchange="toggleNotificationSetting(this.checked)">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <div class="settings-item">
                    <span>تذكير يومي</span>
                    <label class="toggle-switch">
                        <input type="checkbox" ${settings.dailyReminder ? 'checked' : ''} 
                               onchange="toggleDailyReminder(this.checked)">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>
            
            <!-- ============ حول البرنامج ============ -->
            <div class="settings-group">
                <h3 style="padding: 16px 24px; border-bottom: 1px solid var(--border-light);">
                    <i class="fas fa-info-circle" style="margin-left: 8px; color: var(--primary);"></i>
                    حول البرنامج
                </h3>
                <div style="padding: 24px; line-height: 2; color: var(--text-secondary);">
                    <p>
                        منصة تعافي هي منصة توعية وإرشاد ودعم نفسي وسلوكي تساعد المستخدم على التخلص 
                        من بعض العادات السيئة وبناء أسلوب حياة أفضل. جميع المعلومات علمية وموثقة، 
                        مكتوبة بأسلوب هادئ ومحترم، بعيدة عن أسلوب التخويف التقليدي.
                    </p>
                    <p style="margin-top: 12px;">
                        <strong>أهداف المنصة:</strong>
                    </p>
                    <ul style="padding-right: 20px; list-style: disc;">
                        <li>تقديم محتوى توعوي علمي موثق</li>
                        <li>دعم نفسي وسلوكي للمستخدمين</li>
                        <li>توفير برامج علاجية تدريجية</li>
                        <li>تقوية الجانب الإيماني والروحي</li>
                        <li>بناء مجتمع داعم للتعافي</li>
                    </ul>

                    <div class="settings-item" onclick="navigateTo('policies')" style="cursor: pointer;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: #E3F2FD; display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-shield-alt" style="font-size: 20px; color: #1565C0;"></i>
                            </div>
                            <div>
                                <span style="font-weight: 600;">السياسات والقوانين</span>
                                <p style="font-size: 12px; color: var(--text-tertiary); margin-top: 2px;">سياسة الإستخدام والخصوصية ، الترخيص ، قواعد السلوك والمساهمة</p>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 11px; color: var(--primary); background: var(--primary-light); padding: 4px 10px; border-radius: 20px; font-weight: 500;">تصفح</span>
                            <i class="fas fa-chevron-left" style="color: var(--primary); font-size: 14px;"></i>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- ============ حول المطور ============ -->
            <div class="settings-group">
                <h3 style="padding: 16px 24px; border-bottom: 1px solid var(--border-light);">
                    <i class="fas fa-user-circle" style="margin-left: 8px; color: var(--primary);"></i>
                    حول المطور
                </h3>
                <div style="padding: 24px; line-height: 2;">
                    <!-- بطاقة المطور -->
                    <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px; padding: 16px; background: var(--surface-variant); border-radius: var(--radius-lg);">
                        <div style="width: 60px; height: 60px; border-radius: 50%; background: var(--primary-gradient); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <i class="fas fa-code" style="font-size: 26px; color: white;"></i>
                        </div>
                        <div>
                            <p style="font-size: 18px; font-weight: 700; color: var(--text-primary); margin-bottom: 2px;">محمد الباقر</p>
                            <p style="font-size: 13px; color: var(--primary); font-weight: 500;">مطور برمجيات مستقل، أعمل على تصميم وتطوير تطبيقات الويب وتطبيقات الهواتف الذكية وبرامج سطح المكتب تلبي احتياجات المستخدم بأسلوب احترافي مع اهتمام خاص بتقديم تجربة متكاملة تجمع بين البساطة والدقة وجودة التنفيذ.</p>
                        </div>
                    </div>

                    <!-- المهارات -->
                    <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px;">
                        <span style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; background: #E0F2F1; color: #0D6B6E; border-radius: 20px; font-size: 13px; font-weight: 500;">
                            <i class="fas fa-desktop" style="font-size: 12px;"></i>
                            Desktop Apps
                        </span>
                        <span style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; background: #E8F5E9; color: #2E7D32; border-radius: 20px; font-size: 13px; font-weight: 500;">
                            <i class="fas fa-globe" style="font-size: 12px;"></i>
                            Web Apps
                        </span>
                        <span style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; background: #FCE4EC; color: #C62828; border-radius: 20px; font-size: 13px; font-weight: 500;">
                            <i class="fas fa-mobile-alt" style="font-size: 12px;"></i>
                            Mobile Apps
                        </span>
                    </div>
                    
                    <!-- الوصف -->
                    <p style="color: var(--text-secondary); font-size: 14px; line-height: 1.8; margin-bottom: 20px; text-align: justify;">
                        تم تطوير هذا التطبيق بهدف تقديم محتوى توعوي نافع ومفيد، 
                        مع التركيز على الجودة والاحترافية في التصميم والمحتوى.
                    </p>
                    
                    <!-- خط فاصل -->
                    <div style="height: 1px; background: var(--border-light); margin-bottom: 20px;"></div>
                    
                    <!-- وسائل التواصل الاجتماعي -->
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <!-- Instagram -->
                        <a href="https://www.instagram.com/g6xs0r/" target="_blank" rel="noopener noreferrer" 
                           style="display: flex; align-items: center; gap: 14px; padding: 14px 18px; border-radius: var(--radius-lg); background: linear-gradient(45deg, #F09433, #E6683C, #DC2743, #CC2366, #BC1888); color: white; text-decoration: none; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(225, 48, 108, 0.2);">
                            <div style="width: 40px; height: 40px; border-radius: 12px; background: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <i class="fab fa-instagram" style="font-size: 22px; color: #E1306C;"></i>
                            </div>
                            <div style="flex: 1;">
                                <span style="font-weight: 600; font-size: 15px;">Instagram</span>
                                <p style="font-size: 12px; opacity: 0.9;">g6xs0r@</p>
                            </div>
                            <i class="fas fa-arrow-left" style="font-size: 14px; opacity: 0.8;"></i>
                        </a>
                        
                        <!-- Telegram -->
                        <a href="https://t.me/wsl_iq" target="_blank" rel="noopener noreferrer" 
                           style="display: flex; align-items: center; gap: 14px; padding: 14px 18px; border-radius: var(--radius-lg); background: linear-gradient(45deg, #1DA1F2, #0088CC); color: white; text-decoration: none; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(0, 136, 204, 0.2);">
                            <div style="width: 40px; height: 40px; border-radius: 12px; background: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <i class="fab fa-telegram" style="font-size: 22px; color: #0088CC;"></i>
                            </div>
                            <div style="flex: 1;">
                                <span style="font-weight: 600; font-size: 15px;">Telegram</span>
                                <p style="font-size: 12px; opacity: 0.9;">wsl_iq@</p>
                            </div>
                            <i class="fas fa-arrow-left" style="font-size: 14px; opacity: 0.8;"></i>
                        </a>
                        
                        <!-- GitHub -->
                        <a href="https://github.com/wsl-iq" target="_blank" rel="noopener noreferrer" 
                           style="display: flex; align-items: center; gap: 14px; padding: 14px 18px; border-radius: var(--radius-lg); background: linear-gradient(45deg, #333333, #000000); color: white; text-decoration: none; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);">
                            <div style="width: 40px; height: 40px; border-radius: 12px; background: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <i class="fab fa-github" style="font-size: 22px; color: #000000;"></i>
                            </div>
                            <div style="flex: 1;">
                                <span style="font-weight: 600; font-size: 15px;">GitHub</span>
                                <p style="font-size: 12px; opacity: 0.9;">github.com/wsl-iq</p>
                            </div>
                            <i class="fas fa-arrow-left" style="font-size: 14px; opacity: 0.8;"></i>
                        </a>
                    </div>
                </div>
            </div>

            <!-- ============ تحميل التطبيق ============ -->
            <div class="settings-group">
                <h3 style="padding: 16px 24px; border-bottom: 1px solid var(--border-light);">
                    <i class="fas fa-download" style="margin-left: 8px; color: #4CAF50;"></i>
                    تحميل التطبيق
                </h3>
                
                <!-- تحميل Android -->
                <div class="settings-item" style="cursor: pointer;" onclick="downloadApp('android')">
                    <div style="display: flex; align-items: center; gap: 14px;">
                        <div style="width: 48px; height: 48px; border-radius: var(--radius-md); background: #E8F5E9; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <i class="fab fa-android" style="font-size: 26px; color: #3DDC84;"></i>
                        </div>
                        <div>
                            <span style="font-weight: 600;">تحميل للاندرويد</span>
                            <p style="font-size: 12px; color: var(--text-tertiary); margin-top: 2px;">تثبيت مباشر</p>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 11px; color: #4CAF50; background: #E8F5E9; padding: 4px 10px; border-radius: 20px; font-weight: 500;">
                            <i class="fas fa-download" style="margin-left: 4px;"></i>
                            تحميل
                        </span>
                        <i class="fas fa-chevron-left" style="color: var(--text-tertiary); font-size: 14px;"></i>
                    </div>
                </div>
                
                <!-- تحميل Windows -->
                <div class="settings-item" style="cursor: pointer; border-bottom: none;" onclick="downloadApp('windows')">
                    <div style="display: flex; align-items: center; gap: 14px;">
                        <div style="width: 48px; height: 48px; border-radius: var(--radius-md); background: #E3F2FD; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <i class="fab fa-windows" style="font-size: 26px; color: #0078D4;"></i>
                        </div>
                        <div>
                            <span style="font-weight: 600;">تحميل للويندوز</span>
                            <p style="font-size: 12px; color: var(--text-tertiary); margin-top: 2px;">تثبيت على الحاسوب</p>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 11px; color: #0078D4; background: #E3F2FD; padding: 4px 10px; border-radius: 20px; font-weight: 500;">
                            <i class="fas fa-download" style="margin-left: 4px;"></i>
                            تحميل
                        </span>
                        <i class="fas fa-chevron-left" style="color: var(--text-tertiary); font-size: 14px;"></i>
                    </div>
                </div>

                <!-- استخدام عبر المتصفح -->
                <div class="settings-item" style="cursor: pointer;" onclick="openInBrowser()">
                    <div style="display: flex; align-items: center; gap: 14px;">
                        <div style="width: 48px; height: 48px; border-radius: var(--radius-md); background: #FFF3E0; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <i class="fas fa-globe" style="font-size: 26px; color: #FF9800;"></i>
                        </div>
                        <div>
                            <span style="font-weight: 600;">استخدام عبر المتصفح</span>
                            <p style="font-size: 12px; color: var(--text-tertiary); margin-top: 2px;">يعمل على جميع الأجهزة</p>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 11px; color: #FF9800; background: #FFF3E0; padding: 4px 10px; border-radius: 20px; font-weight: 500;">
                            <i class="fas fa-external-link-alt" style="margin-left: 4px;"></i>
                            فتح
                        </span>
                        <i class="fas fa-chevron-left" style="color: var(--text-tertiary); font-size: 14px;"></i>
                    </div>
                </div>
            </div>

            <!-- ============ رسالة الصدقة ============ -->
            <div class="card" style="background: #FFF8E1; border-right: 4px solid var(--accent-orange); font-family: 'Cairo', sans-serif;">
                <p style="line-height: 2.2; font-style: normal; color: var(--text-primary);">
                    <i class="fas fa-quote-right" style="font-size: 24px; color: var(--accent-orange); margin-left: 8px;"></i>
                    تم إنشاء هذا التطبيق ليكون صدقة جارية عني وعن والدي، وأسأل الله أن ينفع به كل من 
                    يستخدمه وأن يجعله سبباً في الهداية والإصلاح والعون على ترك العادات الضارة.
                </p>
            </div>
            
            <!-- ============ منطقة الخطر ============ -->
            <div class="settings-group" style="margin-top: 24px;">
                <h3 style="padding: 16px 24px; border-bottom: 1px solid var(--border-light); color: var(--accent-red);">
                    <i class="fas fa-exclamation-triangle" style="margin-left: 8px;"></i>
                    منطقة الخطر
                </h3>
                <div class="settings-item">
                    <span>حذف جميع البيانات</span>
                    <button class="btn btn-danger btn-sm" onclick="clearAllUserData()">
                        <i class="fas fa-trash"></i>
                        حذف
                    </button>
                </div>
            </div>
            <div class="settings-footer" style="padding: 16px 24px; color: var(--text-secondary); text-align: center; font-size: 0.9rem;">
                Copyright © 2026, Inc. Mohammed Al-Baqer. All rights reserved
            </div>
            
        </div>
    `;
}

// ==================== دوال المظهر ====================

function switchTheme(theme) {
    // حفظ الإعداد في التخزين المحلي
    const settings = StorageManager.getSettings();
    settings.theme = theme;
    StorageManager.saveSettings(settings);
    
    // تطبيق المظهر
    applyTheme(theme);
    
    // إعادة تحميل صفحة الإعدادات لتحديث العلامة
    renderSettingsPage();
    
    // رسالة تأكيد
    const themeNames = {
        'light': 'تم تفعيل المظهر الفاتح',
        'dark': 'تم تفعيل المظهر الداكن',
        'auto': 'تم تفعيل المظهر التلقائي'
    };
    showToast(themeNames[theme]);
}

function applyTheme(theme) {
    const root = document.documentElement;
    const body = document.body;
    
    // إزالة الكلاسات القديمة
    body.classList.remove('theme-light', 'theme-dark');
    
    if (theme === 'dark') {
        body.classList.add('theme-dark');
        
        // ألوان المظهر الداكن
        root.style.setProperty('--surface', '#1E1E1E');
        root.style.setProperty('--surface-variant', '#2D2D2D');
        root.style.setProperty('--background', '#121212');
        root.style.setProperty('--background-dark', '#0A0A0A');
        root.style.setProperty('--text-primary', '#E0E0E0');
        root.style.setProperty('--text-secondary', '#B0B0B0');
        root.style.setProperty('--text-tertiary', '#808080');
        root.style.setProperty('--text-disabled', '#606060');
        root.style.setProperty('--border', '#3D3D3D');
        root.style.setProperty('--border-light', '#2D2D2D');
        root.style.setProperty('--shadow-sm', '0 1px 3px rgba(0, 0, 0, 0.4)');
        root.style.setProperty('--shadow-md', '0 4px 6px rgba(0, 0, 0, 0.5)');
        root.style.setProperty('--shadow-lg', '0 10px 15px rgba(0, 0, 0, 0.6)');
        root.style.setProperty('--primary-light', '#1A3A3C');
        
    } else if (theme === 'light') {
        body.classList.add('theme-light');
        
        // ألوان المظهر الفاتح
        root.style.setProperty('--surface', '#FFFFFF');
        root.style.setProperty('--surface-variant', '#F5F7F8');
        root.style.setProperty('--background', '#F0F2F5');
        root.style.setProperty('--background-dark', '#E8EBEE');
        root.style.setProperty('--text-primary', '#1A1C1E');
        root.style.setProperty('--text-secondary', '#44474E');
        root.style.setProperty('--text-tertiary', '#6B7280');
        root.style.setProperty('--text-disabled', '#9CA3AF');
        root.style.setProperty('--border', '#D1D5DB');
        root.style.setProperty('--border-light', '#E5E7EB');
        root.style.setProperty('--shadow-sm', '0 1px 3px rgba(0, 0, 0, 0.1)');
        root.style.setProperty('--shadow-md', '0 4px 6px rgba(0, 0, 0, 0.1)');
        root.style.setProperty('--shadow-lg', '0 10px 15px rgba(0, 0, 0, 0.1)');
        root.style.setProperty('--primary-light', '#E0F2F1');
        
    } else if (theme === 'auto') {
        // التحقق من إعدادات النظام
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            applyTheme('dark');
        } else {
            applyTheme('light');
        }
    }
}

// الاستماع لتغيير إعدادات النظام في الوضع التلقائي
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        const settings = StorageManager.getSettings();
        if (settings.theme === 'auto') {
            if (e.matches) {
                applyTheme('dark');
            } else {
                applyTheme('light');
            }
        }
    });
}

// ==================== دوال الإعدادات الأخرى ====================

function toggleNotificationSetting(enabled) {
    if (enabled) {
        PermissionsManager.requestNotificationPermission().then(permission => {
            if (permission === 'granted') {
                updateSetting('notifications', true);
                showToast('تم تفعيل الإشعارات');
            } else {
                updateSetting('notifications', false);
                showToast('يرجى السماح بالإشعارات من إعدادات المتصفح');
            }
        });
    } else {
        updateSetting('notifications', false);
        showToast('تم إيقاف الإشعارات');
    }
}

function toggleDailyReminder(enabled) {
    updateSetting('dailyReminder', enabled);
    showToast(enabled ? 'تم تفعيل التذكير اليومي' : 'تم إيقاف التذكير اليومي');
}

function updateSetting(key, value) {
    const settings = StorageManager.getSettings();
    settings[key] = value;
    StorageManager.saveSettings(settings);
}

function clearAllUserData() {
    if (confirm('تحذير: سيتم حذف جميع بياناتك بما في ذلك معلومات الحساب وتقدم التعافي. هل أنت متأكد؟')) {
        if (confirm('تأكيد نهائي: لا يمكن التراجع عن هذا الإجراء. هل تريد المتابعة؟')) {
            StorageManager.clear();
            showToast('تم حذف جميع البيانات');
            setTimeout(() => {
                location.reload();
            }, 1000);
        }
    }
}

// ==================== دالة فتح المتصفح ====================

function openInBrowser() {
    const appUrl = 'https://wsl-iq.github.io/teaafi/';
    
    // عرض نافذة تأكيد
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.zIndex = '200';
    modal.innerHTML = `
        <div class="modal-container" style="max-width: 400px; text-align: center;">
            <div style="margin-bottom: 16px;">
                <div style="width: 64px; height: 64px; border-radius: 50%; background: #FFF3E0; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
                    <i class="fas fa-globe" style="font-size: 32px; color: #FF9800;"></i>
                </div>
            </div>
            <h3 style="margin-bottom: 12px; font-size: 18px;">استخدام عبر المتصفح</h3>
            <p style="color: var(--text-secondary); margin-bottom: 8px; line-height: 1.8;">
                تطبيق <strong>تعافي</strong> يعمل مباشرة من المتصفح
            </p>
            <p style="color: var(--text-tertiary); font-size: 13px; margin-bottom: 16px; direction: ltr;">
                <i class="fas fa-link" style="margin-left: 4px;"></i>
                wsl-iq.github.io/teaafi
            </p>
            
            <div style="background: #E8F5E9; padding: 14px; border-radius: 8px; margin-bottom: 20px; text-align: right;">
                <p style="font-size: 12px; color: #2E7D32; line-height: 1.6;">
                    <i class="fas fa-lightbulb" style="margin-left: 4px;"></i>
                    <strong>نصيحة:</strong> بعد فتح الرابط يمكنك تثبيت التطبيق للوصول السريع:
                </p>
                <ul style="font-size: 11px; color: #2E7D32; line-height: 1.8; padding-right: 16px; margin-top: 8px;">
                    <li><strong>Chrome:</strong> اضغط على ⋮ ثم "تثبيت التطبيق"</li>
                    <li><strong>Safari:</strong> اضغط على ↗ ثم "إلى الشاشة الرئيسية"</li>
                    <li><strong>Firefox:</strong> اضغط على ⊕ في شريط العنوان</li>
                    <li><strong>Edge:</strong> اضغط على ⋮ ثم "التطبيقات" ثم "تثبيت"</li>
                </ul>
            </div>
            
            <div style="display: flex; gap: 12px;">
                <button class="btn btn-outline" onclick="this.closest('.modal-overlay').remove()" style="flex: 1;">
                    <i class="fas fa-times"></i>
                    إغلاق
                </button>
                <a href="${appUrl}" target="_blank" rel="noopener" class="btn btn-primary" style="flex: 1; text-decoration: none;" onclick="this.closest('.modal-overlay').remove()">
                    <i class="fas fa-external-link-alt"></i>
                    فتح التطبيق
                </a>
            </div>
            
            <div style="display: flex; gap: 12px; margin-top: 12px;">
                <button class="btn btn-sm btn-outline" onclick="copyAppUrl('${appUrl}'); this.closest('.modal-overlay').remove();" style="flex: 1; font-size: 13px;">
                    <i class="fas fa-copy"></i>
                    نسخ الرابط
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // إغلاق النافذة عند النقر خارجها
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// ==================== دالة نسخ الرابط ====================

function copyAppUrl(url) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
            showToast('تم نسخ الرابط بنجاح');
        }).catch(() => {
            // fallback للنسخ اليدوي
            fallbackCopy(url);
        });
    } else {
        fallbackCopy(url);
    }
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        showToast('تم نسخ الرابط بنجاح');
    } catch (err) {
        showToast('الرابط: ' + text);
    }
    document.body.removeChild(textarea);
}

// ==================== دالة تحميل التطبيق ====================

function downloadApp(platform) {
    const links = {
        android: 'https://github.com/wsl-iq/taeafi/releases/latest/download/taeafi.apk',
        windows: 'https://github.com/wsl-iq/taeafi/releases/latest/download/taeafi-setup.exe'
    };
    
    const names = {
        android: 'للاندرويد (APK)',
        windows: 'للوندوز (Installer)'
    };
    
    const icons = {
        android: '<div style="width: 64px; height: 64px; border-radius: 50%; background: #E8F5E9; display: flex; align-items: center; justify-content: center; margin: 0 auto;"><i class="fab fa-android" style="color: #3DDC84; font-size: 32px;"></i></div>',
        windows: '<div style="width: 64px; height: 64px; border-radius: 50%; background: #E3F2FD; display: flex; align-items: center; justify-content: center; margin: 0 auto;"><i class="fab fa-windows" style="color: #0078D4; font-size: 32px;"></i></div>'
    };
    
    const colors = {
        android: { bg: '#E8F5E9', text: '#2E7D32' },
        windows: { bg: '#E3F2FD', text: '#1565C0' }
    };
    
    // عرض نافذة تأكيد
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.zIndex = '200';
    modal.innerHTML = `
        <div class="modal-container" style="max-width: 380px; text-align: center;">
            <div style="margin-bottom: 16px;">
                ${icons[platform]}
            </div>
            <h3 style="margin-bottom: 12px; font-size: 18px;">تأكيد التحميل</h3>
            <p style="color: var(--text-secondary); margin-bottom: 8px; line-height: 1.8;">
                جاري تحميل تطبيق <strong>تعافي</strong>
            </p>
            <p style="color: var(--text-tertiary); font-size: 13px; margin-bottom: 20px;">
                ${names[platform]}
            </p>
            
            <div style="background: ${colors[platform].bg}; padding: 12px; border-radius: 8px; margin-bottom: 20px; text-align: right;">
                <p style="font-size: 12px; color: ${colors[platform].text}; line-height: 1.6;">
                    <i class="fas fa-shield-alt" style="margin-left: 4px;"></i>
                    <strong>للتذكير:</strong> التطبيق يعمل كـ PWA مباشرة من المتصفح بدون تحميل. 
                    التحميل اختياري لمن يفضل النسخة المنفصلة.
                </p>
            </div>
            
            <div style="display: flex; gap: 12px;">
                <button class="btn btn-outline" onclick="this.closest('.modal-overlay').remove()" style="flex: 1;">
                    <i class="fas fa-times"></i>
                    إلغاء
                </button>
                <a href="${links[platform]}" target="_blank" rel="noopener" 
                   class="btn btn-primary" style="flex: 1; text-decoration: none;" 
                   onclick="this.closest('.modal-overlay').remove()">
                    <i class="fas fa-download"></i>
                    تحميل
                </a>
            </div>
            
            <p style="font-size: 11px; color: var(--text-tertiary); margin-top: 16px;">
                <i class="fas fa-info-circle" style="margin-left: 4px;"></i>
                يمكنك أيضاً تثبيت التطبيق مباشرة من المتصفح كـ PWA
            </p>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const settings = StorageManager.getSettings();
    const theme = settings.theme || 'light';
    applyTheme(theme);
});
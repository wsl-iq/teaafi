/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : Pages
 * File   : settings.js
 * Type: JavaScript
 */

// function Application Version

let ApplicationVersion = './version.txt';
(function loadAppVersionFromFile() {
    try {
        fetch('./version.txt')
            .then(response => {
                if (!response.ok) throw new Error('version.txt not found');
                return response.text();
            })
            .then(text => {
                const v = text.trim();
                if (v) ApplicationVersion = v;
            })
            .catch(_ => {
            });
    } catch (e) {
    }
})();

function renderSettingsPage() {
    const mainContent = document.getElementById('main-content');
    const settings = StorageManager.getSettings();
    const currentTheme = settings.theme || 'light'; // default mode light
    const isAutoTheme = ThemesManager.isAuto();
    const themeMode = isAutoTheme ? 'auto' : (ThemesManager.isDark() ? 'dark' : 'light');
    
    mainContent.innerHTML = `
        <div class="animate-fade-in">
            <h1 class="heading-underline">الإعدادات</h1>
            <div class="settings-group">
                <h3 style="padding: 16px 24px; border-bottom: 1px solid var(--border-light);">
                    <i class="fas fa-palette" style="margin-left: 8px; color: #9C27B0;"></i>
                    المظهر والسمات
                </h3>
                
            <div class="settings-group">
                <h3 style="padding: 16px 24px; border-bottom: 1px solid var(--border-light);">
                    <i class="fas fa-palette" style="margin-left: 8px; color: #9C27B0;"></i>
                    المظهر
                </h3>
                
                <div class="settings-item" onclick="ThemesManager.setDark(false)" style="cursor: pointer;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 44px; height: 44px; border-radius: 12px; background: #FFF8E1; display: flex; align-items: center; justify-content: center; border: 2px solid ${!ThemesManager.isDark() && !ThemesManager.isAuto() && !StorageManager.get('night_mode_schedule') ? 'var(--primary)' : 'var(--border-light)'};">
                            <i class="fas fa-sun" style="font-size: 18px; color: #FF9800;"></i>
                        </div>
                        <div>
                            <span style="font-weight: 600;">المظهر الفاتح</span>
                            <p style="font-size: 11px; color: var(--text-tertiary);">مريح للعين في الإضاءة الطبيعية</p>
                        </div>
                    </div>
                    ${!ThemesManager.isDark() && !ThemesManager.isAuto() && !StorageManager.get('night_mode_schedule') ? '<i class="fas fa-check-circle" style="color: var(--primary);"></i>' : '<i class="far fa-circle" style="color: var(--text-disabled);"></i>'}
                </div>
                
                <div class="settings-item" onclick="ThemesManager.setDark(true)" style="cursor: pointer;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 44px; height: 44px; border-radius: 12px; background: #263238; display: flex; align-items: center; justify-content: center; border: 2px solid ${ThemesManager.isDark() && !ThemesManager.isAuto() && !StorageManager.get('night_mode_schedule') ? 'var(--primary)' : 'var(--border-light)'};">
                            <i class="fas fa-moon" style="font-size: 18px; color: #FFD54F;"></i>
                        </div>
                        <div>
                            <span style="font-weight: 600;">المظهر الداكن</span>
                            <p style="font-size: 11px; color: var(--text-tertiary);">مريح للعين ليلاً ويوفر البطارية</p>
                        </div>
                    </div>
                    ${ThemesManager.isDark() && !ThemesManager.isAuto() && !StorageManager.get('night_mode_schedule') ? '<i class="fas fa-check-circle" style="color: var(--primary);"></i>' : '<i class="far fa-circle" style="color: var(--text-disabled);"></i>'}
                </div>
                
                <div class="settings-item" onclick="ThemesManager.setDarkAuto()" style="cursor: pointer;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #FFF8E1 50%, #263238 50%); display: flex; align-items: center; justify-content: center; border: 2px solid ${ThemesManager.isAuto() && !StorageManager.get('night_mode_schedule') ? 'var(--primary)' : 'var(--border-light)'};">
                            <i class="fas fa-circle-half-stroke" style="font-size: 18px; color: #0D6B6E;"></i>
                        </div>
                        <div>
                            <span style="font-weight: 600;">تلقائي</span>
                            <p style="font-size: 11px; color: var(--text-tertiary);">يتغير حسب إعدادات النظام</p>
                        </div>
                    </div>
                    ${ThemesManager.isAuto() && !StorageManager.get('night_mode_schedule') ? '<i class="fas fa-check-circle" style="color: var(--primary);"></i>' : '<i class="far fa-circle" style="color: var(--text-disabled);"></i>'}
                </div>

                <div class="settings-item" onclick="toggleNightModeSchedule()" style="cursor: pointer; border-bottom: none;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #263238 50%, #FFF8E1 50%); display: flex; align-items: center; justify-content: center; border: 2px solid ${StorageManager.get('night_mode_schedule') ? 'var(--primary)' : 'var(--border-light)'};">
                            <i class="fas fa-moon" style="font-size: 18px; color: #FFD54F;"></i>
                        </div>
                        <div>
                            <span style="font-weight: 600;">الوضع الليلي التلقائي</span>
                            <p style="font-size: 11px; color: var(--text-tertiary);">من 7:00 مساءً إلى 6:00 صباحاً</p>
                        </div>
                    </div>
                    ${StorageManager.get('night_mode_schedule') ? '<i class="fas fa-check-circle" style="color: var(--primary);"></i>' : '<i class="far fa-circle" style="color: var(--text-disabled);"></i>'}
                </div>
            </div>
            
            <div class="settings-group">
                <h3 style="padding: 16px 24px; border-bottom: 1px solid var(--border-light);">
                    <i class="fas fa-swatchbook" style="margin-left: 8px; color: #E91E63;"></i>
                    الثيمات
                </h3>
                
                <div class="settings-item" onclick="ThemesManager.setTheme('green')" style="cursor: pointer;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #0D6B6E, #26A69A); display: flex; align-items: center; justify-content: center; border: 2px solid ${ThemesManager.getCurrent() === 'green' ? 'var(--primary)' : 'var(--border-light)'};">
                            <i class="fas fa-leaf" style="color: white; font-size: 18px;"></i>
                        </div>
                        <div>
                            <span style="font-weight: 600;">الأخضر</span>
                            <p style="font-size: 11px; color: var(--text-tertiary);">افتراضي - مظهر طبيعي ومريح</p>
                        </div>
                    </div>
                    ${ThemesManager.getCurrent() === 'green' ? '<i class="fas fa-check-circle" style="color: var(--primary);"></i>' : '<i class="far fa-circle" style="color: var(--text-disabled);"></i>'}
                </div>
                
                <div class="settings-item" onclick="ThemesManager.setTheme('pink')" style="cursor: pointer;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #E91E63, #F06292); display: flex; align-items: center; justify-content: center; border: 2px solid ${ThemesManager.getCurrent() === 'pink' ? 'var(--primary)' : 'var(--border-light)'};">
                            <i class="fas fa-heart" style="color: white; font-size: 18px;"></i>
                        </div>
                        <div>
                            <span style="font-weight: 600;">الوردي</span>
                            <p style="font-size: 11px; color: var(--text-tertiary);">دافئ ومريح - مخصص للإناث</p>
                        </div>
                    </div>
                    ${ThemesManager.getCurrent() === 'pink' ? '<i class="fas fa-check-circle" style="color: var(--primary);"></i>' : '<i class="far fa-circle" style="color: var(--text-disabled);"></i>'}
                </div>
                
                <div class="settings-item" onclick="ThemesManager.setTheme('desert')" style="cursor: pointer;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #BF360C, #FF7043); display: flex; align-items: center; justify-content: center; border: 2px solid ${ThemesManager.getCurrent() === 'desert' ? 'var(--primary)' : 'var(--border-light)'};">
                            <i class="fas fa-sun" style="color: white; font-size: 18px;"></i>
                        </div>
                        <div>
                            <span style="font-weight: 600;">الصحراوي</span>
                            <p style="font-size: 11px; color: var(--text-tertiary);">ألوان دافئة - مخصص للذكور</p>
                        </div>
                    </div>
                    ${ThemesManager.getCurrent() === 'desert' ? '<i class="fas fa-check-circle" style="color: var(--primary);"></i>' : '<i class="far fa-circle" style="color: var(--text-disabled);"></i>'}
                </div>
                
                <div class="settings-item" onclick="ThemesManager.setTheme('ocean')" style="cursor: pointer;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #01579B, #03A9F4); display: flex; align-items: center; justify-content: center; border: 2px solid ${ThemesManager.getCurrent() === 'ocean' ? 'var(--primary)' : 'var(--border-light)'};">
                            <i class="fas fa-water" style="color: white; font-size: 18px;"></i>
                        </div>
                        <div>
                            <span style="font-weight: 600;">المحيط</span>
                            <p style="font-size: 11px; color: var(--text-tertiary);">هدوء وعمق - مناسب للجميع</p>
                        </div>
                    </div>
                    ${ThemesManager.getCurrent() === 'ocean' ? '<i class="fas fa-check-circle" style="color: var(--primary);"></i>' : '<i class="far fa-circle" style="color: var(--text-disabled);"></i>'}
                </div>
                
                <div class="settings-item" onclick="ThemesManager.setTheme('ramadan')" style="cursor: pointer; border-bottom: none;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #4A148C, #FFD700); display: flex; align-items: center; justify-content: center; border: 2px solid ${ThemesManager.getCurrent() === 'ramadan' ? 'var(--primary)' : 'var(--border-light)'};">
                            <i class="fas fa-star-and-crescent" style="color: white; font-size: 18px;"></i>
                        </div>
                        <div>
                            <span style="font-weight: 600;">الرمضاني</span>
                            <p style="font-size: 11px; color: var(--text-tertiary);">أجواء روحانية - لشهر رمضان</p>
                        </div>
                    </div>
                    ${ThemesManager.getCurrent() === 'ramadan' ? '<i class="fas fa-check-circle" style="color: var(--primary);"></i>' : '<i class="far fa-circle" style="color: var(--text-disabled);"></i>'}
                </div>
            </div>

                <div class="settings-item">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-lock" style="color: var(--text-tertiary);"></i>
                        <span>قفل التطبيق برمز سري</span>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" ${settings.appLockEnabled ? 'checked' : ''} onchange="toggleAppLock(this.checked)">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>
            
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
                                <p style="font-size: 12px; color: var(--text-tertiary); margin-top: 2px;">شروط الخدمة</p>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 11px; color: var(--primary); background: var(--primary-light); padding: 4px 10px; border-radius: 20px; font-weight: 500;">تصفح</span>
                            <i class="fas fa-chevron-left" style="color: var(--primary); font-size: 14px;"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div class="settings-group">
                <h3 style="padding: 16px 24px; border-bottom: 1px solid var(--border-light);">
                    <i class="fas fa-star" style="margin-left: 8px; color: #FFC107;"></i>
                    تقييم التطبيق
                </h3>
                <div style="padding: 24px; text-align: center;">
                    <p style="color: var(--text-secondary); margin-bottom: 20px; line-height: 1.8;">
                        هل أعجبك تطبيق <strong>تعافي</strong>؟
                        <br>تقييمك يساعدني على تحسين التطبيق وتقديم محتوى أفضل
                    </p>
                    
                    <div style="margin: 0 auto 12px; max-width: 520px; text-align: center;">
                        <textarea id="rating-message" placeholder="اترك تعليقك أو اقتراحك قبل التقييم..." style="width:100%; min-height:60px; padding:10px; border-radius:8px; border:1px solid var(--border-light); resize:vertical; font-size:14px; direction: rtl; font-family: var(--font-primary);"></textarea>
                    </div>
                    
                    <p style="font-size: 11px; color: var(--text-tertiary); margin-bottom: 8px;">
                        <i class="fas fa-arrow-left" style="margin-left: 4px;"></i>
                        من اليمين: 5 نجوم (ممتاز) ← إلى اليسار: نجمة واحدة
                    </p>
                    <div id="rating-stars" style="display: flex; justify-content: center; gap: 8px; margin-bottom: 16px; direction: rtl;">
                        <i class="far fa-star rating-star" data-rating="5" onclick="rateApp(5)" style="font-size: 40px; color: #D1D5DB; cursor: pointer; transition: all 0.2s ease;" title="5 نجوم - ممتاز"></i>
                        <i class="far fa-star rating-star" data-rating="4" onclick="rateApp(4)" style="font-size: 40px; color: #D1D5DB; cursor: pointer; transition: all 0.2s ease;" title="4 نجوم - جيد جداً"></i>
                        <i class="far fa-star rating-star" data-rating="3" onclick="rateApp(3)" style="font-size: 40px; color: #D1D5DB; cursor: pointer; transition: all 0.2s ease;" title="3 نجوم - جيد"></i>
                        <i class="far fa-star rating-star" data-rating="2" onclick="rateApp(2)" style="font-size: 40px; color: #D1D5DB; cursor: pointer; transition: all 0.2s ease;" title="2 نجمة - مقبول"></i>
                        <i class="far fa-star rating-star" data-rating="1" onclick="rateApp(1)" style="font-size: 40px; color: #D1D5DB; cursor: pointer; transition: all 0.2s ease;" title="نجمة واحدة - ضعيف"></i>
                    </div>
                    
                    <p id="rating-text" style="font-size: 14px; color: var(--text-tertiary); min-height: 20px;"></p>
                    
                    <div id="reset-rating-container" style="display: none; margin-top: 8px;">
                        <button class="btn btn-sm btn-outline" onclick="resetRating()" style="font-size: 12px; color: #F44336; border-color: #F44336;">
                            <i class="fas fa-undo"></i> إعادة تعيين التقييم
                        </button>
                    </div>
                    
                    <div id="thank-you-message" style="display: none; margin-top: 16px; animation: fadeSlideIn 0.5s ease;">
                        <div style="background: linear-gradient(135deg, #E8F5E9, #C8E6C9); padding: 20px; border-radius: var(--radius-lg); text-align: center;">
                            <i class="fas fa-heart" style="font-size: 40px; color: #E91E63; margin-bottom: 12px; animation: pulse 1s infinite;"></i>
                            <h3 style="color: #2E7D32; margin-bottom: 8px;">شكراً جزيلاً !</h3>
                            <p style="color: #2E7D32; line-height: 1.8; font-size: 14px;">
                                تقييمك يعني لي الكثير ويُساعدني على الاستمرار في تطوير التطبيق
                                <br>نسأل الله أن ينفع به الجميع
                            </p>
                            <a href="https://docs.google.com/forms/d/e/1FAIpQLScKIXQIP-qh2aZI54iVqX_u2gHknBkv6DyERqfBmbZ1HCSF0w/viewform" 
                               target="_blank" rel="noopener" 
                               class="btn btn-primary btn-sm" 
                               style="margin-top: 12px; background: #2E7D32; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" style="vertical-align: middle; margin-left: 4px;">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.10z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.70 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.70 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.60 3.30-4.53 6.16-4.53z"/>
                                </svg>
                                تقييم مفصل على Google
                            </a>
                            <p style="font-size: 11px; color: var(--text-tertiary); margin-top: 8px;">
                                <i class="fas fa-info-circle" style="margin-left: 4px;"></i>
                                التقييم يُحفظ على جهازك - نموذج Google اختياري
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="settings-group">
                <h3 style="padding: 16px 24px; border-bottom: 1px solid var(--border-light);">
                    <i class="fas fa-user-circle" style="margin-left: 8px; color: var(--primary);"></i>
                    حول المطور
                </h3>
                <div style="padding: 24px; line-height: 2;">
                    <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px; padding: 16px; background: var(--surface-variant); border-radius: var(--radius-lg);">
                        <div style="width: 60px; height: 60px; border-radius: 50%; background: var(--primary-gradient); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <i class="fas fa-code" style="font-size: 26px; color: white;"></i>
                        </div>
                        <div>
                            <p style="font-size: 18px; font-weight: 700; color: var(--text-primary); margin-bottom: 2px;">محمد الباقر</p>
                            <p style="font-size: 13px; color: var(--primary); font-weight: 500;">مطور برمجيات مستقل، أعمل على تصميم وتطوير تطبيقات الويب وتطبيقات الهواتف الذكية وبرامج سطح المكتب تلبي احتياجات المستخدم بأسلوب احترافي مع اهتمام خاص بتقديم تجربة متكاملة تجمع بين البساطة والدقة وجودة التنفيذ.</p>
                        </div>
                    </div>

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
                    
                    <p style="color: var(--text-secondary); font-size: 14px; line-height: 1.8; margin-bottom: 20px; text-align: justify;">
                        تم تطوير هذا التطبيق بهدف تقديم محتوى توعوي نافع ومفيد، 
                        مع التركيز على الجودة والاحترافية في التصميم والمحتوى.
                    </p>
                    
                    <div style="height: 1px; background: var(--border-light); margin-bottom: 20px;"></div>
                    
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <a href="https://wsl-iq.github.io/" target="_blank" rel="noopener noreferrer"
                           style="display: flex; align-items: center; gap: 14px; padding: 14px 18px; border-radius: var(--radius-lg); background: linear-gradient(135deg, #0F172A, #1E293B, #334155); color: white; text-decoration: none; transition: all 0.3s ease; box-shadow: 0 2px 10px rgba(15, 23, 42, 0.28);">
                            <div style="width: 40px; height: 40px; border-radius: 12px; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <i class="fas fa-globe" style="font-size: 22px; color: #E2E8F0;"></i>
                            </div>
                            <div style="flex: 1;">
                                <span style="font-weight: 600; font-size: 15px;">موقعي الشخصي</span>
                                <p style="font-size: 12px; opacity: 0.9;">wsl-iq.github.io</p>
                            </div>
                            <i class="fas fa-arrow-left" style="font-size: 14px; opacity: 0.8;"></i>
                        </a>

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

            <div class="settings-group">
                <h3 style="padding: 16px 24px; border-bottom: 1px solid var(--border-light);">
                    <i class="fas fa-download" style="margin-left: 8px; color: #4CAF50;"></i>
                    تحميل التطبيق
                </h3>
                
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

            <div class="card" style="background: #FFF8E1; border-right: 4px solid var(--accent-orange); font-family: 'Cairo', sans-serif;">
                <p style="line-height: 2.2; font-style: normal; color: var(--text-primary);">
                    <i class="fas fa-quote-right" style="font-size: 24px; color: var(--accent-orange); margin-left: 8px;"></i>
                    تم إنشاء هذا التطبيق ليكون صدقة جارية عني وعن والدي، وأسأل الله أن ينفع به كل من 
                    يستخدمه وأن يجعله سبباً في الهداية والإصلاح والعون على ترك العادات الضارة.
                </p>
            </div>

            <div class="settings-group">
                <h3 style="padding: 16px 24px; border-bottom: 1px solid var(--border-light);">
                    <i class="fas fa-sync-alt" style="margin-left: 8px; color: #2196F3;"></i>
                    تحديثات التطبيق
                </h3>
                
                <div class="settings-item">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-robot" style="color: var(--text-tertiary); font-size: 16px;"></i>
                        <span>التحقق التلقائي من التحديثات</span>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" ${settings.autoUpdateCheck !== false ? 'checked' : ''} 
                               onchange="toggleAutoUpdateCheck(this.checked)">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                
                <div class="settings-item" style="border-bottom: none;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-search" style="color: var(--text-tertiary); font-size: 16px;"></i>
                        <span>التحقق اليدوي من التحديثات</span>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="checkForUpdates()" id="manual-check-btn">
                        <i class="fas fa-sync-alt"></i> تحقق الآن
                    </button>
                </div>
                
                <div style="padding: 16px 24px; text-align: center; border-top: 1px solid var(--border-light);">
                    <div id="update-status" style="margin-bottom: 8px;">
                        <span style="color: var(--text-tertiary); font-size: 13px;">
                            <i class="fas fa-info-circle"></i> اضغط على "تحقق الآن" للبحث عن تحديثات
                        </span>
                    </div>
                    <div id="update-info" style="display: none;">
                        <p id="update-message" style="margin-bottom: 12px; line-height: 1.8;"></p>
                        <div id="update-actions" style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                            <a id="update-download-btn" href="#" target="_blank" rel="noopener" class="btn btn-primary btn-sm" style="text-decoration: none;">
                                <i class="fas fa-download"></i> تحميل التحديث
                            </a>
                            <a id="update-release-btn" href="${GITHUB_RELEASES_URL}" target="_blank" rel="noopener" class="btn btn-outline btn-sm" style="text-decoration: none;">
                                <i class="fab fa-github"></i> صفحة الإصدارات
                            </a>
                        </div>
                    </div>
                    <p style="font-size: 11px; color: var(--text-tertiary); margin-top: 8px;">
                        الإصدار الحالي: <strong id="current-version">${ApplicationVersion}</strong>
                    </p>
                    <p id="last-check-time" style="font-size: 10px; color: var(--text-tertiary); margin-top: 4px;"></p>
                </div>
            </div>

            <div class="settings-group">
                <div class="settings-item" onclick="toggleChangelog()" style="cursor: pointer; border-bottom: none;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 44px; height: 44px; border-radius: 12px; background: #FCE4EC; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-gift" style="font-size: 20px; color: #E91E63;"></i>
                        </div>
                        <div>
                            <span style="font-weight: 600;">ما هو الجديد؟ v${ApplicationVersion}</span>
                            <p style="font-size: 12px; color: var(--text-tertiary); margin-top: 2px;">اضغط لعرض الميزات الجديدة</p>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 11px; color: #E91E63; background: #FCE4EC; padding: 4px 10px; border-radius: 20px; font-weight: 500;">24 مميزات</span>
                        <i class="fas fa-chevron-down" id="changelog-arrow" style="color: var(--text-tertiary); font-size: 14px; transition: transform 0.3s ease;"></i>
                    </div>
                </div>
                
                <div id="changelog-content" style="display: none; padding: 16px 24px; border-top: 1px solid var(--border-light);">
                    <ul style="line-height: 2.2; padding-right: 20px; color: var(--text-secondary); font-size: 14px; list-style: none;">
                        <li>1- نظام الإنجازات والشارات - 16 شارة تحفيزية</li>
                        <li>2- الإحصائيات والرسوم البيانية - تتبع تقدمك</li>
                        <li>3- اختبار تقييم ذاتي - 8 أسئلة لتقييم حالتك</li>
                        <li>4- الوضع الليلي التلقائي - داكن من المغرب للفجر</li>
                        <li>5- بحث متقدم في المحتوى - ابحث في كل شيء</li>
                        <li>6- نسخ احتياطي وتصدير البيانات - حافظ على تقدمك</li>
                        <li>7- إشعارات ذكية - تذكيرات في أفضل الأوقات</li>
                        <li>8- عادة جديدة: الزنا والعلاقات غير الشرعية</li>
                        <li>9- نظام التحقق من التحديثات - تلقائي ويدوي</li>
                        <li>10- تحسينات عامة - أداء | داكن | جوال | تبرع | تقييم</li>
                        <li>11- قفل التطبيق برمز سري - حماية خصوصيتك</li>
                        <li>12- 5 ثيمات جديدة - وردي | صحراوي | محيط | رمضاني</li>
                        <li>13- مذكرات يومية - عبّر عن مشاعرك</li>
                        <li>14- لوحة المتصدرين - تحديات أسبوعية ونقاط</li>
                        <li>15- لعبة تحدي النفس - تمرين تنفس تفاعلي</li>
                        <li>16- الأدعية والزيارات - دعاء كميل، الندبة، عاشوراء...</li>
                        <li>17- البحث الشامل - عادات، أذكار، أدعية، زيارات</li>
                        <li>18- شريط تحكم بالخط - صفحة الأدعية والزيارات الرئيسية - صفحة تفاصيل الدعاء/الزيارة</li>
                        <li>19- الصحة والرياضة - التغذية الصحية والرياضة اليوميةوتجنب تعارضات الطعام</li>
                        <li>20- تصحيح الأخطاء الواجهة الرئيسية</li>
                        <li>21- أضافة التقويم الهجري والميلادي مع الساعة</li>
                        <li>22- التعديل على السياسات والقوانين أضافة بعض الشروط الصارمة</li>
                        <li>23-إمكانية الرجوع للصفحة السابقة وتصحيح الإخطاء</li>
                        <li>24- أضافة ميزة مساعد الصلاة - سجل الركوع والسجود لتعرف أين وصلت</li>
                    </ul>
                </div>
            </div>

            <script>
                function toggleChangelog() {
                    var content = document.getElementById('changelog-content');
                    var arrow = document.getElementById('changelog-arrow');
                    if (!content) return;
                    var isHidden = getComputedStyle(content).display === 'none';
                    content.style.display = isHidden ? 'block' : 'none';
                    if (arrow) arrow.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
                }

                document.addEventListener('DOMContentLoaded', function(){
                    var item = document.querySelector('.settings-item[onclick]');
                    if (item) item.style.cursor = 'pointer';
                });
            </script>

            <div class="settings-group">
                <h3 style="padding: 16px 24px; border-bottom: 1px solid var(--border-light);">
                    <i class="fas fa-hand-holding-heart" style="margin-left: 8px; color: #E91E63;"></i>
                    تبرع لدعم التطبيق
                </h3>
                <div style="padding: 24px; text-align: center;">
                    <p style="color: var(--text-secondary); margin-bottom: 16px; line-height: 1.8;">
                        التطبيق <strong>مجاني بالكامل</strong> وهو صدقة جارية للجميع
                        <br>لكن إن أردت المساهمة في دعم التطوير والاستمرارية
                        <br>يمكنك التبرع بالمبلغ الذي تريده
                    </p>
                    
                    <div style="background: linear-gradient(135deg, #1A1A1A, #2D2D2D); padding: 20px; border-radius: var(--radius-xl); margin-bottom: 16px; max-width: 380px; margin-left: auto; margin-right: auto; box-shadow: 0 8px 24px rgba(0,0,0,0.2);">
                        <!-- شعار Mastercard -->
                        <div style="display: flex; justify-content: flex-end; margin-bottom: 16px;">
                            <svg width="50" height="30" viewBox="0 0 50 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="20" cy="15" r="15" fill="#EB001B"/>
                                <circle cx="30" cy="15" r="15" fill="#F79E1B" opacity="0.8"/>
                                <text x="25" y="20" text-anchor="middle" fill="white" font-size="7" font-weight="bold" font-family="Arial">Mastercard</text>
                            </svg>
                        </div>
                        
                        <div style="margin-bottom: 12px;">
                            <p style="color: #999; font-size: 10px; text-align: left; margin-bottom: 4px;">رقم البطاقة</p>
                            <p style="color: white; font-size: 20px; letter-spacing: 3px; font-family: 'Courier New', monospace; text-align: left; direction: ltr;" id="card-number">4582 1499 61</p>
                        </div>
                        
                        <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                            <div>
                                <p style="color: #999; font-size: 10px; text-align: left; margin-bottom: 2px;">صاحب البطاقة</p>
                                <p style="color: white; font-size: 13px; text-align: left;">MOHAMMED AL-BAQER</p>
                            </div>
                            <div>
                                <p style="color: #999; font-size: 10px; text-align: right; margin-bottom: 2px;">صالحة حتى</p>
                                <p style="color: white; font-size: 13px; text-align: right;">11/2029</p>
                            </div>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 12px;">
                        <button class="btn btn-primary btn-sm" onclick="copyCardNumber('4582149961')" id="copy-card-btn">
                            <i class="fas fa-copy"></i> نسخ رقم البطاقة
                        </button>
                    </div>
                    
                    <p id="copy-status" style="font-size: 12px; color: var(--text-tertiary); min-height: 18px;"></p>
                    
                    <div style="height: 1px; background: var(--border-light); margin: 16px 0;"></div>
                    
                    <p style="color: var(--text-secondary); font-size: 13px; line-height: 1.8; font-style: italic;">
                        <i class="fas fa-quote-right" style="color: #E91E63; margin-left: 4px; font-size: 16px;"></i>
                        جزاك الله خيراً على دعمك وتبرعك
                        <br>جعله الله في ميزان حسناتك
                    </p>
                </div>
            </div>
            
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
    setTimeout(() => loadPreviousRating(), 200);
}

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

function openInBrowser() {
    const appUrl = 'https://wsl-iq.github.io/teaafi/';
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
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function copyAppUrl(url) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
            showToast('تم نسخ الرابط بنجاح');
        }).catch(() => {
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

function downloadApp(platform) {
    const links = {
        android: 'https://github.com/wsl-iq/teaafi/releases/tag/V1.1.2',
        windows: 'https://github.com/wsl-iq/teaafi/releases/tag/V1.1.2'
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

const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScKIXQIP-qh2aZI54iVqX_u2gHknBkv6DyERqfBmbZ1HCSF0w/viewform';

let appRated = StorageManager.get('app_rated') || false;
let currentRating = StorageManager.get('app_rating_value') || 0;

function rateApp(rating) {
    const isChanging = appRated && currentRating !== rating;
    const messageEl = document.getElementById('rating-message');
    const userMessage = messageEl ? messageEl.value.trim() : '';
    const stars = document.querySelectorAll('.rating-star');
    stars.forEach((star) => {
        const starRating = parseInt(star.getAttribute('data-rating'));
        if (starRating <= rating) {
            star.style.color = '#FFC107';
            star.style.transform = 'scale(1.3)';
            star.classList.remove('far');
            star.classList.add('fas');
        } else {
            star.style.color = '#D1D5DB';
            star.style.transform = 'scale(1)';
            star.classList.remove('fas');
            star.classList.add('far');
        }
        setTimeout(() => { star.style.transform = 'scale(1)'; }, 300);
    });
    
    const ratingTexts = { 1: 'نأسف لذلك.. سنعمل على التحسين', 2: 'شكراً لك.. نعدك بالتطوير', 3: 'شكراً لتقييمك.. نقدر رأيك', 4: 'شكراً جزيلاً! سعداء برأيك', 5: 'رائع! شكراً من القلب' };
    
    const ratingText = document.getElementById('rating-text');
    if (ratingText) {
        if (userMessage) {
            ratingText.textContent = `شكراً لتقييمك ${rating}★ - "${userMessage}"`;
        } else if (isChanging) {
            ratingText.textContent = `تم تغيير تقييمك من ${currentRating} إلى ${rating} نجوم - شكراً لك!`;
        } else {
            ratingText.textContent = ratingTexts[rating];
        }
        ratingText.style.color = isChanging ? '#2196F3' : '#FF9800';
        ratingText.style.fontWeight = '600';
    }
    
    currentRating = rating;
    appRated = true;
    StorageManager.set('app_rated', true);
    StorageManager.set('app_rating_value', rating);
    if (userMessage) StorageManager.set('app_rating_message', userMessage);
    
    setTimeout(() => {
        const thankYouMessage = document.getElementById('thank-you-message');
        if (thankYouMessage) {
            thankYouMessage.style.display = 'block';
            thankYouMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        const resetContainer = document.getElementById('reset-rating-container');
        if (resetContainer) resetContainer.style.display = 'block';
        
        const messages = { 1: 'شكراً لصراحتك.. سنعمل على تحسين التطبيق', 2: 'شكراً لك.. نعدك بتطوير أفضل', 3: 'شكراً لتقييمك.. نقدر وقتك', 4: 'شكراً جزيلاً! تقييمك يسعدنا', 5: 'ممتنون جداً لتقييمك الرائع!' };
        showToast(messages[rating]);
    }, 500);
}

function loadPreviousRating() {
    const savedRated = StorageManager.get('app_rated');
    const savedRating = StorageManager.get('app_rating_value');
    const savedMessage = StorageManager.get('app_rating_message') || '';
    
    if (savedRated && savedRating) {
        appRated = true;
        currentRating = savedRating;
        
        setTimeout(() => {
            const messageEl = document.getElementById('rating-message');
            if (messageEl && savedMessage) messageEl.value = savedMessage;
            
            const stars = document.querySelectorAll('.rating-star');
            stars.forEach((star) => {
                const starRating = parseInt(star.getAttribute('data-rating'));
                if (starRating <= savedRating) {
                    star.style.color = '#FFC107';
                    star.classList.remove('far');
                    star.classList.add('fas');
                }
                star.style.cursor = 'pointer';
                star.onclick = function() { rateApp(starRating); };
            });
            
            const thankYouMessage = document.getElementById('thank-you-message');
            if (thankYouMessage) thankYouMessage.style.display = 'block';
            
            const resetContainer = document.getElementById('reset-rating-container');
            if (resetContainer) resetContainer.style.display = 'block';
            
            const ratingText = document.getElementById('rating-text');
            if (ratingText) {
                ratingText.textContent = savedMessage 
                    ? `تقييمك: ${savedRating}/5★ - "${savedMessage}" - اضغط لتغيير التقييم`
                    : `تقييمك: ${savedRating}/5 نجوم - اضغط لتغيير التقييم`;
                ratingText.style.color = '#4CAF50';
                ratingText.style.fontWeight = '600';
            }
        }, 100);
    }
}

function resetRating() {
    if (confirm('هل أنت متأكد من إعادة تعيين تقييمك؟')) {
        appRated = false;
        currentRating = 0;
        StorageManager.set('app_rated', false);
        StorageManager.set('app_rating_value', 0);
        StorageManager.remove('app_rating_message');
        
        // Delete the saved message from local storage
        const messageEl = document.getElementById('rating-message');
        if (messageEl) messageEl.value = '';
        
        // Reset the stars to default state
        const stars = document.querySelectorAll('.rating-star');
        stars.forEach(star => {
            star.style.color = '#D1D5DB';
            star.classList.remove('fas');
            star.classList.add('far');
            star.style.cursor = 'pointer';
        });
        
        const thankYouMessage = document.getElementById('thank-you-message');
        if (thankYouMessage) thankYouMessage.style.display = 'none';
        
        const resetContainer = document.getElementById('reset-rating-container');
        if (resetContainer) resetContainer.style.display = 'none';
        
        const ratingText = document.getElementById('rating-text');
        if (ratingText) {
            ratingText.textContent = '';
            ratingText.style.color = 'var(--text-tertiary)';
        }
        
        showToast('تم إعادة تعيين التقييم');
    }
}

// Effects for star rating hover and click.
document.addEventListener('mouseover', function(e) {
    if (e.target.classList.contains('rating-star')) {
        const rating = parseInt(e.target.getAttribute('data-rating'));
        const stars = document.querySelectorAll('.rating-star');
        stars.forEach((star) => {
            const starRating = parseInt(star.getAttribute('data-rating'));
            if (starRating <= rating) {
                star.style.color = '#FFC107';
                star.style.transform = 'scale(1.15)';
                star.classList.remove('far');
                star.classList.add('fas');
            }
        });
    }
});

document.addEventListener('mouseout', function(e) {
    if (e.target.classList.contains('rating-star')) {
        const stars = document.querySelectorAll('.rating-star');
        stars.forEach((star) => {
            const starRating = parseInt(star.getAttribute('data-rating'));
            if (currentRating > 0 && starRating <= currentRating) {
                star.style.color = '#FFC107';
                star.classList.remove('far');
                star.classList.add('fas');
            } else {
                star.style.color = '#D1D5DB';
                star.classList.remove('fas');
                star.classList.add('far');
            }
            star.style.transform = 'scale(1)';
        });
    }
});

const GITHUB_VERSION_URL = 'https://raw.githubusercontent.com/wsl-iq/teaafi/refs/heads/main/version.txt';
const GITHUB_API_URL = 'https://api.github.com/repos/wsl-iq/teaafi/releases/latest';
const GITHUB_RELEASES_URL = 'https://github.com/wsl-iq/teaafi/releases/latest';

let autoUpdateInterval = null;

/**
 * Enable/Disable Automatic Verification
 */

function toggleAutoUpdateCheck(enabled) {
    updateSetting('autoUpdateCheck', enabled);
    
    if (enabled) {
        startAutoUpdateCheck();
        showToast('تم تفعيل التحقق التلقائي من التحديثات');
    } else {
        stopAutoUpdateCheck();
        showToast('تم إلغاء التحقق التلقائي من التحديثات');
    }
}

/**
 * Start automatic verification
 */

function startAutoUpdateCheck() {
    stopAutoUpdateCheck(); // Stop any previous timer
    
    // Instant verification upon activation
    checkForUpdates(true);
    
    // Check every 24 hours
    autoUpdateInterval = setInterval(function() {
        checkForUpdates(true);
    }, 24 * 60 * 60 * 1000);
    
    console.log('[Update] Auto check started (every 24h)');
}

/**
 * Turn off automatic verification
 */

function stopAutoUpdateCheck() {
    if (autoUpdateInterval) {
        clearInterval(autoUpdateInterval);
        autoUpdateInterval = null;
        console.log('[Update] Auto check stopped');
    }
}

/**
 * Check for updates
 * @param {boolean} silent - If true, Toast messages will not appear.
 */

async function checkForUpdates(silent) {
    const updateStatus = document.getElementById('update-status');
    const updateInfo = document.getElementById('update-info');
    const manualBtn = document.getElementById('manual-check-btn');
    
    // show loading status
    if (updateStatus) {
        updateStatus.innerHTML = `
            <span style="color: var(--text-secondary);">
                <i class="fas fa-spinner fa-spin"></i> جاري التحقق من التحديثات...
            </span>
        `;
    }
    if (updateInfo) updateInfo.style.display = 'none';
    if (manualBtn) {
        manualBtn.disabled = true;
        manualBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحقق...';
    }
    
    try {
        let latestVersion = null;
        let downloadUrl = GITHUB_RELEASES_URL;
        
        // version.txt
        try {
            const response = await fetch(GITHUB_VERSION_URL + '?t=' + Date.now(), {
                cache: 'no-cache',
                headers: { 'Accept': 'text/plain' }
            });
            
            if (response.ok) {
                latestVersion = (await response.text()).trim();
                console.log('[Update] version.txt:', latestVersion);
            }
        } catch (e) {
            console.warn('[Update] version.txt failed, trying API...');
        }
        
        // GitHub API
        if (!latestVersion) {
            try {
                const response = await fetch(GITHUB_API_URL, {
                    cache: 'no-cache',
                    headers: { 'Accept': 'application/vnd.github.v3+json' }
                });
                
                if (response.ok) {
                    const release = await response.json();
                    latestVersion = release.tag_name ? release.tag_name.replace(/^v/, '') : null;
                    if (release.html_url) downloadUrl = release.html_url;
                    console.log('[Update] API:', latestVersion);
                }
            } catch (e) {
                console.warn('[Update] API failed');
            }
        }
        
        // show update status
        if (latestVersion) {
            if (compareVersions(latestVersion, ApplicationVersion) > 0) {
                showUpdateAvailable(latestVersion, downloadUrl, silent);
            } else {
                showNoUpdateAvailable(silent);
            }
        } else {
            showUpdateCheckFailed(silent);
        }
        
        // update datetime of last check
        StorageManager.set('last_update_check', Date.now());
        updateLastCheckTime();
        
    } catch (error) {
        console.error('[Update] Error:', error);
        showUpdateCheckFailed(silent);
    } finally {
        if (manualBtn) {
            manualBtn.disabled = false;
            manualBtn.innerHTML = '<i class="fas fa-sync-alt"></i> تحقق الآن';
        }
    }
}

/**
 * Display message indicating an update
 */

function showUpdateAvailable(latestVersion, downloadUrl, silent) {
    const updateStatus = document.getElementById('update-status');
    const updateInfo = document.getElementById('update-info');
    const updateMessage = document.getElementById('update-message');
    const downloadBtn = document.getElementById('update-download-btn');
    
    if (updateStatus) {
        updateStatus.innerHTML = `
            <span style="color: #FF9800; font-weight: 600;">
                <i class="fas fa-exclamation-circle"></i> يوجد تحديث جديد!
            </span>
        `;
    }
    
    if (updateMessage) {
        updateMessage.innerHTML = `
            <div style="color: var(--text-primary); margin-bottom: 8px;">
                📦 <strong style="color: #FF9800;">الإصدار v${latestVersion}</strong> متاح الآن
            </div>
            <div style="color: var(--text-secondary); font-size: 13px;">
                أنت تستخدم الإصدار <strong>v${ApplicationVersion}</strong>
                <br>يوصى بالتحديث للحصول على أحدث الميزات والتحسينات
            </div>
        `;
    }
    
    if (downloadBtn) {
        downloadBtn.href = downloadUrl || GITHUB_RELEASES_URL;
    }
    
    if (updateInfo) updateInfo.style.display = 'block';
    
    if (!silent && typeof showToast === 'function') {
        showToast('📦 يوجد تحديث جديد! v' + latestVersion);
    }
    
    StorageManager.set('update_available', { version: latestVersion, date: Date.now() });
}

/**
 * Displays "No update" message
 */

function showNoUpdateAvailable(silent) {
    const updateStatus = document.getElementById('update-status');
    const updateInfo = document.getElementById('update-info');
    
    if (updateStatus) {
        updateStatus.innerHTML = `
            <span style="color: #4CAF50; font-weight: 600;">
                <i class="fas fa-check-circle"></i> التطبيق محدث إلى آخر إصدار v${ApplicationVersion}
            </span>
        `;
    }
    
    if (updateInfo) updateInfo.style.display = 'none';
    if (!silent && typeof showToast === 'function') {
        showToast('التطبيق محدث إلى آخر إصدار');
    }
    
    StorageManager.remove('update_available');
}

/**
 * Verification failed message displayed
 */

function showUpdateCheckFailed(silent) {
    const updateStatus = document.getElementById('update-status');
    const updateInfo = document.getElementById('update-info');
    
    if (updateStatus) {
        updateStatus.innerHTML = `
            <span style="color: var(--text-tertiary);">
                <i class="fas fa-exclamation-triangle"></i> تعذر التحقق من التحديثات
            </span>
            <br>
            <span style="font-size: 11px; color: var(--text-tertiary);">
                تحقق من اتصالك بالإنترنت وحاول مرة أخرى
            </span>
        `;
    }
    
    if (updateInfo) updateInfo.style.display = 'none';
    
    if (!silent && typeof showToast === 'function') {
        showToast(' تعذر التحقق من التحديثات');
    }
}

/**
 * Comparing two version numbers
 */

function compareVersions(v1, v2) {
    if (!v1 || !v2) return 0;
    
    const parts1 = v1.toString().split('.').map(Number);
    const parts2 = v2.toString().split('.').map(Number);
    const maxLength = Math.max(parts1.length, parts2.length);
    
    for (let i = 0; i < maxLength; i++) {
        const a = parts1[i] || 0;
        const b = parts2[i] || 0;
        if (a > b) return 1;
        if (a < b) return -1;
    }
    return 0;
}

/**
 * Last scan time update
 */

function updateLastCheckTime() {
    const lastCheck = StorageManager.get('last_update_check');
    const el = document.getElementById('last-check-time');
    
    if (el && lastCheck) {
        const date = new Date(lastCheck);
        const now = new Date();
        const diffMinutes = Math.floor((now - date) / 60000);
        
        if (diffMinutes < 1) {
            el.textContent = 'آخر فحص: الآن';
        } else if (diffMinutes < 60) {
            el.textContent = 'آخر فحص: منذ ' + diffMinutes + ' دقيقة';
        } else if (diffMinutes < 1440) {
            el.textContent = 'آخر فحص: منذ ' + Math.floor(diffMinutes / 60) + ' ساعة';
        } else {
            el.textContent = 'آخر فحص: ' + date.toLocaleDateString('ar-SA');
        }
    } else if (el) {
        el.textContent = 'لم يتم الفحص بعد';
    }
}

/**
 * Configure the page load update system
 */

function initUpdateSystem() {
    const versionEl = document.getElementById('current-version');
    if (versionEl) versionEl.textContent = ApplicationVersion;
    updateLastCheckTime();
    const settings = StorageManager.getSettings();
    
    if (settings.autoUpdateCheck !== false) {
        startAutoUpdateCheck();
    }
    
    // check if there's a saved update notification
    var saved = StorageManager.get('update_available');
    if (saved && saved.version && typeof compareVersions === 'function') {
        if (compareVersions(saved.version, ApplicationVersion) > 0) {

            /** highlight the update notification in the settings page
            var updateNotification = document.getElementById('update-notification');
            if (updateNotification) {
                updateNotification.style.backgroundColor = 'var(--surface-variant)';
                updateNotification.style.border = '1px solid var(--accent-yellow)';
            }
                */

            var dismissed = StorageManager.get('update_notification_dismissed');
            if (dismissed) {

                /**  
                 * If the notification was dismissed more than 3 days ago, remove it
                 * 3 days = 3 * 24 * 60 * 60 * 1000 = 259200000 ms
                 * Check if the dismissed timestamp is older than 3 days
                 * If so, remove the dismissed flag to show the notification again
                 * This ensures that users who dismissed the notification will see it again after 3 days
                 * We use Date.now() to get the current timestamp in milliseconds
                 * Compare the current timestamp with the dismissed timestamp
                 * If the difference is greater than 3 days, remove the dismissed flag
                */

                if (Date.now() - dismissed > 3 * 86400000) {
                    StorageManager.remove('update_notification_dismissed');
                }
            }
        }
    }
}

/**
 * Copy the card number to the clipboard 
 * (only Press [Windows + V]) for show number
 * or, Press [Ctrl + V] for paste
 */

function copyCardNumber(number) {
    const formattedNumber = number.replace(/\s/g, '');
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(formattedNumber).then(function() {
            showCopySuccess();
        }).catch(function() {
            fallbackCopyCardNumber(formattedNumber);
        });
    } else {
        fallbackCopyCardNumber(formattedNumber);
    }
}

/**
 * An alternative method for copying text
 */
function fallbackCopyCardNumber(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        showCopySuccess();
    } catch (err) {
        showCopyFailed(text);
    }
    
    document.body.removeChild(textarea);
}

/**
 * Displaying the copy success message
 */
function showCopySuccess() {
    const statusEl = document.getElementById('copy-status');
    const copyBtn = document.getElementById('copy-card-btn');
    
    if (statusEl) {
        statusEl.innerHTML = '<span style="color: #4CAF50;"><i class="fas fa-check-circle"></i> تم نسخ رقم البطاقة بنجاح</span>';
    }
    
    if (copyBtn) {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> تم النسخ';
        copyBtn.style.background = '#4CAF50';
        copyBtn.style.borderColor = '#4CAF50';
        
        setTimeout(function() {
            copyBtn.innerHTML = originalText;
            copyBtn.style.background = '';
            copyBtn.style.borderColor = '';
        }, 2000);
    }
    
    if (typeof showToast === 'function') {
        showToast('تم نسخ رقم البطاقة بنجاح');
    }
}

function showCopyFailed(text) {
    const statusEl = document.getElementById('copy-status');
    
    if (statusEl) {
        statusEl.innerHTML = '<span style="color: #F44336;"><i class="fas fa-times-circle"></i> تعذر النسخ - رقم البطاقة: ' + text + '</span>';
    }
    
    if (typeof showToast === 'function') {
        showToast('تعذر النسخ التلقائي');
    }
}

function toggleChangelog() {
    var content = document.getElementById('changelog-content');
    var arrow = document.getElementById('changelog-arrow');
    
    if (content && arrow) {
        if (content.style.display === 'none' || content.style.display === '') {
            content.style.display = 'block';
            arrow.style.transform = 'rotate(180deg)';
        } else {
            content.style.display = 'none';
            arrow.style.transform = 'rotate(0deg)';
        }
    }
}

function toggleAppLock(enabled) {
    if (enabled) {
        showPinSetupDialog();
    } else {
        showPinDisableDialog();
    }
}

function showPinSetupDialog() {
    var modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.zIndex = '200';
    
    var setupPin = '';
    window._setupPin = '';
    
    modal.innerHTML = `
        <div class="modal-container" style="max-width: 380px; text-align: center; animation: scaleIn 0.3s ease;">
            <div style="font-size: 50px; margin-bottom: 8px;"></div>
            <h3 style="margin-bottom: 2px;">تعيين رمز سري</h3>
            <p style="color: var(--text-secondary); font-size: 12px; margin-bottom: 4px;">أدخل 6 أرقام لحماية التطبيق</p>
            <p style="color: var(--text-tertiary); font-size: 10px; margin-bottom: 16px;">الحد الأقصى 6 أرقام</p>
            
            <div style="display:flex;gap:8px;justify-content:center;margin-bottom:16px;" id="setup-display">
                <div class="pin-digit" id="sd-0"></div>
                <div class="pin-digit" id="sd-1"></div>
                <div class="pin-digit" id="sd-2"></div>
                <div class="pin-digit" id="sd-3"></div>
                <div class="pin-digit" id="sd-4"></div>
                <div class="pin-digit" id="sd-5"></div>
            </div>
            
            <p id="setup-error" style="color:#F44336;font-size:11px;min-height:18px;margin-bottom:12px;"></p>
            
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:250px;margin:0 auto 16px;" id="setup-pad">
                <button class="pin-key setup-key">1</button>
                <button class="pin-key setup-key">2</button>
                <button class="pin-key setup-key">3</button>
                <button class="pin-key setup-key">4</button>
                <button class="pin-key setup-key">5</button>
                <button class="pin-key setup-key">6</button>
                <button class="pin-key setup-key">7</button>
                <button class="pin-key setup-key">8</button>
                <button class="pin-key setup-key">9</button>
                <div class="pin-empty"></div>
                <button class="pin-key setup-key">0</button>
                <button class="pin-key setup-key pin-delete"><i class="fas fa-delete-left"></i></button>
            </div>
            
            <button class="btn btn-primary w-full" onclick="saveSetupPin()" id="save-pin-btn" disabled style="width:100%;">
                <i class="fas fa-save"></i> حفظ الرمز
            </button>
            <button class="btn btn-outline w-full mt-2" onclick="this.closest('.modal-overlay').remove(); renderSettingsPage();" style="width:100%;">
                إلغاء
            </button>
            
            <div style="background:var(--surface-variant);padding:10px;border-radius:8px;margin-top:12px;">
                <p style="font-size:10px;color:var(--text-tertiary);">
                    <i class="fas fa-info-circle"></i> في حال نسيان الرمز، استخدم رمز الاسترداد:
                </p>
                <p style="font-size:13px;font-weight:700;font-family:monospace;direction:ltr;color:var(--primary);">Taeafi0x10000</p>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // setup pin input handling
    var errorEl = document.getElementById('setup-error');
    var saveBtn = document.getElementById('save-pin-btn');
    
    document.querySelectorAll('#setup-pad .setup-key').forEach(function(key) {
        key.addEventListener('click', function() {
            var val = this.textContent.trim();
            
            if (this.classList.contains('pin-delete')) {
                setupPin = setupPin.slice(0, -1);
            } else if (/^\d$/.test(val)) {
                if (setupPin.length >= 6) {
                    if (errorEl) {
                        errorEl.textContent = 'الحد الأقصى 6 أرقام فقط';
                        setTimeout(function() { errorEl.textContent = ''; }, 1500);
                    }
                    return;
                }
                setupPin += val;
                this.style.transform = 'scale(0.85)';
                setTimeout(function() { key.style.transform = ''; }, 120);
            }
            
            // Refresh display
            for (var i = 0; i < 6; i++) {
                var digitEl = document.getElementById('sd-' + i);
                if (digitEl) {
                    if (i < setupPin.length) {
                        digitEl.textContent = setupPin[i];
                        digitEl.classList.add('filled');
                    } else {
                        digitEl.textContent = '';
                        digitEl.classList.remove('filled');
                    }
                }
            }
            
            saveBtn.disabled = setupPin.length !== 6;
            window._setupPin = setupPin;
        });
    });
}

function saveSetupPin() {
    var pin = window._setupPin || '';
    if (pin.length !== 6) return;
    
    if (typeof AppLock !== 'undefined' && AppLock.setPin(pin)) {
        document.querySelector('.modal-overlay').remove();
        updateSetting('appLockEnabled', true);
        updateSetting('appPin', pin);
        showToast('تم تفعيل قفل التطبيق');
        renderSettingsPage();
    }
}

function showPinDisableDialog() {
    var modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.zIndex = '200';
    modal.innerHTML = `
        <div class="modal-container" style="max-width:380px;text-align:center;animation:scaleIn 0.3s ease;">
            <div style="font-size:50px;margin-bottom:8px;"></div>
            <h3 style="margin-bottom:4px;">إلغاء قفل التطبيق</h3>
            <p style="color:var(--text-secondary);font-size:12px;margin-bottom:4px;">أدخل الرمز الحالي أو رمز الاسترداد</p>
            <p style="color:var(--text-tertiary);font-size:10px;margin-bottom:14px;">رمز الاسترداد: <strong>Taeafi0x10000</strong></p>
            
            <input type="text" id="disable-pin-input" placeholder="أدخل الرمز أو رمز الاسترداد" 
                   style="width:100%;padding:14px;border-radius:12px;border:2px solid var(--border);text-align:center;font-size:15px;font-family:monospace;direction:ltr;margin-bottom:12px;background:var(--input-bg);color:var(--text-primary);">
            
            <p id="disable-error" style="color:#F44336;font-size:12px;min-height:18px;margin-bottom:8px;"></p>
            
            <button class="btn btn-danger w-full" onclick="disableAppLock()" style="width:100%;">
                <i class="fas fa-unlock"></i> إلغاء القفل
            </button>
            <button class="btn btn-outline w-full mt-2" onclick="this.closest('.modal-overlay').remove(); renderSettingsPage();" style="width:100%;">
                إلغاء
            </button>
        </div>
    `;
    document.body.appendChild(modal);
}

function disableAppLock() {
    var input = document.getElementById('disable-pin-input');
    var errorEl = document.getElementById('disable-error');
    if (!input) return;
    
    var code = input.value.trim();
    if (typeof AppLock !== 'undefined' && AppLock.disableLock(code)) {
        document.querySelector('.modal-overlay').remove();
        updateSetting('appLockEnabled', false);
        updateSetting('appPin', null);
        showToast('تم إلغاء قفل التطبيق');
        renderSettingsPage();
    } else {
        if (errorEl) {
            errorEl.textContent = 'رمز خاطئ - حاول مرة أخرى';
            errorEl.style.animation = 'none';
            errorEl.offsetHeight;
            errorEl.style.animation = 'shake 0.4s ease';
        }
    }
}

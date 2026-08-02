/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : Pages
 * File   : recovery.js
 * Type: JavaScript
 */

let counterIntervalId = null;

function renderRecoveryPage() {
    // إيقاف أي عداد سابق قبل إنشاء عداد جديد
    if (counterIntervalId) {
        clearInterval(counterIntervalId);
        counterIntervalId = null;
    }
    
    const mainContent = document.getElementById('main-content');
    const stats = RecoveryCounter.getRecoveryStats();
    const message = RecoveryCounter.getMotivationalMessage();
    
    mainContent.innerHTML = `
        <div class="animate-fade-in">
            <h1 class="heading-underline">رحلة التعافي</h1>
            
            ${stats.isActive ? `
                <!-- العداد الحي -->
                <div class="counter-card" style="position: relative; overflow: hidden;">
                    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%);"></div>
                    
                    <i class="fas fa-heartbeat" style="font-size: 32px; margin-bottom: 12px; animation: pulse 1.5s infinite;"></i>
                    <h3>أنت في رحلة التعافي</h3>
                    
                    <!-- العدادات -->
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 20px 0; position: relative; z-index: 1;">
                        <div class="stat-item">
                            <div class="stat-value" id="counter-seconds" style="font-size: 28px;">00</div>
                            <div class="stat-label">ثانية</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value" id="counter-minutes" style="font-size: 28px;">00</div>
                            <div class="stat-label">دقيقة</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value" id="counter-hours" style="font-size: 28px;">00</div>
                            <div class="stat-label">ساعة</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value" id="counter-days" style="font-size: 28px;">0</div>
                            <div class="stat-label">يوم</div>
                        </div>
                    </div>
                    
                    <div class="counter-stats" style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 16px; margin-top: 8px;">
                        <div class="stat-item">
                            <div class="stat-value" id="counter-weeks">0</div>
                            <div class="stat-label">أسبوع</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value" id="counter-months">0</div>
                            <div class="stat-label">شهر</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value" id="counter-years">0</div>
                            <div class="stat-label">سنة</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value" id="counter-total-hours">0</div>
                            <div class="stat-label">مجموع الساعات</div>
                        </div>
                    </div>
                    
                    <div style="margin-top: 20px; display: flex; gap: 12px; justify-content: center; position: relative; z-index: 1;">
                        <button class="btn" style="background: white; color: #0D6B6E; font-weight: 600;" onclick="handleRelapse()">
                            <i class="fas fa-exclamation-triangle"></i> تسجيل انتكاسة
                        </button>
                        <button class="btn" style="background: rgba(255,255,255,0.2); color: white;" onclick="handleResetRecovery()">
                            <i class="fas fa-redo"></i> إعادة البداية
                        </button>
                    </div>
                </div>
                
                <!-- رسالة تحفيزية -->
                <div class="card" style="background: linear-gradient(135deg, #E8F5E9, #C8E6C9); border: none; text-align: center; padding: 24px;">
                    <i class="fas fa-quote-right" style="font-size: 32px; color: #4CAF50; margin-bottom: 12px;"></i>
                    <p style="font-size: 18px; font-weight: 600; color: #2E7D32; line-height: 1.8; font-style: italic;" id="motivational-message">
                        ${message}
                    </p>
                    <button class="btn btn-sm btn-outline mt-4" onclick="refreshMotivationalMessage()" style="border-color: #4CAF50; color: #4CAF50;">
                        <i class="fas fa-sync-alt"></i> رسالة أخرى
                    </button>
                </div>
                
                <!-- مراحل التعافي -->
                <h2 class="section-title">
                    <i class="fas fa-road" style="margin-left: 8px;"></i>
                    مراحل التعافي والتحسن المتوقع
                </h2>
                
                ${RecoveryCounter.getMilestones(stats).reverse().map(milestone => `
                    <div class="card" style="border-right: 4px solid ${milestone.color};">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                            <i class="fas ${milestone.icon}" style="color: ${milestone.color}; font-size: 28px;"></i>
                            <div>
                                <h3 style="color: ${milestone.color};">${milestone.title}</h3>
                                <p class="text-sm text-secondary">${milestone.time}</p>
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 12px;">
                            <h4 style="color: #4CAF50; margin-bottom: 8px;">
                                <i class="fas fa-check-circle" style="margin-left: 4px;"></i>
                                التحسنات
                            </h4>
                            <ul style="line-height: 2.2; padding-right: 20px; list-style: disc;">
                                ${milestone.improvements.map(imp => `<li>${imp}</li>`).join('')}
                            </ul>
                        </div>
                        
                        ${milestone.challenges ? `
                            <div>
                                <h4 style="color: #FF9800; margin-bottom: 8px;">
                                    <i class="fas fa-exclamation-circle" style="margin-left: 4px;"></i>
                                    تحديات ونصائح
                                </h4>
                                <ul style="line-height: 2.2; padding-right: 20px; list-style: disc;">
                                    ${milestone.challenges.map(ch => `<li>${ch}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
                
                <!-- العادة الحالية -->
                ${stats.habitType ? `
                    <div class="card" style="background: var(--surface-variant);">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <i class="fas fa-info-circle" style="color: var(--primary); font-size: 24px;"></i>
                            <div>
                                <h4>نوع التعافي</h4>
                                <p class="text-secondary">
                                    ${stats.habitType === 'masturbation' ? 'التعافي من العادة السرية' : 
                                      stats.habitType === 'pornography' ? 'التعافي من الأفلام الإباحية' : 
                                      stats.habitType === 'smoking' ? 'الإقلاع عن التدخين' : 
                                      stats.habitType === 'alcohol' ? 'التعافي من شرب الكحول' : 
                                      stats.habitType === 'drugs' ? 'التعافي من المخدرات' : 
                                      stats.habitType === 'gaming' ? 'التعافي من إدمان الألعاب' : 
                                      stats.habitType === 'socialMedia' ? 'التعافي من إدمان التواصل الاجتماعي' : 
                                      stats.habitType === 'smartphone' ? 'التعافي من إدمان الهاتف الذكي' : 
                                      stats.habitType === 'gambling' ? 'التعافي من المقامرة' : 
                                      stats.habitType === 'procrastination' ? 'التعافي من التسويف' : 
                                      stats.habitType === 'lying' ? 'التعافي من الكذب' : 
                                      stats.habitType === 'anger' ? 'التعافي من الغضب غير المنضبط' : 
                                      stats.habitType === 'overspending' ? 'التعافي من الإسراف في الإنفاق' : 
                                      stats.habitType === 'poorNutrition' ? 'التعافي من سوء التغذية' : 
                                      stats.habitType === 'inactivity' ? 'التعافي من الخمول وقلة الحركة' : 
                                      stats.habitType === 'sleepDisorder' ? 'التعافي من اضطرابات النوم' : 
                                      stats.habitType === 'caffeine' ? 'التعافي من الإفراط في الكافيين' : 
                                      stats.habitType === 'nailBiting' ? 'التعافي من قضم الأظافر' : 
                                      stats.habitType === 'bullying' ? 'التعافي من التنمر' : 
                                      stats.habitType === 'isolation' ? 'التعافي من العزلة الاجتماعية' : 
                                      stats.habitType === 'adultery' ? 'التعافي من الزنا والعلاقات غير الشرعية' : 
                                      'رحلة التعافي'}
                                </p>
                            </div>
                        </div>
                    </div>
                ` : ''}
                
            ` : `
                <!-- لا توجد رحلة تعافي نشطة -->
                <div class="card" style="text-align: center; padding: 60px 20px;">
                    <i class="fas fa-play-circle" style="font-size: 72px; color: var(--primary); margin-bottom: 24px;"></i>
                    <h2>ابدأ رحلة التعافي الآن</h2>
                    <p class="text-secondary" style="margin: 20px 0; line-height: 1.8;">
                        كل لحظة تمر وأنت على طريق التعافي هي استثمار في مستقبلك.
                        <br>اختر العادة التي تريد التخلص منها وابدأ رحلتك نحو حياة أفضل.
                    </p>
                    <button class="btn btn-primary btn-lg" onclick="navigateTo('habits')">
                        <i class="fas fa-hands"></i> اختر العادة وابدأ التعافي
                    </button>
                </div>
            `}
        </div>
    `;
    
    // بدء العداد الحي إذا كانت هناك رحلة تعافي نشطة
    if (stats.isActive) {
        startLiveCounter();
    }
}

// بدء العداد الحي
function startLiveCounter() {
    // إيقاف أي عداد سابق
    if (counterIntervalId) {
        clearInterval(counterIntervalId);
    }
    
    // تحديث فوري
    updateLiveCounter();
    
    // تحديث كل ثانية
    counterIntervalId = setInterval(updateLiveCounter, 1000);
}

// تحديث العداد الحي
function updateLiveCounter() {
    const stats = RecoveryCounter.getRecoveryStats();
    
    const secondsEl = document.getElementById('counter-seconds');
    const minutesEl = document.getElementById('counter-minutes');
    const hoursEl = document.getElementById('counter-hours');
    const daysEl = document.getElementById('counter-days');
    const weeksEl = document.getElementById('counter-weeks');
    const monthsEl = document.getElementById('counter-months');
    const yearsEl = document.getElementById('counter-years');
    const totalHoursEl = document.getElementById('counter-total-hours');
    
    if (secondsEl) secondsEl.textContent = String(stats.seconds).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(stats.minutes).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(stats.hours).padStart(2, '0');
    if (daysEl) daysEl.textContent = stats.days;
    if (weeksEl) weeksEl.textContent = stats.weeks;
    if (monthsEl) monthsEl.textContent = stats.months;
    if (yearsEl) yearsEl.textContent = stats.years;
    if (totalHoursEl) totalHoursEl.textContent = stats.totalHours.toLocaleString('ar-SA');
}

// تحديث الرسالة التحفيزية
function refreshMotivationalMessage() {
    const message = RecoveryCounter.getMotivationalMessage();
    const messageEl = document.getElementById('motivational-message');
    if (messageEl) {
        messageEl.style.opacity = '0';
        messageEl.style.transform = 'translateY(-10px)';
        messageEl.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            messageEl.textContent = message;
            messageEl.style.opacity = '1';
            messageEl.style.transform = 'translateY(0)';
        }, 300);
    }
}

function handleRelapse() {
    if (confirm('هل أنت متأكد من تسجيل انتكاسة؟ تذكر أن الانتكاسة جزء من رحلة التعافي وليست نهاية الطريق.')) {
        RecoveryCounter.addRelapse();
        showToast('تم تسجيل الانتكاسة.. استمر في المحاولة ولا تيأس');
        renderRecoveryPage();
    }
}

function handleResetRecovery() {
    if (confirm('هل أنت متأكد من إعادة تعيين عداد التعافي؟ سيتم حذف جميع بيانات التقدم.')) {
        // إيقاف العداد قبل إعادة التعيين
        if (counterIntervalId) {
            clearInterval(counterIntervalId);
            counterIntervalId = null;
        }
        RecoveryCounter.resetRecovery();
        showToast('تم إعادة تعيين العداد');
        renderRecoveryPage();
    }
}

function getHabitNameInArabic(habitType) {
    const names = {
        masturbation: 'التعافي من العادة السرية',
        pornography: 'التعافي من الأفلام الإباحية',
        smoking: 'الإقلاع عن التدخين',
        alcohol: 'التعافي من شرب الكحول',
        drugs: 'التعافي من المخدرات',
        gaming: 'التعافي من إدمان الألعاب',
        socialMedia: 'التعافي من إدمان التواصل الاجتماعي',
        smartphone: 'التعافي من إدمان الهاتف الذكي',
        gambling: 'التعافي من المقامرة',
        procrastination: 'التعافي من التسويف',
        lying: 'التعافي من الكذب',
        anger: 'التعافي من الغضب غير المنضبط',
        overspending: 'التعافي من الإسراف في الإنفاق',
        poorNutrition: 'التعافي من سوء التغذية',
        inactivity: 'التعافي من الخمول وقلة الحركة',
        sleepDisorder: 'التعافي من اضطرابات النوم',
        caffeine: 'التعافي من الإفراط في الكافيين',
        nailBiting: 'التعافي من قضم الأظافر',
        bullying: 'التعافي من التنمر',
        isolation: 'التعافي من العزلة الاجتماعية',
        adultery: 'التعافي من الزنا والعلاقات غير الشرعية'
    };
    return names[habitType] || 'رحلة التعافي';
}

// تنظيف العداد عند مغادرة الصفحة
function cleanupCounter() {
    if (counterIntervalId) {
        clearInterval(counterIntervalId);
        counterIntervalId = null;
    }
}

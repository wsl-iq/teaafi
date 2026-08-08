// Taeafi Recovery Calendar v1.0

function renderCalendarPage() {
    var mainContent = document.getElementById('main-content');
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth(); // 0-11
    
    // جلب بيانات التعافي
    var recoveryData = StorageManager.getRecoveryData();
    var recoveryDays = {};
    
    if (recoveryData && recoveryData.startDate) {
        var start = new Date(recoveryData.startDate);
        var today = new Date();
        
        // حساب أيام التعافي
        for (var d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
            var dateKey = d.getFullYear() + '-' + 
                         String(d.getMonth() + 1).padStart(2, '0') + '-' + 
                         String(d.getDate()).padStart(2, '0');
            recoveryDays[dateKey] = 'clean';
        }
        
        // إضافة الانتكاسات
        if (recoveryData.relapses) {
            recoveryData.relapses.forEach(function(r) {
                var rd = new Date(r.date);
                var dateKey = rd.getFullYear() + '-' + 
                             String(rd.getMonth() + 1).padStart(2, '0') + '-' + 
                             String(rd.getDate()).padStart(2, '0');
                recoveryDays[dateKey] = 'relapse';
            });
        }
    }
    
    var todayKey = now.getFullYear() + '-' + 
                  String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                  String(now.getDate()).padStart(2, '0');
    
    mainContent.innerHTML = `
        <div class="animate-fade-in">
            <h1 class="heading-underline">
                <i class="fas fa-calendar-check" style="margin-left: 8px; color: #4CAF50;"></i>
                روزنامة التعافي
            </h1>
            
            <!-- الشهر الحالي -->
            <div class="card" style="text-align:center;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                    <button class="btn btn-sm btn-outline" onclick="changeCalendarMonth(-1)"><i class="fas fa-chevron-right"></i></button>
                    <h2 id="calendar-month-title">${getMonthName(month)} ${year}</h2>
                    <button class="btn btn-sm btn-outline" onclick="changeCalendarMonth(1)"><i class="fas fa-chevron-left"></i></button>
                </div>
                
                <!-- أيام الأسبوع -->
                <div class="calendar-grid calendar-header">
                    <div>أحد</div><div>اثنين</div><div>ثلاثاء</div><div>أربعاء</div><div>خميس</div><div>جمعة</div><div>سبت</div>
                </div>
                
                <!-- أيام الشهر -->
                <div class="calendar-grid" id="calendar-days">
                    ${generateCalendarDays(year, month, recoveryDays, todayKey)}
                </div>
                
                <!-- مفتاح الألوان -->
                <div style="display:flex;justify-content:center;gap:16px;margin-top:16px;font-size:12px;">
                    <span><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:#4CAF50;margin-left:4px;"></span> يوم نظيف</span>
                    <span><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:#F44336;margin-left:4px;"></span> انتكاسة</span>
                    <span><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:var(--surface);border:1px solid var(--border);margin-left:4px;"></span> عادي</span>
                    <span><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:var(--primary);margin-left:4px;"></span> اليوم</span>
                </div>
            </div>
            
            <!-- إحصائيات الشهر -->
            <div class="card" style="margin-top:16px;">
                <h3 style="margin-bottom:12px;">إحصائيات الشهر</h3>
                <div class="stats-cards-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="stat-card" style="border-top:4px solid #4CAF50;">
                        <span class="stat-number">${countDays(recoveryDays, 'clean')}</span>
                        <span class="stat-label">يوم نظيف</span>
                    </div>
                    <div class="stat-card" style="border-top:4px solid #F44336;">
                        <span class="stat-number">${countDays(recoveryDays, 'relapse')}</span>
                        <span class="stat-label">انتكاسة</span>
                    </div>
                    <div class="stat-card" style="border-top:4px solid #2196F3;">
                        <span class="stat-number">${Math.round(countDays(recoveryDays, 'clean') / Math.max(countDays(recoveryDays, 'clean') + countDays(recoveryDays, 'relapse'), 1) * 100)}%</span>
                        <span class="stat-label">نسبة النجاح</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateCalendarDays(year, month, recoveryDays, todayKey) {
    var firstDay = new Date(year, month, 1).getDay(); // 0=أحد
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var html = '';
    
    // خلايا فارغة قبل أول يوم
    for (var i = 0; i < firstDay; i++) {
        html += '<div class="calendar-day empty"></div>';
    }
    
    // أيام الشهر
    for (var day = 1; day <= daysInMonth; day++) {
        var dateKey = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
        var status = recoveryDays[dateKey] || 'normal';
        var isToday = dateKey === todayKey;
        
        var bgColor = '';
        if (status === 'clean') bgColor = 'background:#4CAF50;color:white;';
        else if (status === 'relapse') bgColor = 'background:#F44336;color:white;';
        else if (isToday) bgColor = 'background:var(--primary);color:white;font-weight:700;';
        
        html += '<div class="calendar-day" style="' + bgColor + '">' + day + '</div>';
    }
    
    return html;
}

function countDays(recoveryDays, status) {
    var count = 0;
    for (var key in recoveryDays) {
        if (recoveryDays[key] === status) count++;
    }
    return count;
}

function getMonthName(month) {
    var months = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
    return months[month];
}

var calendarMonth = new Date().getMonth();
var calendarYear = new Date().getFullYear();

function changeCalendarMonth(delta) {
    calendarMonth += delta;
    if (calendarMonth > 11) { calendarMonth = 0; calendarYear++; }
    if (calendarMonth < 0) { calendarMonth = 11; calendarYear--; }
    renderCalendarPage();
}
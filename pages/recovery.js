function renderRecoveryPage() {
    const mainContent = document.getElementById('main-content');
    const stats = RecoveryCounter.getRecoveryStats();
    
    mainContent.innerHTML = `
        <div class="animate-fade-in">
            <h1 class="heading-underline">رحلة التعافي</h1>
            
            ${stats.isActive ? `
                <div class="counter-card">
                    <i class="fas fa-trophy" style="font-size: 40px; margin-bottom: 12px;"></i>
                    <h3>أنت على طريق التعافي</h3>
                    <div class="counter-value">${stats.days}</div>
                    <p>يوم من القوة والإرادة</p>
                    
                    <div class="counter-stats">
                        <div class="stat-item">
                            <div class="stat-value">${stats.weeks}</div>
                            <div class="stat-label">أسبوع</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${stats.months}</div>
                            <div class="stat-label">شهر</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${stats.years}</div>
                            <div class="stat-label">سنة</div>
                        </div>
                    </div>
                    
                    <div style="margin-top: 24px; display: flex; gap: 12px; justify-content: center;">
                        <button class="btn" style="background: white; color: var(--primary);" 
                                onclick="handleRelapse()">
                            <i class="fas fa-exclamation-triangle"></i>
                            تسجيل انتكاسة
                        </button>
                        <button class="btn" style="background: rgba(255,255,255,0.2); color: white;" 
                                onclick="handleResetRecovery()">
                            <i class="fas fa-redo"></i>
                            إعادة البداية
                        </button>
                    </div>
                </div>
                
                <h2 class="section-title">مراحل التعافي</h2>
                
                ${RecoveryCounter.getMilestones(stats.days).map(milestone => `
                    <div class="card">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                            <i class="fas fa-check-circle" style="color: var(--accent-green); font-size: 24px;"></i>
                            <h3>${milestone.title}</h3>
                        </div>
                        <div style="line-height: 2.2;">
                            <p><strong>التحسن النفسي:</strong> ${milestone.psychological}</p>
                            <p><strong>التحسن الجسدي:</strong> ${milestone.physical}</p>
                            <p><strong>التحسن الهرموني:</strong> ${milestone.hormonal}</p>
                            ${milestone.withdrawal ? `
                                <p style="color: var(--accent-orange);">
                                    <strong>الأعراض الانسحابية:</strong> ${milestone.withdrawal}
                                </p>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
                
                <div class="card" style="background: #E8F5E9; border: 1px solid #C8E6C9;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <i class="fas fa-heart" style="color: var(--accent-green); font-size: 32px;"></i>
                        <div>
                            <h3>رسالة تحفيزية</h3>
                            <p style="line-height: 2; margin-top: 8px;">
                                كل يوم يمر وأنت على طريق التعافي هو انتصار جديد. لا تنظر للمسافة المتبقية،
                                بل انظر للمسافة التي قطعتها. أنت أقوى مما تتصور، والله معك في كل خطوة.
                                استمر فأنت على الطريق الصحيح.
                            </p>
                        </div>
                    </div>
                </div>
            ` : `
                <div class="card" style="text-align: center; padding: 60px 20px;">
                    <i class="fas fa-play-circle" style="font-size: 64px; color: var(--primary); margin-bottom: 20px;"></i>
                    <h2>ابدأ رحلة التعافي الآن</h2>
                    <p class="text-secondary" style="margin: 20px 0;">
                        اختر العادة التي تريد التخلص منها وابدأ رحلتك نحو حياة أفضل
                    </p>
                    <button class="btn btn-primary btn-lg" onclick="navigateTo('habits')">
                        <i class="fas fa-hands"></i>
                        اختر العادة وابدأ التعافي
                    </button>
                </div>
            `}
        </div>
    `;
}

function handleRelapse() {
    if (confirm('هل أنت متأكد من تسجيل انتكاسة؟ تذكر أن الانتكاسة جزء من رحلة التعافي وليست نهاية الطريق.')) {
        RecoveryCounter.addRelapse();
        showToast('تم تسجيل الانتكاسة.. استمر في المحاولة');
        renderRecoveryPage();
    }
}

function handleResetRecovery() {
    if (confirm('هل أنت متأكد من إعادة تعيين عداد التعافي؟ سيتم حذف جميع بيانات التقدم.')) {
        RecoveryCounter.resetRecovery();
        showToast('تم إعادة تعيين العداد');
        renderRecoveryPage();
    }
}
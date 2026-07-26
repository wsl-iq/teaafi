function renderHomePage() {
    const mainContent = document.getElementById('main-content');
    const user = StorageManager.getUser();
    const stats = RecoveryCounter.getRecoveryStats();
    
    mainContent.innerHTML = `
        <div class="animate-fade-in">
            <div class="mb-6">
                <h1 class="font-bold">مرحباً ${user?.name || ''}</h1>
                <p class="text-secondary mt-2">كل يوم هو فرصة جديدة للتغيير</p>
            </div>
            
            ${stats.isActive ? `
                <div class="counter-card" onclick="navigateTo('recovery')">
                    <i class="fas fa-calendar-check" style="font-size: 32px; margin-bottom: 12px;"></i>
                    <h3>رحلة التعافي مستمرة</h3>
                    <div class="counter-value" id="home-counter">${stats.days}</div>
                    <p>يوم منذ بداية رحلتك</p>
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
                </div>
            ` : ''}
            
            <div class="cards-grid">
                <div class="card" onclick="navigateTo('habits')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #E0F2F1; color: #0D6B6E;">
                            <i class="fas fa-hands"></i>
                        </div>
                        <div>
                            <h3 class="card-title">العادات</h3>
                            <p class="text-sm text-secondary">تعرف على العادات وتأثيرها</p>
                        </div>
                    </div>
                    <p class="card-description">
                        معلومات شاملة وموثقة عن العادة السرية، الأفلام الإباحية، والتدخين
                    </p>
                </div>
                
                <div class="card" onclick="navigateTo('spiritual')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #E8F5E9; color: #4CAF50;">
                            <i class="fas fa-mosque"></i>
                        </div>
                        <div>
                            <h3 class="card-title">التحصين الإيماني</h3>
                            <p class="text-sm text-secondary">تقوية الجانب الروحي</p>
                        </div>
                    </div>
                    <p class="card-description">
                        أذكار، أدعية، آيات قرآنية، ونصائح لتقوية الإرادة والعزيمة
                    </p>
                </div>
                
                <div class="card" onclick="navigateTo('recovery')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #FCE4EC; color: #F44336;">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div>
                            <h3 class="card-title">متابعة التعافي</h3>
                            <p class="text-sm text-secondary">تتبع رحلتك خطوة بخطوة</p>
                        </div>
                    </div>
                    <p class="card-description">
                        عداد أيام، مراحل التحسن، رسائل تحفيزية، ودعم مستمر
                    </p>
                </div>
            </div>
        </div>
    `;
    
    // Update counter every minute
    if (stats.isActive) {
        setInterval(() => {
            const counterEl = document.getElementById('home-counter');
            if (counterEl) {
                const currentStats = RecoveryCounter.getRecoveryStats();
                counterEl.textContent = currentStats.days;
            }
        }, 60000);
    }
}
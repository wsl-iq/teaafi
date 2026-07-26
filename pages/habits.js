function renderHabitsPage() {
    const mainContent = document.getElementById('main-content');
    const user = StorageManager.getUser();
    const genderText = user?.gender === 'male' ? 'ذكر' : 'أنثى';
    
    mainContent.innerHTML = `
        <div class="animate-fade-in">
            <h1 class="heading-underline">العادات</h1>
            <p class="text-secondary mb-6">محتوى مخصص: ${genderText}</p>
            
            <div class="cards-grid">
                <div class="card" onclick="renderHabitDetail('masturbation')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #E0F2F1; color: #0D6B6E;">
                            <i class="fas fa-hand-paper"></i>
                        </div>
                        <div>
                            <h3 class="card-title">العادة السرية</h3>
                            <p class="text-sm text-secondary">${genderText}</p>
                        </div>
                    </div>
                    <p class="card-description">
                        الأضرار النفسية والصحية والاجتماعية والدينية وطرق العلاج والتعافي
                    </p>
                </div>
                
                <div class="card" onclick="renderHabitDetail('pornography')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #FCE4EC; color: #F44336;">
                            <i class="fas fa-film"></i>
                        </div>
                        <div>
                            <h3 class="card-title">الأفلام الإباحية</h3>
                            <p class="text-sm text-secondary">${genderText}</p>
                        </div>
                    </div>
                    <p class="card-description">
                        تأثيرها على الدماغ والعلاقات وطرق التعافي والوقاية
                    </p>
                </div>
                
                <div class="card" onclick="renderHabitDetail('smoking')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #FFF3E0; color: #FF9800;">
                            <i class="fas fa-smoking"></i>
                        </div>
                        <div>
                            <h3 class="card-title">التدخين</h3>
                            <p class="text-sm text-secondary">${genderText}</p>
                        </div>
                    </div>
                    <p class="card-description">
                        أضرار التدخين على الصحة والإنجاب والحياة اليومية وطرق الإقلاع
                    </p>
                </div>
            </div>
        </div>
    `;
}
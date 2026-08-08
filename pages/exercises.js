var currentExerciseGender = StorageManager.getUser()?.gender || 'male';

function renderExercisesPage() {
    var mainContent = document.getElementById('main-content');
    var gender = currentExerciseGender;
    var exerciseData = getTodayExercise(gender);
    
    mainContent.innerHTML = `
        <div class="animate-fade-in">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;margin-bottom:16px;">
                <h1 class="heading-underline" style="margin-bottom:0;border-bottom:none;padding-bottom:0;">
                    <i class="fas fa-dumbbell" style="margin-left:8px;color:#4CAF50;"></i>
                    الرياضة اليومية
                </h1>
                
                <!-- أزرار التبديل بين الجنسين -->
                <div style="display:flex;gap:4px;background:var(--surface-variant);padding:4px;border-radius:12px;flex-shrink:0;">
                    <button class="btn btn-sm" onclick="switchExerciseView('male')" 
                            style="min-height:40px;${gender === 'male' ? 'background:var(--primary-gradient);color:white;border:none;' : 'background:transparent;color:var(--text-secondary);'}">
                        <i class="fas fa-male"></i> للرجال
                    </button>
                    <button class="btn btn-sm" onclick="switchExerciseView('female')" 
                            style="min-height:40px;${gender === 'female' ? 'background:var(--primary-gradient);color:white;border:none;' : 'background:transparent;color:var(--text-secondary);'}">
                        <i class="fas fa-female"></i> للنساء
                    </button>
                </div>
            </div>
            
            <p class="text-secondary mb-4">
                <i class="fas fa-info-circle" style="margin-left:4px;"></i>
                ${gender === 'male' ? 'عرض تمارين الرجال' : 'عرض تمارين النساء'} - يمكنك التبديل للاطلاع على تمارين الجنس الآخر
            </p>
            
            <!-- تمرين اليوم -->
            <div class="card ${exerciseData.dayName ? 'exercise-today-card' : ''}" style="border-right:4px solid #4CAF50;margin-bottom:16px;">
                <h3 style="color:#4CAF50;margin-bottom:8px;">
                    <i class="fas fa-calendar-day" style="margin-left:8px;"></i> تمرين اليوم - ${exerciseData.dayName}
                </h3>
                <p style="font-size:16px;line-height:1.8;">${exerciseData.weekly.focus}: ${exerciseData.weekly.exercises}</p>
            </div>
            
            <!-- اقتراح سريع -->
            <div class="card" style="border-right:4px solid #2196F3;margin-bottom:16px;">
                <h3 style="color:#2196F3;margin-bottom:8px;">
                    <i class="fas ${exerciseData.daily.icon}" style="margin-left:8px;"></i> اقتراح سريع
                </h3>
                <p style="font-size:16px;">${exerciseData.daily.name} - ${exerciseData.daily.duration}</p>
                <p style="font-size:12px;color:var(--text-tertiary);">يحرق ~${exerciseData.daily.calories} سعرة | المستوى: ${exerciseData.daily.level}</p>
            </div>
            
            <!-- الخطة الأسبوعية -->
            <h2 class="section-title" style="margin-top:24px;">
                <i class="fas fa-calendar-week" style="margin-left:8px;"></i> الخطة الأسبوعية
            </h2>
            
            ${EXERCISE_DATA[gender].weekly.map(function(day) {
                var isToday = day.day === exerciseData.dayName;
                return `
                    <div class="card" style="margin-bottom:8px;${isToday ? 'border:2px solid #4CAF50;background:#E8F5E9;' : ''}">
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <strong>${day.day} - ${day.focus}</strong>
                            ${isToday ? '<span style="background:#4CAF50;color:white;padding:2px 10px;border-radius:10px;font-size:11px;">اليوم</span>' : ''}
                        </div>
                        <p style="font-size:13px;color:var(--text-secondary);margin-top:4px;">${day.exercises}</p>
                    </div>
                `;
            }).join('')}
            
            ${gender === 'female' ? `
                <div class="card" style="margin-top:16px;background:#FCE4EC;border-right:4px solid #E91E63;">
                    <h3 style="color:#C62828;margin-bottom:8px;">
                        <i class="fas fa-calendar-times" style="margin-left:8px;"></i> أيام الدورة الشهرية
                    </h3>
                    <p style="font-size:13px;line-height:1.8;">${EXERCISE_DATA.female.periodDays.exercises}</p>
                    <p style="font-size:12px;color:#C62828;margin-top:8px;">
                        <i class="fas fa-exclamation-triangle"></i> تجنبي: ${EXERCISE_DATA.female.periodDays.avoid}
                    </p>
                </div>
            ` : ''}
            
            <div class="card" style="margin-top:16px;text-align:center;">
                <p style="font-size:13px;color:var(--text-secondary);">
                    <i class="fas fa-lightbulb" style="color:#FFC107;margin-left:4px;"></i>
                    <strong>نصيحة:</strong> اشرب 2-3 لتر ماء يومياً. مارس الرياضة بعد الأكل بساعة على الأقل.
                </p>
            </div>
        </div>
    `;
}

function switchExerciseView(gender) {
    currentExerciseGender = gender;
    renderExercisesPage();
}
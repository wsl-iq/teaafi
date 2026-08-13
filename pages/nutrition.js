/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : pages
 * File   : nutrition.js
 * Type: JavaScript
 */

var currentNutritionGender = StorageManager.getUser()?.gender || 'male';

function renderNutritionPage() {
    var mainContent = document.getElementById('main-content');
    var user = StorageManager.getUser();
    var gender = currentNutritionGender; // Use the gender selected for display (not the user's gender).
    var breakfast = getTodayMeal('breakfast', gender);
    var lunch = getTodayMeal('lunch', gender);
    var dinner = getTodayMeal('dinner', gender);
    
    mainContent.innerHTML = `
        <div class="animate-fade-in">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;margin-bottom:16px;">
                <h1 class="heading-underline" style="margin-bottom:0;border-bottom:none;padding-bottom:0;">
                    <i class="fas fa-utensils" style="margin-left:8px;color:#FF9800;"></i>
                    التغذية الصحية
                </h1>
                
                <!-- أزرار التبديل بين الجنسين -->
                <div style="display:flex;gap:4px;background:var(--surface-variant);padding:4px;border-radius:12px;flex-shrink:0;">
                    <button class="btn btn-sm" onclick="switchNutritionView('male')" 
                            style="min-height:40px;${gender === 'male' ? 'background:var(--primary-gradient);color:white;border:none;' : 'background:transparent;color:var(--text-secondary);'}">
                        <i class="fas fa-male"></i> للرجال
                    </button>
                    <button class="btn btn-sm" onclick="switchNutritionView('female')" 
                            style="min-height:40px;${gender === 'female' ? 'background:var(--primary-gradient);color:white;border:none;' : 'background:transparent;color:var(--text-secondary);'}">
                        <i class="fas fa-female"></i> للنساء
                    </button>
                </div>
            </div>
            
            <p class="text-secondary mb-4">
                <i class="fas fa-info-circle" style="margin-left:4px;"></i>
                ${gender === 'male' ? 'عرض محتوى الرجال' : 'عرض محتوى النساء'} - يمكنك التبديل للاطلاع على محتوى الجنس الآخر
            </p>
            
            ${renderMealCard('وجبة الإفطار', breakfast, 'fa-sun', '#FF9800')}
            ${renderMealCard('وجبة الغداء', lunch, 'fa-sun', '#F44336')}
            ${renderMealCard('وجبة العشاء', dinner, 'fa-moon', '#5C6BC0')}
            
            <!-- قائمة الممنوعات (مشتركة) -->
            <div class="card" style="margin-top:24px;">
                <h3 style="margin-bottom:12px;color:#F44336;">
                    <i class="fas fa-ban" style="margin-left:8px;"></i> قائمة الممنوعات
                </h3>
                <div style="display:flex;flex-wrap:wrap;gap:6px;">
                    ${NUTRITION_DATA.forbidden.map(function(item) {
                        return '<span class="forbidden-tag" style="background:#FCE4EC;color:#C62828;">' + item + '</span>';
                    }).join('')}
                </div>
            </div>
            
            ${gender === 'female' ? `
                <div class="card" style="margin-top:16px;background:#FCE4EC;border-right:4px solid #E91E63;">
                    <h3 style="color:#C62828;margin-bottom:8px;">
                        <i class="fas fa-calendar-times" style="margin-left:8px;"></i> أيام الدورة الشهرية
                    </h3>
                    <p style="font-size:13px;line-height:1.8;">${NUTRITION_DATA.periodDays.meals}</p>
                    <p style="font-size:12px;color:#C62828;margin-top:8px;">
                        <i class="fas fa-exclamation-triangle"></i> تجنبي: ${NUTRITION_DATA.periodDays.avoid}
                    </p>
                    <p style="font-size:12px;color:#C62828;margin-top:4px;">
                        <i class="fas fa-walking"></i> ${NUTRITION_DATA.periodDays.exercise}
                    </p>
                </div>
            ` : ''}
        </div>
    `;
}

function renderMealCard(title, meal, icon, color) {
    if (!meal) return '';
    
    // Checking for food incompatibility
    var conflicts = checkFoodConflict(meal.meal);
    
    return `
        <div class="card nutrition-meal-card" style="border-right:4px solid ${color};margin-bottom:16px;">
            <h3 style="color:${color};margin-bottom:8px;">
                <i class="fas ${icon}" style="margin-left:8px;"></i> ${title}
            </h3>
            <p style="font-size:16px;line-height:1.8;margin-bottom:8px;">${meal.meal}</p>
            <div style="display:flex;gap:16px;font-size:12px;color:var(--text-tertiary);flex-wrap:wrap;">
                <span><i class="fas fa-fire"></i> ${meal.calories} سعرة</span>
                <span><i class="fas fa-dumbbell"></i> ${meal.protein} بروتين</span>
                <span><i class="fas fa-wallet"></i> ${meal.budget}</span>
            </div>
            <p style="font-size:11px;color:var(--primary);margin-top:8px;">
                <i class="fas fa-running"></i> ${meal.postExercise || ''}
            </p>
            
            ${conflicts.length > 0 ? `
                <div style="background:#FFF3E0;padding:8px 12px;border-radius:8px;margin-top:8px;">
                    <p style="font-size:11px;color:#E65100;">
                        <i class="fas fa-exclamation-triangle"></i> تنبيه: ${conflicts[0].effect}
                    </p>
                </div>
            ` : ''}
            
            <button class="btn btn-sm btn-outline mt-2" onclick="showAlternative('${meal.meal.replace(/'/g, "\\'")}', '${meal.budget}')">
                <i class="fas fa-exchange-alt"></i> اقترح بديل
            </button>
        </div>
    `;
}

function switchNutritionView(gender) {
    currentNutritionGender = gender;
    renderNutritionPage();
}

function showAlternative(mealText, budget) {
    var alt = findAlternative(mealText, budget);
    if (alt) {
        if (typeof showToast === 'function') {
            showToast(alt);
        } else {
            alert(alt);
        }
    } else {
        if (typeof showToast === 'function') {
            showToast('لا يوجد بديل مقترح حالياً');
        } else {
            alert('لا يوجد بديل مقترح حالياً');
        }
    }
}


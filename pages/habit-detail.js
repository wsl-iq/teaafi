/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : Pages
 * File   : habit-detail.js
 * Type: JavaScript
 */

let currentViewGender = StorageManager.getUser()?.gender || 'male';

function renderHabitDetail(habitType) {
    
    /** 
     * Habit cards call this function directly. Convert that direct call
     * into a real Router history entry so Android/WebView Back can return
     * to the habits list instead of skipping straight to the previous page.
     */

    if (
        !window.__taeafiRouterRenderingHabitDetail &&
        typeof Router !== 'undefined' &&
        typeof Router.openHabitDetail === 'function'
    ) {
        return Router.openHabitDetail(habitType);
    }

    const mainContent = document.getElementById('main-content');
    const content = HABIT_CONTENT[habitType];
    
    if (!content) {
        mainContent.innerHTML = '<p>المحتوى غير متوفر</p>';
        return;
    }
    
    const user = StorageManager.getUser();
    // Use current gender or user gender
    if (!currentViewGender) {
        currentViewGender = user?.gender || 'male';
    }
    
    const isMaleView = currentViewGender === 'male';
    
    mainContent.innerHTML = `
        <div class="animate-fade-in">
            <button class="btn btn-outline mb-4" onclick="Router.back()">
                <i class="fas fa-arrow-right"></i>
                رجوع للعادات
            </button>
            
            <div class="content-section">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; margin-bottom: 24px;">
                    <h1 class="heading-underline" style="margin-bottom: 0; border-bottom: none; padding-bottom: 0;">${content.title}</h1>
                    
                    <div style="display: flex; gap: 4px; background: var(--surface-variant); padding: 4px; border-radius: var(--radius-lg); flex-shrink: 0;">
                        <button 
                            class="btn btn-sm gender-toggle-btn" 
                            id="btn-male-view"
                            onclick="switchToMaleView('${habitType}')" 
                            style="min-height: 40px; ${isMaleView ? 'background: var(--primary-gradient); color: white; border: none;' : 'background: transparent; color: var(--text-secondary); border: 2px solid transparent;'}">
                            <i class="fas fa-male"></i>
                            محتوى الرجال
                        </button>
                        <button 
                            class="btn btn-sm gender-toggle-btn" 
                            id="btn-female-view"
                            onclick="switchToFemaleView('${habitType}')" 
                            style="min-height: 40px; ${!isMaleView ? 'background: var(--primary-gradient); color: white; border: none;' : 'background: transparent; color: var(--text-secondary); border: 2px solid transparent;'}">
                            <i class="fas fa-female"></i>
                            محتوى النساء
                        </button>
                    </div>
                </div>
                
                <p class="text-secondary mb-6">
                    <i class="fas fa-info-circle" style="margin-left: 4px;"></i>
                    ${isMaleView ? 'عرض محتوى الرجال' : 'عرض محتوى النساء'} - 
                    يمكنك التبديل بين المحتوى المخصص لكل جنس للاطلاع والمعرفة
                </p>
                
                <button class="btn btn-primary btn-lg w-full mb-6" 
                        onclick="startRecoveryJourney('${habitType}')">
                    <i class="fas fa-play"></i>
                    ابدأ رحلة التعافي من ${content.title}
                </button>
            </div>
            
            ${content.common ? content.common.map(section => `
                <div class="content-section">
                    <h2 class="section-title">
                        <i class="fas fa-${section.type === 'danger' ? 'exclamation-triangle' : 
                                       section.type === 'warning' ? 'exclamation-circle' : 
                                       section.type === 'success' ? 'check-circle' : 'info-circle'}"
                           style="color: ${
                               section.type === 'danger' ? 'var(--accent-red)' :
                               section.type === 'warning' ? 'var(--accent-orange)' :
                               section.type === 'success' ? 'var(--accent-green)' :
                               'var(--primary)'
                           }; margin-left: 8px;"></i>
                        ${section.title}
                    </h2>
                    <div class="subsection" style="
                        border-right-color: ${
                            section.type === 'danger' ? 'var(--accent-red)' :
                            section.type === 'warning' ? 'var(--accent-orange)' :
                            section.type === 'success' ? 'var(--accent-green)' :
                            'var(--primary)'
                        }
                    ">
                        <p style="white-space: pre-line; line-height: 2;">${section.content}</p>
                    </div>
                </div>
            `).join('') : ''}
            
            ${content[currentViewGender] && content[currentViewGender].length > 0 ? `
                <div class="content-section">
                    <h2 class="section-title" style="color: ${content.color};">
                        <i class="fas fa-${currentViewGender === 'male' ? 'mars' : 'venus'}" style="margin-left: 8px;"></i>
                        أضرار خاصة ${currentViewGender === 'male' ? 'بالرجال' : 'بالنساء'}
                    </h2>
                    ${content[currentViewGender].map(section => `
                        <div class="subsection" style="
                            border-right-color: ${section.type === 'danger' ? 'var(--accent-red)' : 'var(--accent-orange)'}
                        ">
                            <h3 style="margin-bottom: 12px; color: ${section.type === 'danger' ? 'var(--accent-red)' : 'var(--accent-orange)'};">
                                ${section.title}
                            </h3>
                            <p style="white-space: pre-line; line-height: 2;">${section.content}</p>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            ${!content[currentViewGender] || content[currentViewGender].length === 0 ? `
                <div class="card" style="text-align: center; padding: 40px 20px;">
                    <i class="fas fa-info-circle" style="font-size: 48px; color: var(--primary); margin-bottom: 16px;"></i>
                    <p class="text-secondary">
                        ${currentViewGender === 'male' ? 
                            'لم يتم إضافة محتوى خاص بالرجال بعد لهذا القسم' : 
                            'لم يتم إضافة محتوى خاص بالنساء بعد لهذا القسم'}
                    </p>
                </div>
            ` : ''}
        </div>
    `;
    
    document.getElementById('main-content').scrollTop = 0;
}

// Gender switching functions
function switchToMaleView(habitType) {
    currentViewGender = 'male';
    window.__taeafiRouterRenderingHabitDetail = true;
    try {
        renderHabitDetail(habitType);
    } finally {
        window.__taeafiRouterRenderingHabitDetail = false;
    }
    showToast('تم التبديل إلى محتوى الرجال');
}

function switchToFemaleView(habitType) {
    currentViewGender = 'female';
    window.__taeafiRouterRenderingHabitDetail = true;
    try {
        renderHabitDetail(habitType);
    } finally {
        window.__taeafiRouterRenderingHabitDetail = false;
    }
    showToast('تم التبديل إلى محتوى النساء');
}

function switchGenderView(gender, habitType) {
    currentViewGender = gender;
    window.__taeafiRouterRenderingHabitDetail = true;
    try {
        renderHabitDetail(habitType);
    } finally {
        window.__taeafiRouterRenderingHabitDetail = false;
    }
}

function startRecoveryJourney(habitType) {
    if (confirm('هل أنت متأكد من بدء رحلة التعافي؟ سيتم تسجيل تاريخ اليوم كبداية لرحلتك.')) {
        RecoveryCounter.startRecovery(habitType);
        showToast('تم بدء رحلة التعافي بنجاح');
        
        setTimeout(() => {
            navigateTo('recovery');
        }, 500);
    }
}
/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : Pages
 * File   : habits.js
 * Type: JavaScript
 */

function renderHabitsPage() {
    const mainContent = document.getElementById('main-content');
    const user = StorageManager.getUser();
    const genderText = user?.gender === 'male' ? 'ذكر' : 'أنثى';
    
    mainContent.innerHTML = `
        <div class="animate-fade-in">
            <h1 class="heading-underline">العادات</h1>
            <p class="text-secondary mb-6">محتوى مخصص: ${genderText}</p>
            
            <h2 class="section-title" style="margin-top: 24px;">
                <i class="fas fa-heartbeat" style="margin-left: 8px; color: #F44336;"></i>
                الصحة الجسدية
            </h2>
            <div class="cards-grid">
                
                <!-- التدخين -->
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
                    <p class="card-description">أضرار التدخين على الصحة والإنجاب والحياة اليومية وطرق الإقلاع</p>
                </div>
                
                <div class="card" onclick="renderHabitDetail('alcohol')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #FCE4EC; color: #C62828;">
                            <i class="fas fa-wine-bottle"></i>
                        </div>
                        <div>
                            <h3 class="card-title">شرب الكحول</h3>
                            <p class="text-sm text-secondary">${genderText}</p>
                        </div>
                    </div>
                    <p class="card-description">الأضرار الصحية والنفسية والاجتماعية وطرق العلاج والتعافي</p>
                </div>
                
                <div class="card" onclick="renderHabitDetail('drugs')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #F3E5F5; color: #6A1B9A;">
                            <i class="fas fa-capsules"></i>
                        </div>
                        <div>
                            <h3 class="card-title">المخدرات</h3>
                            <p class="text-sm text-secondary">${genderText}</p>
                        </div>
                    </div>
                    <p class="card-description">تأثير المخدرات والمؤثرات العقلية على الجسد والعقل والمجتمع</p>
                </div>
                
                <div class="card" onclick="renderHabitDetail('poorNutrition')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #FFF3E0; color: #E65100;">
                            <i class="fas fa-hamburger"></i>
                        </div>
                        <div>
                            <h3 class="card-title">سوء التغذية</h3>
                            <p class="text-sm text-secondary">${genderText}</p>
                        </div>
                    </div>
                    <p class="card-description">الإفراط في الوجبات السريعة والسكريات والمشروبات الغازية</p>
                </div>
                
                <div class="card" onclick="renderHabitDetail('inactivity')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #EFEBE9; color: #795548;">
                            <i class="fas fa-couch"></i>
                        </div>
                        <div>
                            <h3 class="card-title">الخمول وقلة الحركة</h3>
                            <p class="text-sm text-secondary">${genderText}</p>
                        </div>
                    </div>
                    <p class="card-description">تأثير قلة النشاط البدني على الصحة الجسدية والنفسية</p>
                </div>
                
                <div class="card" onclick="renderHabitDetail('sleepDisorder')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #E8EAF6; color: #5C6BC0;">
                            <i class="fas fa-moon"></i>
                        </div>
                        <div>
                            <h3 class="card-title">اضطرابات النوم</h3>
                            <p class="text-sm text-secondary">${genderText}</p>
                        </div>
                    </div>
                    <p class="card-description">السهر المزمن وقلة النوم وتأثيرها على الصحة والإنتاجية</p>
                </div>
                
                <div class="card" onclick="renderHabitDetail('caffeine')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #ECEFF1; color: #546E7A;">
                            <i class="fas fa-coffee"></i>
                        </div>
                        <div>
                            <h3 class="card-title">الإفراط في الكافيين</h3>
                            <p class="text-sm text-secondary">${genderText}</p>
                        </div>
                    </div>
                    <p class="card-description">أضرار الإفراط في استهلاك الكافيين على النوم والجهاز العصبي</p>
                </div>
                
            </div>
            
            <h2 class="section-title" style="margin-top: 32px;">
                <i class="fas fa-brain" style="margin-left: 8px; color: #9C27B0;"></i>
                الصحة النفسية والسلوكية
            </h2>
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
                    <p class="card-description">الأضرار النفسية والصحية والاجتماعية والدينية وطرق العلاج والتعافي</p>
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
                    <p class="card-description">تأثيرها على الدماغ والعلاقات وطرق التعافي والوقاية</p>
                </div>
                
                <div class="card" onclick="renderHabitDetail('gaming')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #E8EAF6; color: #283593;">
                            <i class="fas fa-gamepad"></i>
                        </div>
                        <div>
                            <h3 class="card-title">إدمان الألعاب</h3>
                            <p class="text-sm text-secondary">${genderText}</p>
                        </div>
                    </div>
                    <p class="card-description">تأثير إدمان ألعاب الفيديو على الصحة والحياة اليومية والعلاقات</p>
                </div>
                
                <div class="card" onclick="renderHabitDetail('socialMedia')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #E3F2FD; color: #1565C0;">
                            <i class="fas fa-hashtag"></i>
                        </div>
                        <div>
                            <h3 class="card-title">إدمان التواصل الاجتماعي</h3>
                            <p class="text-sm text-secondary">${genderText}</p>
                        </div>
                    </div>
                    <p class="card-description">تأثير الإفراط في مواقع التواصل على الصحة النفسية والتركيز</p>
                </div>
                
                <div class="card" onclick="renderHabitDetail('smartphone')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #E0F7FA; color: #00838F;">
                            <i class="fas fa-mobile-screen"></i>
                        </div>
                        <div>
                            <h3 class="card-title">إدمان الهاتف الذكي</h3>
                            <p class="text-sm text-secondary">${genderText}</p>
                        </div>
                    </div>
                    <p class="card-description">أضرار الاستخدام المفرط للهاتف على الصحة الجسدية والنفسية</p>
                </div>
                
                <div class="card" onclick="renderHabitDetail('procrastination')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #FFF8E1; color: #F57F17;">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div>
                            <h3 class="card-title">التسويف</h3>
                            <p class="text-sm text-secondary">${genderText}</p>
                        </div>
                    </div>
                    <p class="card-description">تأجيل الأعمال وتأثيره على الإنتاجية والصحة النفسية والنجاح</p>
                </div>
                
                <div class="card" onclick="renderHabitDetail('gambling')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #EFEBE9; color: #4E342E;">
                            <i class="fas fa-dice"></i>
                        </div>
                        <div>
                            <h3 class="card-title">المقامرة والمراهنات</h3>
                            <p class="text-sm text-secondary">${genderText}</p>
                        </div>
                    </div>
                    <p class="card-description">إدمان المقامرة وتأثيرها على المال والصحة النفسية والأسرة</p>
                </div>
                
                <div class="card" onclick="renderHabitDetail('nailBiting')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #FCE4EC; color: #880E4F;">
                            <i class="fas fa-hand-sparkles"></i>
                        </div>
                        <div>
                            <h3 class="card-title">قضم الأظافر</h3>
                            <p class="text-sm text-secondary">${genderText}</p>
                        </div>
                    </div>
                    <p class="card-description">قضم الأظافر كسلوك قهري وتأثيره على الصحة والمظهر</p>
                </div>
                
                <div class="card" onclick="renderHabitDetail('adultery')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #FFEBEE; color: #B71C1C;">
                            <i class="fas fa-heart-crack"></i>
                        </div>
                        <div>
                            <h3 class="card-title">الزنا والعلاقات غير الشرعية</h3>
                            <p class="text-sm text-secondary">${genderText}</p>
                        </div>
                    </div>
                    <p class="card-description">أضرار العلاقات المحرمة على الصحة والنفس والمجتمع وطريق التوبة</p>
                </div>
            
            </div>
            <h2 class="section-title" style="margin-top: 32px;">
                <i class="fas fa-users" style="margin-left: 8px; color: #2196F3;"></i>
                العادات الاجتماعية
            </h2>
            <div class="cards-grid">
                
                <div class="card" onclick="renderHabitDetail('lying')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #FCE4EC; color: #880E4F;">
                            <i class="fas fa-comment-slash"></i>
                        </div>
                        <div>
                            <h3 class="card-title">الكذب</h3>
                            <p class="text-sm text-secondary">${genderText}</p>
                        </div>
                    </div>
                    <p class="card-description">أنواع الكذب وأضراره على العلاقات والثقة بالنفس والمجتمع</p>
                </div>
                
                <div class="card" onclick="renderHabitDetail('anger')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #FFEBEE; color: #B71C1C;">
                            <i class="fas fa-angry"></i>
                        </div>
                        <div>
                            <h3 class="card-title">الغضب غير المنضبط</h3>
                            <p class="text-sm text-secondary">${genderText}</p>
                        </div>
                    </div>
                    <p class="card-description">أضرار الغضب على الصحة والعلاقات وطرق التحكم به وعلاجه</p>
                </div>
                
                <div class="card" onclick="renderHabitDetail('bullying')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #FFF3E0; color: #BF360C;">
                            <i class="fas fa-bullhorn"></i>
                        </div>
                        <div>
                            <h3 class="card-title">التنمر</h3>
                            <p class="text-sm text-secondary">${genderText}</p>
                        </div>
                    </div>
                    <p class="card-description">أشكال التنمر وأضراره على الضحية والمتنمر وطرق العلاج</p>
                </div>
                
                <div class="card" onclick="renderHabitDetail('overspending')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #FFF3E0; color: #E65100;">
                            <i class="fas fa-shopping-cart"></i>
                        </div>
                        <div>
                            <h3 class="card-title">الإسراف في الإنفاق</h3>
                            <p class="text-sm text-secondary">${genderText}</p>
                        </div>
                    </div>
                    <p class="card-description">الشراء القهري والإسراف المالي وتأثيره على الحياة الأسرية</p>
                </div>
                
                <div class="card" onclick="renderHabitDetail('isolation')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #ECEFF1; color: #546E7A;">
                            <i class="fas fa-user-slash"></i>
                        </div>
                        <div>
                            <h3 class="card-title">العزلة الاجتماعية</h3>
                            <p class="text-sm text-secondary">${genderText}</p>
                        </div>
                    </div>
                    <p class="card-description">أسباب العزلة الاجتماعية وتأثيرها على الصحة النفسية والعلاقات</p>
                </div> 
            </div>
        </div>
    `;
}


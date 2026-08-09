/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : Pages
 * File   : spiritual.js
 * Type: JavaScript
 */

function renderSpiritualPage() {
    const mainContent = document.getElementById('main-content');
    
    mainContent.innerHTML = `
        <div class="animate-fade-in">
            <h1 class="heading-underline">التحصين الإيماني</h1>
            <div class="spiritual-card">
                <h2 style="margin-bottom: 16px;">
                    <i class="fas fa-star" style="margin-left: 8px;"></i>
                    من أقوال النبي محمد (صلى الله عليه وآله وسلم)
                </h2>
                ${ADHKAR_DATA.prophet_sayings.map(saying => `
                    <div class="mb-3" style="background: rgba(255,255,255,0.15); padding: 16px; border-radius: 12px;">
                        <p class="font-quran" style="color: white;">${saying.text}</p>
                        <small style="opacity: 0.8;">${saying.source}</small>
                    </div>
                `).join('')}
            </div>
            
            <div class="spiritual-card" style="background: linear-gradient(135deg, #1B5E20 0%, #4CAF50 100%);">
                <h2 style="margin-bottom: 16px;">
                    <i class="fas fa-crown" style="margin-left: 8px;"></i>
                    من حكم الإمام علي (عليه السلام)
                </h2>
                ${ADHKAR_DATA.imam_ali_sayings.map(saying => `
                    <div class="mb-3" style="background: rgba(255,255,255,0.15); padding: 16px; border-radius: 12px;">
                        <p class="font-quran" style="color: white;">${saying.text}</p>
                        <small style="opacity: 0.8;">${saying.source}</small>
                    </div>
                `).join('')}
            </div>
            
            <div class="spiritual-card" style="background: linear-gradient(135deg, #4A148C 0%, #9C27B0 100%);">
                <h2 style="margin-bottom: 16px;">
                    <i class="fas fa-hands-praying" style="margin-left: 8px;"></i>
                    أدعية ومناجاة أهل البيت (عليهم السلام)
                </h2>
                ${ADHKAR_DATA.ahlulbayt_duas.map(dua => `
                    <div class="mb-3" style="background: rgba(255,255,255,0.15); padding: 16px; border-radius: 12px;">
                        <h4 style="color: white; margin-bottom: 8px; font-size: 14px; opacity: 0.9;">${dua.title}</h4>
                        <p class="font-quran" style="color: white;">${dua.text}</p>
                        <small style="opacity: 0.8;">${dua.source}</small>
                    </div>
                `).join('')}
            </div>
            
            <div class="card">
                <h3 style="margin-bottom: 16px;">
                    <i class="fas fa-quran" style="margin-left: 8px; color: var(--primary);"></i>
                    آيات قرآنية
                </h3>
                ${ADHKAR_DATA.verses.map(verse => `
                    <div class="dhikr-text mb-3">
                        <p>${verse.text}</p>
                        <small style="opacity: 0.8; margin-top: 8px; display: block;">${verse.source}</small>
                    </div>
                `).join('')}
            </div>
            
            <div class="card">
                <h3 style="margin-bottom: 16px;">
                    <i class="fas fa-sun" style="margin-left: 8px; color: var(--accent-orange);"></i>
                    أذكار الصباح
                </h3>
                ${ADHKAR_DATA.morning.map(dhikr => `
                    <div class="mb-4" style="line-height: 2.2;">
                        <p class="font-quran">${dhikr.text}</p>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
                            <small class="text-tertiary">${dhikr.source}</small>
                            ${dhikr.count > 1 ? `<small class="text-accent">${dhikr.count} مرات</small>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="card">
                <h3 style="margin-bottom: 16px;">
                    <i class="fas fa-moon" style="margin-left: 8px; color: #5C6BC0;"></i>
                    أذكار المساء
                </h3>
                ${ADHKAR_DATA.evening.map(dhikr => `
                    <div class="mb-4" style="line-height: 2.2;">
                        <p class="font-quran">${dhikr.text}</p>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
                            <small class="text-tertiary">${dhikr.source}</small>
                            ${dhikr.count > 1 ? `<small class="text-accent">${dhikr.count} مرات</small>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="card">
                <h3 style="margin-bottom: 16px;">
                    <i class="fas fa-hand-holding-heart" style="margin-left: 8px; color: var(--accent-red);"></i>
                    أدعية التوبة والاستغفار
                </h3>
                ${ADHKAR_DATA.repentance.map(dua => `
                    <div class="mb-4" style="line-height: 2.2;">
                        <p class="font-quran">${dua.text}</p>
                        <small class="text-tertiary">${dua.source}</small>
                    </div>
                `).join('')}
            </div>
            
            <div class="card">
                <h3 style="margin-bottom: 16px;">
                    <i class="fas fa-anchor" style="margin-left: 8px; color: var(--primary);"></i>
                    أدعية الثبات على الإيمان
                </h3>
                ${ADHKAR_DATA.steadfastness.map(dua => `
                    <div class="mb-4" style="line-height: 2.2;">
                        <p class="font-quran">${dua.text}</p>
                        <small class="text-tertiary">${dua.source}</small>
                    </div>
                `).join('')}
            </div>
            
            <div class="card">
                <h3 style="margin-bottom: 16px;">
                    <i class="fas fa-shield-alt" style="margin-left: 8px; color: var(--accent-green);"></i>
                    أدعية التحصين والحفظ
                </h3>
                ${ADHKAR_DATA.protection.map(dhikr => `
                    <div class="mb-4" style="line-height: 2.2;">
                        <p class="font-quran">${dhikr.text}</p>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
                            <small class="text-tertiary">${dhikr.source}</small>
                            ${dhikr.count > 1 ? `<small class="text-accent">${dhikr.count} مرات</small>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="card">
                <h3 style="margin-bottom: 16px;">
                    <i class="fas fa-scroll" style="margin-left: 8px; color: var(--accent-purple);"></i>
                    أحاديث شريفة
                </h3>
                ${ADHKAR_DATA.hadith.map(hadith => `
                    <div class="mb-4" style="line-height: 2.2;">
                        <p class="font-quran">"${hadith.text}"</p>
                        <small class="text-tertiary">${hadith.source}</small>
                    </div>
                `).join('')}
            </div>
            
            <div class="card" style="background: #E8F5E9; border: 1px solid #C8E6C9;">
                <h3 style="margin-bottom: 16px; color: var(--accent-green);">
                    <i class="fas fa-lightbulb" style="margin-left: 8px;"></i>
                    نصائح لتقوية الإرادة من تعاليم أهل البيت (عليهم السلام)
                </h3>
                <ul style="line-height: 2.5; padding-right: 20px; list-style: disc;">
                    <li>المحافظة على الصلوات الخمس في أوقاتها فهي عمود الدين</li>
                    <li>قراءة القرآن يومياً والتدبر في آياته</li>
                    <li>الصيام التطوعي لتهذيب النفس وتقوية الإرادة</li>
                    <li>الصحبة الصالحة ومجالسة المؤمنين الصالحين</li>
                    <li>تجنب الخلوة والفراغ لأنهما باب للوساوس الشيطانية</li>
                    <li>ممارسة الرياضة والعمل البدني المفيد</li>
                    <li>تذكر الموت والآخرة لتقوية العزيمة</li>
                    <li>الدعاء والتوسل إلى الله بأهل البيت (عليهم السلام)</li>
                    <li>قراءة الأدعية المأثورة عن الأئمة المعصومين (عليهم السلام)</li>
                    <li>التفكر في خلق الله وآلائه ونعمه</li>
                </ul>
            </div>
        </div>
    `;
}
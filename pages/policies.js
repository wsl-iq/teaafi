function renderPoliciesPage() {
    const mainContent = document.getElementById('main-content');
    
    mainContent.innerHTML = `
        <div class="animate-fade-in">
            <h1 class="heading-underline">
                <i class="fas fa-shield-alt" style="margin-left: 8px;"></i>
                السياسات والقوانين
            </h1>
            
            <p class="text-secondary mb-6">
                يرجى قراءة السياسات التالية بعناية قبل استخدام تطبيق تعافي
            </p>
            
            <!-- قائمة السياسات -->
            <div class="cards-grid" style="margin-bottom: 24px;">
                <div class="card" onclick="scrollToPolicy('privacy')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #E3F2FD; color: #1565C0;">
                            <i class="fas fa-lock"></i>
                        </div>
                        <div>
                            <h3 class="card-title">سياسة الخصوصية</h3>
                            <p class="text-sm text-secondary">كيف نحمي بياناتك وخصوصيتك</p>
                        </div>
                    </div>
                </div>
                
                <div class="card" onclick="scrollToPolicy('terms')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #FFF3E0; color: #E65100;">
                            <i class="fas fa-file-contract"></i>
                        </div>
                        <div>
                            <h3 class="card-title">شروط الاستخدام</h3>
                            <p class="text-sm text-secondary">قواعد استخدام التطبيق</p>
                        </div>
                    </div>
                </div>
                
                <div class="card" onclick="scrollToPolicy('license')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #E8F5E9; color: #2E7D32;">
                            <i class="fas fa-balance-scale"></i>
                        </div>
                        <div>
                            <h3 class="card-title">الترخيص</h3>
                            <p class="text-sm text-secondary">MIT License - مفتوح المصدر</p>
                        </div>
                    </div>
                </div>
                
                <div class="card" onclick="scrollToPolicy('conduct')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #F3E5F5; color: #6A1B9A;">
                            <i class="fas fa-users"></i>
                        </div>
                        <div>
                            <h3 class="card-title">قواعد السلوك</h3>
                            <p class="text-sm text-secondary">معايير المجتمع والمساهمة</p>
                        </div>
                    </div>
                </div>
                
                <div class="card" onclick="scrollToPolicy('contributing')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #E0F2F1; color: #00695C;">
                            <i class="fas fa-code-branch"></i>
                        </div>
                        <div>
                            <h3 class="card-title">المساهمة</h3>
                            <p class="text-sm text-secondary">كيف تساهم في تطوير التطبيق</p>
                        </div>
                    </div>
                </div>
                
                <div class="card" onclick="scrollToPolicy('security')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #FCE4EC; color: #C62828;">
                            <i class="fas fa-shield-alt"></i>
                        </div>
                        <div>
                            <h3 class="card-title">سياسة الأمان</h3>
                            <p class="text-sm text-secondary">الإبلاغ عن الثغرات الأمنية</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- ==================== سياسة الخصوصية ==================== -->
            <div id="policy-privacy" class="content-section">
                <h2 class="section-title">
                    <i class="fas fa-lock" style="margin-left: 8px; color: #1565C0;"></i>
                    سياسة الخصوصية
                </h2>
                
                <div class="subsection" style="border-right-color: #1565C0;">
                    <h3 style="color: #1565C0; margin-bottom: 12px;">مقدمة</h3>
                    <p style="line-height: 2; color: var(--text-primary);">
                        تطبيق تعافي يحترم خصوصيتك. توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية معلوماتك.
                    </p>
                </div>
                
                <div class="subsection" style="border-right-color: #1565C0;">
                    <h3 style="color: #1565C0; margin-bottom: 12px;">المعلومات التي نجمعها</h3>
                    <p style="line-height: 2; color: var(--text-primary);">
                        <strong>معلومات يقدمها المستخدم (اختيارية):</strong><br>
                        • الاسم (يمكن استخدام اسم مستعار)<br>
                        • العمر التقريبي<br>
                        • الجنس (ذكر/أنثى)<br><br>
                        <strong>بيانات محفوظة محلياً:</strong><br>
                        • بيانات التعافي وتاريخ البداية<br>
                        • عداد التسبيح والإحصائيات<br>
                        • إعدادات التطبيق والمظهر<br>
                        • حالة الموافقة على الإشعارات
                    </p>
                </div>
                
                <div class="subsection" style="border-right-color: #1565C0;">
                    <h3 style="color: #1565C0; margin-bottom: 12px;">تخزين البيانات</h3>
                    <p style="line-height: 2; color: var(--text-primary);">
                        <i class="fas fa-check-circle" style="color: #4CAF50; margin-left: 4px;"></i>
                        جميع البيانات تُخزن محلياً على جهازك فقط باستخدام LocalStorage<br>
                        <i class="fas fa-check-circle" style="color: #4CAF50; margin-left: 4px;"></i>
                        لا يتم إرسال أي بيانات إلى خوادم خارجية<br>
                        <i class="fas fa-check-circle" style="color: #4CAF50; margin-left: 4px;"></i>
                        لا يتم جمع معلومات التصفح أو الموقع<br>
                        <i class="fas fa-check-circle" style="color: #4CAF50; margin-left: 4px;"></i>
                        يمكنك حذف جميع بياناتك من الإعدادات في أي وقت
                    </p>
                </div>
                
                <div class="subsection" style="border-right-color: #1565C0;">
                    <h3 style="color: #1565C0; margin-bottom: 12px;">حقوق المستخدم</h3>
                    <p style="line-height: 2; color: var(--text-primary);">
                        • الوصول إلى جميع بياناتك من خلال التطبيق<br>
                        • تصحيح بياناتك من الإعدادات<br>
                        • حذف جميع بياناتك بنقرة واحدة<br>
                        • رفض الإشعارات أو استخدام اسم مستعار<br>
                        • الاطلاع على الكود المصدري الكامل
                    </p>
                </div>
            </div>
            
            <!-- ==================== شروط الاستخدام ==================== -->
            <div id="policy-terms" class="content-section">
                <h2 class="section-title">
                    <i class="fas fa-file-contract" style="margin-left: 8px; color: #E65100;"></i>
                    شروط الاستخدام
                </h2>
                
                <div class="subsection" style="border-right-color: #E65100;">
                    <h3 style="color: #E65100; margin-bottom: 12px;">قبول الشروط</h3>
                    <p style="line-height: 2; color: var(--text-primary);">
                        باستخدامك للتطبيق، فإنك توافق على هذه الشروط. إذا كنت لا توافق، يرجى عدم استخدام التطبيق.
                    </p>
                </div>
                
                <div class="subsection" style="border-right-color: #E65100;">
                    <h3 style="color: #E65100; margin-bottom: 12px;">طبيعة الخدمة</h3>
                    <p style="line-height: 2; color: var(--text-primary);">
                        • التطبيق يقدم محتوى توعوياً وتثقيفياً فقط<br>
                        • ليس بديلاً عن الاستشارة الطبية أو النفسية المتخصصة<br>
                        • المعلومات مقدمة "كما هي" دون ضمانات<br>
                        • أحرص على دقة المعلومات ولكن لا أضمن خلوها من الأخطاء
                    </p>
                </div>
                
                <div class="subsection" style="border-right-color: #E65100;">
                    <h3 style="color: #E65100; margin-bottom: 12px;">استخدام التطبيق</h3>
                    <p style="line-height: 2; color: var(--text-primary);">
                        أنت توافق على:<br>
                        • استخدام التطبيق لأغراض شخصية مشروعة فقط<br>
                        • عدم إساءة استخدام التطبيق بأي شكل<br>
                        • عدم محاولة اختراق أو تعطيل التطبيق<br>
                        • احترام حقوق الملكية الفكرية
                    </p>
                </div>
                
                <div class="subsection" style="border-right-color: #E65100;">
                    <h3 style="color: #E65100; margin-bottom: 12px;">إخلاء المسؤولية</h3>
                    <p style="line-height: 2; color: var(--text-primary);">
                        <i class="fas fa-exclamation-triangle" style="color: #FF9800; margin-left: 4px;"></i>
                        التطبيق غير مسؤول عن:<br>
                        • أي ضرر ناتج عن استخدام المعلومات المقدمة<br>
                        • القرارات الشخصية المبنية على محتوى التطبيق<br>
                        • فقدان البيانات في حالة مسح المتصفح<br>
                        • عدم توافق التطبيق مع بعض المتصفحات القديمة
                    </p>
                </div>
            </div>
            
            <!-- ==================== الترخيص ==================== -->
            <div id="policy-license" class="content-section">
                <h2 class="section-title">
                    <i class="fas fa-balance-scale" style="margin-left: 8px; color: #2E7D32;"></i>
                    الترخيص - MIT License
                </h2>
                
                <div class="subsection" style="border-right-color: #2E7D32;">
                    <h3 style="color: #2E7D32; margin-bottom: 12px;">معلومات الترخيص</h3>
                    <div style="background: var(--surface-variant); padding: 16px; border-radius: 8px; margin-bottom: 12px;">
                        <p style="line-height: 2; color: var(--text-primary);">
                            <strong>MIT License</strong><br><br>
                            جميع الحقوق محفوظة (c) 2026 محمد الباقر<br>
                            يُمنح بموجب هذا الإذن، دون أي مقابل، لأي شخص يحصل على نسخة من هذا البرنامج والملفات المرفقة به ("البرنامج")،<br>
                            للتعامل مع البرنامج دون قيود، بما في ذلك على سبيل المثال لا الحصر حقوق الاستخدام والتعديل والتوزيع والترخيص من الباطن و/أو البيع من نسخ البرنامج،<br>
                            وللسماح للأشخاص الذين يتم تزويدهم بالبرنامج بالقيام بذلك، رهناً بالشروط التالية:
                        </p>
                    </div>
                </div>
                
                <div class="subsection" style="border-right-color: #2E7D32;">
                    <h3 style="color: #2E7D32; margin-bottom: 12px;">ما يسمح به الترخيص</h3>
                    <p style="line-height: 2; color: var(--text-primary);">
                        <i class="fas fa-check-circle" style="color: #4CAF50; margin-left: 4px;"></i> الاستخدام التجاري<br>
                        <i class="fas fa-check-circle" style="color: #4CAF50; margin-left: 4px;"></i> التعديل على الكود<br>
                        <i class="fas fa-check-circle" style="color: #4CAF50; margin-left: 4px;"></i> التوزيع<br>
                        <i class="fas fa-check-circle" style="color: #4CAF50; margin-left: 4px;"></i> الاستخدام الخاص<br>
                        <i class="fas fa-check-circle" style="color: #4CAF50; margin-left: 4px;"></i> الترخيص من الباطن
                    </p>
                </div>
                
                <div class="subsection" style="border-right-color: #2E7D32;">
                    <h3 style="color: #2E7D32; margin-bottom: 12px;">الشروط</h3>
                    <p style="line-height: 2; color: var(--text-primary);">
                        <i class="fas fa-info-circle" style="color: #2196F3; margin-left: 4px;"></i> يجب تضمين إشعار حقوق النشر<br>
                        <i class="fas fa-info-circle" style="color: #2196F3; margin-left: 4px;"></i> يجب تضمين نص الترخيص في جميع النسخ<br>
                        <i class="fas fa-info-circle" style="color: #2196F3; margin-left: 4px;"></i> البرنامج مقدم "كما هو" دون أي ضمانات
                    </p>
                </div>
            </div>
            
            <!-- ==================== قواعد السلوك ==================== -->
            <div id="policy-conduct" class="content-section">
                <h2 class="section-title">
                    <i class="fas fa-users" style="margin-left: 8px; color: #6A1B9A;"></i>
                    قواعد السلوك
                </h2>
                
                <div class="subsection" style="border-right-color: #6A1B9A;">
                    <h3 style="color: #6A1B9A; margin-bottom: 12px;">أتعهد</h3>
                    <p style="line-height: 2; color: var(--text-primary);">
                        أنا كمساهم ومشرف ومالك على هذا المشروع اتعهد بتوفير بيئة ترحيبية وخالية من المضايقات للجميع.
                    </p>
                </div>
                
                <div class="subsection" style="border-right-color: #6A1B9A;">
                    <h3 style="color: #6A1B9A; margin-bottom: 12px;">السلوكيات المشجعة</h3>
                    <p style="line-height: 2; color: var(--text-primary);">
                        <i class="fas fa-star" style="color: #FFD700; margin-left: 4px;"></i> استخدام لغة ترحيبية وشاملة<br>
                        <i class="fas fa-star" style="color: #FFD700; margin-left: 4px;"></i> احترام وجهات النظر المختلفة<br>
                        <i class="fas fa-star" style="color: #FFD700; margin-left: 4px;"></i> تقبل النقد البناء بروح رياضية<br>
                        <i class="fas fa-star" style="color: #FFD700; margin-left: 4px;"></i> التركيز على ما هو أفضل للمجتمع<br>
                        <i class="fas fa-star" style="color: #FFD700; margin-left: 4px;"></i> إظهار التعاطف تجاه الآخرين
                    </p>
                </div>
                
                <div class="subsection" style="border-right-color: #6A1B9A;">
                    <h3 style="color: #6A1B9A; margin-bottom: 12px;">السلوكيات غير المقبولة</h3>
                    <p style="line-height: 2; color: var(--text-primary);">
                        <i class="fas fa-times-circle" style="color: #F44336; margin-left: 4px;"></i> استخدام لغة أو صور غير لائقة<br>
                        <i class="fas fa-times-circle" style="color: #F44336; margin-left: 4px;"></i> التعليقات المهينة أو المسيئة<br>
                        <i class="fas fa-times-circle" style="color: #F44336; margin-left: 4px;"></i> المضايقات العامة أو الخاصة<br>
                        <i class="fas fa-times-circle" style="color: #F44336; margin-left: 4px;"></i> نشر معلومات الآخرين دون إذن<br>
                        <i class="fas fa-times-circle" style="color: #F44336; margin-left: 4px;"></i> أي سلوك غير مهني
                    </p>
                </div>
            </div>
            
            <!-- ==================== المساهمة ==================== -->
            <div id="policy-contributing" class="content-section">
                <h2 class="section-title">
                    <i class="fas fa-code-branch" style="margin-left: 8px; color: #00695C;"></i>
                    دليل المساهمة
                </h2>
                
                <div class="subsection" style="border-right-color: #00695C;">
                    <h3 style="color: #00695C; margin-bottom: 12px;">كيف تساهم</h3>
                    <p style="line-height: 2; color: var(--text-primary);">
                        <strong>1. الإبلاغ عن الأخطاء:</strong> افتح issue في GitHub مع وصف المشكلة<br>
                        <strong>2. اقتراح تحسينات:</strong> افتح issue للنقاش قبل البدء بالعمل<br>
                        <strong>3. المساهمة بالكود:</strong> Fork ثم Pull Request<br>
                        <strong>4. المساهمة بالمحتوى:</strong> تأكد من دقة المعلومات والمصادر<br>
                        <strong>5. المساهمة بالترجمة:</strong> افتح issue للمناقشة أولاً
                    </p>
                </div>
                
                <div class="subsection" style="border-right-color: #00695C;">
                    <h3 style="color: #00695C; margin-bottom: 12px;">إرشادات الكود</h3>
                    <p style="line-height: 2; color: var(--text-primary);">
                        • استخدم HTML5 semantic elements<br>
                        • اكتب CSS باستخدام CSS Variables<br>
                        • استخدم JavaScript ES6+ الحديث<br>
                        • اكتب تعليقات واضحة بالعربية<br>
                        • حافظ على RTL compatibility<br>
                        • اختبر على المتصفحات المختلفة
                    </p>
                </div>
            </div>
            
            <!-- ==================== سياسة الأمان ==================== -->
            <div id="policy-security" class="content-section">
                <h2 class="section-title">
                    <i class="fas fa-shield-alt" style="margin-left: 8px; color: #C62828;"></i>
                    سياسة الأمان
                </h2>
                
                <div class="subsection" style="border-right-color: #C62828;">
                    <h3 style="color: #C62828; margin-bottom: 12px;">الإبلاغ عن الثغرات</h3>
                    <p style="line-height: 2; color: var(--text-primary);">
                        <i class="fas fa-shield-alt" style="color: #FF9800; margin-left: 4px;"></i>
                        <strong>لا تنشر الثغرة علناً</strong> - لا تفتح issue عام<br><br>
                        <strong>طريقة الإبلاغ:</strong><br>
                        • راسل المطور مباشرة عبر وسائل التواصل المتاحة<br>
                        • قدم وصفاً مفصلاً للثغرة<br>
                        • اشرح خطوات إعادة إنتاج المشكلة<br>
                        • انتظر التأكيد قبل النشر
                    </p>
                </div>
                
                <div class="subsection" style="border-right-color: #C62828;">
                    <h3 style="color: #C62828; margin-bottom: 12px;">الممارسات الأمنية</h3>
                    <p style="line-height: 2; color: var(--text-primary);">
                        <i class="fas fa-shield-alt" style="color: #4CAF50; margin-left: 4px;"></i> جميع البيانات مخزنة محلياً فقط<br>
                        <i class="fas fa-shield-alt" style="color: #4CAF50; margin-left: 4px;"></i> لا اتصال بخوادم خارجية<br>
                        <i class="fas fa-shield-alt" style="color: #4CAF50; margin-left: 4px;"></i> Service Worker للتشغيل بدون إنترنت<br>
                        <i class="fas fa-shield-alt" style="color: #4CAF50; margin-left: 4px;"></i> لا جمع للموقع الجغرافي أو معلومات التصفح
                    </p>
                </div>
            </div>
            
            <!-- زر العودة للأعلى -->
            <div style="text-align: center; padding: 24px;">
                <button class="btn btn-primary" onclick="scrollToTop()">
                    <i class="fas fa-arrow-up"></i>
                    العودة للأعلى
                </button>
            </div>
        </div>
    `;
}

function scrollToTop() {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        if (typeof mainContent.scrollTo === 'function') {
            mainContent.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            mainContent.scrollTop = 0;
        }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToPolicy(policyId) {
    const element = document.getElementById('policy-' + policyId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // إضافة تأثير تمييز مؤقت
        element.style.transition = 'all 0.3s ease';
        element.style.boxShadow = '0 0 0 4px var(--primary-light)';
        element.style.borderRadius = '12px';
        setTimeout(() => {
            element.style.boxShadow = '';
        }, 2000);
    }
}
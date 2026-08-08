/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : Pages
 * File   : quiz.js
 * Type: JavaScript
 */

var QuizData = {
    // ==================== 100 سؤال ====================
    allQuestions: [
        // الرغبة والتحكم (1-15)
        { id: 1, text: 'كيف تقيم رغبتك في العادة خلال الأسبوع الماضي؟', options: ['ضعيفة جداً', 'ضعيفة', 'متوسطة', 'قوية', 'قوية جداً'], scores: [0,1,2,3,4] },
        { id: 2, text: 'كم مرة فكرت في العادة اليوم؟', options: ['0 مرات', '1-3 مرات', '4-6 مرات', '7-10 مرات', 'أكثر من 10'], scores: [0,1,2,3,4] },
        { id: 3, text: 'هل واجهت أي انتكاسات هذا الأسبوع؟', options: ['لم أواجه', 'مرة واحدة', 'مرتين', 'ثلاث مرات', 'أكثر من ثلاث'], scores: [0,1,2,3,4] },
        { id: 4, text: 'كيف تقيم قدرتك على التحكم في دوافعك؟', options: ['ممتازة', 'جيدة', 'متوسطة', 'ضعيفة', 'ضعيفة جداً'], scores: [0,1,2,3,4] },
        { id: 5, text: 'هل تشعر أنك مسيطر على حياتك؟', options: ['مسيطر تماماً', 'مسيطر غالباً', 'أحياناً', 'نادراً', 'لا أشعر بالسيطرة'], scores: [0,1,2,3,4] },
        { id: 6, text: 'كم مرة قاومت الرغبة بنجاح هذا الأسبوع؟', options: ['دائماً', 'غالباً', 'أحياناً', 'نادراً', 'لم أقاوم'], scores: [0,1,2,3,4] },
        { id: 7, text: 'هل تلاحظ انخفاضاً في شدة الرغبة مقارنة بالسابق؟', options: ['انخفضت كثيراً', 'انخفضت', 'بقيت كما هي', 'زادت قليلاً', 'زادت كثيراً'], scores: [0,1,2,3,4] },
        { id: 8, text: 'كم دقيقة تقضيها في التفكير بالعادة يومياً؟', options: ['0 دقائق', 'أقل من 10', '10-30', '30-60', 'أكثر من ساعة'], scores: [0,1,2,3,4] },
        { id: 9, text: 'هل تشعر أنك حر أم عبد للعادة؟', options: ['حر تماماً', 'حر غالباً', 'محايد', 'عبد غالباً', 'عبد تماماً'], scores: [0,1,2,3,4] },
        { id: 10, text: 'كيف تقيم قوة إرادتك هذا الأسبوع؟', options: ['قوية جداً', 'قوية', 'متوسطة', 'ضعيفة', 'ضعيفة جداً'], scores: [0,1,2,3,4] },
        { id: 11, text: 'هل تشعر بالندم بعد التفكير في العادة؟', options: ['لا أفكر فيها', 'لا أشعر بالندم', 'أحياناً', 'غالباً', 'دائماً'], scores: [0,1,2,3,4] },
        { id: 12, text: 'كم مرة تجنبت المحفزات بنجاح هذا الأسبوع؟', options: ['دائماً', 'غالباً', 'أحياناً', 'نادراً', 'لم أتجنب'], scores: [0,1,2,3,4] },
        { id: 13, text: 'هل لديك خطة واضحة للتعامل مع الرغبة عند ظهورها؟', options: ['نعم وخطة فعالة', 'نعم', 'لدي فكرة', 'ليس لدي خطة', 'لا أعرف ماذا أفعل'], scores: [0,1,2,3,4] },
        { id: 14, text: 'كيف تقيم تقدمك في رحلة التعافي بشكل عام؟', options: ['ممتاز', 'جيد جداً', 'جيد', 'مقبول', 'ضعيف'], scores: [0,1,2,3,4] },
        { id: 15, text: 'هل تشعر أنك تستطيع الاستمرار في التعافي؟', options: ['بكل تأكيد', 'نعم', 'ربما', 'لست متأكداً', 'لا أستطيع'], scores: [0,1,2,3,4] },

        // المزاج والصحة النفسية (16-35)
        { id: 16, text: 'كيف تصف حالتك المزاجية هذا الأسبوع؟', options: ['ممتاز', 'جيد', 'متوسط', 'سيء', 'سيء جداً'], scores: [0,1,2,3,4] },
        { id: 17, text: 'هل شعرت بالضغط النفسي أو التوتر هذا الأسبوع؟', options: ['لم أشعر', 'شعرت قليلاً', 'شعرت أحياناً', 'شعرت كثيراً', 'شعرت دائماً'], scores: [0,1,2,3,4] },
        { id: 18, text: 'هل شعرت بالارتياح النفسي والسلام الداخلي؟', options: ['شعرت به كثيراً', 'شعرت به', 'محايد', 'شعرت بالضيق', 'شعرت بالضيق كثيراً'], scores: [0,1,2,3,4] },
        { id: 19, text: 'كم مرة شعرت بالسعادة الحقيقية هذا الأسبوع؟', options: ['كل يوم', 'معظم الأيام', 'بعض الأيام', 'نادراً', 'لم أشعر بالسعادة'], scores: [0,1,2,3,4] },
        { id: 20, text: 'هل تشعر بالتفاؤل بشأن مستقبل تعافيك؟', options: ['متفائل جداً', 'متفائل', 'محايد', 'قلق', 'متشائم'], scores: [0,1,2,3,4] },
        { id: 21, text: 'هل شعرت بالتحفيز لمواصلة التعافي؟', options: ['متحفز جداً', 'متحفز', 'محايد', 'قليل التحفيز', 'غير متحفز'], scores: [0,1,2,3,4] },
        { id: 22, text: 'كيف تقيم ثقتك بنفسك هذا الأسبوع؟', options: ['عالية جداً', 'عالية', 'متوسطة', 'منخفضة', 'منخفضة جداً'], scores: [0,1,2,3,4] },
        { id: 23, text: 'هل شعرت بالوحدة أو العزلة هذا الأسبوع؟', options: ['لم أشعر', 'شعرت قليلاً', 'شعرت أحياناً', 'شعرت كثيراً', 'شعرت دائماً'], scores: [0,1,2,3,4] },
        { id: 24, text: 'هل تشعر أنك تستحق التعافي والنجاح؟', options: ['أستحق تماماً', 'أستحق', 'محايد', 'لا أستحق', 'لا أستحق أبداً'], scores: [0,1,2,3,4] },
        { id: 25, text: 'كيف تقيم صحتك النفسية بشكل عام هذا الأسبوع؟', options: ['ممتازة', 'جيدة', 'متوسطة', 'سيئة', 'سيئة جداً'], scores: [0,1,2,3,4] },
        { id: 26, text: 'هل شعرت بالغضب أو الانفعال هذا الأسبوع؟', options: ['لم أشعر', 'شعرت قليلاً', 'شعرت أحياناً', 'شعرت كثيراً', 'شعرت دائماً'], scores: [0,1,2,3,4] },
        { id: 27, text: 'هل بكيت أو شعرت برغبة في البكاء هذا الأسبوع؟', options: ['لم أبكِ', 'مرة واحدة', 'مرتين', 'ثلاث مرات', 'أكثر من ثلاث'], scores: [0,1,2,3,4] },
        { id: 28, text: 'كيف تقيم مرونتك النفسية في مواجهة الصعاب؟', options: ['مرن جداً', 'مرن', 'متوسط', 'ضعيف', 'ضعيف جداً'], scores: [0,1,2,3,4] },
        { id: 29, text: 'هل تشعر أن حياتك لها معنى وهدف؟', options: ['بكل تأكيد', 'نعم', 'محايد', 'لا أشعر', 'لا هدف لي'], scores: [0,1,2,3,4] },
        { id: 30, text: 'كم مرة شعرت بالامتنان هذا الأسبوع؟', options: ['كل يوم', 'معظم الأيام', 'بعض الأيام', 'نادراً', 'لم أشعر'], scores: [0,1,2,3,4] },

        // النوم والصحة الجسدية (31-50)
        { id: 31, text: 'كيف تقيم جودة نومك هذا الأسبوع؟', options: ['ممتاز', 'جيد', 'متوسط', 'سيء', 'سيء جداً'], scores: [0,1,2,3,4] },
        { id: 32, text: 'كم ساعة تنام في المتوسط ليلاً؟', options: ['8 ساعات أو أكثر', '7-8 ساعات', '6-7 ساعات', '5-6 ساعات', 'أقل من 5 ساعات'], scores: [0,1,2,3,4] },
        { id: 33, text: 'هل تستيقظ وأنت تشعر بالنشاط والطاقة؟', options: ['دائماً', 'غالباً', 'أحياناً', 'نادراً', 'لا أشعر بالنشاط'], scores: [0,1,2,3,4] },
        { id: 34, text: 'كم مرة مارست الرياضة هذا الأسبوع؟', options: ['5 مرات أو أكثر', '3-4 مرات', '1-2 مرات', 'لم أمارس', 'لا أهتم'], scores: [0,1,2,3,4] },
        { id: 35, text: 'كيف تقيم مستوى طاقتك خلال النهار؟', options: ['عالية جداً', 'عالية', 'متوسطة', 'منخفضة', 'منخفضة جداً'], scores: [0,1,2,3,4] },
        { id: 36, text: 'هل تعاني من الصداع أو الآلام الجسدية؟', options: ['لا أعاني', 'نادراً', 'أحياناً', 'كثيراً', 'دائماً'], scores: [0,1,2,3,4] },
        { id: 37, text: 'كيف تصف نظامك الغذائي هذا الأسبوع؟', options: ['صحي جداً', 'صحي', 'متوسط', 'غير صحي', 'غير صحي إطلاقاً'], scores: [0,1,2,3,4] },
        { id: 38, text: 'كم كوب ماء تشرب يومياً؟', options: ['8 أكواب أو أكثر', '6-7 أكواب', '4-5 أكواب', '2-3 أكواب', 'أقل من كوبين'], scores: [0,1,2,3,4] },
        { id: 39, text: 'هل تشعر بالإرهاق والتعب دون سبب؟', options: ['لا أشعر', 'نادراً', 'أحياناً', 'كثيراً', 'دائماً'], scores: [0,1,2,3,4] },
        { id: 40, text: 'كيف تقيم لياقتك البدنية هذا الأسبوع؟', options: ['ممتازة', 'جيدة', 'متوسطة', 'ضعيفة', 'ضعيفة جداً'], scores: [0,1,2,3,4] },
        { id: 41, text: 'هل ذهبت للطبيب أو المختص الصحي هذا الأسبوع؟', options: ['نعم للفحص الدوري', 'نعم للعلاج', 'لا لم أحتج', 'لا أهملت', 'لا أهتم بصحتي'], scores: [0,1,2,3,4] },
        { id: 42, text: 'هل تعاني من أي آلام مزمنة؟', options: ['لا أعاني', 'آلام خفيفة', 'آلام متوسطة', 'آلام شديدة', 'آلام لا تطاق'], scores: [0,1,2,3,4] },
        { id: 43, text: 'كيف تصف وزنك الحالي؟', options: ['مثالي', 'قريب من المثالي', 'زائد قليلاً', 'زائد كثيراً', 'لا أهتم'], scores: [0,1,2,3,4] },
        { id: 44, text: 'هل توقفت عن التدخين أو الكحول هذا الأسبوع؟', options: ['لا أدخن أصلاً', 'توقفت تماماً', 'قللت كثيراً', 'قللت قليلاً', 'لم أقلل'], scores: [0,1,2,3,4] },
        { id: 45, text: 'كيف تقيم صحتك الجسدية بشكل عام؟', options: ['ممتازة', 'جيدة', 'متوسطة', 'سيئة', 'سيئة جداً'], scores: [0,1,2,3,4] },

        // العبادة والروحانيات (46-65)
        { id: 46, text: 'هل التزمت بالأذكار والعبادات هذا الأسبوع؟', options: ['ملتزم جداً', 'ملتزم', 'أحياناً', 'نادراً', 'لم ألتزم'], scores: [0,1,2,3,4] },
        { id: 47, text: 'كم مرة صليت في المسجد هذا الأسبوع؟', options: ['كل الصلوات', 'معظم الصلوات', 'بعض الصلوات', 'صلاة واحدة', 'لم أصلِّ في المسجد'], scores: [0,1,2,3,4] },
        { id: 48, text: 'هل تشعر أنك أقرب إلى الله هذا الأسبوع؟', options: ['أقرب كثيراً', 'أقرب', 'محايد', 'أبعد قليلاً', 'أبعد كثيراً'], scores: [0,1,2,3,4] },
        { id: 49, text: 'كم مرة قرأت القرآن هذا الأسبوع؟', options: ['كل يوم', 'معظم الأيام', 'بعض الأيام', 'مرة واحدة', 'لم أقرأ'], scores: [0,1,2,3,4] },
        { id: 50, text: 'هل دعوت الله بالثبات والتعافي هذا الأسبوع؟', options: ['كل يوم', 'معظم الأيام', 'بعض الأيام', 'نادراً', 'لم أدعُ'], scores: [0,1,2,3,4] },
        { id: 51, text: 'هل تشعر بالطمأنينة عند الدعاء والذكر؟', options: ['دائماً', 'غالباً', 'أحياناً', 'نادراً', 'لا أشعر'], scores: [0,1,2,3,4] },
        { id: 52, text: 'كم مرة استغفرت الله هذا الأسبوع؟', options: ['أكثر من 100 مرة', '50-100 مرة', '20-50 مرة', 'أقل من 20', 'لم أستغفر'], scores: [0,1,2,3,4] },
        { id: 53, text: 'هل حضرت مجالس علم أو ذكر هذا الأسبوع؟', options: ['حضرت أكثر من مجلس', 'حضرت مجلساً واحداً', 'لم أحضر', 'لم تتح لي الفرصة', 'لا أهتم'], scores: [0,1,2,3,4] },
        { id: 54, text: 'كيف تقيم علاقتك بالله هذا الأسبوع؟', options: ['قوية جداً', 'قوية', 'متوسطة', 'ضعيفة', 'ضعيفة جداً'], scores: [0,1,2,3,4] },
        { id: 55, text: 'هل تشعر أن الإيمان يساعدك في التعافي؟', options: ['يساعدني كثيراً', 'يساعدني', 'محايد', 'لا يساعدني', 'لا أؤمن بذلك'], scores: [0,1,2,3,4] },
        { id: 56, text: 'كم مرة صليت على النبي هذا الأسبوع؟', options: ['أكثر من 100 مرة', '50-100 مرة', '20-50 مرة', 'أقل من 20', 'لم أصلِّ'], scores: [0,1,2,3,4] },
        { id: 57, text: 'هل تشعر بالندم على الذنوب هذا الأسبوع؟', options: ['لا أشعر بالذنب', 'ندم خفيف', 'ندم متوسط', 'ندم شديد', 'ندم شديد جداً'], scores: [0,1,2,3,4] },
        { id: 58, text: 'كيف تقيم التزامك الديني هذا الأسبوع؟', options: ['ممتاز', 'جيد', 'متوسط', 'ضعيف', 'ضعيف جداً'], scores: [0,1,2,3,4] },
        { id: 59, text: 'هل ساعدت الآخرين أو تصدقت هذا الأسبوع؟', options: ['ساعدت كثيراً', 'ساعدت', 'ساعدت قليلاً', 'لم أساعد', 'لا أهتم'], scores: [0,1,2,3,4] },
        { id: 60, text: 'هل تشعر براحة البال عند ذكر الله؟', options: ['دائماً', 'غالباً', 'أحياناً', 'نادراً', 'لا أشعر'], scores: [0,1,2,3,4] },

        // العلاقات الاجتماعية (61-75)
        { id: 61, text: 'هل شعرت بالتحسن في علاقاتك الاجتماعية هذا الأسبوع؟', options: ['تحسنت كثيراً', 'تحسنت', 'بقيت كما هي', 'تدهورت قليلاً', 'تدهورت كثيراً'], scores: [0,1,2,3,4] },
        { id: 62, text: 'كم مرة تواصلت مع أصدقائك هذا الأسبوع؟', options: ['كل يوم', 'معظم الأيام', 'بعض الأيام', 'مرة واحدة', 'لم أتواصل'], scores: [0,1,2,3,4] },
        { id: 63, text: 'هل قضيت وقتاً ممتعاً مع عائلتك هذا الأسبوع؟', options: ['كل يوم', 'معظم الأيام', 'بعض الأيام', 'نادراً', 'لم أقضِ'], scores: [0,1,2,3,4] },
        { id: 64, text: 'هل تشعر أن الناس يدعمونك في رحلة التعافي؟', options: ['يدعمونني كثيراً', 'يدعمونني', 'محايد', 'لا يدعمونني', 'يعارضونني'], scores: [0,1,2,3,4] },
        { id: 65, text: 'هل تجنبت الأشخاص السلبيين هذا الأسبوع؟', options: ['تجنبتهم تماماً', 'تجنبتهم غالباً', 'تجنبتهم أحياناً', 'لم أتجنبهم', 'لا أستطيع'], scores: [0,1,2,3,4] },
        { id: 66, text: 'كيف تقيم مهاراتك في التواصل مع الآخرين؟', options: ['ممتازة', 'جيدة', 'متوسطة', 'ضعيفة', 'ضعيفة جداً'], scores: [0,1,2,3,4] },
        { id: 67, text: 'هل شعرت بالخجل أو القلق الاجتماعي هذا الأسبوع؟', options: ['لم أشعر', 'شعرت قليلاً', 'شعرت أحياناً', 'شعرت كثيراً', 'شعرت دائماً'], scores: [0,1,2,3,4] },
        { id: 68, text: 'هل شاركت في أنشطة اجتماعية إيجابية هذا الأسبوع؟', options: ['شاركت كثيراً', 'شاركت', 'شاركت قليلاً', 'لم أشارك', 'لا أهتم'], scores: [0,1,2,3,4] },
        { id: 69, text: 'كيف تقيم علاقتك بشريك حياتك هذا الأسبوع؟', options: ['ممتازة', 'جيدة', 'متوسطة', 'سيئة', 'سيئة جداً / لا يوجد شريك'], scores: [0,1,2,3,4] },
        { id: 70, text: 'هل ساعدت شخصاً آخر في رحلة تعافيه هذا الأسبوع؟', options: ['ساعدت أكثر من شخص', 'ساعدت شخصاً', 'حاولت المساعدة', 'لم أساعد', 'لا أستطيع'], scores: [0,1,2,3,4] },
        { id: 71, text: 'هل تشعر بالانتماء لمجتمع داعم؟', options: ['أنتمي بقوة', 'أنتمي', 'محايد', 'لا أنتمي', 'لا يوجد مجتمع'], scores: [0,1,2,3,4] },
        { id: 72, text: 'كم مرة خرجت من المنزل للترفيه هذا الأسبوع؟', options: ['كل يوم', 'معظم الأيام', 'بعض الأيام', 'مرة واحدة', 'لم أخرج'], scores: [0,1,2,3,4] },
        { id: 73, text: 'هل تشعر أنك شخص محبوب من الآخرين؟', options: ['محبوب جداً', 'محبوب', 'محايد', 'غير محبوب', 'مكروه'], scores: [0,1,2,3,4] },
        { id: 74, text: 'كيف تقيم دعم أسرتك لك في التعافي؟', options: ['دعم قوي', 'دعم جيد', 'دعم متوسط', 'دعم ضعيف', 'لا يوجد دعم'], scores: [0,1,2,3,4] },
        { id: 75, text: 'هل تشعر أنك قدوة حسنة للآخرين؟', options: ['قدوة بامتياز', 'قدوة', 'محايد', 'لست قدوة', 'قدوة سيئة'], scores: [0,1,2,3,4] },

        // الإنتاجية والتطوير (76-90)
        { id: 76, text: 'كيف تقيم إنتاجيتك في العمل أو الدراسة هذا الأسبوع؟', options: ['ممتازة', 'جيدة', 'متوسطة', 'ضعيفة', 'ضعيفة جداً'], scores: [0,1,2,3,4] },
        { id: 77, text: 'هل أنجزت مهامك اليومية في وقتها؟', options: ['أنجزت كل شيء', 'أنجزت معظمها', 'أنجزت بعضها', 'أنجزت القليل', 'لم أنجز شيئاً'], scores: [0,1,2,3,4] },
        { id: 78, text: 'هل تعلمت شيئاً جديداً هذا الأسبوع؟', options: ['تعلمت كثيراً', 'تعلمت', 'تعلمت شيئاً بسيطاً', 'لم أتعلم', 'لا أهتم'], scores: [0,1,2,3,4] },
        { id: 79, text: 'كيف تقيم مهاراتك في إدارة الوقت؟', options: ['ممتازة', 'جيدة', 'متوسطة', 'ضعيفة', 'ضعيفة جداً'], scores: [0,1,2,3,4] },
        { id: 80, text: 'هل خططت لأهدافك المستقبلية هذا الأسبوع؟', options: ['خططت لأهداف كبيرة', 'خططت', 'خططت قليلاً', 'لم أخطط', 'لا أهتم'], scores: [0,1,2,3,4] },
        { id: 81, text: 'كم ساعة قضيتها في تطوير نفسك هذا الأسبوع؟', options: ['أكثر من 10 ساعات', '5-10 ساعات', '2-5 ساعات', 'أقل من ساعتين', 'لم أطور نفسي'], scores: [0,1,2,3,4] },
        { id: 82, text: 'هل تشعر أنك تحقق تقدماً في حياتك المهنية أو الدراسية؟', options: ['تقدم كبير', 'تقدم', 'تقدم بسيط', 'لا تقدم', 'تراجع'], scores: [0,1,2,3,4] },
        { id: 83, text: 'كيف تقيم تركيزك وانتباهك هذا الأسبوع؟', options: ['ممتاز', 'جيد', 'متوسط', 'ضعيف', 'ضعيف جداً'], scores: [0,1,2,3,4] },
        { id: 84, text: 'هل استخدمت وقتك بشكل مفيد هذا الأسبوع؟', options: ['مفيد جداً', 'مفيد', 'متوسط', 'غير مفيد', 'ضائع تماماً'], scores: [0,1,2,3,4] },
        { id: 85, text: 'كيف تقيم انضباطك الذاتي هذا الأسبوع؟', options: ['منضبط جداً', 'منضبط', 'متوسط', 'غير منضبط', 'فوضوي'], scores: [0,1,2,3,4] },
        { id: 86, text: 'هل بدأت مشروعاً أو هواية جديدة هذا الأسبوع؟', options: ['بدأت أكثر من شيء', 'بدأت شيئاً واحداً', 'فكرت في البدء', 'لم أبدأ', 'لا أهتم'], scores: [0,1,2,3,4] },
        { id: 87, text: 'كم مرة أجلت أعمالك المهمة هذا الأسبوع؟', options: ['لم أؤجل', 'أجلت مرة', 'أجلت مرتين', 'أجلت كثيراً', 'أجلت كل شيء'], scores: [0,1,2,3,4] },
        { id: 88, text: 'هل تشعر بالرضا عن إنجازاتك هذا الأسبوع؟', options: ['راضٍ جداً', 'راضٍ', 'محايد', 'غير راضٍ', 'غير راضٍ أبداً'], scores: [0,1,2,3,4] },
        { id: 89, text: 'كيف تقيم تطورك الشخصي مقارنة بالشهر الماضي؟', options: ['تطورت كثيراً', 'تطورت', 'بقيت كما أنا', 'تراجعت قليلاً', 'تراجعت كثيراً'], scores: [0,1,2,3,4] },
        { id: 90, text: 'هل تشعر أنك تعيش حياة متوازنة؟', options: ['متوازنة جداً', 'متوازنة', 'محايد', 'غير متوازنة', 'فوضوية'], scores: [0,1,2,3,4] },

        // المستقبل والأمل (91-100)
        { id: 91, text: 'كيف ترى مستقبلك بعد التعافي؟', options: ['مشرق جداً', 'مشرق', 'محايد', 'غامض', 'مظلم'], scores: [0,1,2,3,4] },
        { id: 92, text: 'هل وضعت خطة واضحة للـ 30 يوماً القادمة؟', options: ['خطة واضحة ومكتوبة', 'خطة واضحة', 'خطة تقريبية', 'لا خطة', 'لا أعرف'], scores: [0,1,2,3,4] },
        { id: 93, text: 'هل تؤمن أن التعافي الكامل ممكن؟', options: ['ممكن جداً', 'ممكن', 'ربما', 'صعب', 'مستحيل'], scores: [0,1,2,3,4] },
        { id: 94, text: 'هل تعتقد أنك ستصبح شخصاً أفضل بعد التعافي؟', options: ['بكل تأكيد', 'نعم', 'ربما', 'لا أعتقد', 'لن أتغير'], scores: [0,1,2,3,4] },
        { id: 95, text: 'كيف تقيم أملك في الحياة؟', options: ['أمل كبير', 'أمل', 'محايد', 'أمل ضعيف', 'لا أمل'], scores: [0,1,2,3,4] },
        { id: 96, text: 'هل تشارك تجربتك في التعافي مع الآخرين؟', options: ['أشارك دائماً', 'أشارك', 'أشارك أحياناً', 'لا أشارك', 'أخجل من المشاركة'], scores: [0,1,2,3,4] },
        { id: 97, text: 'هل تعتقد أنك تستطيع مساعدة الآخرين في التعافي؟', options: ['أستطيع كثيراً', 'أستطيع', 'ربما', 'لا أستطيع', 'لا أريد'], scores: [0,1,2,3,4] },
        { id: 98, text: 'كيف تقيم استعدادك للتغيير الإيجابي؟', options: ['مستعد جداً', 'مستعد', 'محايد', 'غير مستعد', 'أرفض التغيير'], scores: [0,1,2,3,4] },
        { id: 99, text: 'هل تشعر بالحماس لمواصلة رحلة التعافي؟', options: ['متحمس جداً', 'متحمس', 'محايد', 'فاتر', 'لا حماس'], scores: [0,1,2,3,4] },
        { id: 100, text: 'ما هو تقييمك العام لرحلتك في التعافي حتى الآن؟', options: ['ممتازة', 'جيدة', 'متوسطة', 'ضعيفة', 'فاشلة'], scores: [0,1,2,3,4] }
    ],
    
    results: [
        { min: 0, max: 8, level: 'ممتاز', color: '#4CAF50', icon: 'fa-star',
          advice: 'أنت في حالة ممتازة! استمر على هذا المنوال، فأنت على طريق التعافي الكامل. قوة إرادتك واضحة ونتائجك مبهرة.' },
        { min: 9, max: 16, level: 'جيد جداً', color: '#8BC34A', icon: 'fa-thumbs-up',
          advice: 'أنت تسير في الطريق الصحيح. هناك بعض النقاط التي تحتاج تحسيناً بسيطاً. استمر في عباداتك ورياضتك.' },
        { min: 17, max: 25, level: 'جيد', color: '#FFC107', icon: 'fa-smile',
          advice: 'أداؤك جيد لكن هناك مجال للتحسين. حاول زيادة الأنشطة الإيجابية والتركيز على الأذكار اليومية.' },
        { min: 26, max: 34, level: 'متوسط', color: '#FF9800', icon: 'fa-exclamation-circle',
          advice: 'أنت في منتصف الطريق. ركز على تقوية إرادتك وزيادة العبادات. لا تيأس - الانتكاسات جزء من الرحلة.' },
        { min: 35, max: 44, level: 'يحتاج انتباه', color: '#F44336', icon: 'fa-exclamation-triangle',
          advice: 'مستوى الخطر مرتفع. ننصحك بمراجعة خطة التعافي وزيادة الدعم. تواصل مع مختص إذا لزم الأمر.' },
        { min: 45, max: 60, level: 'خطر', color: '#B71C1C', icon: 'fa-skull',
          advice: 'أنت تمر بمرحلة صعبة. لا تواجه هذا الطريق وحدك. اطلب المساعدة من مختص وفعّل خطة التعافي فوراً.' }
    ]
};

// ==================== المتغيرات ====================
var selectedQuestions = [];
var currentQuestion = 0;
var answers = [];
var quizActive = false;
var quizHistory = [];

// ==================== الدوال الرئيسية ====================

function getRandomQuestions(count) {
    var pool = QuizData.allQuestions.slice();
    var result = [];
    
    // خلط الأسئلة
    for (var i = pool.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = pool[i];
        pool[i] = pool[j];
        pool[j] = temp;
    }
    
    // اختيار أول count سؤال
    for (var k = 0; k < count && k < pool.length; k++) {
        result.push(pool[k]);
    }
    
    return result;
}

function renderQuizPage() {
    var mainContent = document.getElementById('main-content');
    currentQuestion = 0;
    answers = [];
    quizActive = true;
    
    // ✅ اختيار 15 سؤال عشوائي
    selectedQuestions = getRandomQuestions(15);
    
    // تحميل التاريخ السابق
    quizHistory = StorageManager.get('quiz_history') || [];
    
    mainContent.innerHTML = `
        <div class="animate-fade-in">
            <h1 class="heading-underline">
                <i class="fas fa-clipboard-check" style="margin-left: 8px;"></i>
                تقييم ذاتي
            </h1>
            <p class="text-secondary mb-2">${selectedQuestions.length} سؤال عشوائي من أصل 100 سؤال</p>
            <p style="font-size: 11px; color: var(--text-tertiary); margin-bottom: 16px;">
                <i class="fas fa-random" style="margin-left: 4px;"></i> الأسئلة تتغير في كل مرة
            </p>
            
            <div id="quiz-container">
                <div id="quiz-progress" style="margin-bottom: 20px;">
                    <div style="background: var(--border-light); border-radius: 10px; height: 6px;">
                        <div id="quiz-progress-bar" style="background: #4CAF50; height: 100%; border-radius: 10px; width: 0%; transition: width 0.3s;"></div>
                    </div>
                    <p style="text-align: center; font-size: 13px; color: var(--text-tertiary); margin-top: 8px;">
                        السؤال <span id="current-q">1</span> من ${selectedQuestions.length}
                    </p>
                </div>
                
                <div id="quiz-question" class="card"></div>
                <div id="quiz-result" style="display: none;"></div>
            </div>
            
            <!-- التاريخ السابق -->
            ${quizHistory.length > 0 ? `
                <div class="card" style="margin-top: 24px;">
                    <h3 style="margin-bottom: 12px;"><i class="fas fa-history" style="margin-left: 6px;"></i> آخر التقييمات</h3>
                    ${quizHistory.slice(-5).reverse().map(function(h, i) {
                        return `
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border-light);">
                                <span style="font-size: 13px;">${h.date}</span>
                                <span style="font-weight: 600; color: ${h.color || '#4CAF50'};">${h.score} نقطة - ${h.level}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            ` : ''}
        </div>
    `;
    
    showQuestion();
}

function showQuestion() {
    if (currentQuestion >= selectedQuestions.length) {
        showQuizResult();
        return;
    }
    
    var q = selectedQuestions[currentQuestion];
    var container = document.getElementById('quiz-question');
    var progress = document.getElementById('quiz-progress-bar');
    var currentQ = document.getElementById('current-q');
    
    if (progress) progress.style.width = ((currentQuestion / selectedQuestions.length) * 100) + '%';
    if (currentQ) currentQ.textContent = currentQuestion + 1;
    
    container.innerHTML = `
        <h3 style="margin-bottom: 20px;">${q.text}</h3>
        <div style="display: flex; flex-direction: column; gap: 10px;">
            ${q.options.map(function(opt, i) {
                return `
                    <button class="btn btn-outline quiz-option" onclick="selectAnswer(${i})" style="text-align: right; justify-content: flex-start;">
                        <span style="margin-left: 8px;">${i + 1}.</span> ${opt}
                    </button>
                `;
            }).join('')}
        </div>
    `;
}

function selectAnswer(index) {
    var q = selectedQuestions[currentQuestion];
    answers.push(q.scores[index]);
    currentQuestion++;
    
    var container = document.getElementById('quiz-question');
    container.style.opacity = '0';
    container.style.transform = 'translateX(-20px)';
    
    setTimeout(function() {
        container.style.opacity = '1';
        container.style.transform = 'translateX(0)';
        showQuestion();
    }, 300);
}

function showQuizResult() {
    quizActive = false;
    var totalScore = answers.reduce(function(a, b) { return a + b; }, 0);
    var maxScore = selectedQuestions.length * 4;
    var percent = Math.round((totalScore / maxScore) * 100);
    
    // تحديد المستوى
    var result = QuizData.results.find(function(r) {
        return totalScore >= r.min && totalScore <= r.max;
    });
    if (!result) result = QuizData.results[QuizData.results.length - 1];
    
    var container = document.getElementById('quiz-result');
    var questionDiv = document.getElementById('quiz-question');
    var progressDiv = document.getElementById('quiz-progress');
    
    if (questionDiv) questionDiv.style.display = 'none';
    if (progressDiv) progressDiv.style.display = 'none';
    container.style.display = 'block';
    
    // ✅ إحصائيات الفئات
    var categories = {
        'الرغبة والتحكم': { total: 0, count: 0 },
        'المزاج والصحة النفسية': { total: 0, count: 0 },
        'النوم والصحة الجسدية': { total: 0, count: 0 },
        'العبادة والروحانيات': { total: 0, count: 0 },
        'العلاقات الاجتماعية': { total: 0, count: 0 },
        'الإنتاجية والتطوير': { total: 0, count: 0 },
        'المستقبل والأمل': { total: 0, count: 0 }
    };
    
    selectedQuestions.forEach(function(q, i) {
        var cat = getCategoryName(q.id);
        if (categories[cat]) {
            categories[cat].total += q.scores[answers[i]];
            categories[cat].count++;
        }
    });
    
    // بناء HTML الفئات
    var categoryHTML = '';
    for (var cat in categories) {
        if (categories[cat].count > 0) {
            var avg = Math.round((categories[cat].total / categories[cat].count) * 10);
            var catColor = avg <= 2 ? '#4CAF50' : avg <= 3 ? '#FF9800' : '#F44336';
            var catLabel = avg <= 2 ? 'جيد' : avg <= 3 ? 'متوسط' : 'يحتاج عمل';
            categoryHTML += `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border-light);">
                    <span style="font-size: 13px;">${cat}</span>
                    <span style="font-weight: 600; color: ${catColor}; font-size: 12px;">${avg}/40 - ${catLabel}</span>
                </div>
            `;
        }
    }
    
    container.innerHTML = `
        <div class="card" style="text-align: center;">
            <i class="fas ${result.icon}" style="font-size: 60px; color: ${result.color}; margin-bottom: 16px;"></i>
            <h2 style="color: ${result.color}; margin-bottom: 8px;">${result.level}</h2>
            <p style="color: var(--text-secondary); margin-bottom: 20px; line-height: 1.8;">${result.advice}</p>
            
            <!-- النتيجة الرئيسية -->
            <div style="background: var(--surface-variant); padding: 20px; border-radius: var(--radius-lg); margin-bottom: 12px;">
                <div style="font-size: 40px; font-weight: 700; color: ${result.color};">${totalScore}</div>
                <div style="font-size: 14px; color: var(--text-tertiary);">من ${maxScore} نقطة (${percent}%)</div>
            </div>
            
            <!-- شريط التقدم -->
            <div style="margin-bottom: 20px;">
                <div style="background: var(--border-light); border-radius: 10px; height: 8px; overflow: hidden;">
                    <div style="width: ${percent}%; height: 100%; background: ${result.color}; border-radius: 10px; transition: width 1s ease;"></div>
                </div>
            </div>
            
            <!-- تحليل الفئات -->
            <div class="card" style="background: var(--surface-variant); text-align: right; margin-bottom: 16px;">
                <h4 style="margin-bottom: 12px; text-align: center;">تحليل مفصل</h4>
                ${categoryHTML}
            </div>
            
            <!-- مقارنة بالتقييم السابق -->
            ${quizHistory.length > 1 ? `
                <div style="background: #E3F2FD; padding: 12px; border-radius: 12px; margin-bottom: 16px; text-align: center;">
                    <p style="font-size: 12px; color: #1565C0;">
                        <i class="fas fa-chart-line" style="margin-left: 4px;"></i>
                        ${totalScore < quizHistory[quizHistory.length - 2].score ? '⬇️ تحسن! نتيجتك أقل من المرة السابقة (' + quizHistory[quizHistory.length - 2].score + ')' : totalScore > quizHistory[quizHistory.length - 2].score ? '⬆️ ارتفعت نتيجتك عن المرة السابقة (' + quizHistory[quizHistory.length - 2].score + ')' : '➡️ نتيجتك ثابتة مثل المرة السابقة'}
                    </p>
                </div>
            ` : ''}
            
            <button class="btn btn-primary" onclick="renderQuizPage()">
                <i class="fas fa-redo"></i> إعادة الاختبار (أسئلة جديدة)
            </button>
            
            <p style="font-size: 11px; color: var(--text-tertiary); margin-top: 12px;">
                <i class="fas fa-info-circle" style="margin-left: 4px;"></i>
                في كل مرة تحصل على 15 سؤال مختلف من أصل 100
            </p>
        </div>
    `;
    
    // ✅ حفظ النتيجة
    var record = {
        score: totalScore,
        maxScore: maxScore,
        percent: percent,
        level: result.level,
        color: result.color,
        date: new Date().toLocaleDateString('ar-SA', { weekday: 'short', month: 'short', day: 'numeric' }),
        timestamp: new Date().toISOString()
    };
    
    quizHistory.push(record);
    if (quizHistory.length > 50) quizHistory = quizHistory.slice(-50);
    StorageManager.set('quiz_history', quizHistory);
    StorageManager.set('last_quiz', record);
    
    if (typeof XPSystem !== 'undefined') XPSystem.addXP('quiz_complete');
}

function getCategoryName(questionId) {
    if (questionId <= 15) return 'الرغبة والتحكم';
    if (questionId <= 30) return 'المزاج والصحة النفسية';
    if (questionId <= 45) return 'النوم والصحة الجسدية';
    if (questionId <= 60) return 'العبادة والروحانيات';
    if (questionId <= 75) return 'العلاقات الاجتماعية';
    if (questionId <= 90) return 'الإنتاجية والتطوير';
    return 'المستقبل والأمل';
}
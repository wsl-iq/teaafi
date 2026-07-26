class RecoveryCounter {
    static #recoveryData = null;
    
    static init() {
        this.#recoveryData = StorageManager.getRecoveryData();
    }
    
    static startRecovery(habitType) {
        this.#recoveryData = {
            startDate: new Date().toISOString(),
            habitType: habitType,
            relapses: []
        };
        StorageManager.saveRecoveryData(this.#recoveryData);
        return this.#recoveryData;
    }
    
    static resetRecovery() {
        this.#recoveryData = {
            startDate: null,
            habitType: null,
            relapses: []
        };
        StorageManager.saveRecoveryData(this.#recoveryData);
    }
    
    static addRelapse() {
        if (!this.#recoveryData?.startDate) return;
        this.#recoveryData.relapses.push({
            date: new Date().toISOString()
        });
        StorageManager.saveRecoveryData(this.#recoveryData);
    }
    
    static getTimeSinceStart() {
        if (!this.#recoveryData?.startDate) {
            return {
                seconds: 0, minutes: 0, hours: 0,
                days: 0, weeks: 0, months: 0, years: 0,
                totalSeconds: 0, totalMinutes: 0, totalHours: 0,
                totalDays: 0, totalWeeks: 0, totalMonths: 0
            };
        }
        
        const start = new Date(this.#recoveryData.startDate);
        const now = new Date();
        const diffMs = now - start;
        
        const totalSeconds = Math.floor(diffMs / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        const totalDays = Math.floor(totalHours / 24);
        const totalWeeks = Math.floor(totalDays / 7);
        const totalMonths = Math.floor(totalDays / 30.4375);
        const totalYears = Math.floor(totalDays / 365.25);
        
        const seconds = totalSeconds % 60;
        const minutes = totalMinutes % 60;
        const hours = totalHours % 24;
        const days = totalDays;
        const weeks = totalWeeks;
        const months = totalMonths;
        const years = totalYears;
        
        return {
            seconds, minutes, hours,
            days, weeks, months, years,
            totalSeconds, totalMinutes, totalHours,
            totalDays, totalWeeks, totalMonths
        };
    }
    
    static getRecoveryStats() {
        const time = this.getTimeSinceStart();
        return {
            ...time,
            relapses: this.#recoveryData?.relapses?.length || 0,
            habitType: this.#recoveryData?.habitType || null,
            isActive: !!this.#recoveryData?.startDate
        };
    }
    
    static getMotivationalMessage() {
        const stats = this.getRecoveryStats();
        const habitType = this.#recoveryData?.habitType;
        const days = stats.totalDays;
        const hours = stats.totalHours;
        const minutes = stats.totalMinutes;
        
        // رسائل حسب نوع العادة
        const messages = {
            masturbation: this.#getMasturbationMessages(days, hours, minutes),
            smoking: this.#getSmokingMessages(days, hours, minutes),
            pornography: this.#getPornographyMessages(days, hours, minutes)
        };
        
        const habitMessages = messages[habitType] || messages.masturbation;
        
        // اختيار الرسالة المناسبة حسب المدة
        if (days < 1) {
            return habitMessages.firstDay[Math.floor(Math.random() * habitMessages.firstDay.length)];
        } else if (days < 3) {
            return habitMessages.firstThreeDays[Math.floor(Math.random() * habitMessages.firstThreeDays.length)];
        } else if (days < 7) {
            return habitMessages.firstWeek[Math.floor(Math.random() * habitMessages.firstWeek.length)];
        } else if (days < 14) {
            return habitMessages.secondWeek[Math.floor(Math.random() * habitMessages.secondWeek.length)];
        } else if (days < 30) {
            return habitMessages.firstMonth[Math.floor(Math.random() * habitMessages.firstMonth.length)];
        } else if (days < 60) {
            return habitMessages.secondMonth[Math.floor(Math.random() * habitMessages.secondMonth.length)];
        } else if (days < 90) {
            return habitMessages.thirdMonth[Math.floor(Math.random() * habitMessages.thirdMonth.length)];
        } else if (days < 180) {
            return habitMessages.sixMonths[Math.floor(Math.random() * habitMessages.sixMonths.length)];
        } else if (days < 365) {
            return habitMessages.oneYear[Math.floor(Math.random() * habitMessages.oneYear.length)];
        } else {
            return habitMessages.plusYear[Math.floor(Math.random() * habitMessages.plusYear.length)];
        }
    }
    
    static #getMasturbationMessages(days, hours, minutes) {
        return {
            firstDay: [
                'كل ثانية تمر هي انتصار جديد.. أنت أقوى مما تتخيل',
                'البداية دائماً هي الأصعب.. استمر فأنت على الطريق الصحيح',
                'كل لحظة مقاومة تقويك وتحررك أكثر',
                'لا تستسلم للرغبة المؤقتة.. فكر في الحرية الدائمة'
            ],
            firstThreeDays: [
                'دماغك بدأ يستعيد توازنه الكيميائي.. استمر',
                'الأيام الأولى هي الأصعب لكنها ستمر.. كن قوياً',
                'كل ساعة تمر بدون انتكاسة تقربك من التعافي الكامل',
                'تذكر أن الألم مؤقت لكن النصر دائم'
            ],
            firstWeek: [
                'أسبوع كامل من القوة والإرادة.. أحسنت!',
                'بدأت تستعيد السيطرة على حياتك.. فخور بك',
                'التستوستيرون يرتفع والثقة تزداد.. لاحظ الفرق',
                'أسبوع من التعافي يعني أنك جاد في التغيير'
            ],
            secondWeek: [
                'أسبوعان من الحرية.. كيف تشعر الآن؟',
                'دماغك يتعافى والتركيز يتحسن يوماً بعد يوم',
                'قوة إرادتك تزداد مع كل يوم يمر.. أنت بطل',
                'لم تعد عبداً للعادة.. أنت حر الآن'
            ],
            firstMonth: [
                'شهر كامل من التعافي.. هذه بداية حياة جديدة',
                'صحتك النفسية والجسدية تتحسن بشكل ملحوظ',
                'نظام الدوبامين في دماغك عاد لطبيعته تقريباً',
                'شهر من الانتصار.. تستحق أن تفخر بنفسك'
            ],
            secondMonth: [
                'شهران وأنت تسير في طريق النور.. ما أروعك',
                'لم تعد العادة جزءاً من حياتك.. لقد تحررت',
                'ثقتك بنفسك في أعلى مستوياتها.. وهذا واضح',
                'شهران من التعافي غيرا حياتك للأفضل'
            ],
            thirdMonth: [
                'ثلاثة أشهر.. لقد أثبت لنفسك أنك قادر على التغيير',
                '90 يوماً من الحرية.. أنت الآن شخص مختلف',
                'التعافي أصبح أسلوب حياة وليس مجرد هدف',
                'ثلاثة أشهر كاملة.. أنت مصدر إلهام لغيرك'
            ],
            sixMonths: [
                'ستة أشهر من التعافي.. حياتك تغيرت بالكامل',
                'لم تعد تفكر في العادة أصلاً.. لقد أصبحت ماضياً',
                'نصف عام من القوة.. أنت الآن سيد نفسك',
                'ستة أشهر أثبتت أنك صاحب إرادة لا تقهر'
            ],
            oneYear: [
                'سنة كاملة من التعافي.. هذه حياة جديدة تماماً',
                '365 يوماً من الحرية.. أنت تستحق الاحتفال',
                'سنة مرت وكأنها حلم.. والآن أنت في الواقع الجميل',
                'أنت الآن نموذج يحتذى به في رحلة التعافي'
            ],
            plusYear: [
                'أكثر من سنة من التعافي.. أنت أسطورة حقيقية',
                'لقد بنيت حياة جديدة خالية من العادات الضارة',
                'رحلتك الملهمة تثبت أن التغيير ممكن للجميع',
                'أنت تعيش الآن أفضل نسخة من نفسك.. استمر'
            ]
        };
    }
    
    static #getSmokingMessages(days, hours, minutes) {
        return {
            firstDay: [
                'كل سيجارة ترفضها تطيل عمرك وتنقي رئتيك',
                'أول يوم بدون تدخين.. جسمك بدأ رحلة التنظيف',
                'كل دقيقة بدون نيكوتين هي استثمار في صحتك',
                'الانسحاب صعب لكنه مؤقت.. الحرية دائمة'
            ],
            firstThreeDays: [
                'النيكوتين يغادر جسدك.. تشبث بقرارك',
                'رئتاك بدأتا بتنظيف نفسيهما.. أحسنت',
                'الأيام الثلاثة الأولى هي الأصعب.. وقد اجتزتها',
                'ضغط الدم يعود لطبيعته.. جسمك يشكرك'
            ],
            firstWeek: [
                'أسبوع بدون تدخين.. حاسة الشم والتذوق تتحسنان',
                'تنفسك أصبح أسهل.. لاحظ الفرق في صعود الدرج',
                'قلبك ورئتاك في حالة تحسن مستمر.. استمر',
                'أسبوع كامل وفرت فيه مالاً وصحة.. أنت رابح'
            ],
            secondWeek: [
                'أسبوعان بدون سجائر.. بشرتك أصبحت أكثر نضارة',
                'السعال بدأ يختفي.. رئتاك تنظفان نفسيهما',
                'لم تعد عبداً للسيجارة.. أنت حر وقوي',
                'الدورة الدموية تتحسن.. طاقتك في ازدياد'
            ],
            firstMonth: [
                'شهر بدون تدخين.. خطر أمراض القلب بدأ ينخفض',
                'وفرت مالاً كثيراً هذا الشهر.. كافئ نفسك بشيء مفيد',
                'رئتاك استعادتا 30% من وظيفتهما.. كم هذا رائع',
                'شهر كامل وأنت تستنشق الحرية بدل السموم'
            ],
            secondMonth: [
                'شهران بدون تدخين.. لياقتك البدنية تحسنت كثيراً',
                'لم تعد تفكر في السجائر.. لقد تحررت حقاً',
                'جهازك التنفسي في أفضل حالاته منذ سنوات',
                'شهران من الصحة والنقاء.. حياتك أجمل'
            ],
            thirdMonth: [
                'ثلاثة أشهر.. انخفض خطر الجلطات بشكل كبير',
                '90 يوماً بدون نيكوتين.. أنت الآن غير مدخن',
                'الدورة الدموية في أفضل حال.. بشرتك تشع نضارة',
                'ثلاثة أشهر من الحرية.. أنت بطل حقيقي'
            ],
            sixMonths: [
                'ستة أشهر.. رئتاك نظيفتان تقريباً.. أحسنت',
                'نصف عام بدون تدخين.. عمرك البيولوجي انخفض',
                'لم تعد مدمناً.. أنت حر تماماً من النيكوتين',
                'ستة أشهر أضفتها إلى عمرك.. استثمار رابح'
            ],
            oneYear: [
                'سنة كاملة بدون تدخين.. خطر السرطان انخفض للنصف',
                '365 يوماً من الهواء النقي.. رئتاك مثل الذهب',
                'سنة مرت وأنت تستنشق الحياة بدل الموت',
                'أنت الآن قدوة لكل من يريد الإقلاع عن التدخين'
            ],
            plusYear: [
                'أكثر من سنة.. لقد انتصرت على إدمان النيكوتين',
                'جسمك نسي تماماً طعم السجائر.. أنت نظيف',
                'سنوات من الصحة أضفتها لحياتك.. أنت تستحق الحياة',
                'قصتك مع الإقلاع ملهمة.. شاركها مع الآخرين'
            ]
        };
    }
    
    static #getPornographyMessages(days, hours, minutes) {
        return {
            firstDay: [
                'كل صورة ترفض النظر إليها تقوي إرادتك',
                'دماغك بدأ رحلة التعافي من الإباحية.. استمر',
                'أول يوم بدون محتوى إباحي.. أنت في الطريق الصحيح',
                'نظرتك للجنس الآخر بدأت تستعيد طبيعتها'
            ],
            firstThreeDays: [
                'دماغك يعيد برمجة نفسه.. كن صبوراً مع نفسك',
                'الأيام الأولى صعبة لكنها أساس التعافي',
                'كل ساعة بدون إباحية تقوي دوائر دماغك السليمة',
                'بدأت ترى العالم بوضوح أكثر.. بعيداً عن التشوهات'
            ],
            firstWeek: [
                'أسبوع من الصفاء الذهني.. أحسنت الاختيار',
                'نظرتك للعلاقات أصبحت أكثر واقعية وصحية',
                'دماغك يتخلص من تأثير الإباحية تدريجياً',
                'أسبوع وأنت تستعيد السيطرة على أفكارك'
            ],
            secondWeek: [
                'أسبوعان وأنت تنظف ذاكرتك من الصور الضارة',
                'بدأت تستمتع بالحياة الطبيعية بعيداً عن الشاشات',
                'علاقاتك الاجتماعية تتحسن.. والناس يلاحظون',
                'ثقتك بنفسك تزداد وأنت تتحرر من هذا الإدمان'
            ],
            firstMonth: [
                'شهر من النقاء.. دماغك يتعافى بشكل ملحوظ',
                'نظرتك للجنس الآخر أصبحت صحية ومتوازنة',
                'استعدت السيطرة على دوافعك.. أنت قوي',
                'شهر كامل وأنت تبني علاقات حقيقية بدل الافتراضية'
            ],
            secondMonth: [
                'شهران من التعافي.. ذاكرتك أصبحت أنظف',
                'لم تعد بحاجة للمحتوى الإباحي.. لقد تحررت',
                'علاقاتك أصبحت أعمق وأكثر صدقاً',
                'شهران من الحرية الذهنية.. أنت إنسان جديد'
            ],
            thirdMonth: [
                'ثلاثة أشهر.. دماغك استعاد توازنه الطبيعي',
                '90 يوماً وأنت ترى الجمال الحقيقي في الحياة',
                'نظرتك للعلاقات الزوجية أصبحت واقعية وصحية',
                'ثلاثة أشهر من التعافي غيرت حياتك للأفضل'
            ],
            sixMonths: [
                'ستة أشهر.. الإباحية أصبحت ذكرى بعيدة',
                'دماغك نظيف تماماً.. أنت الآن حر ذهنياً',
                'علاقاتك الحقيقية أفضل من أي محتوى افتراضي',
                'نصف عام من الصفاء.. أنت فخور بنفسك'
            ],
            oneYear: [
                'سنة من التعافي.. أنت الآن تعيش الحقيقة',
                '365 يوماً بدون إباحية.. نظرتك للحياة طبيعية',
                'سنة مرت وأنت تستمتع بالعلاقات الحقيقية',
                'رحلتك الملهمة تثبت أن التعافي من الإباحية ممكن'
            ],
            plusYear: [
                'أكثر من سنة.. الإباحية لم تعد موجودة في حياتك',
                'أنت تعيش الآن حياة طبيعية مليئة بالعلاقات الصحية',
                'دماغك نسي تماماً تأثير الإباحية.. أنت نظيف',
                'أنت دليل حي على إمكانية التعافي الكامل'
            ]
        };
    }
    
    static getMilestones(stats) {
        const days = stats.totalDays;
        const milestones = [];
        
        // مراحل زمنية مع تحسينات متوقعة
        const stages = [
            {
                time: 'أول 24 ساعة',
                condition: days < 1,
                title: 'بداية الرحلة',
                icon: 'fa-flag-checkered',
                color: '#4CAF50',
                improvements: [
                    'اتخذت أهم قرار في حياتك',
                    'بداية استعادة السيطرة على حياتك',
                    'كل دقيقة تمر هي انتصار جديد'
                ],
                challenges: [
                    'قد تشعر برغبة قوية - هذه طبيعية وستمر',
                    'اشغل وقتك بأنشطة مفيدة',
                    'تذكر لماذا بدأت هذه الرحلة'
                ]
            },
            {
                time: 'بعد 3 أيام (72 ساعة)',
                condition: days >= 3,
                title: 'اجتياز المرحلة الحرجة',
                icon: 'fa-fire',
                color: '#FF9800',
                improvements: [
                    'تجاوزت أصعب فترة في التعافي',
                    'بدء عودة التوازن الكيميائي للدماغ',
                    'زيادة ملحوظة في الثقة بالنفس'
                ],
                challenges: [
                    'الأعراض الانسحابية في ذروتها - ستخف قريباً',
                    'أحلام اليقظة قد تزيد - اشغل نفسك',
                    'تذكر أن هذا مؤقت وسيمر'
                ]
            },
            {
                time: 'بعد أسبوع كامل',
                condition: days >= 7,
                title: 'أول انتصار كبير',
                icon: 'fa-trophy',
                color: '#2196F3',
                improvements: [
                    'تحسن المزاج والتركيز',
                    'نوم أفضل وطاقة متزايدة',
                    'انخفاض كبير في الرغبة'
                ],
                challenges: [
                    'لا تستهين بالإنجاز - أنت بطل',
                    'ابدأ بممارسة الرياضة بانتظام',
                    'كافئ نفسك بشيء صحي'
                ]
            },
            {
                time: 'بعد أسبوعين',
                condition: days >= 14,
                title: 'استقرار التعافي',
                icon: 'fa-chart-line',
                color: '#9C27B0',
                improvements: [
                    'اختفاء معظم الأعراض الانسحابية',
                    'تحسن العلاقات الاجتماعية',
                    'زيادة الإنتاجية في العمل والدراسة'
                ]
            },
            {
                time: 'بعد شهر كامل',
                condition: days >= 30,
                title: 'شهر من الحرية',
                icon: 'fa-medal',
                color: '#E91E63',
                improvements: [
                    'استقرار نفسي وعاطفي',
                    'تحسن الصحة الجسدية',
                    'عادات جديدة إيجابية'
                ]
            },
            {
                time: 'بعد شهرين',
                condition: days >= 60,
                title: 'التعافي المتقدم',
                icon: 'fa-star',
                color: '#00BCD4',
                improvements: [
                    'نادراً ما تفكر في العادة القديمة',
                    'ثقة عالية بالنفس',
                    'حياة اجتماعية أفضل'
                ]
            },
            {
                time: 'بعد 3 أشهر (90 يوماً)',
                condition: days >= 90,
                title: 'التعافي الكامل',
                icon: 'fa-crown',
                color: '#FFD700',
                improvements: [
                    'تحرر كامل من الإدمان السلوكي',
                    'دماغ متوازن كيميائياً',
                    'شخصية أقوى وإرادة صلبة'
                ]
            },
            {
                time: 'بعد 6 أشهر',
                condition: days >= 180,
                title: 'نصف عام من النجاح',
                icon: 'fa-gem',
                color: '#4CAF50',
                improvements: [
                    'نسيت تماماً أنك كنت مدمنًا',
                    'حياة جديدة بالكامل',
                    'أنت مصدر إلهام للآخرين'
                ]
            },
            {
                time: 'بعد سنة كاملة',
                condition: days >= 365,
                title: 'عام من الانتصار',
                icon: 'fa-award',
                color: '#FF5722',
                improvements: [
                    'سنة كاملة من الحرية والصحة',
                    'أفضل نسخة من نفسك',
                    'قصة نجاحك تستحق أن تروى'
                ]
            }
        ];
        
        stages.forEach(stage => {
            if (stage.condition) {
                milestones.push(stage);
            }
        });
        
        return milestones;
    }
}
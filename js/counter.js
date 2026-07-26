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
        
        // Send notification
        NotificationService.sendNotification('بدء رحلة التعافي', {
            body: 'أحسنت! لقد بدأت رحلتك نحو حياة أفضل',
            icon: '/assets/icons/icon-192.png'
        });
        
        return this.#recoveryData;
    }
    
    static resetRecovery() {
        this.#recoveryData = {
            startDate: null,
            habitType: null,
            relapses: []
        };
        
        StorageManager.saveRecoveryData(this.#recoveryData);
        return this.#recoveryData;
    }
    
    static addRelapse() {
        if (!this.#recoveryData.startDate) return;
        
        this.#recoveryData.relapses.push({
            date: new Date().toISOString()
        });
        
        StorageManager.saveRecoveryData(this.#recoveryData);
        return this.#recoveryData;
    }
    
    static getDaysSinceStart() {
        if (!this.#recoveryData?.startDate) return 0;
        
        const start = new Date(this.#recoveryData.startDate);
        const now = new Date();
        const diffTime = Math.abs(now - start);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays;
    }
    
    static getRecoveryStats() {
        const days = this.getDaysSinceStart();
        
        return {
            days: days,
            weeks: Math.floor(days / 7),
            months: Math.floor(days / 30),
            years: Math.floor(days / 365),
            relapses: this.#recoveryData?.relapses?.length || 0,
            habitType: this.#recoveryData?.habitType || null,
            isActive: !!this.#recoveryData?.startDate
        };
    }
    
    static getMilestones(days) {
        const milestones = [];
        
        const stages = [
            {
                days: 1,
                title: 'اليوم الأول',
                psychological: 'بداية الوعي والتصميم على التغيير',
                physical: 'قد تشعر ببعض التوتر والقلق',
                hormonal: 'بدء استجابة الجسم للتغيير',
                withdrawal: 'قد تظهر رغبة قوية - اشغل نفسك بنشاط مفيد'
            },
            {
                days: 3,
                title: 'اليوم الثالث',
                psychological: 'زيادة الثقة بالنفس والشعور بالإنجاز',
                physical: 'تحسن طفيف في الطاقة',
                hormonal: 'بدء توازن الدوبامين',
                withdrawal: 'ذروة الأعراض الانسحابية - استمر في المقاومة'
            },
            {
                days: 7,
                title: 'بعد أسبوع',
                psychological: 'تحسن المزاج وزيادة التركيز',
                physical: 'نوم أفضل ونشاط متزايد',
                hormonal: 'تحسن ملحوظ في توازن الهرمونات',
                withdrawal: 'الأعراض تبدأ في الانخفاض'
            },
            {
                days: 14,
                title: 'بعد أسبوعين',
                psychological: 'صفاء ذهني وثقة أعلى',
                physical: 'طاقة متزايدة وتحسن عام',
                hormonal: 'استقرار هرموني أفضل'
            },
            {
                days: 30,
                title: 'بعد شهر',
                psychological: 'استقرار نفسي وقوة إرادة',
                physical: 'صحة جسدية محسنة',
                hormonal: 'توازن هرموني جيد',
                withdrawal: 'اختفاء معظم الأعراض الانسحابية'
            },
            {
                days: 60,
                title: 'بعد شهرين',
                psychological: 'تغير إيجابي في النظرة للحياة',
                physical: 'نشاط وحيوية عالية',
                hormonal: 'نظام هرموني صحي'
            },
            {
                days: 90,
                title: 'بعد ثلاثة أشهر',
                psychological: 'تحرر نفسي كبير',
                physical: 'صحة ممتازة ولياقة عالية',
                hormonal: 'توازن هرموني مثالي'
            },
            {
                days: 180,
                title: 'بعد ستة أشهر',
                psychological: 'شخصية أقوى وإرادة صلبة',
                physical: 'جسم صحي ونشيط',
                hormonal: 'استقرار هرموني كامل'
            },
            {
                days: 365,
                title: 'بعد سنة',
                psychological: 'تعافي كامل وتحرر نهائي',
                physical: 'صحة متكاملة',
                hormonal: 'نظام هرموني متوازن'
            }
        ];
        
        stages.forEach(stage => {
            if (days >= stage.days) {
                milestones.push(stage);
            }
        });
        
        return milestones;
    }
}
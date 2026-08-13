/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : data
 * File   : exercises.js
 * Type: JavaScript
 */

var EXERCISE_DATA = {
    male: {
        daily: [
            { name: 'المشي السريع', duration: '45 دقيقة', calories: 250, icon: 'fa-walking', level: 'سهل' },
            { name: 'الركض', duration: '30 دقيقة', calories: 350, icon: 'fa-running', level: 'متوسط' },
            { name: 'تمارين حديد', duration: '45 دقيقة', calories: 400, icon: 'fa-dumbbell', level: 'متوسط' },
            { name: 'سباحة', duration: '30 دقيقة', calories: 300, icon: 'fa-swimmer', level: 'متوسط' },
            { name: 'دراجة هوائية', duration: '45 دقيقة', calories: 350, icon: 'fa-bicycle', level: 'سهل' },
            { name: 'تمارين وزن الجسم', duration: '20 دقيقة', calories: 200, icon: 'fa-child', level: 'سهل' },
            { name: 'نط الحبل', duration: '15 دقيقة', calories: 200, icon: 'fa-shoe-prints', level: 'متوسط' },
            { name: 'تمارين بطن', duration: '15 دقيقة', calories: 150, icon: 'fa-circle', level: 'سهل' }
        ],

        weekly: [
            {
                day: 'السبت',
                focus: 'صدر وترايسبس',
                exercises: 'تمارين الضغط 4×12، ضغط البار على الصدر 3×10، تمرين المتوازي للترايسبس 3×12'
            },
            {
                day: 'الأحد',
                focus: 'ظهر وبايسبس',
                exercises: 'العقلة 4×8، سحب الدمبل للظهر 3×12، ثني الذراع بالدمبل 3×12'
            },
            {
                day: 'الاثنين',
                focus: 'أرجل',
                exercises: 'القرفصاء 4×10، الطعنات 3×12، رفع الساق للسمانة 4×15'
            },
            {
                day: 'الثلاثاء',
                focus: 'راحة نشطة',
                exercises: 'مشي 30 دقيقة + تمارين إطالة'
            },
            {
                day: 'الأربعاء',
                focus: 'أكتاف وبطن',
                exercises: 'ضغط الكتف 3×12، تمرين البلانك 3×60 ثانية، تمارين البطن 4×20'
            },
            {
                day: 'الخميس',
                focus: 'كامل الجسم',
                exercises: 'تمرين البربي 4×10، مرجحة الكيتل بيل 3×15، تمرين تسلق الجبل 3×30 ثانية'
            },
            {
                day: 'الجمعة',
                focus: 'كارديو',
                exercises: 'ركض 30 دقيقة + سباحة أو دراجة 20 دقيقة'
            }
        ]
    },

    female: {
        daily: [
            { name: 'المشي السريع', duration: '45 دقيقة', calories: 200, icon: 'fa-walking', level: 'سهل' },
            { name: 'يوغا', duration: '30 دقيقة', calories: 150, icon: 'fa-heart', level: 'سهل' },
            { name: 'بيلاتس', duration: '45 دقيقة', calories: 200, icon: 'fa-circle', level: 'متوسط' },
            { name: 'سباحة', duration: '30 دقيقة', calories: 250, icon: 'fa-swimmer', level: 'متوسط' },
            { name: 'دراجة هوائية', duration: '30 دقيقة', calories: 200, icon: 'fa-bicycle', level: 'سهل' },
            { name: 'تمارين مقاومة خفيفة', duration: '20 دقيقة', calories: 150, icon: 'fa-dumbbell', level: 'سهل' },
            { name: 'زومبا / رقص', duration: '30 دقيقة', calories: 250, icon: 'fa-music', level: 'متوسط' },
            { name: 'تمارين إطالة', duration: '20 دقيقة', calories: 100, icon: 'fa-child', level: 'سهل' }
        ],

        weekly: [
            {
                day: 'السبت',
                focus: 'أرجل ومؤخرة',
                exercises: 'القرفصاء 3×15، رفع الحوض 3×20، الطعنات 3×12'
            },
            {
                day: 'الأحد',
                focus: 'بطن وخصر',
                exercises: 'تمرين البلانك 3×45 ثانية، لف الجذع للبطن 3×20، رفع الساقين 3×15'
            },
            {
                day: 'الاثنين',
                focus: 'كارديو',
                exercises: 'مشي سريع 40 دقيقة + نط حبل 10 دقائق'
            },
            {
                day: 'الثلاثاء',
                focus: 'يوغا واسترخاء',
                exercises: 'يوغا متحركة 30 دقيقة + تأمل 10 دقائق'
            },
            {
                day: 'الأربعاء',
                focus: 'ذراعين وأكتاف',
                exercises: 'دوائر الذراعين 3×20، ضغط الدمبل الخفيف 3×15، تمارين الضغط على الركبتين 3×10'
            },
            {
                day: 'الخميس',
                focus: 'كامل الجسم',
                exercises: 'بيلاتس 30 دقيقة + تمارين مقاومة خفيفة 15 دقيقة'
            },
            {
                day: 'الجمعة',
                focus: 'راحة نشطة',
                exercises: 'مشي 20 دقيقة + تمارين إطالة 15 دقيقة'
            }
        ],

        periodDays: {
            exercises: 'يوغا خفيفة، مشي بطيء، تمارين تنفس - تجنب الرياضة العنيفة والقفز',
            avoid: 'رفع أثقال، تمارين بطن مكثفة، قفز، سباحة في ماء بارد'
        }
    }
};

function getTodayExercise(gender) {
    var today = new Date();

    var dayNames = [
        'الأحد',
        'الاثنين',
        'الثلاثاء',
        'الأربعاء',
        'الخميس',
        'الجمعة',
        'السبت'
    ];

    var dayName = dayNames[today.getDay()];
    var data = EXERCISE_DATA[gender];
    var weeklyPlan = data.weekly.find(function (w) {
        return w.day === dayName;
    });

    var dailySuggestion = data.daily[today.getDay() % data.daily.length];

    return {
        dayName: dayName,
        weekly: weeklyPlan,
        daily: dailySuggestion
    };
}


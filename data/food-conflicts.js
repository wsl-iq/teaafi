// Taeafi Food Conflicts Database v1.0

var FOOD_CONFLICTS = [
    { combo: 'حليب + ليمون / برتقال', effect: 'تخثر الحليب في المعدة وعسر هضم', severity: 'عالي' },
    { combo: 'سمك + لبن / زبادي', effect: 'اضطرابات هضمية وحساسية جلدية', severity: 'عالي' },
    { combo: 'لحم + نشويات بكثرة', effect: 'تخمر في المعدة وانتفاخ', severity: 'متوسط' },
    { combo: 'فواكه بعد الأكل مباشرة', effect: 'تخمر الفواكه في المعدة وغازات', severity: 'متوسط' },
    { combo: 'شاي بعد الأكل مباشرة', effect: 'يمنع امتصاص الحديد', severity: 'متوسط' },
    { combo: 'بيض + سمك', effect: 'تفاعل بروتيني يسبب حساسية', severity: 'عالي' },
    { combo: 'موز + حليب', effect: 'ثقيل على المعدة ويسبب خمول', severity: 'متوسط' },
    { combo: 'خيار + طماطم', effect: 'تفاعل حمضي يسبب غازات', severity: 'منخفض' },
    { combo: 'عسل + ماء ساخن جداً', effect: 'يفقد العسل خواصه العلاجية', severity: 'منخفض' },
    { combo: 'لحم + خل', effect: 'يعيق هضم البروتين', severity: 'متوسط' },
    { combo: 'بطيخ + ماء بارد', effect: 'مغص وإسهال', severity: 'عالي' },
    { combo: 'رز + سمك + ليمون', effect: 'آمن وصحي ✓', severity: 'آمن' },
    { combo: 'دجاج + خضار مشكلة', effect: 'آمن وصحي ✓', severity: 'آمن' },
    { combo: 'بيض + خبز أسمر + أفوكادو', effect: 'آمن وصحي ✓', severity: 'آمن' },
    { combo: 'شوفان + موز + عسل', effect: 'آمن ومغذي ✓', severity: 'آمن' }
];

function checkFoodConflict(mealText) {
    var conflicts = [];
    
    FOOD_CONFLICTS.forEach(function(item) {
        var ingredients = item.combo.split('+');
        var hasAll = true;
        
        for (var i = 0; i < ingredients.length; i++) {
            if (!mealText.includes(ingredients[i].trim())) {
                hasAll = false;
                break;
            }
        }
        
        if (hasAll && item.severity !== 'آمن') {
            conflicts.push(item);
        }
    });
    
    return conflicts;
}
/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : data
 * File   : nutrition.js
 * Type: JavaScript
 */

var NUTRITION_DATA = {
    breakfast: {
        male: [
            { day: 1, meal: 'بيض مسلوق (3 حبات) + خبز أسمر + زيتون (5 حبات) + كوب حليب', calories: 450, protein: '30g', budget: 'اقتصادي' },
            { day: 2, meal: 'جبنة بيضاء قليلة الدسم + خبز توست أسمر + طماطم + شاي أخضر', calories: 350, protein: '22g', budget: 'اقتصادي' },
            { day: 3, meal: 'فول مدمس بزيت الزيتون + بيضة مسلوقة + خبز أسمر + فلفل أخضر', calories: 420, protein: '25g', budget: 'اقتصادي' },
            { day: 4, meal: 'شوفان بالحليب والعسل + موز + مكسرات (لوز وجوز)', calories: 480, protein: '18g', budget: 'متوسط' },
            { day: 5, meal: 'عجة بيض بالخضار (3 بيضات) + خبز أسمر + زبادي', calories: 460, protein: '32g', budget: 'اقتصادي' },
            { day: 6, meal: 'حمص بالطحينة + زيت زيتون + خبز أسمر + خيار + كوب لبن', calories: 400, protein: '20g', budget: 'اقتصادي' },
            { day: 7, meal: 'بان كيك شوفان + عسل طبيعي + فواكه مشكلة + كوب حليب', calories: 500, protein: '20g', budget: 'متوسط' },
            { day: 8, meal: 'بيض مقلي بزيت الزيتون (3 حبات) + فلافل (3 حبات) + خبز أسمر + سلطة', calories: 520, protein: '28g', budget: 'اقتصادي' },
            { day: 9, meal: 'توست جبنة مشوي + بيض مسلوق + شرائح أفوكادو + شاي أخضر', calories: 440, protein: '26g', budget: 'متوسط' },
            { day: 10, meal: 'كورن فليكس بالحليب + موز + عسل + مكسرات', calories: 420, protein: '15g', budget: 'متوسط' },
            { day: 11, meal: 'مناقيش زعتر بالجبنة + خيار + طماطم + كوب لبن', calories: 480, protein: '22g', budget: 'اقتصادي' },
            { day: 12, meal: 'شكشوكة (3 بيضات) + خبز أسمر + زيتون أسود', calories: 430, protein: '28g', budget: 'اقتصادي' },
            { day: 13, meal: 'سموذي بروتين (حليب + موز + شوفان + زبدة فول سوداني)', calories: 500, protein: '25g', budget: 'متوسط' },
            { day: 14, meal: 'بيض مسلوق (2) + جبنة حلوم مشوي + خبز أسمر + زعتر', calories: 460, protein: '30g', budget: 'متوسط' },
            { day: 15, meal: 'فول بالطحينة + بيضة مقلية + خبز أسمر + بصل أخضر', calories: 440, protein: '26g', budget: 'اقتصادي' },
            { day: 16, meal: 'أومليت مشروم وجبنة + خبز توست + عصير برتقال طازج', calories: 420, protein: '28g', budget: 'متوسط' },
            { day: 17, meal: 'لبنة بالزعتر + زيت زيتون + خبز أسمر + طماطم كرزية + شاي', calories: 380, protein: '18g', budget: 'اقتصادي' },
            { day: 18, meal: 'بيض بينديكت + خبز إنجليزي + سلمون مدخن + شاي', calories: 550, protein: '32g', budget: 'مرتفع' },
            { day: 19, meal: 'عصيدة بالتمر والحليب + مكسرات + قرفة', calories: 450, protein: '16g', budget: 'اقتصادي' },
            { day: 20, meal: 'توست فرنسي بالبيض + عسل + فواكه + كوب حليب', calories: 480, protein: '20g', budget: 'متوسط' },
            { day: 21, meal: 'متبل باذنجان + بيض مسلوق + خبز أسمر + زيتون', calories: 400, protein: '22g', budget: 'اقتصادي' },
            { day: 22, meal: 'جرانولا بالحليب والزبادي + توت + عسل', calories: 460, protein: '18g', budget: 'متوسط' },
            { day: 23, meal: 'بيض مخفوق بالطماطم والبصل + خبز أسمر + جبنة بيضاء', calories: 420, protein: '28g', budget: 'اقتصادي' },
            { day: 24, meal: 'ساندويش فلافل + طحينة + خضار + كوب لبن', calories: 500, protein: '24g', budget: 'اقتصادي' },
            { day: 25, meal: 'بطاطا حلوة مشوية + بيض مسلوق + زبادي + قرفة', calories: 440, protein: '20g', budget: 'اقتصادي' },
            { day: 26, meal: 'كريب بالجبنة والزعتر + خضار + كوب حليب', calories: 480, protein: '24g', budget: 'متوسط' },
            { day: 27, meal: 'بيض مسلوق (3) + حمص + خبز أسمر + مخللات', calories: 450, protein: '30g', budget: 'اقتصادي' },
            { day: 28, meal: 'تشيا بودينغ بالحليب + فواكه + عسل + لوز', calories: 420, protein: '16g', budget: 'متوسط' },
            { day: 29, meal: 'فطائر السبانخ والجبنة + زبادي + خيار', calories: 460, protein: '22g', budget: 'اقتصادي' },
            { day: 30, meal: 'بيض أومليت بالخضار والجبنة + خبز أسمر + عصير برتقال', calories: 450, protein: '30g', budget: 'متوسط' }
        ],
        female: [
            { day: 1, meal: 'بيضة مسلوقة + خبز أسمر + زيتون (3 حبات) + كوب حليب قليل الدسم', calories: 300, protein: '18g', budget: 'اقتصادي' },
            { day: 2, meal: 'جبنة قريش + خيار + خبز توست أسمر + شاي أخضر', calories: 250, protein: '20g', budget: 'اقتصادي' },
            { day: 3, meal: 'شوفان بالحليب + توت + لوز (5 حبات)', calories: 350, protein: '15g', budget: 'متوسط' },
            { day: 4, meal: 'بيض مخفوق بالخضار (بيضتان) + خبز أسمر + زبادي', calories: 320, protein: '22g', budget: 'اقتصادي' },
            { day: 5, meal: 'فول مدمس خفيف + طماطم + خبز أسمر + شاي أعشاب', calories: 280, protein: '16g', budget: 'اقتصادي' },
            { day: 6, meal: 'سموذي موز وشوفان وحليب + تمر (3 حبات)', calories: 380, protein: '14g', budget: 'متوسط' },
            { day: 7, meal: 'توست أفوكادو + بيض مسلوق + رمان + شاي أخضر', calories: 350, protein: '16g', budget: 'متوسط' },
            { day: 8, meal: 'زبادي يوناني + عسل + جوز + توت', calories: 300, protein: '18g', budget: 'متوسط' },
            { day: 9, meal: 'بيضة مسلوقة + جبنة بيضاء + خبز أسمر + خيار', calories: 280, protein: '20g', budget: 'اقتصادي' },
            { day: 10, meal: 'شوفان بالماء والحليب + تفاح مبشور + قرفة', calories: 320, protein: '12g', budget: 'اقتصادي' },
            { day: 11, meal: 'عجة بيض بالخضار (بيضة واحدة) + خبز أسمر + شاي', calories: 280, protein: '18g', budget: 'اقتصادي' },
            { day: 12, meal: 'سموذي سبانخ وتفاح وموز + بيضة مسلوقة', calories: 350, protein: '16g', budget: 'متوسط' },
            { day: 13, meal: 'توست جبنة قريش + عسل + جوز + شاي أعشاب', calories: 320, protein: '18g', budget: 'اقتصادي' },
            { day: 14, meal: 'بيض مسلوق + حمص + خبز أسمر + طماطم', calories: 340, protein: '20g', budget: 'اقتصادي' },
            { day: 15, meal: 'جرانولا بالزبادي + فراولة + عسل', calories: 360, protein: '14g', budget: 'متوسط' },
            { day: 16, meal: 'بيضة مقلية بزيت زيتون + خبز أسمر + أفوكادو', calories: 350, protein: '16g', budget: 'متوسط' },
            { day: 17, meal: 'شوربة عدس صغيرة + خبز أسمر + ليمون', calories: 300, protein: '18g', budget: 'اقتصادي' },
            { day: 18, meal: 'توست زبدة فول سوداني + موز + كوب حليب', calories: 380, protein: '16g', budget: 'اقتصادي' },
            { day: 19, meal: 'بيض مخفوق + مشروم + خبز أسمر + شاي أخضر', calories: 300, protein: '20g', budget: 'اقتصادي' },
            { day: 20, meal: 'فواكه مشكلة + زبادي + عسل + لوز', calories: 320, protein: '14g', budget: 'متوسط' },
            { day: 21, meal: 'لبنة بالزعتر + خبز أسمر + زيتون + خيار', calories: 280, protein: '16g', budget: 'اقتصادي' },
            { day: 22, meal: 'كريب صغير بالجبنة + شاي أعشاب + تفاحة', calories: 340, protein: '14g', budget: 'اقتصادي' },
            { day: 23, meal: 'بيضة مسلوقة + سلطة خضار + خبز أسمر', calories: 280, protein: '18g', budget: 'اقتصادي' },
            { day: 24, meal: 'تشيا بودينغ بالحليب + مانجو + جوز الهند', calories: 350, protein: '12g', budget: 'متوسط' },
            { day: 25, meal: 'عصيدة صغيرة بالحليب والتمر + لوز', calories: 320, protein: '10g', budget: 'اقتصادي' },
            { day: 26, meal: 'بيض مسلوق + جبنة حلوم مشوي + خبز + زعتر', calories: 360, protein: '22g', budget: 'متوسط' },
            { day: 27, meal: 'سموذي بروتين نباتي + تمر + لوز', calories: 340, protein: '16g', budget: 'متوسط' },
            { day: 28, meal: 'توست حمص + خضار + بيضة مسلوقة', calories: 320, protein: '18g', budget: 'اقتصادي' },
            { day: 29, meal: 'زبادي + فواكه + شوفان + عسل', calories: 330, protein: '14g', budget: 'اقتصادي' },
            { day: 30, meal: 'بيض أومليت بالخضار (بيضة واحدة) + خبز أسمر + شاي', calories: 300, protein: '18g', budget: 'اقتصادي' }
        ]
    },
    
    lunch: {
        male: [
            { day: 1, meal: 'صدر دجاج مشوي (200g) + أرز بني + سلطة خضراء', calories: 550, protein: '45g', budget: 'متوسط' },
            { day: 2, meal: 'سمك مشوي + بطاطا حلوة مشوية + بروكلي مطهو', calories: 480, protein: '40g', budget: 'متوسط' },
            { day: 3, meal: 'لحم أحمر مقطع مع خضار + أرز أبيض + سلطة زبادي', calories: 600, protein: '42g', budget: 'مرتفع' },
            { day: 4, meal: 'عدس أصفر + أرز + بصل مقطع + سلطة فتوش', calories: 450, protein: '28g', budget: 'اقتصادي' },
            { day: 5, meal: 'تونة بزيت الزيتون + مكرونة قمح كامل + سلطة', calories: 500, protein: '38g', budget: 'اقتصادي' },
            { day: 6, meal: 'دجاج تكا بالفرن + خبز أسمر + حمص + سلطة', calories: 520, protein: '44g', budget: 'متوسط' },
            { day: 7, meal: 'ستيك لحم مشوي + بطاطا مشوية + فاصوليا خضراء', calories: 650, protein: '50g', budget: 'مرتفع' },
            { day: 8, meal: 'دجاج بالكاري + أرز بسمتي + سلطة خيار ولبن', calories: 580, protein: '42g', budget: 'متوسط' },
            { day: 9, meal: 'سمك فيلية مقلي بالهواء + أرز + خضار سوتيه', calories: 500, protein: '38g', budget: 'متوسط' },
            { day: 10, meal: 'فاصوليا بيضاء باللحم + أرز + سلطة', calories: 550, protein: '40g', budget: 'اقتصادي' },
            { day: 11, meal: 'دجاج مشوي على الفحم + خبز + ثومية + مخلل', calories: 600, protein: '48g', budget: 'متوسط' },
            { day: 12, meal: 'مكرونة بولونيز باللحم المفروم + جبنة بارميزان', calories: 620, protein: '38g', budget: 'متوسط' },
            { day: 13, meal: 'برغل بالدجاج والخضار + سلطة زبادي', calories: 520, protein: '40g', budget: 'اقتصادي' },
            { day: 14, meal: 'سمك مشوي بالليمون والثوم + أرز + سلطة طحينة', calories: 480, protein: '42g', budget: 'متوسط' },
            { day: 15, meal: 'يخنة بامية باللحم + أرز أبيض + سلطة', calories: 500, protein: '35g', budget: 'اقتصادي' },
            { day: 16, meal: 'دجاج محشي بالخضار + بطاطا مهروسة + سلطة', calories: 580, protein: '45g', budget: 'مرتفع' },
            { day: 17, meal: 'شوربة حريرة مغربية + خبز + تمر + لبن', calories: 480, protein: '30g', budget: 'اقتصادي' },
            { day: 18, meal: 'برياني دجاج + سلطة رايتا + خبز نان', calories: 650, protein: '42g', budget: 'مرتفع' },
            { day: 19, meal: 'كفتة مشوية + أرز + سلطة طحينة + بقدونس', calories: 550, protein: '44g', budget: 'متوسط' },
            { day: 20, meal: 'سمك تونة طازج مشوي + بطاطا + سلطة خضراء', calories: 500, protein: '45g', budget: 'مرتفع' },
            { day: 21, meal: 'يخنة سبانخ باللحم + أرز + ليمون', calories: 480, protein: '35g', budget: 'اقتصادي' },
            { day: 22, meal: 'دجاج شيش طاووق + خبز + بطاطا مقلية بالهواء', calories: 600, protein: '46g', budget: 'متوسط' },
            { day: 23, meal: 'فول وعدس مع أرز + سلطة + لبن', calories: 500, protein: '32g', budget: 'اقتصادي' },
            { day: 24, meal: 'لحم بالفرن مع خضار + أرز + سلطة', calories: 620, protein: '48g', budget: 'مرتفع' },
            { day: 25, meal: 'سمك مشوي بالفرن + كينوا + هليون', calories: 480, protein: '42g', budget: 'مرتفع' },
            { day: 26, meal: 'دجاج بالصلصة الحارة + أرز + سلطة كول سلو', calories: 550, protein: '44g', budget: 'متوسط' },
            { day: 27, meal: 'معكرونة بالخضار والجبنة + صدر دجاج مشوي', calories: 580, protein: '40g', budget: 'متوسط' },
            { day: 28, meal: 'يخنة بطاطا باللحم + أرز + سلطة', calories: 520, protein: '36g', budget: 'اقتصادي' },
            { day: 29, meal: 'دجاج مشوي مع الأرز البري + فطر + سلطة', calories: 560, protein: '44g', budget: 'متوسط' },
            { day: 30, meal: 'سمك سلمون مشوي + أرز بني + سبانخ', calories: 550, protein: '42g', budget: 'مرتفع' }
        ],
        female: [
            { day: 1, meal: 'صدر دجاج مشوي (120g) + أرز بني + سلطة خضراء', calories: 380, protein: '30g', budget: 'متوسط' },
            { day: 2, meal: 'سمك فيليه مشوي + كينوا + خضار مشكلة', calories: 350, protein: '28g', budget: 'متوسط' },
            { day: 3, meal: 'شوربة عدس + خبز أسمر + سلطة زبادي وخيار', calories: 320, protein: '20g', budget: 'اقتصادي' },
            { day: 4, meal: 'دجاج مقطع مع خضار سوتيه + أرز بني', calories: 380, protein: '32g', budget: 'متوسط' },
            { day: 5, meal: 'تونة + سلطة أفوكادو + خبز توست أسمر', calories: 350, protein: '25g', budget: 'اقتصادي' },
            { day: 6, meal: 'بيض مسلوق (2) + سلطة نيسواز + زيتون', calories: 340, protein: '22g', budget: 'اقتصادي' },
            { day: 7, meal: 'سمك سلمون مشوي + هليون + أرز بني', calories: 420, protein: '32g', budget: 'مرتفع' },
            { day: 8, meal: 'دجاج بالكاري الخفيف + أرز + سلطة', calories: 380, protein: '30g', budget: 'متوسط' },
            { day: 9, meal: 'شوربة خضار + صدر دجاج + خبز أسمر', calories: 340, protein: '28g', budget: 'اقتصادي' },
            { day: 10, meal: 'سمك مشوي + بطاطا حلوة + سلطة', calories: 360, protein: '30g', budget: 'متوسط' },
            { day: 11, meal: 'سلطة سيزر بالدجاج + خبز محمص', calories: 380, protein: '32g', budget: 'متوسط' },
            { day: 12, meal: 'برغل بالخضار + لحم مفروم قليل + سلطة', calories: 350, protein: '25g', budget: 'اقتصادي' },
            { day: 13, meal: 'دجاج مشوي + خضار مشوية + حمص', calories: 370, protein: '34g', budget: 'متوسط' },
            { day: 14, meal: 'مكرونة قمح كامل + صلصة طماطم + جبنة', calories: 380, protein: '20g', budget: 'اقتصادي' },
            { day: 15, meal: 'سمك بالفرن + أرز + سلطة خضراء', calories: 360, protein: '30g', budget: 'متوسط' },
            { day: 16, meal: 'يخنة بامية + أرز + سلطة', calories: 320, protein: '18g', budget: 'اقتصادي' },
            { day: 17, meal: 'دجاج تكا + سلطة + خبز أسمر', calories: 380, protein: '34g', budget: 'متوسط' },
            { day: 18, meal: 'شوربة عدس + خبز + بيضة مسلوقة', calories: 340, protein: '22g', budget: 'اقتصادي' },
            { day: 19, meal: 'سمك تونة + سلطة كبيرة + زيتون', calories: 330, protein: '28g', budget: 'اقتصادي' },
            { day: 20, meal: 'دجاج مشوي + كينوا + خضار', calories: 370, protein: '32g', budget: 'متوسط' },
            { day: 21, meal: 'فاصوليا باللحم + أرز + سلطة', calories: 360, protein: '25g', budget: 'اقتصادي' },
            { day: 22, meal: 'سلطة دجاج مشوي + أفوكادو + ذرة', calories: 380, protein: '30g', budget: 'متوسط' },
            { day: 23, meal: 'سمك مشوي + بروكلي + بطاطا', calories: 340, protein: '30g', budget: 'متوسط' },
            { day: 24, meal: 'بيض أومليت + سلطة خضراء + خبز', calories: 320, protein: '24g', budget: 'اقتصادي' },
            { day: 25, meal: 'دجاج بالفرن + خضار مشكلة + أرز', calories: 370, protein: '34g', budget: 'متوسط' },
            { day: 26, meal: 'عدس مع أرز + سلطة + لبن', calories: 340, protein: '22g', budget: 'اقتصادي' },
            { day: 27, meal: 'سمك سلمون + سلطة أفوكادو + كينوا', calories: 400, protein: '30g', budget: 'مرتفع' },
            { day: 28, meal: 'دجاج مقطع + خضار سوتيه + أرز بني', calories: 360, protein: '32g', budget: 'متوسط' },
            { day: 29, meal: 'شوربة خضار + خبز + جبنة', calories: 300, protein: '18g', budget: 'اقتصادي' },
            { day: 30, meal: 'تونة + مكرونة + سلطة خضراء', calories: 370, protein: '28g', budget: 'اقتصادي' }
        ]
    },
    
    dinner: {
        male: [
            { day: 1, meal: 'زبادي يوناني + خيار + جبنة بيضاء + بيضة مسلوقة', calories: 300, protein: '25g', budget: 'اقتصادي' },
            { day: 2, meal: 'سلطة تونة + ذرة + خس + طماطم + زيت زيتون', calories: 350, protein: '30g', budget: 'اقتصادي' },
            { day: 3, meal: 'شوربة خضار + خبز محمص + لبنة', calories: 280, protein: '15g', budget: 'اقتصادي' },
            { day: 4, meal: 'أومليت بالخضار + سلطة جانبية + خبز أسمر', calories: 350, protein: '28g', budget: 'اقتصادي' },
            { day: 5, meal: 'جبنة قريش + زيتون + طماطم + خيار + خبز أسمر', calories: 280, protein: '22g', budget: 'اقتصادي' },
            { day: 6, meal: 'سمك مشوي صغير + سلطة خضراء + ليمون', calories: 320, protein: '35g', budget: 'متوسط' },
            { day: 7, meal: 'حمص + فول + زيت زيتون + خبز أسمر + بصل أخضر', calories: 380, protein: '20g', budget: 'اقتصادي' },
            { day: 8, meal: 'بيض مسلوق (2) + سلطة + جبنة + خبز', calories: 320, protein: '26g', budget: 'اقتصادي' },
            { day: 9, meal: 'تونة بزيت الزيتون + سلطة + خبز توست', calories: 340, protein: '30g', budget: 'اقتصادي' },
            { day: 10, meal: 'شوربة دجاج بالشوفان + خبز محمص', calories: 350, protein: '28g', budget: 'اقتصادي' },
            { day: 11, meal: 'جبنة بيضاء + طماطم + خيار + زيتون + خبز', calories: 300, protein: '20g', budget: 'اقتصادي' },
            { day: 12, meal: 'بيض أومليت + فطر + جبنة + سلطة', calories: 360, protein: '28g', budget: 'اقتصادي' },
            { day: 13, meal: 'سلطة دجاج مشوي + ذرة + خس + صلصة خفيفة', calories: 380, protein: '32g', budget: 'متوسط' },
            { day: 14, meal: 'لبنة + زعتر + خبز أسمر + خضار', calories: 280, protein: '18g', budget: 'اقتصادي' },
            { day: 15, meal: 'سمك تونة + حمص + سلطة + خبز', calories: 360, protein: '30g', budget: 'اقتصادي' },
            { day: 16, meal: 'بيض مسلوق + جبنة + سلطة + خبز أسمر', calories: 310, protein: '24g', budget: 'اقتصادي' },
            { day: 17, meal: 'شوربة عدس + خبز + ليمون', calories: 330, protein: '20g', budget: 'اقتصادي' },
            { day: 18, meal: 'زبادي + خيار + نعنع + خبز أسمر', calories: 260, protein: '18g', budget: 'اقتصادي' },
            { day: 19, meal: 'سلطة تونة كبيرة + خبز توست + زيتون', calories: 350, protein: '28g', budget: 'اقتصادي' },
            { day: 20, meal: 'أومليت بيض + خضار + جبنة قريش', calories: 340, protein: '30g', budget: 'اقتصادي' },
            { day: 21, meal: 'فول مدمس + خبز أسمر + طماطم + بصل', calories: 350, protein: '22g', budget: 'اقتصادي' },
            { day: 22, meal: 'جبنة حلوم مشوي + سلطة + خبز', calories: 360, protein: '24g', budget: 'متوسط' },
            { day: 23, meal: 'بيض مخفوق + خضار + خبز توست', calories: 320, protein: '24g', budget: 'اقتصادي' },
            { day: 24, meal: 'سمك مشوي + سلطة + ليمون + زيت زيتون', calories: 330, protein: '32g', budget: 'متوسط' },
            { day: 25, meal: 'حمص + متبل + خبز + خضار', calories: 340, protein: '18g', budget: 'اقتصادي' },
            { day: 26, meal: 'بيض مسلوق + تونة + سلطة + خبز', calories: 350, protein: '30g', budget: 'اقتصادي' },
            { day: 27, meal: 'شوربة خضار + خبز + جبنة', calories: 280, protein: '16g', budget: 'اقتصادي' },
            { day: 28, meal: 'زبادي + مكسرات + عسل + خبز أسمر', calories: 320, protein: '18g', budget: 'اقتصادي' },
            { day: 29, meal: 'سلطة دجاج + أفوكادو + طماطم + خبز', calories: 370, protein: '30g', budget: 'متوسط' },
            { day: 30, meal: 'بيض أومليت + جبنة + زيتون + خبز أسمر', calories: 340, protein: '26g', budget: 'اقتصادي' }
        ],
        female: [
            { day: 1, meal: 'زبادي + خيار + جبنة قريش + شاي أعشاب', calories: 200, protein: '18g', budget: 'اقتصادي' },
            { day: 2, meal: 'سلطة خضراء كبيرة + تونة خفيفة + ليمون', calories: 250, protein: '22g', budget: 'اقتصادي' },
            { day: 3, meal: 'شوربة خضار + توست أسمر + لبنة', calories: 220, protein: '12g', budget: 'اقتصادي' },
            { day: 4, meal: 'بيضة مسلوقة + سلطة أفوكادو + خبز أسمر', calories: 280, protein: '16g', budget: 'متوسط' },
            { day: 5, meal: 'جبنة بيضاء + زيتون + طماطم كرزية + خبز أسمر', calories: 230, protein: '15g', budget: 'اقتصادي' },
            { day: 6, meal: 'سموذي بروتين (حليب + موز + زبدة فول سوداني)', calories: 300, protein: '20g', budget: 'متوسط' },
            { day: 7, meal: 'سلطة حمص + بقدونس + طماطم + زيت زيتون', calories: 280, protein: '14g', budget: 'اقتصادي' },
            { day: 8, meal: 'زبادي + فواكه + شوفان', calories: 250, protein: '14g', budget: 'اقتصادي' },
            { day: 9, meal: 'بيضة مسلوقة + سلطة + خبز أسمر', calories: 240, protein: '18g', budget: 'اقتصادي' },
            { day: 10, meal: 'شوربة خضار + توست + جبنة', calories: 220, protein: '14g', budget: 'اقتصادي' },
            { day: 11, meal: 'جبنة قريش + خيار + طماطم + زيتون', calories: 200, protein: '20g', budget: 'اقتصادي' },
            { day: 12, meal: 'سلطة تونة صغيرة + خبز توست', calories: 260, protein: '22g', budget: 'اقتصادي' },
            { day: 13, meal: 'بيض أومليت خفيف + سلطة + خبز', calories: 270, protein: '20g', budget: 'اقتصادي' },
            { day: 14, meal: 'زبادي + لوز + عسل + شاي', calories: 250, protein: '14g', budget: 'اقتصادي' },
            { day: 15, meal: 'حمص + خضار + خبز أسمر', calories: 260, protein: '14g', budget: 'اقتصادي' },
            { day: 16, meal: 'بيضة مسلوقة + جبنة + سلطة', calories: 240, protein: '20g', budget: 'اقتصادي' },
            { day: 17, meal: 'شوربة عدس صغيرة + خبز', calories: 250, protein: '16g', budget: 'اقتصادي' },
            { day: 18, meal: 'سلطة خضراء + تونة + ليمون', calories: 240, protein: '22g', budget: 'اقتصادي' },
            { day: 19, meal: 'زبادي + خيار + نعنع', calories: 180, protein: '14g', budget: 'اقتصادي' },
            { day: 20, meal: 'جبنة بيضاء + طماطم + خبز أسمر', calories: 220, protein: '16g', budget: 'اقتصادي' },
            { day: 21, meal: 'بيض مسلوق + سلطة + زيتون', calories: 250, protein: '18g', budget: 'اقتصادي' },
            { day: 22, meal: 'سموذي خضار + تفاح + زنجبيل', calories: 220, protein: '8g', budget: 'اقتصادي' },
            { day: 23, meal: 'شوربة خضار + توست + لبنة', calories: 210, protein: '12g', budget: 'اقتصادي' },
            { day: 24, meal: 'سلطة حمص + بقدونس + زيت زيتون', calories: 260, protein: '14g', budget: 'اقتصادي' },
            { day: 25, meal: 'بيضة مسلوقة + خيار + جبنة', calories: 230, protein: '18g', budget: 'اقتصادي' },
            { day: 26, meal: 'زبادي + فواكه + عسل', calories: 240, protein: '12g', budget: 'اقتصادي' },
            { day: 27, meal: 'تونة + سلطة + خبز توست', calories: 260, protein: '22g', budget: 'اقتصادي' },
            { day: 28, meal: 'جبنة قريش + زيتون + خبز أسمر', calories: 220, protein: '20g', budget: 'اقتصادي' },
            { day: 29, meal: 'شوربة دجاج خفيفة + خبز', calories: 250, protein: '20g', budget: 'اقتصادي' },
            { day: 30, meal: 'بيض مخفوق + خضار + خبز أسمر', calories: 270, protein: '18g', budget: 'اقتصادي' }
        ]
    },
    
    forbidden: [
        'السكر الأبيض المكرر',
        'المشروبات الغازية',
        'مشروبات الطاقة',
        'اللحوم المصنعة (نقانق، مرتديلا، هوت دوغ)',
        'الوجبات السريعة المقلية',
        'الدهون المهدرجة (السمن النباتي)',
        'الحلويات الجاهزة (كيك، دونات، بسكويت)',
        'الصلصات الجاهزة (كاتشب، مايونيز)',
        'رقائق البطاطس والشيبس',
        'المقرمشات المقلية',
        'الخبز الأييض المكرر',
        'الأرز الأبيض (بكميات كبيرة)',
        'العصائر المعلبة المحلاة',
        'الشوكولاتة التجارية',
        'الآيس كريم التجاري'
    ],
    
    alternatives: {
        'دجاج': ['تونة', 'بيض', 'جبنة قريش', 'عدس', 'فول'],
        'لحم': ['دجاج', 'سمك', 'بيض', 'فطر', 'حمص'],
        'سمك': ['تونة', 'دجاج', 'بيض', 'روبيان', 'سردين'],
        'بيض': ['جبنة قريش', 'تونة', 'زبادي يوناني', 'حمص'],
        'حليب': ['زبادي', 'لبن', 'جبنة', 'حليب نباتي'],
        'خبز': ['شوفان', 'بطاطا حلوة', 'أرز بني', 'كينوا'],
        'أرز': ['برغل', 'كينوا', 'بطاطا', 'مكرونة قمح كامل']
    },
    
    postMealExercise: {
        breakfast: { male: 'تمارين إطالة 5 دقائق + 10 ضغط', female: 'يوغا صباحية 10 دقائق' },
        lunch: { male: 'مشي 20 دقيقة بعد الأكل بساعة', female: 'مشي 15 دقيقة بعد الأكل بساعة' },
        dinner: { male: 'تمارين تنفس واسترخاء 5 دقائق', female: 'تمدد خفيف 5 دقائق' }
    },
    
    periodDays: {
        meals: 'زيادة الحديد: كبدة دجاج، سبانخ، عدس، تمر، عصير رمان',
        avoid: 'كافيين، مقليات، سكريات، مشروبات باردة',
        exercise: 'يوغا خفيفة، مشي بطيء، تمارين تنفس - تجنب الرياضة العنيفة'
    }
};

function getTodayMeal(mealType, gender) {
    var today = new Date();
    var dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    var dayIndex = (dayOfYear % 30);
    
    var meals = NUTRITION_DATA[mealType][gender];
    if (!meals || meals.length === 0) return null;
    
    var meal = meals.find(function(m) { return m.day === (dayIndex + 1); });
    if (!meal) meal = meals[0];
    
    return {
        ...meal,
        postExercise: NUTRITION_DATA.postMealExercise[mealType][gender],
        date: today.toLocaleDateString('ar-SA', { weekday: 'long', month: 'long', day: 'numeric' })
    };
}

function findAlternative(mealText, budget) {
    var keywords = Object.keys(NUTRITION_DATA.alternatives);
    var foundKeyword = null;
    
    for (var i = 0; i < keywords.length; i++) {
        if (mealText.includes(keywords[i])) {
            foundKeyword = keywords[i];
            break;
        }
    }
    
    if (!foundKeyword) return null;
    
    var alternatives = NUTRITION_DATA.alternatives[foundKeyword];
    var randomAlt = alternatives[Math.floor(Math.random() * alternatives.length)];
    
    return 'بديل مقترح: ' + randomAlt + ' (متوفر بتكلفة ' + (budget || 'اقتصادية') + ')';
}
/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : Pages
 * File   : quiz.js
 * Type: JavaScript
 */

var QuizData = {
    questions: [
        {
            id: 1,
            text: 'كيف تقيم رغبتك في العادة خلال الأسبوع الماضي؟',
            options: ['ضعيفة جداً', 'ضعيفة', 'متوسطة', 'قوية', 'قوية جداً'],
            scores: [0, 1, 2, 3, 4]
        },
        {
            id: 2,
            text: 'كم مرة فكرت في العادة اليوم؟',
            options: ['0 مرات', '1-3 مرات', '4-6 مرات', '7-10 مرات', 'أكثر من 10'],
            scores: [0, 1, 2, 3, 4]
        },
        {
            id: 3,
            text: 'كيف تصف حالتك المزاجية هذا الأسبوع؟',
            options: ['ممتاز', 'جيد', 'متوسط', 'سيء', 'سيء جداً'],
            scores: [0, 1, 2, 3, 4]
        },
        {
            id: 4,
            text: 'هل تشعر بالتحسن مقارنة بالأسبوع الماضي؟',
            options: ['كثيراً', 'نوعاً ما', 'محايد', 'قليلاً', 'لا أشعر بتحسن'],
            scores: [0, 1, 2, 3, 4]
        },
        {
            id: 5,
            text: 'كم مرة مارست الرياضة هذا الأسبوع؟',
            options: ['5 مرات أو أكثر', '3-4 مرات', '1-2 مرات', 'لم أمارس', 'لا أهتم'],
            scores: [0, 1, 2, 3, 4]
        },
        {
            id: 6,
            text: 'هل التزمت بالأذكار والعبادات هذا الأسبوع؟',
            options: ['ملتزم جداً', 'ملتزم', 'أحياناً', 'نادراً', 'لم ألتزم'],
            scores: [0, 1, 2, 3, 4]
        },
        {
            id: 7,
            text: 'كيف تقيم جودة نومك هذا الأسبوع؟',
            options: ['ممتاز', 'جيد', 'متوسط', 'سيء', 'سيء جداً'],
            scores: [0, 1, 2, 3, 4]
        },
        {
            id: 8,
            text: 'هل تشعر بالتفاؤل بشأن مستقبل تعافيك؟',
            options: ['متفائل جداً', 'متفائل', 'محايد', 'قلق', 'متشائم'],
            scores: [0, 1, 2, 3, 4]
        }
    ],
    
    results: [
        { min: 0, max: 8, level: 'ممتاز', color: '#4CAF50', icon: 'fa-star',
          advice: 'أنت في حالة ممتازة! استمر على هذا المنوال، فأنت على طريق التعافي الكامل.' },
        { min: 9, max: 16, level: 'جيد', color: '#8BC34A', icon: 'fa-thumbs-up',
          advice: 'أنت بخير، لكن هناك مجال للتحسين. حاول زيادة الأنشطة الإيجابية.' },
        { min: 17, max: 24, level: 'متوسط', color: '#FF9800', icon: 'fa-exclamation-circle',
          advice: 'أنت في منتصف الطريق. ركز على تقوية إرادتك وزيادة العبادات.' },
        { min: 25, max: 32, level: 'يحتاج انتباه', color: '#F44336', icon: 'fa-exclamation-triangle',
          advice: 'مستوى الخطر مرتفع. ننصحك بمراجعة خطة التعافي وزيادة الدعم.' }
    ]
};

var currentQuestion = 0;
var answers = [];
var quizActive = false;

function renderQuizPage() {
    var mainContent = document.getElementById('main-content');
    currentQuestion = 0;
    answers = [];
    quizActive = true;
    
    mainContent.innerHTML = `
        <div class="animate-fade-in">
            <h1 class="heading-underline">
                <i class="fas fa-clipboard-check" style="margin-left: 8px;"></i>
                تقييم ذاتي
            </h1>
            <p class="text-secondary mb-6">أجب عن الأسئلة التالية لتقييم حالتك الحالية</p>
            
            <div id="quiz-container">
                <div id="quiz-progress" style="margin-bottom: 20px;">
                    <div style="background: var(--border-light); border-radius: 10px; height: 6px;">
                        <div id="quiz-progress-bar" style="background: #4CAF50; height: 100%; border-radius: 10px; width: 0%; transition: width 0.3s;"></div>
                    </div>
                    <p style="text-align: center; font-size: 13px; color: var(--text-tertiary); margin-top: 8px;">
                        السؤال <span id="current-q">1</span> من ${QuizData.questions.length}
                    </p>
                </div>
                
                <div id="quiz-question" class="card"></div>
                
                <div id="quiz-result" style="display: none;"></div>
            </div>
        </div>
    `;
    
    showQuestion();
}

function showQuestion() {
    if (currentQuestion >= QuizData.questions.length) {
        showQuizResult();
        return;
    }
    
    var q = QuizData.questions[currentQuestion];
    var container = document.getElementById('quiz-question');
    var progress = document.getElementById('quiz-progress-bar');
    var currentQ = document.getElementById('current-q');
    
    if (progress) progress.style.width = ((currentQuestion / QuizData.questions.length) * 100) + '%';
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
    var q = QuizData.questions[currentQuestion];
    answers.push(q.scores[index]);
    currentQuestion++;
    
    // أنيميشن انتقال
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
    
    var result = QuizData.results.find(function(r) {
        return totalScore >= r.min && totalScore <= r.max;
    });
    
    var container = document.getElementById('quiz-result');
    var questionDiv = document.getElementById('quiz-question');
    var progressDiv = document.getElementById('quiz-progress');
    
    if (questionDiv) questionDiv.style.display = 'none';
    if (progressDiv) progressDiv.style.display = 'none';
    container.style.display = 'block';
    
    var maxScore = QuizData.questions.length * 4;
    var percent = Math.round((totalScore / maxScore) * 100);
    
    container.innerHTML = `
        <div class="card" style="text-align: center;">
            <i class="fas ${result.icon}" style="font-size: 60px; color: ${result.color}; margin-bottom: 16px;"></i>
            <h2 style="color: ${result.color}; margin-bottom: 8px;">${result.level}</h2>
            <p style="color: var(--text-secondary); margin-bottom: 20px;">${result.advice}</p>
            
            <div style="background: var(--surface-variant); padding: 20px; border-radius: var(--radius-lg); margin-bottom: 20px;">
                <div style="font-size: 40px; font-weight: 700; color: ${result.color};">${totalScore}</div>
                <div style="font-size: 14px; color: var(--text-tertiary);">من ${maxScore} نقطة</div>
            </div>
            
            <button class="btn btn-primary" onclick="renderQuizPage()">
                <i class="fas fa-redo"></i> إعادة الاختبار
            </button>
        </div>
    `;
    
    // حفظ النتيجة
    StorageManager.set('last_quiz', {
        score: totalScore,
        level: result.level,
        date: new Date().toISOString()
    });
}
let selectedGender = null;

function showWelcomeScreen() {
    document.getElementById('welcome-screen').classList.remove('hidden');
    document.getElementById('app').classList.remove('visible');
    resetWelcomeSlides();
}

function hideWelcomeScreen() {
    document.getElementById('welcome-screen').classList.add('hidden');
}

function nextSlide(slideNumber) {
    const currentSlide = document.querySelector('.welcome-slide.active');
    const nextSlideElement = document.querySelector(`[data-slide="${slideNumber}"]`);
    
    if (!currentSlide || !nextSlideElement) return;
    
    currentSlide.classList.remove('active');
    nextSlideElement.classList.add('active');
    
    updateProgressSteps(slideNumber);
}

function prevSlide(slideNumber) {
    const currentSlide = document.querySelector('.welcome-slide.active');
    const prevSlideElement = document.querySelector(`[data-slide="${slideNumber}"]`);
    
    if (!currentSlide || !prevSlideElement) return;
    
    currentSlide.classList.remove('active');
    prevSlideElement.classList.add('active');
    
    updateProgressSteps(slideNumber);
}

function updateProgressSteps(step) {
    document.querySelectorAll('.progress-step').forEach(el => {
        const stepNum = parseInt(el.dataset.step);
        el.classList.remove('active', 'completed');
        if (stepNum === step) el.classList.add('active');
        if (stepNum < step) el.classList.add('completed');
    });
}

function resetWelcomeSlides() {
    document.querySelectorAll('.welcome-slide').forEach((slide, index) => {
        slide.classList.remove('active');
        if (index === 0) slide.classList.add('active');
    });
    updateProgressSteps(1);
    selectedGender = null;
    document.getElementById('user-gender').value = '';
    document.querySelectorAll('.gender-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    document.getElementById('user-name').value = '';
    document.getElementById('user-age').value = '';
    document.getElementById('name-next-btn').disabled = true;
    document.getElementById('age-next-btn').disabled = true;
    document.getElementById('start-btn').disabled = true;
}

function selectGender(gender) {
    selectedGender = gender;
    document.getElementById('user-gender').value = gender;
    
    document.querySelectorAll('.gender-option').forEach(opt => {
        opt.classList.remove('selected');
        if (opt.dataset.gender === gender) {
            opt.classList.add('selected');
        }
    });
    
    document.getElementById('start-btn').disabled = false;
}

// Event Listeners
document.getElementById('user-name').addEventListener('input', function(e) {
    document.getElementById('name-next-btn').disabled = !e.target.value.trim();
});

document.getElementById('user-age').addEventListener('input', function(e) {
    const age = parseInt(e.target.value);
    document.getElementById('age-next-btn').disabled = !age || age < 10 || age > 100;
});

function completeWelcome() {
    const name = document.getElementById('user-name').value.trim();
    const age = parseInt(document.getElementById('user-age').value);
    const gender = document.getElementById('user-gender').value;
    
    if (!name || !age || !gender) return;
    
    const userData = {
        name,
        age,
        gender,
        createdAt: new Date().toISOString()
    };
    
    StorageManager.saveUser(userData);
    hideWelcomeScreen();
    initApp();
    showToast(`مرحباً بك ${name}`);
    
    // Show permission modal after welcome
    setTimeout(() => {
        PermissionsManager.showPermissionModal();
    }, 1000);
}
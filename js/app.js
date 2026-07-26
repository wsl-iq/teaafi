// Main Application Controller
const App = {
    init() {
        StorageManager.init();
        RecoveryCounter.init();
        this.checkFirstRun();
        this.handleSplashScreen();
        this.setupEventListeners();
        this.checkResponsive();
    },
    
    checkFirstRun() {
        const user = StorageManager.getUser();
        if (user) {
            this.showMainApp();
        } else {
            this.showWelcome();
        }
    },
    
    handleSplashScreen() {
        setTimeout(() => {
            document.getElementById('splash-screen').classList.add('hidden');
        }, 2000);
    },
    
    showWelcome() {
        document.getElementById('welcome-screen').classList.remove('hidden');
        document.getElementById('app').classList.remove('visible');
    },
    
    showMainApp() {
        document.getElementById('welcome-screen').classList.add('hidden');
        document.getElementById('app').classList.add('visible');
        navigateTo('home');
        
        // Show permission modal after app loads
        setTimeout(() => {
            PermissionsManager.showPermissionModal();
        }, 1500);
        
        // Start notification scheduler
        NotificationService.scheduleDailyReminder();
    },
    
    setupEventListeners() {
        // Handle responsive changes
        window.addEventListener('resize', () => this.checkResponsive());
        
        // Handle PWA install
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            window.deferredPrompt = e;
        });
        
        // Handle online/offline
        window.addEventListener('online', () => showToast('تم استعادة الاتصال بالإنترنت'));
        window.addEventListener('offline', () => showToast('أنت غير متصل بالإنترنت حالياً'));
    },
    
    checkResponsive() {
        const width = window.innerWidth;
        const sidebar = document.getElementById('sidebar');
        const bottomNav = document.getElementById('bottom-nav');
        
        if (width >= 1024) {
            sidebar.style.display = 'flex';
            bottomNav.style.display = 'none';
        } else {
            sidebar.style.display = 'none';
            bottomNav.style.display = 'flex';
        }
    }
};

// Toast System
function showToast(message, duration = 3000) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registered successfully');
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}
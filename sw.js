/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : Taafi
 * File   : sw.js
 * Type: JavaScript
 */

const CACHE_NAME = 'taafi-app-v1.0.0';
const DYNAMIC_CACHE = 'taafi-dynamic-v1';

const STATIC_ASSETS = [
  '/',

  // HTML
  '/index.html', // T

  // CSS
  '/css/variables.css', // T
  '/css/reset.css', // T
  '/css/typography.css', // T
  '/css/components.css', // T
  '/css/mobile.css', // T
  '/css/tablet.css', // T
  '/css/desktop.css', // T
  '/css/utilities.css', // T
  '/css/themes.css', // T

  // JavaScript
  '/js/app.js', // T
  '/js/storage.js', // T
  '/js/router.js', // T
  '/js/notifications.js', // T
  '/js/permissions.js', // T
  '/js/counter.js', // T
  '/js/app-lock.js', // T
  '/js/backup.js', // T
  '/js/optimization.js', // T
  '/js/search.js', // T
  '/js/smart-notifications.js', // T
  '/js/themes.js', // T
  '/js/xp-system.js',

  '/data/content.js', // T
  '/data/adhkar.js', // T
  '/data/achievements.js', // T
  '/data/challenges.js', // T
  '/data/duas.js', // T

  '/pages/welcome.js', // T
  '/pages/home.js', // T
  '/pages/habits.js', // T
  '/pages/habit-detail.js', // T
  '/pages/spiritual.js', // T
  '/pages/recovery.js', // T
  '/pages/settings.js', // T
  '/pages/tasbih.js', // T
  '/pages/journal.js',
  '/pages/leaderboard.js',
  '/pages/quiz.js',
  '/pages/stats.js',
  '/pages/challenge-game.js',
  '/pages/duas.js',
  '/pages/policies.js',
  '/pages/prayer-box.js',
  '/pages/calendar.js',

  // json
  '/manifest.json', // T

  // python
  '/Application.py',

  // C/C++
  '/wasm/optimization.c',
  '/wasm/optmization.cpp',
  '/wasm/CMakeList.txt',

  // Batchfile
  '/wasm/bulid.bat',

  // Bash sheel script
  '/wasm/bulid.sh',

  // other
  '/version.txt',
  '/wasm/optmization.wasm',
  '/wasm/optmization.wat',
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME && name !== DYNAMIC_CACHE)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Strategy: Cache First, then Network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(event.request)
          .then(response => {
            // Cache dynamic content
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(DYNAMIC_CACHE)
                .then(cache => cache.put(event.request, responseClone));
            }
            return response;
          })
          .catch(() => {
            // Return offline page if available
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/.html');
            }
          });
      })
  );
});

// Push Notification
self.addEventListener('push', event => {
  let data = {
    title: 'تعافي',
    body: 'تذكير من تطبيق تعافي',
    icon: '/assets/icons/icon-192.png',
    badge: '/assets/icons/icon-72.png'
  };
  
  if (event.data) {
    try {
      data = { ...data, ...JSON.parse(event.data.text()) };
    } catch (e) {
      data.body = event.data.text();
    }
  }
  
  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    vibrate: [200, 100, 200],
    tag: 'taafi-notification',
    renotify: true,
    requireInteraction: false,
    data: {
      url: data.url || '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification Click
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then(clientList => {
        // If a window is already open, focus it
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise open a new window
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});
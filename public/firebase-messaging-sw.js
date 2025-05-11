importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

const firebaseConfig = {

  apiKey: "AIzaSyCci1XkgAyxM7Iewk1W1YwyzGeMfLCa9b0", 
  authDomain: "movieexplorerapp-2025.firebaseapp.com",
  projectId: "movieexplorerapp-2025",
  storageBucket: "movieexplorerapp-2025.firebasestorage.app",
  messagingSenderId: "79088125226",
  appId: "1:79088125226:web:f4a1dbb7b408aeaaa14a53",
  measurementId: "G-RKFLEBTXBT"
  
};

firebase.initializeApp(firebaseConfig); 

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image || '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

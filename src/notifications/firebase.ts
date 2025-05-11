import { initializeApp } from "firebase/app";
import { deleteToken, getMessaging, getToken, onMessage } from "firebase/messaging";
import { sendTokenToBackend,toggleNotifications } from "../utils/User";

const firebaseConfig = {
      apiKey: "AIzaSyCci1XkgAyxM7Iewk1W1YwyzGeMfLCa9b0", 
      authDomain: "movieexplorerapp-2025.firebaseapp.com",
      projectId: "movieexplorerapp-2025",
      storageBucket: "movieexplorerapp-2025.firebasestorage.app",
      messagingSenderId: "79088125226",
      appId: "1:79088125226:web:f4a1dbb7b408aeaaa14a53",
      measurementId: "G-RKFLEBTXBT"

};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const generateToken = async () => {
    try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log("Service Worker registered:", registration);

        const permission = await Notification.requestPermission();
        console.log("Notification permission:", permission);
        if (permission !== "granted") {
            console.warn('Notification permission not granted:', permission);
            return null;
        }

        // const vapidKey = "BFm0kTDh9QoBi9OGzGTctrOsCUSCmg7uKrvxDbDh0TDrDm35H-TgvXjPmAxZqXFV4PZOFihn0JuKzpCXSTwc_cE";
        const vapidKey = "BNp-QAa-FM4eAUJ6gwJmIHaL8DINbddqGo44EEjFvHf9D35lSeQwMPUdoH27skZDAdUb8bFfwasb9nvC_nkzRcA"; 

        const token = await getToken(messaging, {
            vapidKey,
            serviceWorkerRegistration: registration,
        });

        if (!token || typeof token !== 'string' || token.length < 50) {
            console.warn("Generated token appears invalid");
            return null;
        }

        console.log("New FCM Token:", token);
        sendTokenToBackend(token);
        // toggleNotifications();

        return token;
    } catch (error) {
        console.error('Error generating FCM token or sending to backend:', error);
        return null;
    }
};

export const monitorToken = async () => {
    try {
        // const vapidKey = "BFm0kTDh9QoBi9OGzGTctrOsCUSCmg7uKrvxDbDh0TDrDm35H-TgvXjPmAxZqXFV4PZOFihn0JuKzpCXSTwc_cE";
        const vapidKey = "BNp-QAa-FM4eAUJ6gwJmIHaL8DINbddqGo44EEjFvHf9D35lSeQwMPUdoH27skZDAdUb8bFfwasb9nvC_nkzRcA";
        const token = await getToken(messaging, { vapidKey }).catch(async (error) => {
            if (error.code === 'messaging/token-unsubscribed' || error.code === 'messaging/invalid-token') {
                console.log('Token invalid or unsubscribed, generating new token');
                await deleteToken(messaging).catch(() => console.log('No token to delete'));
                const newToken = await getToken(messaging, { vapidKey });
                console.log('New FCM Token (refreshed):', newToken);
                return newToken;
            }
            throw error;
        });
        if (token) {
            if (typeof token !== 'string' || token.length < 50) {
                console.warn("Monitored token appears invalid");
                return null;
            }
            console.log('Token validated:', token);
        }
        return token;
    } catch (error) {
        console.error('Error monitoring FCM token:', error);
        return null;
    }
};

export { onMessage };

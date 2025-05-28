import { useEffect } from "react";
import Slider from "../Banner/Slider";
import Footer from "../Common/Footer";
import Carousel from "../CrasouleSample/Carosule";
import { generateToken, messaging } from '../../notifications/firebase';
import { onMessage } from 'firebase/messaging';

function Dashboard() {
    useEffect(() => {
    generateToken();
    onMessage(messaging, (payload) => {
      console.log('Foreground message received:', payload);
      if (Notification.permission === 'granted') {
        const notificationTitle = payload.notification?.title || 'New Notification';
        const notificationOptions = {
          body: payload.notification?.body || 'You have a new message',
          icon: payload.notification?.image || '/favicon.ico',
        };
        new Notification(notificationTitle, notificationOptions);
      }
    });
  }, []);

  return (
    <div>
      <Slider />
      <Carousel title="Sci-Fi" genre="Si-Fi" />
      <Carousel title="Thriller" genre="Thriller" />
      <Carousel title="Action" genre="Action" />
      <Footer />
    </div>
  );
}

export default Dashboard;
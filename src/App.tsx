import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './component/Auth/Login';
import Signup from './component/Auth/Signup';
import Dashboard from './component/Pages/Dashboard';
import LandingPage from './component/Pages/LandingPage';
import MovieDetailPage from './component/Pages/MovieDetailPage';
import MoviesListCheck from './component/CrasouleSample/MoviesListCheck';
import Banner from './component/Banner/Banner';
import AdminPage from './component/Pages/AdminPage';
import Gener from './component/Pages/Gener';
import SubscriptionPage from './component/Pages/SubscriptionPage';
import { useEffect } from 'react';
import { generateToken, messaging } from './notifications/firebase';
import { onMessage } from 'firebase/messaging';
import Success from './component/Pages/Success';

function App() {
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
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/landingPage" element={<LandingPage />} />
        <Route path="/movie/:id" element={<MovieDetailPage />} />
        <Route path="/allmovies" element={<MoviesListCheck />} />
        <Route path="/hero" element={<Banner />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/:id" element={<AdminPage />} />
        <Route path="/gen" element={<Gener />} />
        <Route path="/sub" element={<SubscriptionPage />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </Router>
  );
}

export default App;

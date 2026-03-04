import { useEffect, useRef, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Header from './components/main/Header';
import ChallengeDetailPage from './components/ChallengeDetailPage';
import Challenge from './components/challengeView/Challenge';
import OngoingChallenge from './components/challengeView/OngoingChallenge';
import Login from './components/main/Login';
import Signup from './components/main/Signup';
import Attendance from './components/attendanceSection/Attendance';
import Ranking from './components/rankingView/Ranking';
import Community from './components/communityView/Community';
import Shop from './components/shopView/Shop';
import TierGuide from './components/main/TierGuide';
import MyItems from './components/MyItems';
import WordChainGame from './components/WordChainGame';
import CustomAlertModal from './components/modals/CustomAlertModal';



function App() {
  const originalAlertRef = useRef(window.alert);
  const [alertQueue, setAlertQueue] = useState([]);
  const [currentAlert, setCurrentAlert] = useState('');

  useEffect(() => {
    const originalAlert = originalAlertRef.current;

    window.alert = (message = '') => {
      const text = typeof message === 'string' ? message : String(message);
      setAlertQueue(prev => [...prev, text]);
    };

    return () => {
      window.alert = originalAlert;
    };
  }, []);

  useEffect(() => {
    if (!currentAlert && alertQueue.length > 0) {
      setCurrentAlert(alertQueue[0]);
      setAlertQueue(prev => prev.slice(1));
    }
  }, [alertQueue, currentAlert]);

  const handleCloseAlert = () => {
    setCurrentAlert('');
  };

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/challenge" element={<Challenge />} />
        <Route path="/challenge/:id" element={<ChallengeDetailPage />} />
        <Route path="/challenge/:id/minigame" element={<WordChainGame />} />
        <Route path="/ongoing-challenges" element={<OngoingChallenge />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/community" element={<Community />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/tier-guide" element={<TierGuide />} />
        <Route path="/my-items" element={<MyItems />} />

      </Routes>
      {currentAlert && (
        <CustomAlertModal
          message={currentAlert}
          onClose={handleCloseAlert}
        />
      )}
    </>
  );
}
export default App;

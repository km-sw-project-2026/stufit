import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Header from './components/main/Header';
// import ChallengeDetailView from './components/ChallengeDetailView';
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



function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/challenge" element={<ChallengeDetailView />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/challenge" element={<Challenge />} />
        <Route path="/ongoing-challenges" element={<OngoingChallenge />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/community" element={<Community />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/tier-guide" element={<TierGuide />} />
        <Route path="/my-items" element={<MyItems />} />

      </Routes>
    </>
  );
}
export default App;

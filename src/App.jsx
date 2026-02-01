import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Header from './components/main/Header';
// import ChallengeDetailView from './components/ChallengeDetailView';
import OngoingChallenge from './components/challengeView/OngoingChallenge';
import Login from './components/main/Login';
import Signup from './components/main/Signup';
import Attendance from './components/attendanceSection/Attendance';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/challenge" element={<ChallengeDetailView />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/challenge" element={<OngoingChallenge />} />
        <Route path="/attendance" element={<Attendance />} />
      </Routes>
    </>
  );
}
export default App;

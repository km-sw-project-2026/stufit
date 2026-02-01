import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Header from './components/main/Header';
// import ChallengeDetailView from './components/ChallengeDetailView';
<<<<<<< HEAD
import OngoingChallenge from './components/challengeView/OngoingChallenge';
=======
import Login from './components/main/Login';
import Signup from './components/main/Signup';
import OngoingChallenge from './components/challengeView/OngoingChallenge';  
import ChallengeDetailView from './components/ChallengeDetailView';
import Attendance from './components/attendanceSection/Attendance';

>>>>>>> 0dc1d6bfb7df812e3253086df3041b632a3ced98
function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
<<<<<<< HEAD
        <Route path="/challenge" element={<OngoingChallenge />} />
        {/* <Route path="/challenge" element={<ChallengeDetailView />} /> */}
=======
        {/* <Route path="/challenge" element={<ChallengeDetailView />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/challenge" element={<OngoingChallenge />} />
        <Route path="/challenge" element={<ChallengeDetailView />} />
        <Route path="/attendance" element={<Attendance />} />
>>>>>>> 0dc1d6bfb7df812e3253086df3041b632a3ced98
      </Routes>
    </>
  );
}
export default App;

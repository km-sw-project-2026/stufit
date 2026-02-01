import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Header from './components/main/Header';
import ChallengeDetailView from './components/ChallengeDetailView';
import Attendance from './components/attendanceSection/Attendance';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/challenge" element={<ChallengeDetailView />} />
        <Route path="/attendance" element={<Attendance />} />
      </Routes>
    </>
  );
}
export default App;

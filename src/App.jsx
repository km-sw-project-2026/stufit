import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Header from './components/main/Header';
// import ChallengeDetailView from './components/ChallengeDetailView';
import OngoingChallenge from './components/challengeView/OngoingChallenge';
function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/challenge" element={<OngoingChallenge />} />
        {/* <Route path="/challenge" element={<ChallengeDetailView />} /> */}
      </Routes>
    </>
  );
}
export default App;

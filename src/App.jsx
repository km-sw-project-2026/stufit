import { Routes, Route } from 'react-router-dom';
import Posts from './components/Posts';
import Post from './components/Post';
// 1. 우리가 작업할 챌린지 상세 컴포넌트 불러오기
import ChallengeDetail from './components/[id]'; 

function App(){
  return(
    <Routes>
      <Route path="/" element={<Posts />} />
      <Route path="/post/:id" element={<Post />} />
      {/* 2. 챌린지 상세 페이지 경로 추가 */}
      <Route path="/challenges/:id" element={<ChallengeDetail />} />
    </Routes> 
  );
}
export default App;
import { Routes, Route } from 'react-router-dom';
import Posts from './components/Posts';
import Post from './components/Post';
function App(){
  return(
    <Routes>
      <Route path="/" element={<Posts />} />
      <Route path="/post/:id" element={<Post />} />
    </Routes> 
  );
}
export default App;

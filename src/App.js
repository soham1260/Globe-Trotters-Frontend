import './App.css';
import Home from './components/Home';
import PostState from './components/state/PostState';
import Login from './components/Login';
import Signup from './components/Signup';
import About from './components/About';
import Post from './components/Post';
import Myposts from './components/Myposts';
import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Compose from './components/Compose';
import Update from './components/Update';
import NotFound from './components/NotFound';


function App() {
  return (
    <BrowserRouter>
      <PostState>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/about' element={<><Navbar/><About/><Footer/></>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path="/posts/:id" element={<><Navbar/><Post/><Footer/></>} />
          <Route path="/updatepost/:id" element={<><Navbar/><Update/><Footer/></>} />
          <Route path="/my-posts" element={<><Navbar/><Myposts/><Footer/></>} />
          <Route path="/compose" element={<><Navbar/><Compose/><Footer/></>} />
          <Route path="*" element={<><Navbar/><NotFound/><Footer/></>} />
        </Routes>
      </PostState>
    </BrowserRouter>
  );
}

export default App;

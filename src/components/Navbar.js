import React,{useContext, useEffect} from 'react'
import logout from '../assets/logout.png'
import { Link,useNavigate } from 'react-router-dom'
import {postContext} from './state/PostState';
export default function Navbar() {

  const navigate = useNavigate();
  const context = useContext(postContext);
  const {Loggedin,setLoggedin,checkUser} = context;

  useEffect(() => {
    checkUser();
  },[]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedin(false);
  }

  return (
    <nav className="navbar navbar-default" style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000 }}>
    <div className="container">
      <div className="navbar-header">
        <Link className="navbar-brand" to="/">Globe Trotters</Link>
      </div>
        <ul className="nav navbar-nav navbar-right">
          <li id="search"><Link to="/search">SEARCH</Link></li>
          {Loggedin && <li id="about"><Link to="/my-posts">MY-POSTS</Link></li>}
          {Loggedin && <li id="compose"><Link to="/compose">COMPOSE</Link></li>}
          <li id="compose"><Link to="/about">ABOUT</Link></li>
          {Loggedin ? 
          <li id="home" style={{cursor:"pointer"}}><a onClick={handleLogout}>LOGOUT<img src={logout} alt="logout logo" width="16px"/></a></li> :
          <li id="home" style={{cursor:"pointer"}}><a onClick={() => {navigate("/login")}}>LOGIN</a></li>
          }
        </ul>
    </div>
  </nav>
  )
}

import React, { useState } from 'react';
import {Routes, Route} from 'react-router-dom';
import Home from './components/Home';
import BoardList from './components/BoardList';
import ViewBoard from './components/ViewBoard';
import RegisterPage from './components/RegisterPage';
import SignInPage from './components/SignInPage';


function App() {
  const getInitialUser = () => {
    const userInfo = sessionStorage.getItem("userInfo");
    const jwtToken = sessionStorage.getItem("jwtToken");
    
    if (userInfo && jwtToken) {
      return {
        ...JSON.parse(userInfo),
        token: jwtToken
      };
    }
    return null;
  };

  let visibleHeight = window.innerHeight;
  document.documentElement.style.setProperty('--vh', `${visibleHeight}px`);
  
  const [user, setUser] = useState(getInitialUser);

  return(
    <Routes>
      <Route path="/" element={<Home user={user} setUser={setUser} />} />
      <Route path="/boards" element={<BoardList user={user} setUser={setUser} />} />
      <Route path="/viewBoard/:boardId" element={<ViewBoard user={user} setUser={setUser} />} />
      <Route path="/registerPage" element={<RegisterPage />} />
      <Route path="/signInPage" element={<SignInPage setUser={setUser} />} />
    </Routes>
  )
}

export default App;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Home from './components/Home';
import {Routes, Route} from 'react-router-dom';
import RegisterPage from './components/RegisterPage';
import SignInPage from './components/SignInPage';
import ViewBoard from './components/ViewBoard';


function App() {
  const body = document.querySelector('body');
  // body.style.height = `${window.visualViewport.height}px`;
  const getInitialUser = () => {
    const userInfo = sessionStorage.getItem("userInfo");
    const jwtToken = sessionStorage.getItem("jwtToken");
    
    if (userInfo && jwtToken) {
      // 정보가 있으면 파싱해서 user 객체로 반환 (토큰도 포함)
      return {
        ...JSON.parse(userInfo),
        token: jwtToken
      };
    }
    return null; // 정보가 없으면 null 반환
  };
  
  // 🚨 2. useState 초기값으로 함수 호출
  const [user, setUser] = useState(getInitialUser);
  // const [board, setBoard] = useState();

  return(
    <Routes>
      <Route path="/" element={<Home user={user} setUser={setUser} />} />
      <Route path="/viewBoard/:boardId" element={<ViewBoard />} />
      <Route path="/registerPage" element={<RegisterPage />} />
      <Route path="/signInPage" element={<SignInPage setUser={setUser} />} />
    </Routes>
  )
}

export default App;
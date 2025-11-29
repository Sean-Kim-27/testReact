import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Home from './components/Home';
import BoardList from './components/BoardList';
import {Routes, Route} from 'react-router-dom';
import RegisterPage from './components/RegisterPage';
import SignInPage from './components/SignInPage';

function App() {
  const [user, setUser] = useState();

  useEffect(() => {
    const handleBeforeLoad = () => {
      localStorage.removeItem("jwtToken");
    }

    window.addEventListener('beforeunload', handleBeforeLoad);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeLoad);
    }
  });

  return(
    <Routes>
      <Route path="/" element={<Home user={user} setUser={setUser} />} />
      {/* <Route path="/boardList" element={<BoardList id={id} />} /> */}
      <Route path="/registerPage" element={<RegisterPage />} />
      <Route path="/signInPage" element={<SignInPage setUser={setUser} />} />
    </Routes>
  )
}

export default App;
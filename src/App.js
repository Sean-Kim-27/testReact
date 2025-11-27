import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Home from './Home';
import BoardList from './BoardList';
import {Routes, Route} from 'react-router-dom';
import RegisterPage from './RegisterPage';
import SignInPage from './SignInPage';

function App() {
  return(
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/boardList" element={<BoardList />} />
      <Route path="/registerPage" element={<RegisterPage />} />
      <Route path="/signInPage" element={<SignInPage />} />
    </Routes>
  )
}

export default App;
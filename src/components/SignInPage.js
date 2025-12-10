import axios from 'axios';
import '../styles/init.css';
import React, { useState } from 'react'
import '../styles/signInPage.css'
// import Home from './Home'
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';


function SignInPage({setUser}) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(sessionStorage.getItem('jwtToken'));
  const navigate = useNavigate();

  // console.log(username);

  const handleLogin = async (e) => {
    // const empty_input = document.querySelector('.empty_input');
    e.preventDefault();
    if (!userId || !password) {
        alert('뒤지기 싫으면 다 채워라');
        return;
    }

    try {
      const { token, nickname } = await login(userId, password);
      
      sessionStorage.setItem("jwtToken", token);
      sessionStorage.setItem("userInfo", JSON.stringify({
        nickname: nickname,
        userId: userId
      }));
      console.log(token, nickname);

      setUser({
            nickname: nickname,
            userId: userId,
            token: token
      });
      navigate('/');

    } catch(error) {
      alert(`아이디나 비밀번호를 다시 확인해주세요.`);
      // console.error('로그인 중 오류 발생:', error)
      // alert('서버와 통신할 수 없습니다.')
    }
  } 

  const locationBack = () => {
    navigate('/');
  }

  return (
    <div className='container' id='signIn_container'>
      <form className='signIn_form' onSubmit={handleLogin}>
        <div className='location_back'
          onClick={locationBack}
        >
          <i className="bi bi-arrow-left"></i>
        </div>
        <p>로그인 쳐 해라</p>
        <input type='text' className='text_input' placeholder='아이디를 입력하세요.' name='username' id='input_id'
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        ></input>
        <input type='password' className='text_input' placeholder='비밀번호를 입력하세요.' name='password' id='input_pw'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        ></input>
        <button type='submit' className='signIn_btn'>로그인</button>
        <div className='empty_input'>다 쳐 적어라</div>
      </form>
    </div>
  );
}

export default SignInPage
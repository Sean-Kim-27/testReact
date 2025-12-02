import axios from 'axios';
import '../styles/init.css';
import '../styles/registerPage.css';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Home from './Home';

function RegisterPage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const RegisterCheck = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://testspring-kmuc.onrender.com/auth/signup', {
        nickname: nickname,
        username: userId,
        password: password
      });
      // ... 요청 ...
      alert("가입 성공!");
      navigate('/');
    } catch (err) {
      console.log(err);
      // ★★★ 백엔드가 보낸 에러 메시지(message)를 띄워준다 ★★★
      // err.response.data.message가 없을 수도 있으니 안전하게 처리
      const msg = err.response?.data?.message || "가입 실패. (서버 에러)";
      alert(msg); 
    }
  }

  const locationBack = () => {
    navigate('/');
  }

  return (
    <div className='register_container'>
      <form className='register_form' onSubmit={RegisterCheck}>
        <div className='location_back'
          onClick={locationBack}
        >
          <i className="bi bi-arrow-left"></i>
        </div>
        <p>회원가입 쳐 해라</p>
        <input className='register_input' type='text' placeholder='이름을 입력하세요.' name='nickname'
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        />
        <input className='register_input' type='text' placeholder='아이디를 입력하세요.' name='username'
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        />
        <input className='register_input' type='password' placeholder='비밀번호를 입력하세요.' name='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />
        <button type='submit' className='register_submit_button'>회원가입</button>
      </form>
    </div>
  )
}

export default RegisterPage
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

    // console.log(nickname, userId, password);
    try {
      await axios.post('https://testspring-kmuc.onrender.com/auth/signup', {
        nickname: nickname,
        username: userId,
        password: password
      });

      alert('회원가입 성공!');
      navigate('/');
    } catch(error) {
      console.error(error);
    }
  }

  return (
    <div className='register_container'>
      <form className='register_form' onSubmit={RegisterCheck}>
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
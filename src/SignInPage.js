import axios from 'axios';
import './styles/init.css';
import React, { useState } from 'react'
import './styles/signInPage.css'
import { useNavigate } from 'react-router-dom';

function SignInPage() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://testspring-kmuc.onrender.com/auth/login', {
        username: userId,
        password: password,
      });     

      console.log(response);

      if(response.data.success) {
        alert('로그인 성공!');
        navigate('/')
      } else {
        alert('로스인 실패', response.data.message);
      }
    } catch(error) {
      console.error('로그인 중 오류 발생:', error)
      alert('서버와 통신할 수 없습니다.')
    }
  } 

  return (
    <div className='container' id='signIn_container'>
      <form className='signIn_form' onSubmit={handleLogin}>
        <input type='text' className='text_input' placeholder='Input ID' name='username' id='input_id'
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        ></input>
        <input type='text' className='text_input' placeholder='Input PW' name='password' id='input_pw'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        ></input>
        <button type='submit' className='submit_button'>로그인</button>
      </form>
    </div>
  )
}

export default SignInPage
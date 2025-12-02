import axios from 'axios';
import '../styles/init.css';
import React, { useState } from 'react'
import '../styles/signInPage.css'
// import Home from './Home'
import { useNavigate } from 'react-router-dom';


function SignInPage({setUser}) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('jwtToken'));
  const navigate = useNavigate();

  // console.log(username);

  const handleLogin = async (e) => {
    const empty_input = document.querySelector('.empty_input');
    e.preventDefault();

    try {
      const request = userId && password ? await axios.post('https://testspring-kmuc.onrender.com/auth/login', {
        username: userId,
        password: password,
      }) : false;
      
      console.log(request.data);

      if(request) {
        const { token, nickname } = request.data;
        setToken(token);
        
        localStorage.setItem("jwtToken", token);
        console.log(token)
        // 🚨 2. App.js의 user 상태를 업데이트!
        setUser({
            nickname: nickname,
            userId: userId,
            token: token
        });

        navigate('/');
      } else {
        empty_input.classList.add('empty');
        // alert("다 쳐 적어라");
      }
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
        <button type='submit' className='submit_button'>로그인</button>
        <div className='empty_input'>다 쳐 적어라</div>
      </form>
    </div>
  );
}

export default SignInPage
import react from 'react'
import './styles/home.css'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    const handleSignIn = () => {
        navigate("/signInPage");
    }


    const handleSignUp = () => {
        console.log("회원가입 버튼 클릭");
    }

    return(
        <nav className='header'>
            <ul className='menu_container'>
                <li className='menu'
                    onClick={handleSignIn}
                >
                    로그인
                </li>
                <li className='menu'
                    onClick={handleSignUp}
                >
                    회원가입
                </li>
            </ul>
        </nav>
    )   
}

export default Home;
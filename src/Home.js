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
        navigate('/registerPage')
    }

    return(
        <nav className='header'>
            <ul className='menu_container'>
                <li className='menu'
                    onClick={handleSignIn}
                >
                    <p>로그인</p>
                </li>
                <li className='menu'
                    onClick={handleSignUp}
                >
                    <p>회원가입</p>
                </li>
            </ul>
        </nav>
    )   
}

export default Home;
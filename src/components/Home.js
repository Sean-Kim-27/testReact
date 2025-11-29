import react from 'react'
import '../styles/home.css'
import '../styles/init.css'
import { useNavigate } from 'react-router-dom';
import BoardList from './BoardList';


function Home({user, setUser}) {
    const navigate = useNavigate();
    const token = localStorage.getItem("jwtToken");


    const handleSignIn = () => {
        navigate("/signInPage");
    }


    const handleSignUp = () => {
        navigate('/registerPage')
    }

    const hangleLogOut = () => {
        localStorage.removeItem('jwtToken');
        setUser('');
    }

    return(
        <div className='Home_container'>
            <header className='header'>
                <nav className='container'>
                    <ul className='menu_container'>
                        {/* 🚨 user 상태에 따라 로그인/회원가입 메뉴를 조건부 렌더링 */}
                        {user ? (
                            <>
                                <li className='userName'>
                                    <p>
                                        {user ? `${user.nickname}` : ''}
                                    </p>
                                </li>
                                <li className='menu'>
                                    <p onClick={hangleLogOut}>로그아웃</p>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className='menu' onClick={handleSignIn}>
                                    <p>로그인</p>
                                </li>
                                <li className='menu' onClick={handleSignUp}>
                                    <p>회원가입</p>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </header>
            {token ? (
                user ? <BoardList userId={user.userId} /> : ''
            ) : <div className='notToken container'>로그인부터 하셈ㅇㅇ {token}</div>}
        </div>
        
    )
}

export default Home;
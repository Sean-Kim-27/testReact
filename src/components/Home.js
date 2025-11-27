import react from 'react'
import '../styles/home.css'
import { useNavigate } from 'react-router-dom';
import BoardList from './BoardList';


function Home({user, setUser}) {
    const navigate = useNavigate();
    const token = localStorage.getItem("jwtToken");
    // console.log(token);


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
            <nav className='header'>
                <ul className='menu_container'>
                    {/* 🚨 user 상태에 따라 로그인/회원가입 메뉴를 조건부 렌더링 */}
                    {user ? (
                        <>
                            <p className='userName'>
                                {user ? `${user.nickname}` : ''}
                            </p>
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
            {token ? (
                <BoardList uesr={user} />
            ) : <div>못 불러옴 ㅅㄱ {token}</div>}
        </div>
        
    )
}

export default Home;
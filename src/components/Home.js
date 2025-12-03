import react from 'react'
import '../styles/home.css'
import '../styles/init.css'
import { useNavigate } from 'react-router-dom';
import BoardList from './BoardList';


function Home({user, setUser}) {
    const navigate = useNavigate();
    const token = sessionStorage.getItem("jwtToken");

    const handleSignIn = () => {
        navigate("/signInPage");
    }

    const handleSignUp = () => {
        navigate('/registerPage')
    }

    const handleLogOut = () => {
        sessionStorage.removeItem('jwtToken');
        sessionStorage.removeItem('userInfo');
        setUser(null);
        navigate('/');
    }

    return(
        <div className='Home_container'>
            {/* 왼쪽 사이드바 */}
            <aside className='sidebar'>
                <div className='sidebar_header'>
                    <div className='sidebar_logo'>💩</div>
                    <h2 className='sidebar_title'>하수구</h2>
                    <p className='sidebar_subtitle'>게시판</p>
                </div>

                <nav className='sidebar_nav'>
                    <div className='nav_item active'>
                        <i className="bi bi-house-door-fill"></i>
                        <span>홈</span>
                    </div>
                    <div className='nav_item'>
                        <i className="bi bi-file-text-fill"></i>
                        <span>게시글</span>
                    </div>
                    <div className='nav_item'>
                        <i className="bi bi-bell-fill"></i>
                        <span>알림</span>
                    </div>
                    <div className='nav_item'>
                        <i className="bi bi-gear-fill"></i>
                        <span>설정</span>
                    </div>
                </nav>

                <div className='sidebar_footer'>
                    {user ? (
                        <div className='user_info' onClick={handleLogOut}>
                            <div className='user_avatar'>
                                {user.nickname.charAt(0).toUpperCase()}
                            </div>
                            <span className='user_name'>{user.nickname}</span>
                            <i className="bi bi-box-arrow-right logout_icon"></i>
                        </div>
                    ) : (
                        <div className='user_info' onClick={handleSignIn}>
                            <div className='user_avatar'>
                                <i className="bi bi-person-fill"></i>
                            </div>
                            <span className='user_name'>로그인</span>
                        </div>
                    )}
                </div>
            </aside>

            {/* 메인 컨텐츠 */}
            <main className='main_content'>
                <div className='content_header'>
                    <h1 className='content_title'>💩 하수구</h1>
                    <div className='header_actions'>
                        {!user && (
                            <>
                                <button className='btn_action btn_secondary' onClick={handleSignIn}>
                                    로그인
                                </button>
                                <button className='btn_action btn_primary' onClick={handleSignUp}>
                                    회원가입
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {token ? (
                    user ? <BoardList userId={user.userId} /> : <div className='notToken'>로딩 중...</div>
                ) : (
                    <div className='notToken'>
                        로그인이 필요합니다 🔐
                    </div>
                )}
            </main>
        </div>
    )
}

export default Home;
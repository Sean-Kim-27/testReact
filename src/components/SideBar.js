import { useNavigate } from "react-router-dom";

function SideBar({user, setUser, state}) {
    // console.log(user, setUser)
    const navigate = useNavigate();
    // const { nickname } = JSON.parse(sessionStorage.getItem('uesrInfo'));

    // console.log(state);
    const handleLogout = () => {
        sessionStorage.removeItem('userInfo');
        sessionStorage.removeItem('jwtToken');
        setUser(null);
        navigate('/');
    };

    return (
        <div className="sidebar">
            <div className="sidebar_header">
                <div className="sidebar_logo">📋</div>
                <div className="sidebar_title">게시판</div>
            </div>
            
            <nav className="sidebar_menu">
                <ul>
                    <li><a href="/" onClick={(e) => {e.preventDefault(); navigate('/')}} className={state == "home" ? "active" : ''}>
                        <span className="menu_icon">🏠</span>
                        홈
                    </a></li>
                    <li><a href="/boards" onClick={(e) => {e.preventDefault(); navigate('/boards');}} className={state == "boardList" ? "active" : ''}>
                        <span className="menu_icon">📋</span>
                        게시판
                    </a></li>
                    <li><a href="/profile" className={state == "profile" ? "active" : ''}>
                        <span className="menu_icon">👤</span>
                        프로필
                    </a></li>
                </ul>
            </nav>
            
            <div className="sidebar_footer">
                {user ? (
                    <>
                        <div className="user_info">
                            <div>👋 {user.nickname}님</div>
                            <div style={{fontSize: '12px', color: 'rgba(255,255,255,0.7)'}}>환영합니다!</div>
                        </div>
                        <button className="logout_btn" onClick={handleLogout}>
                            로그아웃
                        </button>
                    </>
                ) : (
                    <div style={{textAlign: 'center'}}>
                        <p style={{color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '12px'}}>
                            로그인이 필요합니다
                        </p>
                        <button className="logout_btn" onClick={() => navigate('/signInPage')}>
                            로그인
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SideBar;
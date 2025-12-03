// src/components/Home.js
import React, { useState, useEffect } from 'react'
import '../styles/home.css'
import '../styles/init.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function Home({user, setUser}) {
    const navigate = useNavigate();
    const token = sessionStorage.getItem("jwtToken");
    const [stats, setStats] = useState({
        totalBoards: 0,
        totalUsers: 0,
        recentBoards: []
    });

    useEffect(() => {
        if (token) {
            fetchStats();
        }
    }, [token]);

    const fetchStats = async () => {
        try {
            const response = await axios.get('https://testspring-kmuc.onrender.com/api/boards', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            const boards = response.data || [];
            const recentBoards = boards.slice(-5).reverse(); // 최근 5개
            
            setStats({
                totalBoards: boards.length,
                totalUsers: new Set(boards.map(board => board.userId)).size,
                recentBoards: recentBoards
            });
        } catch (error) {
            console.error('통계 데이터 로딩 실패:', error);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('userInfo');
        sessionStorage.removeItem('jwtToken');
        setUser(null);
        navigate('/signin');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR');
    };

    return (
        <div className="Home_container">
            <div className="sidebar">
                <div className="sidebar_header">
                    <div className="sidebar_logo">📋</div>
                    <div className="sidebar_title">게시판</div>
                </div>
                
                <nav className="sidebar_menu">
                    <ul>
                        <li><a href="#" onClick={(e) => e.preventDefault()} className="active">홈</a></li>
                        <li><a href="/boards" onClick={(e) => {e.preventDefault(); navigate('/boards');}}>게시판</a></li>
                        <li><a href="#" onClick={() => alert('프로필 기능 준비중입니다.')}>프로필</a></li>
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
                            <button className="logout_btn" onClick={() => navigate('/signin')}>
                                로그인
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="main_content">
                <div className="content_header">
                    <h1>홈</h1>
                    <p>게시판의 최근 소식을 확인하세요</p>
                </div>

                {user ? (
                    <>
                        <div className="stats_container">
                            <div className="stat_card">
                                <div className="stat_icon">📊</div>
                                <div className="stat_number">{stats.totalBoards}</div>
                                <div className="stat_label">총 게시물</div>
                            </div>
                            <div className="stat_card">
                                <div className="stat_icon">👥</div>
                                <div className="stat_number">{stats.totalUsers}</div>
                                <div className="stat_label">참여자</div>
                            </div>
                            <div className="stat_card">
                                <div className="stat_icon">📝</div>
                                <div className="stat_number">{stats.recentBoards.length}</div>
                                <div className="stat_label">최근 게시물</div>
                            </div>
                        </div>

                        <div className="recent_boards">
                            <h2>최근 게시물</h2>
                            <div className="recent_boards_list">
                                {stats.recentBoards.length > 0 ? (
                                    stats.recentBoards.map((board) => (
                                        <div 
                                            key={board.id} 
                                            className="recent_board_item"
                                            onClick={() => navigate(`/viewBoard/${board.id}`)}
                                        >
                                            <div>
                                                <div className="board_title">{board.title}</div>
                                                <div style={{fontSize: '12px', color: '#94a3b8'}}>
                                                    {board.author} • {formatDate(board.createdAt)}
                                                </div>
                                            </div>
                                            <div>
                                                <span style={{color: '#667eea'}}>자세히 보기 →</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="empty_state">
                                        <p>최근 게시물이 없습니다.</p>
                                        <a href="/boards">게시판 바로가기</a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="empty_state">
                        <h3>로그인이 필요합니다</h3>
                        <p>게시판 기능을 이용하시려면 로그인해주세요.</p>
                        <button 
                            onClick={() => navigate('/signin')}
                            style={{
                                marginTop: '16px',
                                padding: '10px 20px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            로그인하기
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;
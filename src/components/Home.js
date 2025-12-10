// src/components/Home.js
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { getBoardList } from '../services/boardService';
import SideBar from './SideBar';
import '../styles/home.css'
import '../styles/init.css'


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
        let writedUsers = new Set();

        try {
            const [ ...data ] = await getBoardList();
            // console.log(data);

            data.map(item => {
                writedUsers.add(item.nickname);
            });

            // console.log(writedUsers.size);
            // console.log(new Set(boards.map(board => board.userId)));

            const boards = data || [];
            const recentBoards = boards.sort((a, b) => {return b.likeCount - a.likeCount}).slice(0, 3);
            // console.log(recentBoards);
            
            setStats({
                totalBoards: boards.length,
                totalUsers: writedUsers.size,
                recentBoards: recentBoards
            });
        } catch (error) {
            console.error('통계 데이터 로딩 실패:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR');
    };

    return (
        <div className="Home_container">
            <SideBar user={user} setUser={setUser} state={'home'} />

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
                            <h2>베스트 똥 TOP3</h2>
                            <div className="recent_boards_list">
                                {stats.recentBoards.length > 0 ? (
                                    stats.recentBoards.map((board) => (
                                        <div 
                                            key={board.id} 
                                            className="recent_board_item"
                                            onClick={() => navigate(`/viewBoard/${board.id}`)}
                                        >
                                            <div className='board_container'>
                                                <div className="content_title">{board.title}</div>
                                                <div className='content_text'>{board.content}</div>
                                                <div className='content_area_container' style={{fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '12px'}}>
                                                    <span>{board.author || board.nickname}</span>
                                                    <span>•</span>
                                                    <span>{formatDate(board.createdAt)}</span>
                                                    {(board.likeCount > 0 || board.commentCount > 0) && (
                                                        <>
                                                            <span>•</span>
                                                            {board.likeCount > 0 && (
                                                                <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                                                                    <span>❤️</span>
                                                                    <span>{board.likeCount}</span>
                                                                </span>
                                                            )}
                                                            {board.commentCount > 0 && (
                                                                <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                                                                    <span>💬</span>
                                                                    <span>{board.commentCount}</span>
                                                                </span>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className='viewBoard_text'>
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
                            onClick={() => navigate('/signInPage')}
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
                        
                            로그인
                        </button>
                        <button 
                            onClick={() => navigate('/registerPage')}
                            style={{
                                marginTop: '16px',
                                padding: '10px 20px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                marginLeft: '10px'
                            }}
                        >회원가입</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;
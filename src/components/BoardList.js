// src/components/BoardList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';
import '../styles/boardList.css';

function BoardList({ user, setUser }) {
    const [boards, setBoards] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const token = sessionStorage.getItem("jwtToken");
    const navigate = useNavigate();

    const fetchBoards = async () => {
        try {
            const response = await axios.get('https://testspring-kmuc.onrender.com/api/boards', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setBoards(response.data ? response.data.sort() : []);
        } catch (error) {
            console.error("에러 발생:", error);
            if (error.response?.status === 401) {
                alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                navigate('/signInPage');
            }
        }
    };

    useEffect(() => {
        if (token) {
            fetchBoards();
        } else {
            navigate('/signInPage');
        }
    }, [token]);

    const handleDelete = async (e) => {
        try {

        } catch(error) {

        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            alert("제목과 내용을 입력해주세요.");
            return;
        }

        try {
            const response = await axios.post('https://testspring-kmuc.onrender.com/api/boards', {
                title: title,
                content: content
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            setTitle('');
            setContent('');
            fetchBoards();
        } catch (error) {
            console.error("게시글 작성 실패:", error);
            alert("게시글 작성에 실패했습니다.");
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('userInfo');
        sessionStorage.removeItem('jwtToken');
        setUser(null);
        navigate('/');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR');
    };

    if (!user) {
        return (
            <div className="Home_container">
                <div className="sidebar">
                    <div className="sidebar_header">
                        <div className="sidebar_logo">📋</div>
                        <div className="sidebar_title">게시판</div>
                    </div>
                    
                    <nav className="sidebar_menu">
                        <ul>
                            <li><a href="/">
                                <span className="menu_icon">🏠</span>
                                홈
                            </a></li>
                            <li><a href="/boards" className="active">
                                <span className="menu_icon">📋</span>
                                게시판
                            </a></li>
                            <li><a href="#" onClick={() => alert('프로필 기능 준비중입니다.')}>
                                <span className="menu_icon">👤</span>
                                프로필
                            </a></li>
                        </ul>
                    </nav>
                    
                    <div className="sidebar_footer">
                        <div style={{textAlign: 'center'}}>
                            <p style={{color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '12px'}}>
                                로그인이 필요합니다
                            </p>
                            <button className="logout_btn" onClick={() => navigate('/signin')}>
                                로그인
                            </button>
                        </div>
                    </div>
                </div>

                <div className="main_content">
                    <div className="empty_state">
                        <h3>로그인이 필요합니다</h3>
                        <p>게시판을 이용하시려면 로그인해주세요.</p>
                        <button onClick={() => navigate('/signin')}>
                            로그인하기
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="Home_container">
            <div className="sidebar">
                <div className="sidebar_header">
                    <div className="sidebar_logo">📋</div>
                    <div className="sidebar_title">게시판</div>
                </div>
                
                <nav className="sidebar_menu">
                    <ul>
                        <li><a href="/" onClick={(e) => {e.preventDefault(); navigate('/');}}>
                            <span className="menu_icon">🏠</span>
                            홈
                        </a></li>
                        <li><a href="/boards" className="active" onClick={(e) => e.preventDefault()}>
                            <span className="menu_icon">📋</span>
                            게시판
                        </a></li>
                        <li><a href="#" onClick={() => alert('프로필 기능 준비중입니다.')}>
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

            <div className="main_content">
                <div className="board_container">
                    <div className="board_header">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <div>
                                <h1 className="board_head_Text">게시판</h1>
                                <p className="board_subtitle">공유하고 싶은 이야기를 작성해보세요</p>
                            </div>
                        </div>
                    </div>

                    <div className="write_form_container">
                        <h3>새 게시글 작성</h3>
                        <form className="write_form" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="제목을 입력하세요"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="내용을 입력하세요"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                            <button type="submit">작성</button>
                        </form>
                    </div>

                    <div className="board_list">
                        {boards.length > 0 ? (
                            boards.map((board) => (
                                <div key={board.id} className="board_item" onClick={() => navigate(`/viewBoard/${board.id}`)}>
                                    <div className="board_item_left">
                                        <div className="board_profile">
                                            {board.nickname?.charAt(0)?.toUpperCase() || 'A'}
                                        </div>
                                        <div className="board_info">
                                            <div className="board_title">{board.title}</div>
                                            <div className="board_content">{board.content}</div>
                                            <div className="board_meta">
                                                <span className="board_author">{board.author || board.nickname}</span>
                                                <span>•</span>
                                                <span className="board_date">{formatDate(board.createdAt)}</span>
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
                                    </div>
                                    <div className="board_item_right">
                                        <div className="board_actions">
                                            <button onClick={(e) => {e.stopPropagation(); handleDelete(board.id);}}>삭제</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty_state">
                                <p>아직 게시물이 없습니다.</p>
                                <p>첫 번째 게시물을 작성해보세요!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BoardList;
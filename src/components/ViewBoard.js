// src/components/ViewBoard.js

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import '../styles/home.css';
import '../styles/init.css';
import '../styles/viewBoard.css';

function ViewBoard({user, setUser}) {
    const { boardId } = useParams();
    const navigate = useNavigate();
    
    const [board, setBoard] = useState(null); 
    const token = sessionStorage.getItem("jwtToken");
    
    useEffect(() => {
        const fetchBoardDetail = async () => {
            if (!boardId || !token) {
                return; 
            }

            try {
                const response = await axios.get(`https://testspring-kmuc.onrender.com/api/boards/${boardId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setBoard(response.data); 
                console.log("상세 게시물 로딩 성공:", response.data);
            } catch(error) {
                console.error("게시물 로딩 에러", error);
            }
        }
        
        fetchBoardDetail();
        
    }, [boardId, token]);

    const handleLogOut = () => {
        sessionStorage.removeItem('jwtToken');
        sessionStorage.removeItem('userInfo');
        setUser(null);
        navigate('/');
    }

    const handleHome = () => {
        navigate('/');
    }

    if (!board) {
        return (
            <div className='Home_container'>
                <aside className='sidebar'>
                    <div className='sidebar_header'>
                        <div className='sidebar_logo'>💩</div>
                        <h2 className='sidebar_title'>하수구</h2>
                        <p className='sidebar_subtitle'>게시판</p>
                    </div>
                </aside>
                <main className='main_content'>
                    <div className='notToken'>게시물 로딩 중...</div>
                </main>
            </div>
        );
    }

    return (
        <div className='Home_container'>
            {/* 왼쪽 사이드바 */}
            <aside className='sidebar'>
                <div className='sidebar_header'>
                    <div className='sidebar_logo'>💩</div>
                    <h2 className='sidebar_title'>하수구</h2>
                    <p className='sidebar_subtitle'>게시판</p>
                </div>

                <nav className='sidebar_nav'>
                    <div className='nav_item' onClick={handleHome}>
                        <i className="bi bi-house-door-fill"></i>
                        <span>홈</span>
                    </div>
                    <div className='nav_item active'>
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
                        <div className='user_info'>
                            <div className='user_avatar'>
                                <i className="bi bi-person-fill"></i>
                            </div>
                            <span className='user_name'>게스트</span>
                        </div>
                    )}
                </div>
            </aside>

            {/* 메인 컨텐츠 */}
            <main className='main_content'>
                <div className='content_header'>
                    <h1 className='content_title'>💩 하수구</h1>
                </div>

                {token ? (
                    <div className="container" id='viewboard_container'>
                        <header>
                            <button onClick={() => navigate(-1)}>뒤로가기</button>
                        </header>
                        
                        <article className="board_content">
                            <h1>{board.title}</h1>
                            <div className="info_bar">
                                <small>작성자: <strong>{board.nickname}</strong></small>
                                <small>작성시간: {board.createdAt ? new Date(board.createdAt).toLocaleString('ko-KR') : '정보 없음'}</small>
                            </div>
                            <p className="content">{board.content}</p>
                            
                            <div className="action_buttons">
                                <button className="btn_like">
                                    <i className="bi bi-heart-fill"></i>
                                    좋아요
                                </button>
                                <button className="btn_comment">
                                    <i className="bi bi-chat-fill"></i>
                                    댓글
                                </button>
                            </div>
                        </article>
                        
                        {/* 댓글 섹션 (추후 구현) */}
                        <section className="comments_section">
                            <h3>댓글</h3>
                            <div className="comment_item">
                                <div className="comment_header">
                                    <div className="comment_avatar">A</div>
                                    <span className="comment_author">익명 사용자</span>
                                    <span className="comment_time">방금 전</span>
                                </div>
                                <p className="comment_content">댓글 기능은 추후 구현 예정입니다.</p>
                            </div>
                        </section>
                    </div>
                ) : (
                    <div className='notToken'>
                        로그인이 필요합니다 🔐
                    </div>
                )}
            </main>
        </div>
    );
}

export default ViewBoard;
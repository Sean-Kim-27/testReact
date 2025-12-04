// src/components/ViewBoard.js

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import '../styles/home.css'
import '../styles/init.css';
import '../styles/viewBoard.css';
import LikeButton from "./LikeButton";

function ViewBoard({user, setUser}) {
    // const [isLiked, setIsLiked] = useState(false); 
    // const [likeCount, setLikeCount] = useState(0);
    const [content, setContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const { boardId } = useParams();
    const navigate = useNavigate();
    
    const [board, setBoard] = useState(null); 
    const token = sessionStorage.getItem("jwtToken");

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

    useEffect(() => {
        fetchBoardDetail();
    }, [boardId, token]);

    const handleLogOut = () => {
        sessionStorage.removeItem('jwtToken');
        sessionStorage.removeItem('userInfo');
        setUser(null);
        navigate('/');
    }

    const handleDelete = async(boardId) => {
        try {
            await axios.delete(`https://testspring-kmuc.onrender.com/api/boards/${boardId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert("삭제 완.");
            // fetchBoards();
            navigate(-1);
        } catch(error) {
            console.error("씨발.", error)
        }
    }

    const handleComment = async(e) => {
        // console.log(content);
        e.preventDefault();
        try {
            await axios.post(`https://testspring-kmuc.onrender.com/api/boards/${boardId}/comments`, {
                content: content,
            }, {headers: { Authorization: `Bearer ${token}`}});
            alert("댓글이 작성 되었습니다!");
            setContent('');
            fetchBoardDetail();
        } catch(error) {
            console.error("씨바아알", error);
        }
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

    const toggleEditMode = () => {
        // 🚨 수정 모드 진입: 현재 게시물 데이터를 폼 상태에 채운다.
        if (board && !isEditing) {
            setEditTitle(board.title);
            setEditContent(board.content);
            setIsEditing(true);
        } else {
            // 🚨 수정 모드 종료/취소
            setIsEditing(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR');
    };

    const handleUpdateBoard = async (e) => {
        e.preventDefault();

        if (!editTitle.trim() || !editContent.trim()) {
            alert('제목과 내용을 입력해라!');
            return;
        }

        try {
            // 🚨 게시물 수정 API 호출 (PUT/PATCH 사용, Body에 제목과 내용 전송)
            const response = await axios.put(
                `https://testspring-kmuc.onrender.com/api/boards/${boardId}`,
                {
                    title: editTitle,
                    content: editContent,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // 🚨 성공 시 4단계로 넘어감
            alert('게시물 수정 성공!');
            
            // 4단계 로직을 여기에 통합! (로컬 상태 업데이트 및 모드 종료)
            setBoard(response.data); // 서버에서 업데이트된 게시물 전체를 받아왔다고 가정
            setIsEditing(false); // 수정 모드 종료

        } catch(error) {
            console.error("게시물 수정 에러:", error);
            alert("게시물 수정 실패! 작성자 권한이나 서버 상태를 확인해라.");
        }
    };

    return (
        <div className='Home_container'>
            {/* 왼쪽 사이드바 */}
            <div className="sidebar">
                <div className="sidebar_header">
                    <div className="sidebar_logo">📋</div>
                    <div className="sidebar_title">게시판</div>
                </div>
                
                <nav className="sidebar_menu">
                    <ul>
                        <li><a href="/" onClick={(e) => {e.preventDefault(); navigate('/')}} >
                            <span className="menu_icon">🏠</span>
                            홈
                        </a></li>
                        <li><a href="/boards" onClick={(e) => {e.preventDefault(); navigate('/boards');}} className="active">
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
                            <button className="logout_btn" onClick={handleLogOut}>
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
                            {
                                isEditing ? (
                                    // 🚨🚨🚨 [수정 모드] : 폼 띄우기 🚨🚨🚨
                                    <form onSubmit={handleUpdateBoard} className="board_edit_form">
                                        <input
                                            type="text"
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            placeholder="제목을 입력해라"
                                            className="update_title"
                                        />
                                        <div className="edit_board_meta">
                                            <small>작성자: <strong>{board.nickname}</strong></small>
                                            <small className="board_date">작성시간: {board.createdAt ? new Date(board.createdAt).toLocaleString('ko-KR') : '정보 없음'}</small>
                                        </div>
                                        <textarea
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            placeholder="내용을 입력해라"
                                            className="edit_content_textarea"
                                        />
                                        <div className="edit_button_container">
                                            <button type="submit" className="update_button">수정 완료</button>
                                            <button type="button" className="update_cancel_button" onClick={toggleEditMode}>취소</button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <h1 className="board_title">{board.title}</h1>
                                        <div className="board_meta">
                                            <small>작성자: <strong>{board.nickname}</strong></small>
                                            <small className="board_date">작성시간: {board.createdAt ? new Date(board.createdAt).toLocaleString('ko-KR') : '정보 없음'}</small>
                                        </div>
                                        <div className="board_body">
                                            <p>{board.content}</p>
                                        </div>
                                        
                                        <div className="action_buttons">
                                            <p className="comments_count">똥 싸질러진 수: {board.comments.length}</p>
                                            <LikeButton 
                                                boardId={board.id}
                                                likeCount={board.likeCount}
                                                isLiked={board.liked}
                                                token={token}
                                                fetchBoardDetail={fetchBoardDetail}
                                            />
                                            {/* <div className="d"></div> */}
                                            {
                                            board.nickname == user.nickname ?
                                                <>
                                                    <div className="delete_container">
                                                        <button className="delete" onClick={(e) => {e.stopPropagation(); handleDelete(board.id);}}>삭제</button>
                                                    </div>
                                                    <div className="update_container">
                                                        <button className="update" onClick={(e) => {toggleEditMode();}}>수정</button>
                                                    </div>
                                                </> : ''
                                            
                                            }
                                        </div>
                                    </>
                                )
                            }
                            
                        </article>
                        
                        {/* 댓글 섹션 (추후 구현) */}
                        <section className="comments_section" onSubmit={(e) => handleComment(e)}>
                            <h3 className="comments_header">똥싸지르기</h3>
                            <form className="comment_form">
                                <textarea placeholder="댓글 내용을 작성해 주세요." value={content} onChange={(e) => setContent(e.target.value)}></textarea>
                                <div className="comment_form_actions">
                                    <button type="submit">작성</button>
                                </div>
                            </form>
                            <div className="comment_list">
                                {
                                    board.comments.length > 0 ? (
                                        board.comments.map(board_item => (
                                            <div className="comment_item" key={board_item.id}>
                                                <div className="comment_header">
                                                    <span className="comment_author">{board_item.nickname}</span>
                                                    <span className="comment_time">{formatDate(board_item.createdAt)}</span>
                                                </div>
                                                <p className="comment_content">{board_item.content}</p>
                                            </div>
                                        ))
                                    ) : ''
                                }
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
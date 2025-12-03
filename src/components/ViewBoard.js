// src/components/ViewBoard.js

import React, { useState, useEffect } from "react";
// 🚨 1. URL에서 ID를 가져올 useParams와 페이지 이동을 위한 useNavigate
import { useParams, useNavigate } from 'react-router-dom'; 
import axios from 'axios';

function ViewBoard(userInfo, setUser) {
    // 🚨 2. URL에서 /viewBoard/:boardId 값을 가져옴
    const { boardId } = useParams();
    const navigate = useNavigate(); // 페이지 이동용
    const user = userInfo.user;
    console.log(user.nickname ? user.nickname : '');
    console.log(setUser);
    
    // 🚨 3. 게시물 상세 데이터를 저장할 상태
    const [board, setBoard] = useState(null); 
    const token = sessionStorage.getItem("jwtToken"); // 토큰 가져오기 (localStorage로 통일했다 가정)
    console.log(token);
    // 🚨 4. 컴포넌트가 처음 렌더링될 때 딱 한 번 실행되어 데이터를 가져옴
    useEffect(() => {
        // 🚨 async 함수를 useEffect 내부에서 정의하고 호출! (destroy is not a function 에러 방지)
        const fetchBoardDetail = async () => {
            if (!boardId || !token) {
                // ID나 토큰이 없으면 그냥 리턴
                return; 
            }

            try {
                // 🚨 5. 가져온 boardId를 사용하여 API에 요청
                const response = await axios.get(`https://testspring-kmuc.onrender.com/api/boards/${boardId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                // 🚨 6. 서버 응답으로 받은 데이터를 상태에 저장
                setBoard(response.data); 
                console.log("상세 게시물 로딩 성공:", response.data);
            } catch(error) {
                console.error("씨발 게시물 로딩 에러났다", error);
            }
        }
        
        fetchBoardDetail();
        
    }, [boardId, token]); // boardId나 token이 바뀔 때만 재실행

    const handleLogOut = () => {
        sessionStorage.removeItem('jwtToken');
        sessionStorage.removeItem('userInfo');
        navigate('/');
    }

    // 🚨 7. board 데이터가 null일 때 (로딩 중) 화면이 깨지지 않게 방어!
    if (!board) {
        return <div>게시물 로딩 중이거나 데이터를 찾을 수 없습니다.</div>;
    }

    // 🚨 8. board 데이터가 완벽하게 로드된 후 화면에 띄우기!
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
                    <div className='nav_item'>
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
                    <div className='user_info' onClick={handleLogOut}>
                        <div className='user_avatar'>
                            {user.nickname.charAt(0).toUpperCase()}
                        </div>
                        <span className='user_name'>{user.nickname ? user.nickname : ''}</span>
                        <i className="bi bi-box-arrow-right logout_icon"></i>
                    </div>
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
                            <small>
                                작성자: **{board.nickname}** | 
                                시간: {board.createdAt ? new Date(board.createdAt).toLocaleString() : '정보 없음'}
                            </small>
                        </div>
                        <p className="content">{board.content}</p>
                    </article>
                    
                    {/* 좋아요 버튼 등... */}
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
// src/components/BoardList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';
import '../styles/boardList.css';
import SockJS from 'sockjs-client';
import SideBar from './SideBar';
// 🚨 기존: import Stomp from 'stompjs/lib/stomp'; (이걸 바꿔야 함)

// 🚨🚨🚨 StompModule이라는 이름으로 임포트 후, 실제 Stomp 객체를 찾아서 Stomp 변수에 할당 🚨🚨🚨
import { Client } from '@stomp/stompjs';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getBoardList, createBoard, uploadImage } from '../services/boardService';

// console.log(Client);

function BoardList({ user, setUser }) {
    // const [boards, setBoards] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const token = sessionStorage.getItem("jwtToken");
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [file, setFile] = useState(null);

    const {
        data: boards,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ['boardList'],
        queryFn: getBoardList,
        enabled: !!token,
    });

    useEffect(() => {
        if (token) {
            // fetchBoards();
            const client = new Client({
                // 🚨 1. 웹소켓 브로커 URL 지정
                webSocketFactory: () => {
                    // SockJS를 사용해 https 주소로 연결 시도
                    return new SockJS('https://testspring-kmuc.onrender.com/ws');
                },
                
                // 🚨 2. 연결 성공 시 처리
                onConnect: () => {
                    console.log('웹소켓 연결 성공!');
                    // console.log(client);
                    
                    // 3. '/topic/boards' 채널 구독 시작
                    client.subscribe('/topic/new-board', (message) => {
                        console.log('새 게시글 알림 수신, 목록 업데이트:', message.body);
                        // 메시지가 오면 목록을 다시 불러와 화면을 최신화
                        // fetchBoards(); 
                        queryClient.invalidateQueries({queryKey: ['boardList']});
                    });
                    
                    // 🚨 초기 로딩 시 목록 가져오기
                    // fetchBoards(); 
                    client.activate();
                },
                
                // 4. 에러 처리
                onStompError: (frame) => {
                    console.error('웹소켓 에러:', frame);
                },
            });

            // 5. 클라이언트 활성화 (연결 시작)

            // 6. ⭐️ 컴포넌트가 종료될 때 연결 해제 (클린업)
            return () => {
                if (client) {
                    client.deactivate(); // 새 라이브러리에서는 deactivate()를 쓴다
                }
            };
        } else {
            navigate('/signInPage');
        }

        
    }, [token, queryClient]);

    // 🚨 4. 로딩 및 에러 처리 (JSX 리턴 전에 처리)
    if (isLoading) {
        return (
            <div className="Home_container">
                <SideBar user={user} setUser={setUser} state={'boardList'} />
                <div className="main_content">
                    <div className="loading_state">
                        <div className="loading_spinner"></div>
                        <div>로딩 중이다... 기다려라.</div>
                        <div className="loading_dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    if (isError) {
        console.error("게시물 로딩 에러:", error);
        return <div className="error_state">데이터를 못 가져왔다. 서버 상태 확인해라.</div>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            alert("제목과 내용을 입력해주세요.");
            return;
        }
        console.log(file);
        // 1. 이미지가 있으면 백엔드에 먼저 올려서 URL 받아옴
        let uploadedImageUrl = null;
        if (file) {
            const formData = new FormData();
            formData.append("file", file); // 파일 담기

            try {
                // ★ 백엔드 업로드 API 호출
                const res = await uploadImage(formData);
                uploadedImageUrl = res.data; // 백엔드가 준 URL (https://...)
                
            } catch (err) {
                alert("이미지 업로드 실패함");
                return;
            }
        } else {
            try {
                await createBoard(title, content, uploadedImageUrl, user.nickname);
                alert("게시글 작성 완료!");
                
                setTitle('');
                setContent('');
                setFile('');
                queryClient.invalidateQueries({queryKey: ['boardList']});
            } catch (error) {
                console.error("게시글 작성 실패:", error);
                alert("게시글 작성에 실패했습니다.");
            }
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
                <SideBar user={user} setUser={setUser} state={'boardList'} />
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
                        <li><a href="#" onClick={() => navigate('/profile')}>
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
                                                                <span>{board.commentCount }</span>
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                                
                                            </div>
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
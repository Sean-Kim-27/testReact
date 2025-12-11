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
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
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
    const [idx, setIdx] = useState(0); // 현재 페이지 인덱스 (0, 1, 2, ...)

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

    ///////////////////////// boards select /////////////////////////////
    // console.log(boards);
    const ITEMS_PER_PAGE = 5;

    const startIndex = idx * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;


    // 🚨 3. slice()는 원본 배열을 건드리지 않고, 새로운 배열을 반환한다. (가장 중요!)
    // boards가 없을 경우(로딩 중)를 대비해 빈 배열을 기본값으로 준다.
    const displayedBoards = boards ? boards.slice(startIndex, endIndex) : [];

    // 🚨 4. 전체 페이지 수 계산
    const totalPages = boards ? Math.ceil(boards.length / ITEMS_PER_PAGE) : 0;


    // 🚨 5. 페이지 변경 핸들러 함수
    const handlePageChange = (newIdx) => {
        if (newIdx >= 0 && newIdx < totalPages) {
            setIdx(newIdx); // 상태 업데이트는 이벤트 핸들러 안에서만!
        }
    };

    // console.log(displayedBoards); // 이제 displayedBoards에는 5개씩 묶인 배열이 들어있다.
    // console.log(boards.splice(0, boards.length));

    useEffect(() => {
        if (token) {
            // fetchBoards();
            // console.log("asd");
            // console.log(boards);
            const client = new Client({
                // 🚨 1. 웹소켓 브로커 URL 지정
                webSocketFactory: () => {
                    // SockJS를 사용해 https 주소로 연결 시도
                    return new SockJS('https://testspring-kmuc.onrender.com/ws');
                },
                
                // 🚨 2. 연결 성공 시 처리
                onConnect: () => {
                    // console.log('웹소켓 연결 성공!');
                    // console.log(client);
                    
                    // 3. '/topic/boards' 채널 구독 시작
                    client.subscribe('/topic/new-board', (message) => {
                        // console.log('새 게시글 알림 수신, 목록 업데이트:', message.body);
                        // 메시지가 오면 목록을 다시 불러와 화면을 최신화
                        // fetchBoards(); 
                        queryClient.invalidateQueries({queryKey: ['boardList']});

                    });
                    
                    // 🚨 초기 로딩 시 목록 가져오기
                    // fetchBoards(); 
                },
                
                // 4. 에러 처리
                onStompError: (frame) => {
                    console.error('웹소켓 에러:', frame);
                },
            });

            // 5. 클라이언트 활성화 (연결 시작)
            client.activate();
            
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

    // 🚨 2. 글 작성 Mutation 정의 (POST 요청)
    const createBoardMutation = useMutation({
        // mutationFn: 실제로 서버에 요청을 보낼 함수 (service 파일의 함수 사용)
        mutationFn: ({ title, content, uploadedImageUrl, nickname }) => 
            createBoard(title, content, uploadedImageUrl, nickname),
            
        // onSuccess: 요청 성공 시 실행 (이게 핵심이다!)
        onSuccess: () => {
            // 'boardList' 쿼리 키를 무효화하여 useQuery를 다시 실행시킨다!
            queryClient.invalidateQueries({ queryKey: ['boardList'] });
            
            // 입력 필드 초기화
            setTitle('');
            setContent('');
            setFile(null); 
            alert('게시물 등록 성공!');
        },
        
        // onError: 요청 실패 시 실행
        onError: (error) => {
            console.error('글 작성 중 오류 발생:', error.response?.data || error.message);
            alert(`글 작성 실패: ${error.response?.data?.message || '알 수 없는 오류'}`);
        }
    });

    // 🚨 4. handleSubmit 함수 수정 (Mutation 실행)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // ... (유효성 검사 유지) ...
        
        let uploadedImageUrl = null;
        
        // 파일 업로드 로직은 Mutation이 아니므로 그대로 유지
        if (file) {
            // console.log(file);
            try {
                const uploadResponse = await uploadImage(file);
                // 🚨🚨🚨 이전 대화에서 지적했던 버그 수정: .data.url을 써야 한다!
                uploadedImageUrl = uploadResponse.data; 
                // console.log(uploadedImageUrl);
            } catch (error) {
                console.error('이미지 업로드 실패:', error);
                alert("이미지 업로드에 실패했다.");
                return;
            }
        }
        
        // 🚨 Mutation 호출! (비동기 처리와 상태 관리를 라이브러리에 맡긴다)
        createBoardMutation.mutate({
            title, 
            content, 
            uploadedImageUrl, 
            nickname: user.nickname // user 객체에 nickname이 있다는 가정 하에
        });
    };

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

    // ✨ 에러 발생 시
    if (isError) {
        return (
            <div className="profile_container">
                <SideBar user={user} setUser={setUser} state={'profile'} />
                <div className="profile_content_container">
                    <div className="error_state">
                        <div>프로필 데이터를 불러오는데 실패했습니다.</div>
                        <button 
                            onClick={queryClient.invalidateQueries({queryKey: ['boardList']})}
                            style={{
                                padding: '10px 20px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            다시 시도
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 🚨 파일 변경 핸들러 추가
    const handleFileChange = (e) => {
        // e.target.files[0]이 선택된 파일이다.
        // console.log(e.target.files[0]);
        setFile(e.target.files[0]);
        // console.log(e.target.files[0]);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('userInfo');
        sessionStorage.removeItem('jwtToken');
        setUser(null);
        navigate('/');
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

                            <input 
                                type="file" 
                                onChange={(e) => { handleFileChange(e) }}
                                accept="image/*,video/*"
                            />
                            <button type="submit">작성</button>
                        </form>
                    </div>

                    <div className="board_list">
                        <div className='board-list-container'>
                            {/* 🚨 6. 5개씩 묶인 displayedBoards를 map 돌려 보여준다. */}
                            {displayedBoards.map((board) => (
                                <div key={board.id} className='list'>
                                    <div key={board.id} className="board_item" onClick={() => navigate(`/viewBoard/${board.id}`)}>
                                        <div className="board_item_left">
                                            <div className="board_profile">
                                                {board.nickname?.charAt(0)?.toUpperCase() || 'A'}
                                            </div>
                                            <div className="board_info">
                                                <div className="board_title">{board.title}</div>
                                                <div className="boardList_content">{board.content}</div>
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
                                    </div>
                                </div>
                            ))}

                            {/* 🚨 7. 페이지 이동 버튼 (JSX 하단에 추가) */}
                            <div className='pagination'>
                                <button 
                                    onClick={() => handlePageChange(idx - 1)} 
                                    disabled={idx === 0}
                                >
                                    이전
                                </button>
                                {/* 현재 페이지 번호 표시 (선택 사항) */}
                                <span>{idx + 1} / {totalPages}</span> 
                                <button 
                                    onClick={() => handlePageChange(idx + 1)} 
                                    disabled={idx === totalPages - 1 || totalPages === 0}
                                >
                                    다음
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BoardList;
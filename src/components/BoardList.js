import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Home from './Home';
import '../App.css'; // 스타일 좀 먹이자
import '../styles/boardList.css';
import '../styles/init.css';
import SockJS from 'sockjs-client';
// 🚨 기존: import Stomp from 'stompjs/lib/stomp'; (이걸 바꿔야 함)

// 🚨🚨🚨 StompModule이라는 이름으로 임포트 후, 실제 Stomp 객체를 찾아서 Stomp 변수에 할당 🚨🚨🚨
import { Client } from '@stomp/stompjs';

// console.log(Client);

function BoardList(userId) {
    // 1. 상태 관리 (변수들)
    const [boards, setBoards] = useState([]); // 게시글 목록 담을 바구니
    const [title, setTitle] = useState('');   // 제목 입력값
    const [content, setContent] = useState(''); // 내용 입력값
    // const [username, setUserName] = useState('');   // 작성자 입력값
    const token = sessionStorage.getItem("jwtToken");

    const USERID = userId["userId"];

    // 2. 서버에서 글 목록 가져오기 (GET)
    const fetchBoards = async () => {
        try {
            const response = await axios.get('https://testspring-kmuc.onrender.com/api/boards', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // 스프링 부트 주소로 요청 날림

            setBoards(response.data.id.sort()); // 가져온 데이터 바구니에 담기
            console.log("데이터 가져오기 성공:", response.data.id.sort());
            } catch (error) {
            console.error("에러 났다 씨발:", error);
            alert("서버랑 연결 안 됨. 백엔드 켜져있냐?");
        }
    };

    // 화면 켜지자마자 글 목록 가져와라 (useEffect)
    useEffect(() => {
        fetchBoards();
        const client = new Client({
            // 🚨 1. 웹소켓 브로커 URL 지정
            webSocketFactory: () => {
                // SockJS를 사용해 https 주소로 연결 시도
                return new SockJS('https://testspring-kmuc.onrender.com/ws');
            },
            
            // 🚨 2. 연결 성공 시 처리
            onConnect: () => {
                console.log('웹소켓 연결 성공!');
                
                // 3. '/topic/new-board' 채널 구독 시작
                client.subscribe('/topic/new-board', (message) => {
                    console.log('새 게시글 알림 수신, 목록 업데이트:', message.body);
                    // 메시지가 오면 목록을 다시 불러와 화면을 최신화
                    fetchBoards(); 
                });
                
                // 🚨 초기 로딩 시 목록 가져오기
                fetchBoards(); 
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
    }, []);

    // 3. 글 쓰기 (POST)
    const handleSubmit = async (e) => {
        e.preventDefault(); // 새로고침 막기

        if(!token) {
            alert("로그인을 해야 글을 이용할 수 있습니다.");
            return;
        }

        if (!title || !content) {
        alert("빈칸 다 채워라 뒤지기 싫으면");
        return;
        }

        try {
            await axios.post('https://testspring-kmuc.onrender.com/api/boards', {
                title: title,
                content: content,
                username: USERID
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(USERID);
            alert("저장 완료!");
            
            // 입력창 비우고 목록 다시 불러오기
            setTitle('');
            setContent('');
            // setUserName('');
            fetchBoards(); 
            } catch (error) {
            console.error("저장 실패:", error);
            alert("저장 실패. 로그 봐라.");
        }
    };

    const handleRemoveBoard = async(e) => {
        await axios.delete(`https://testspring-kmuc.onrender.com/api/boards/${e.target.dataset.boardId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        alert("삭제 완료!");
        fetchBoards();
    }

    return (
        <div className="board_container container" style={{ padding: '20px' }}>
            <h1 className='board_head_Text'>💩 하수구 💩</h1>

            {/* 글 쓰기 폼 */}
            <div className='write_form_container'>
                <h3>글 쓰기</h3>
                <form className='write_form' onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="제목" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ marginRight: '5px' }}
                    />
                    <input 
                        type="text" 
                        placeholder="내용" 
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        style={{ marginRight: '5px' }}
                    />
                    <button className='write_button' type="submit">등록</button>
                </form>
            </div>

            {/* 글 목록 보여주기 */}
            <div className="board-list-container">
                <h3>글 목록 ({boards.length}개)</h3>
                <div className='list_scroll'>
                    <div className='board_list'>
                        {boards.map((board) => (
                            <div key={board.id} className='list'>
                                {
                                    board.username === USERID ? <i className="bi bi-trash-fill" id='board_remove_icon' data-board-id={board.id} onClick={handleRemoveBoard} /> : ''
                                }
                                
                                <h4>[{board.id}] {board.title}</h4>
                                <p>{board.content}</p>
                                <small> 작성자: {board.nickname} | 시간: {board.createdAt}</small>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BoardList;

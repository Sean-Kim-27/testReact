import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Home from './Home';
import '../App.css'; // 스타일 좀 먹이자
import '../styles/boardList.css';
import '../styles/init.css';

function BoardList({user, userId}) {
    // 1. 상태 관리 (변수들)
    const [boards, setBoards] = useState([]); // 게시글 목록 담을 바구니
    const [title, setTitle] = useState('');   // 제목 입력값
    const [content, setContent] = useState(''); // 내용 입력값
    // const [username, setUserName] = useState('');   // 작성자 입력값
    const token = localStorage.getItem("jwtToken");

    // 2. 서버에서 글 목록 가져오기 (GET)
    const fetchBoards = async () => {
        try {
            const response = await axios.get('https://testspring-kmuc.onrender.com/api/boards', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // 스프링 부트 주소로 요청 날림
            setBoards(response.data); // 가져온 데이터 바구니에 담기
            console.log("데이터 가져오기 성공:", response.data);
            } catch (error) {
            console.error("에러 났다 씨발:", error);
            alert("서버랑 연결 안 됨. 백엔드 켜져있냐?");
        }
    };

    // 화면 켜지자마자 글 목록 가져와라 (useEffect)
    useEffect(() => {
        fetchBoards();
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
                username: user
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
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
            <h1 className='board_head_Text'>🔥 지존 게시판 🔥</h1>

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
                                    board.member.username === userId ? <i className="bi bi-trash-fill" id='board_remove_icon' data-board-id={board.id} onClick={handleRemoveBoard} /> : ''
                                }
                                
                                <h4>[{board.id}] {board.title}</h4>
                                <p>{board.content}</p>
                                <small> 작성자: {board.member?.nickname || "알 수 없음"} | 시간: {board.createdAt}</small>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BoardList;

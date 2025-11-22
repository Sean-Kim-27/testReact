import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // 스타일 좀 먹이자

function App() {
  // 1. 상태 관리 (변수들)
  const [boards, setBoards] = useState([]); // 게시글 목록 담을 바구니
  const [title, setTitle] = useState('');   // 제목 입력값
  const [content, setContent] = useState(''); // 내용 입력값
  const [writer, setWriter] = useState('');   // 작성자 입력값

  // 2. 서버에서 글 목록 가져오기 (GET)
  const fetchBoards = async () => {
    try {
      // 스프링 부트 주소로 요청 날림
      const response = await axios.get('https://testspring-kmuc.onrender.com/api/boards');
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

    if (!title || !content || !writer) {
      alert("빈칸 다 채워라 뒤지기 싫으면");
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/boards', {
        title: title,
        content: content,
        writer: writer
      });
      alert("저장 완료!");
      
      // 입력창 비우고 목록 다시 불러오기
      setTitle('');
      setContent('');
      setWriter('');
      fetchBoards(); 
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장 실패. 로그 봐라.");
    }
  };

  return (
    <div className="App" style={{ padding: '20px' }}>
      <h1>🔥 지존 게시판 🔥</h1>

      {/* 글 쓰기 폼 */}
      <div style={{ border: '2px solid black', padding: '10px', marginBottom: '20px' }}>
        <h3>글 쓰기</h3>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="제목" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ marginRight: '5px' }}
          />
          <input 
            type="text" 
            placeholder="작성자" 
            value={writer}
            onChange={(e) => setWriter(e.target.value)}
            style={{ marginRight: '5px' }}
          />
          <input 
            type="text" 
            placeholder="내용" 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ marginRight: '5px' }}
          />
          <button type="submit">등록</button>
        </form>
      </div>

      {/* 글 목록 보여주기 */}
      <div className="board-list">
        <h3>글 목록 ({boards.length}개)</h3>
        {boards.map((board) => (
          <div key={board.id} style={{ border: '1px solid gray', margin: '5px', padding: '10px' }}>
            <h4>[{board.id}] {board.title}</h4>
            <p>{board.content}</p>
            <small>작성자: {board.writer} | 시간: {board.createdAt}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
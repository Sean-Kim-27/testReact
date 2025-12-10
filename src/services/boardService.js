// src/services/boardService.js
import apiClient from '../api/apiClient'; // 🚨 중앙화된 클라이언트 사용

// 1. 게시글 목록 가져오기 함수 (BoardList.js의 fetchBoards를 이사시킨다)
export const getBoardList = async () => {
    // 🚨 apiClient가 이미 baseURL과 Authorization 헤더를 자동으로 처리한다!
    const response = await apiClient.get('/api/boards');
    
    // 정렬 로직도 여기서 처리하고 깔끔한 데이터만 반환
    return response.data.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
    });
};

// 2. 새 게시글 작성 함수
export const createBoard = async (title, content, imageUrl) => {
    const response = await apiClient.post('/api/boards', {
        title: title,
        content: content,
        imageUrl: imageUrl
    });
    return response.data;
};

// 3. 특정 게시글 상세 조회 (ViewBoard에서 사용)
export const getBoardDetail = async (boardId) => {
    // '/api/boards/{id}' 경로로 요청
    const response = await apiClient.get(`/api/boards/${boardId}`);
    return response;
};

// 4. (예시) 게시글 삭제
export const deleteBoard = async (boardId) => {
    await apiClient.delete(`/api/boards/${boardId}`);
    // 삭제는 보통 응답 데이터가 필요 없으므로 void로 처리
};

export const updateBoard = async (boardId, editTitle, editContent) => {
    const response = await apiClient.put(`/api/boards/${boardId}`, {
        title: editTitle,
        content: editContent});
    return response.data;
}

export const createComment = async(boardId, content) => {
    await apiClient.post(`/api/boards/${boardId}/comments`, {
        content: content
    });
}

///////////////////////////// Like Button ///////////////////////////////////

export const clickOnLike = async(boardId) => {
    await apiClient.post(`/api/boards/${boardId}/like`, { id: boardId });
}
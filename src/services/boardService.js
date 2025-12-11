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
export const createBoard = async (title, content, uploadedImageUrl, nickname) => {
    const response = await apiClient.post('/api/boards', {
        title: title,
        content: content,
        imageUrl: uploadedImageUrl,
        username: nickname
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

export const uploadImage = async(file) => {
    // 🚨 1. 파일 이름 인코딩 및 변경 로직
    // UUID + 원래 확장자를 붙여서 완전히 고유하고 안전한 이름으로 만든다.
    // 'file'이 null인지 확인하는 로직은 BoardList에서 처리했으니 여기서는 file이 있다고 가정.
    
    const fileExtension = file.name.split('.').pop(); // 확장자 추출
    const safeFileName = encodeURI(fileExtension);

    // console.log(safeFileName);
    
    // 🚨 2. 새로운 File 객체 생성
    // File(fileBits, fileName, options)
    // const safeFile = new File([file], safeFileName, { type: file.type }); // Blob 데이터는 그대로 쓰고 이름만 바꾼다!

    // 🚨 3. FormData 객체 생성 및 안전한 파일 추가
    const formData = new FormData();
    // 백엔드가 기대하는 키 'file'을 사용한다.
    formData.append('file', file, safeFileName); 

    try {
        // 🚨 4. apiClient에 FormData 객체를 바로 전달한다.
        const response = await apiClient.post('/api/boards/upload', formData); 
        
        // 서버 응답 (URL 문자열만 반환한다고 가정)
        return response; 
    } catch (error) {
        console.error("이미지 업로드 실패:", error.response || error);
        throw error;
    }
}

///////////////////////////// Like Button ///////////////////////////////////

export const clickOnLike = async(boardId) => {
    await apiClient.post(`/api/boards/${boardId}/like`, { id: boardId });
}
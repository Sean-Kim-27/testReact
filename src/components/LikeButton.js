// src/components/LikeButton.js

import React, { useState } from 'react';
import axios from 'axios';
import '../styles/likedButton.css'

function LikeButton({ boardId, initialLikeCount, initialIsLiked, token, fetchBoards, liked }) {
    // 🚨 1. 상태를 이 컴포넌트 내부에 선언 (이 버튼에만 종속됨)
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likeCount, setLikeCount] = useState(initialLikeCount);

    const handleLike = async () => {
        if (!token) {
            alert("로그인 먼저 쳐 해라!");
            return;
        }
        
        // 2. 낙관적 업데이트
        liked = !liked;

        try {
            // 3. 서버 요청
            const like = await axios.post(
                `https://testspring-kmuc.onrender.com/api/boards/${boardId}/like`, 
                null, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchBoards();
            
        } catch(error) {
            // 4. 실패 시 롤백
            setIsLiked(prev => !prev);
            setLikeCount(prev => prev + (isLiked ? 1 : -1));
            console.error("좋아요 요청 에러:", error);
        }
    };

    return (
        <i className={liked ? "bi bi-hand-thumbs-up-fill" : "bi bi-hand-thumbs-up"} 
            onClick={handleLike} 
            id='liked_button'
        />
    );
}

export default LikeButton;
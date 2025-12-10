// src/components/LikeButton.js

import React, { useState } from 'react';
import axios from 'axios';
import '../styles/likedButton.css'
import { clickOnLike } from '../services/boardService';

function LikeButton({ boardId, likeCount, isLiked, token, fetchBoardDetail }) {
    
    // // 🚨 1. 상태를 이 컴포넌트 내부에 선언 (이 버튼에만 종속됨)
    // const [isLiked, setIsLiked] = useState(initialIsLiked);
    // const [likeCount, setLikeCount] = useState(initialLikeCount);

    // console.log(boardId, isLiked, token, fetchBoardDetail);
    const handleLike = async () => {
        if (!token) {
            alert("로그인 먼저 쳐 해라!");
            return;
        }
        
        // 2. 낙관적 업데이트
        isLiked = !isLiked;
        
        try {
            // 3. 서버 요청
            console.log(boardId);
            await clickOnLike(boardId);
            fetchBoardDetail();
            
        } catch(error) {
            // 4. 실패 시 롤백
            // setIsLiked(prev => !prev);
            // setLikeCount(prev => prev + (isLiked ? 1 : -1));
            console.error("좋아요 요청 에러:", error);
        }
    };

    return (
        <div className='likeButton_Container'>
            <p>개추ㅋㅋ: {likeCount}</p>
            <i className={isLiked ? "bi bi-hand-thumbs-up-fill" : "bi bi-hand-thumbs-up"} 
                onClick={handleLike} 
                id='liked_button'
            />
        </div>
    );
}

export default LikeButton;
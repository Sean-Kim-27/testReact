// src/api/apiClient.js
import axios from 'axios';

// 🚨 1. Axios 인스턴스 생성 및 기본 URL 설정 (단 하나의 설정)
const apiClient = axios.create({
    baseURL: 'https://testspring-kmuc.onrender.com', 
    headers: {
        // 'Content-Type': 'multipart/form-data',
    },
});

// 🚨 2. 요청 인터셉터: 모든 요청에 토큰을 자동으로 붙여주는 마법 (선택 사항이지만 강력 추천)
apiClient.interceptors.request.use((config) => {
    // 모든 요청이 나가기 전에 실행됨
    const token = sessionStorage.getItem("jwtToken");
    if (token) {
        console.log(token);
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config; // 설정된 config를 반환해야 요청이 이어진다
}, (error) => {
    return Promise.reject(error);
});

export default apiClient; // 이 인스턴스를 다른 파일에서 사용할 거다.
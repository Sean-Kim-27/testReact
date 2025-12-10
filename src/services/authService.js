// src/services/authService.js
import apiClient from '../api/apiClient';

// 1. 로그인 요청
export const login = async (username, password) => {
    // '/auth/login'으로 요청, apiClient가 baseURL과 헤더를 알아서 처리.
    const response = await apiClient.post('/auth/login', {
        username: username,
        password: password,
    });
    return response.data; // { token, nickname } 등이 담긴다.
};

// 2. 회원가입 요청

// await axios.post('https://testspring-kmuc.onrender.com/auth/signup', {
      //   nickname: nickname,
      //   username: userId,
      //   password: password
      // });


export const register = async (nickname, username, password) => {
    // '/auth/signup'으로 요청
    const response = await apiClient.post('/auth/signup', {
        nickname: nickname,
        username: username,
        password: password,
    });
    return response.data;
};
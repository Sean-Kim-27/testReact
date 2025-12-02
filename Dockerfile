# 1. [Builder 단계] 빌드해서 정적 파일 뽑아내기
FROM node:18-alpine AS builder

WORKDIR /app

# 패키지 파일 복사 & 설치
COPY package.json package-lock.json ./
RUN npm install

# 소스 복사 & 빌드
COPY . .
RUN npm run build

# ---------------------------------------------------------

# 2. [Runner 단계] Nginx로 서빙하기
FROM nginx:stable-alpine

# 아까 만든 nginx 설정 파일 덮어쓰기
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드된 결과물(build 폴더)만 쏙 가져와서 Nginx 폴더에 넣기
COPY --from=builder /app/build /usr/share/nginx/html

# 80번 포트 열기
EXPOSE 80

# 실행
CMD ["nginx", "-g", "daemon off;"]
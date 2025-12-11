// src/utils/mediaUtils.js (새로 만들어라!)

/**
 * 주어진 URL이 이미지인지 영상인지 구분하는 함수
 * @param {string} url - 업로드된 파일의 URL
 * @returns {'image' | 'video' | null} 파일 타입
 */
export const getMediaTypeFromUrl = (url) => {
    if (!url || typeof url !== 'string') {
        return null;
    }

    // console.log(url);

    // 1. URL의 경로 부분만 가져온다 (쿼리 파라미터는 제거)
    const path = url.split('?')[0]; 
    
    // 2. 마지막 . 뒤의 확장자를 소문자로 가져온다.
    const extension = path.split('_').pop().toLowerCase(); 
    // console.log(extension);
    // 3. 이미지 확장자 목록
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
    
    // 4. 영상 확장자 목록 (네가 허용했을 만한 것들)
    const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi']; 
    
    if (imageExtensions.includes(extension)) {
        
        return 'image';
    } else if (videoExtensions.includes(extension)) {
        return 'video';
    } else {
        // 둘 다 아니면 (혹은 확장자가 없는 URL이면) 널을 반환하거나, 안전하게 'image'로 처리할 수 있다.
        // 여기서는 명확하게 null을 반환한다.
        return null; 
    }
};
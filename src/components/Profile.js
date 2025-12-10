import { useEffect, useState } from "react";
import { getBoardList } from "../services/boardService";
import { useNavigate } from "react-router-dom";
import SideBar from "./SideBar";
import '../styles/profile.css'

function Profile({user, setUser}) {
    const [ likeBoards, setLikeBoards ] = useState([]);
    const [ writeBoards, setWriteBoards ] = useState([]);
    let toggle = {'like' : false, 'write' : false};
    // const [ commentBoards, setCommentBoards ] = useState([]);
    const navigate = useNavigate();
    const {nickname} = JSON.parse(sessionStorage.getItem('userInfo'));
    console.log(nickname);

    const ProfileFetch = async() => {
        try {
            const boardLists = await getBoardList();

            setWriteBoards(boardLists.filter(item => item.nickname == nickname));
            setLikeBoards(boardLists.filter(item => item.liked == true));
            // console.log(boardLists.filter(boardList => boardList.nickname == nickname));
            // console.log(boardList.map(board => board.liked == true));
            // console.log(likeBoards);
        } catch(error) {
            console.log("Tlqkf", error);
        }
    }
    console.log(writeBoards );
    useEffect(() => {
        ProfileFetch();
    }, []);

    const handleButton = (e, focus) => {
        const likeListContainer = document.querySelector('.like_list_container');
        const writeListContainer = document.querySelector('.write_list_container');
        // console.log(e.target);

        if(!toggle[focus]) {
            if(focus == 'like') {
                likeListContainer.style.height="500px";
                likeListContainer.style.overflowY="scroll";
                // e.target.style.transform="rotate(180deg)";
            } else if(focus == 'write') {
                writeListContainer.style.height="500px";
                writeListContainer.style.overflowY="scroll";

            }
            
        } else {
            if(focus == 'like') {
                likeListContainer.style.height="80px";
                likeListContainer.style.overflow="hidden";
            } else if(focus == 'write') {
                writeListContainer.style.height="80px";
                writeListContainer.style.overflow="hidden";
            }
            
        }

        toggle[focus] = !toggle[focus];
    }

    const calcLikeCount = () => {
        let LikeCount = 0;
        [...writeBoards].map(writeBoard => {
            LikeCount += writeBoard.likeCount;
        });

        return LikeCount;
    }

    const totalLikeCount = calcLikeCount();

    // console.log(likeBoards);
    // likeBoards.map(likeBoard => { console.log(likeBoard.liked) });
    // [...likeBoards].map(likeBoard => { console.log(likeBoard.title, likeBoard.title, likeBoard.content, likeBoard.nickname) });

    return(
        <div className="profile_container">
            <SideBar user={user} setUser={setUser} state={'profile'} />

            <div className="profile_content_container">
                <div className="profile_info_container">
                    <p>네놈의 이름: {nickname} | 개추 받은 수: {totalLikeCount} | 내가 싸지른 게시물: {[...writeBoards].length}개</p>    
                </div>

                <div onClick={() => {navigate(-1)}} className="location_back_button">뒤로가기</div>
                <div className="like_list_container">
                    {user ? (
                        <>
                            <h2 className="like_list_button">개추 누른 게시물 <i className="bi bi-arrow-down-circle" style={{fontSize: '24px'}} onClick={ (e) => handleButton(e, 'like') }></i></h2>
                            {likeBoards.length > 0 ? [...likeBoards].map((likeBoard) => (
                                <div key={likeBoard.id} onClick={() => {navigate(`/viewBoard/${likeBoard.id}`)}}>
                                    <>
                                        <div>{likeBoard.title}</div>
                                        <div>{likeBoard.content}</div>
                                        <div>{likeBoard.nickname} | {likeBoard.createdAt}</div>
                                    </>
                                </div>
                            )) : <div>좋아요를 누른 게시물이 존재하지 않습니다.</div>}
                        </>
                    ): '로그인 먼저 해주세요.'}
                </div>
                <div className="write_list_container">
                    <h2 className="wrtie_list_button">내가 싸지른 게시물 <i className="bi bi-arrow-down-circle" style={{fontSize: '24px'}} onClick={ (e) => handleButton(e, 'write') }></i></h2>

                    {writeBoards.length > 0 ? [...writeBoards].map((writeBoard) => (
                        <div key={writeBoard.id} onClick={() => {navigate(`/viewBoard/${writeBoard.id}`)}}>
                                    <>
                                        <div>{writeBoard.title}</div>
                                        <div>{writeBoard.content}</div>
                                        <div>{writeBoard.nickname} | {writeBoard.createdAt}</div>
                                    </>
                                </div>
                    )) : <div>아직 싸지른 게시물이 없다.</div>}
                </div>
            </div>
        </div>
    );
}

export default Profile;
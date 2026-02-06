import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MyPage from "../modal/MyPage";

function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMyPageOpen, setIsMyPageOpen] = useState(false);

    useEffect(() => {
        // 로그인 상태 확인
        const username = localStorage.getItem('username');
        setIsLoggedIn(!!username);
    }, []);

    const handleMyPageClick = () => {
        setIsMyPageOpen(true);
    };

    return (
        <>
            <div className="header">
                {/* 로고 이미지 영역 (클릭 시 메인 페이지로 이동) */}
                <div className="logo">
                    <Link to="/" id="logo-link"><img src="img/logo.png" alt="Stufit Logo" /></Link>
                </div>
                {/* 메인 네비게이션 메뉴: 출석체크, 챌린지, 랭킹 등 */}
                <div className="nav">
                    <Link to="/attendance" id="attendance-link">출석체크</Link>
                    <Link to="/challenge" id="challenge-link">챌린지</Link>
                    <Link to="/ranking" id="ranking-link">랭킹</Link>
                    <Link to="/community" id="community-link">커뮤니티</Link>
                    <Link to="/shop" id="shop-link">상점</Link>
                </div>
                {/* 사용자 인증 영역: 로그인 및 회원가입 링크 */}
                <div className="auth">
                    {isLoggedIn ? (
                        <button onClick={handleMyPageClick} id="mypage-btn" className="mypage-link">마이페이지</button>
                    ) : (
                        <>
                            <Link to="/login" id="login-link">로그인</Link> | <Link to="/signup" id="signup-link">회원가입</Link>
                        </>
                    )}
                </div>
            </div>
            
            <MyPage isOpen={isMyPageOpen} onClose={() => setIsMyPageOpen(false)} />
        </>
    );
};
export default Header;
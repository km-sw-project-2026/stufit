import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MyPage from "../modal/MyPage";

function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMyPageOpen, setIsMyPageOpen] = useState(false);
    const [points, setPoints] = useState(0);

    useEffect(() => {
        // 로그인 상태 확인
        const checkLoginStatus = () => {
            const username = localStorage.getItem('username');
            setIsLoggedIn(!!username);
            
            // 로그인 상태면 포인트도 로드
            if (username) {
                const storedPoints = localStorage.getItem('points');
                setPoints(storedPoints ? Number(storedPoints) : 0);
            } else {
                setPoints(0);
            }
        };

        checkLoginStatus();

        // 포인트 업데이트 이벤트 리스너
        const handlePointsUpdate = (event) => {
            const newPoints = Number(event?.detail?.points);
            if (!Number.isNaN(newPoints)) {
                console.log('🟢 Header: 포인트 업데이트 감지!', newPoints);
                setPoints(newPoints);
            }
        };

        // storage 이벤트 리스너 추가 (다른 탭에서의 변경 감지)
        window.addEventListener('storage', checkLoginStatus);
        
        // 커스텀 이벤트 리스너 추가 (같은 탭에서의 변경 감지)
        window.addEventListener('loginStatusChanged', checkLoginStatus);
        window.addEventListener('pointsUpdated', handlePointsUpdate);

        return () => {
            window.removeEventListener('storage', checkLoginStatus);
            window.removeEventListener('loginStatusChanged', checkLoginStatus);
            window.removeEventListener('pointsUpdated', handlePointsUpdate);
        };
    }, []);

    const handleMyPageClick = () => {
        setIsMyPageOpen(true);
    };

    return (
        <>
            <div className="header" style={{ position: 'relative', zIndex: 2000 }}>
                {/* 로고 이미지 영역 (클릭 시 메인 페이지로 이동) */}
                <div className="logo">
                    <Link to="/" id="logo-link"><img src="/img/logo.png" alt="Stufit Logo" /></Link>
                </div>
                {/* 메인 네비게이션 메뉴: 출석체크, 챌린지, 랭킹 등 */}
                <div className="nav">
                    <Link to="/attendance" id="attendance-link">출석체크</Link>
                    <Link to="/ongoing-challenges" id="challenge-link">챌린지</Link>
                    <Link to="/ranking" id="ranking-link">랭킹</Link>
                    <Link to="/community" id="community-link">커뮤니티</Link>
                    <Link to="/shop" id="shop-link">상점</Link>
                </div>
                {/* 사용자 인증 영역: 로그인 및 회원가입 링크 */}
                <div className="auth">
                    {isLoggedIn ? (
                        <>
                            <span style={{ 
                                marginRight: '15px', 
                                color: '#70c1b3', 
                                fontWeight: 'bold',
                                fontSize: '14px'
                            }}>
                                {points.toLocaleString()}P
                            </span>
                            <button onClick={handleMyPageClick} id="mypage-btn" className="mypage-link">마이페이지</button>
                        </>
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
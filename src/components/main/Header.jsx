import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MyPage from "../modal/MyPage";

function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMyPageOpen, setIsMyPageOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileViewport, setIsMobileViewport] = useState(false);
    const [points, setPoints] = useState(0);

    useEffect(() => {
        let isMounted = true;

        const fetchPointsFromDb = async ({ username, userId }) => {
            const normalizedUserId = Number(userId);
            if (!username && (!Number.isInteger(normalizedUserId) || normalizedUserId <= 0)) {
                return;
            }

            try {
                const query = Number.isInteger(normalizedUserId) && normalizedUserId > 0
                    ? `?userId=${normalizedUserId}`
                    : '';

                const response = await fetch(`/api/user/points${query}`, {
                    method: 'GET',
                    headers: {
                        ...(username ? { 'X-Username': encodeURIComponent(username) } : {}),
                        ...(Number.isInteger(normalizedUserId) && normalizedUserId > 0 ? { 'X-User-Id': String(normalizedUserId) } : {}),
                    },
                });

                const payload = await response.json().catch(() => null);
                if (!response.ok || !payload?.success) {
                    return;
                }

                const dbPoints = Number(payload?.points);
                if (!Number.isNaN(dbPoints) && isMounted) {
                    localStorage.setItem('points', String(dbPoints));
                    setPoints(dbPoints);
                    window.dispatchEvent(new CustomEvent('pointsUpdated', { detail: { points: dbPoints } }));
                }
            } catch (error) {
                console.error('Header points fetch failed:', error);
            }
        };

        // 로그인 상태 확인
        const checkLoginStatus = async () => {
            const username = localStorage.getItem('username');
            const userId = localStorage.getItem('userId');
            setIsLoggedIn(!!username);
            
            // 로그인 상태면 포인트도 로드
            if (username) {
                const storedPoints = localStorage.getItem('points');
                setPoints(storedPoints ? Number(storedPoints) : 0);
                await fetchPointsFromDb({ username, userId });
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

        const updateViewport = () => {
            setIsMobileViewport(window.innerWidth <= 750);
        };

        updateViewport();
        window.addEventListener('resize', updateViewport);

        return () => {
            isMounted = false;
            window.removeEventListener('storage', checkLoginStatus);
            window.removeEventListener('loginStatusChanged', checkLoginStatus);
            window.removeEventListener('pointsUpdated', handlePointsUpdate);
            window.removeEventListener('resize', updateViewport);
        };
    }, []);

    useEffect(() => {
        if (!isMobileViewport) {
            setIsMobileMenuOpen(false);
        }
    }, [isMobileViewport]);

    const handleMyPageClick = () => {
        setIsMyPageOpen(true);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <div className={`header ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`} style={{ position: 'relative', zIndex: 2000 }}>
                {/* 로고 이미지 영역 (클릭 시 메인 페이지로 이동) */}
                <div className="logo">
                    <Link to="/" id="logo-link" onClick={closeMobileMenu}><img src="/img/logo.png" alt="Stufit Logo" /></Link>
                </div>
                {/* 메인 네비게이션 메뉴: 출석체크, 챌린지, 랭킹 등 */}
                <div
                    className={`nav ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}
                    style={isMobileViewport ? {
                        maxHeight: isMobileMenuOpen ? '280px' : '0px',
                        opacity: isMobileMenuOpen ? 1 : 0,
                        transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(-8px)',
                        pointerEvents: isMobileMenuOpen ? 'auto' : 'none',
                    } : undefined}
                >
                    <Link to="/attendance" id="attendance-link" onClick={closeMobileMenu}>출석체크</Link>
                    <Link to="/ongoing-challenges" id="challenge-link" onClick={closeMobileMenu}>챌린지</Link>
                    <Link to="/ranking" id="ranking-link" onClick={closeMobileMenu}>랭킹</Link>
                    <Link to="/community" id="community-link" onClick={closeMobileMenu}>커뮤니티</Link>
                    <Link to="/shop" id="shop-link" onClick={closeMobileMenu}>상점</Link>
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
                            <button onClick={() => { closeMobileMenu(); handleMyPageClick(); }} id="mypage-btn" className="mypage-link">마이페이지</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" id="login-link" onClick={closeMobileMenu}>로그인</Link> | <Link to="/signup" id="signup-link" onClick={closeMobileMenu}>회원가입</Link>
                        </>
                    )}
                </div>
                {/* 모바일 햄버거 버튼: 750px 이하에서만 표시 */}
                <button
                    type="button"
                    className="mobile-menu-toggle"
                    onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                    aria-label="메뉴 열기"
                    aria-expanded={isMobileMenuOpen}
                >
                    ☰
                </button>
            </div>
            
            <MyPage isOpen={isMyPageOpen} onClose={() => setIsMyPageOpen(false)} />
        </>
    );
};
export default Header;
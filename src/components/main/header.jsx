function Header () {
    return(
        <div className="header">
                {/* <!-- 로고 이미지 영역 (클릭 시 메인 페이지로 이동) --> */}
                <div className="logo">
                    <img src="img/logo.png" alt="Stufit Logo" />
                </div>
                {/* <!-- 메인 네비게이션 메뉴: 출석체크, 챌린지, 랭킹 등 --> */}
                <div className="nav">
                    <a href="#" id="attendance-link">출석체크</a>
                    <a href="#" id="challenge-link">챌린지</a>
                    <a href="#" id="ranking-link">랭킹</a>
                    <a href="#" id="community-link">커뮤니티</a>
                    <a href="#">상점</a>
                </div>
                {/* <!-- 사용자 인증 영역: 로그인 및 회원가입 링크 --> */}
                <div className="auth">
                    <a href="#" id="login-link">로그인</a> | <a href="#" id="signup-link">회원가입</a>
                </div>
            </div>
    );
};
export default Header;
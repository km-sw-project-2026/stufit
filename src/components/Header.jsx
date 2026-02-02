function Header({ onNavigate, isLoggedIn }) {
  return (
    <div className="header">
      <div className="logo">
        <img src="img/logo.png" alt="Stufit Logo" />
      </div>
      <div className="nav">
        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('attendance'); }}>출석체크</a>
        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('challenge'); }}>챌린지</a>
        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('ranking'); }}>랭킹</a>
        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('community'); }}>커뮤니티</a>
        <a href="#">상점</a>
      </div>
      <div className="auth">
        {!isLoggedIn ? (
          <>
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('login'); }}>로그인</a> | <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('signup'); }}>회원가입</a>
          </>
        ) : (
          <>
            <a href="#">마이페이지</a> | <a href="#">로그아웃</a>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;

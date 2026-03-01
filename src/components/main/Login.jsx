import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Footer from "./Footer";
import CustomAlertModal from "../modal/CustomAlertModal";

function Login() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const navigate = useNavigate();
  const [alertModal, setAlertModal] = useState({ show: false, message: '', onClose: null });

  const showAlert = (message, onClose) => {
    setAlertModal({ show: true, message, onClose: onClose || null });
  };

  const closeAlert = () => {
    const cb = alertModal.onClose;
    setAlertModal({ show: false, message: '', onClose: null });
    if (cb) cb();
  };

  const handleLogin = async () => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: id, password: pw }),
      });

      const data = await res.json();

      if (!res.ok) {
        showAlert(data.message);
        return;
      }

      // 사용자 정보 저장
      localStorage.setItem("username", id);
      localStorage.setItem("userId", String(data.userId));
      localStorage.setItem("joinDate", new Date().toLocaleDateString('ko-KR'));
      
      // 로그인 상태 변경 이벤트 발생
      window.dispatchEvent(new Event('loginStatusChanged'));
      
      showAlert('로그인 성공!', () => navigate("/challenge"));
    } catch {
      showAlert("서버 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <div id="login-view" className="login-view">
        <div className="login-container-view">
          <div className="input-group">
            <label htmlFor="login-id-view">아이디</label>
            <input type="text" id="login-id-view" placeholder="아이디를 입력해주세요." value={id} onChange={(e) => setId(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
          </div>

          <div className="input-group">
            <label htmlFor="login-pw-view">비밀번호</label>
            <input type="password" id="login-pw-view" placeholder="비밀번호를 입력해주세요." value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
          </div>
          <div className="button-group">
            <button className="login-btn" onClick={handleLogin}>로그인</button>
            <Link to="/signup" className="signup-btn">회원가입</Link>
          </div>

          <div className="login-footer-links">
            <a href="#">아이디 찾기</a>
            <a href="#">비밀번호 찾기</a>
          </div>
        </div>
      </div>

      <Footer />

      {alertModal.show && (
        <CustomAlertModal message={alertModal.message} onClose={closeAlert} />
      )}
    </>
  );
}

export default Login;

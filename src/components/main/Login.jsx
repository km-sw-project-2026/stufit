import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Footer from "./Footer";
import CustomAlertModal from "../modal/CustomAlertModal";

function Login() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const navigate = useNavigate();
  const [alertModal, setAlertModal] = useState({
    show: false,
    message: "",
    onClose: null,
  });
  const [socialUrls, setSocialUrls] = useState({ naver: null, kakao: null });

  useEffect(() => {
    fetch("/api/auth/social-config")
      .then((r) => r.json())
      .then((data) => setSocialUrls(data))
      .catch(() => {});
  }, []);

  // 소셜 로그인 callback 처리 (리다이렉트로 전달된 파라미터)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("socialLogin") === "1") {
      const userId = params.get("userId");
      const username = params.get("username");
      if (userId && username) {
        localStorage.setItem("username", decodeURIComponent(username));
        localStorage.setItem("userId", userId);
        localStorage.setItem("joinDate", new Date().toLocaleDateString("ko-KR"));
        window.dispatchEvent(new Event("loginStatusChanged"));
        showAlert("로그인 성공!", () => navigate("/challenge"));
      }
    }
  }, []);

  const showAlert = (message, onClose) => {
    setAlertModal({ show: true, message, onClose: onClose || null });
  };

  const closeAlert = () => {
    const cb = alertModal.onClose;
    setAlertModal({ show: false, message: "", onClose: null });
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
      localStorage.setItem("joinDate", new Date().toLocaleDateString("ko-KR"));

      // 로그인 상태 변경 이벤트 발생
      window.dispatchEvent(new Event("loginStatusChanged"));

      showAlert("로그인 성공!", () => navigate("/challenge"));
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
            <input
              type="text"
              id="login-id-view"
              placeholder="아이디를 입력해주세요."
              value={id}
              onChange={(e) => setId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          <div className="input-group">
            <label htmlFor="login-pw-view">비밀번호</label>
            <input
              type="password"
              id="login-pw-view"
              placeholder="비밀번호를 입력해주세요."
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>
          <div className="button-group">
            <button className="login-btn" onClick={handleLogin}>
              로그인
            </button>
            <Link to="/signup" className="signup-btn">
              회원가입
            </Link>
          </div>

          <div className="login-footer-links">
            <span>아이디 찾기</span>
            <span>비밀번호 찾기</span>
          </div>

          <div className="social-login-section">
            <p className="social-login-divider">SNS 계정으로 로그인</p>
            <div className="social-login-buttons">
              <button
                className="social-btn naver-btn"
                onClick={() => {
                  if (socialUrls.naver) window.location.href = socialUrls.naver;
                }}
              >
                <svg viewBox="0 0 24 24" width="20" height="20"><path fill="#fff" d="M16.273 12.845 7.727 3H3v18h4.727V8.845l8.546 9.845H21V3h-4.727v9.845z"/></svg>
                네이버 로그인
              </button>
              <button
                className="social-btn kakao-btn"
                onClick={() => {
                  if (socialUrls.kakao) window.location.href = socialUrls.kakao;
                }}
              >
                <svg viewBox="0 0 24 24" width="20" height="20"><path fill="#371D1E" d="M12 3C6.48 3 2 6.58 2 11c0 2.75 1.74 5.17 4.36 6.67L5.5 21l4.19-2.3c.76.2 1.54.3 2.31.3 5.52 0 10-3.58 10-8s-4.48-8-10-8z"/></svg>
                카카오 로그인
              </button>
            </div>
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

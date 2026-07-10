import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import CustomAlertModal from "../modal/CustomAlertModal";

function Signup() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const navigate = useNavigate();
  const [alertModal, setAlertModal] = useState({
    show: false,
    message: "",
    onClose: null,
  });

  const showAlert = (message, onClose) => {
    setAlertModal({ show: true, message, onClose: onClose || null });
  };

  const closeAlert = () => {
    const cb = alertModal.onClose;
    setAlertModal({ show: false, message: "", onClose: null });
    if (cb) cb();
  };

  const handleSignup = async () => {
    // 1. 입력값 검증
    if (!id || !pw || !pwConfirm) {
      showAlert("모든 항목을 입력해주세요.");
      return;
    }

    // 2. 비밀번호 확인
    if (pw !== pwConfirm) {
      showAlert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      // 3. API 호출
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: id, password: pw }),
      });

      const data = await res.json();

      if (!res.ok) {
        showAlert(data.message);
        return;
      }

      // 4. 성공 시 로그인 페이지로 이동
      showAlert("회원가입이 완료되었습니다! 로그인해주세요.", () =>
        navigate("/"),
      );
    } catch {
      showAlert("서버 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <div id="signup-view" className="login-view">
        <div className="login-container-view">
          <div className="input-group">
            <label htmlFor="signup-id-view">아이디</label>
            <input
              type="text"
              id="signup-id-view"
              placeholder="아이디를 입력해주세요."
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="signup-pw-view">비밀번호</label>
            <input
              type="password"
              id="signup-pw-view"
              placeholder="비밀번호를 입력해주세요."
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="signup-pw-confirm-view">비밀번호 확인</label>
            <input
              type="password"
              id="signup-pw-confirm-view"
              placeholder="비밀번호를 다시 입력해주세요."
              value={pwConfirm}
              onChange={(e) => setPwConfirm(e.target.value)}
            />
          </div>
          <div className="button-group">
            <button className="login-btn" onClick={handleSignup}>
              회원가입
            </button>
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
export default Signup;

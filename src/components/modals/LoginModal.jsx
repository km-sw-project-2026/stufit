import { useState } from "react";

function LoginModal({ onClose, onSignup, onLogin }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (id && password) {
      onLogin();
    }
  };

  return (
    <div className="login-view">
      <div className="login-container-view">
        <div className="input-group">
          <label htmlFor="login-id-view">아이디</label>
          <input
            type="text"
            id="login-id-view"
            placeholder="아이디를 입력해주세요."
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="login-pw-view">비밀번호</label>
          <input
            type="password"
            id="login-pw-view"
            placeholder="비밀번호를 입력해주세요."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="button-group">
          <button className="login-btn" onClick={handleLogin}>
            로그인
          </button>
          <button className="signup-btn" onClick={onSignup}>
            회원가입
          </button>
        </div>
        <div className="login-footer-links">
          <a href="#">아이디 찾기</a>
          <a href="#">비밀번호 찾기</a>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;

import { useState } from "react";

function SignupModal({ onClose, onSignup }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = () => {
    if (id && password && confirmPassword && password === confirmPassword) {
      onSignup();
    }
  };

  return (
    <div className="login-view">
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="signup-pw-confirm-view">비밀번호 확인</label>
          <input
            type="password"
            id="signup-pw-confirm-view"
            placeholder="비밀번호를 다시 입력해주세요."
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="button-group">
          <button className="login-btn" onClick={handleSignup}>
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignupModal;

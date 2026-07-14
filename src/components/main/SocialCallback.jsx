import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function SocialCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const userId = params.get("userId");
    const username = params.get("username");

    if (userId && username) {
      localStorage.setItem("username", username);
      localStorage.setItem("userId", userId);
      localStorage.setItem("joinDate", new Date().toLocaleDateString("ko-KR"));
      window.dispatchEvent(new Event("loginStatusChanged"));
      navigate("/challenge", { replace: true });
    } else {
      const error = params.get("error");
      if (error) alert(decodeURIComponent(error));
      navigate("/login", { replace: true });
    }
  }, []);

  return <div style={{ textAlign: "center", padding: 80, fontSize: 18 }}>로그인 처리 중...</div>;
}

export default SocialCallback;

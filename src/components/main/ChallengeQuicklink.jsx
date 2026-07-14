import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ChallengeQuicklink() {
  const [displayText, setDisplayText] = useState("");
  const navigate = useNavigate();

  const fullText = "Join The Challenge Now";

  useEffect(() => {
    let currentIndex = 1;

    const typingTimer = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingTimer);
      }
    }, 100);

    return () => clearInterval(typingTimer);
  }, [fullText]);

  const handleNavigate = () => {
    navigate("/challenge");
    window.scrollTo(0, 0);
  };

  return (
    <div className="challenge-quicklink">
      <div className="challenge-quicklink-inner">
        <div className="stufit-logo">STUFIT</div>
        <h2 style={{ minHeight: "40px" }}>{displayText || "\u00A0"}</h2>
        <p>여러가지 챌린지를 만들어 친구들과 경쟁하세요!</p>
        <button onClick={handleNavigate}>바로가기</button>
      </div>
    </div>
  );
}

export default ChallengeQuicklink;

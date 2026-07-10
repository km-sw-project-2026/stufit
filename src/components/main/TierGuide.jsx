import React from "react";
import Footer from "./Footer";
import { TIER_GUIDE } from "../../constants/tiers";

function TierGuide() {
  return (
    <>
      <div className="tier-guide-view">
        <div className="tier-guide-container">
          <h1 className="tier-guide-title">티어 진척도 가이드</h1>

          <div className="tier-icons-row">
            {TIER_GUIDE.map((tier, index) => (
              <div key={index} className="tier-item">
                <img
                  src={tier.image}
                  alt={tier.name}
                  className="tier-icon-img"
                />
                <p className="tier-score">{tier.minScore.toLocaleString()}</p>
              </div>
            ))}
          </div>

          <div className="tier-content-row">
            <div className="tier-section">
              <h2 className="tier-section-title">티어 산정 기준</h2>
              <p className="tier-description">
                티어는 점수 기준으로 산정되며, 승급 점수 간격은 다음과 같습니다:
              </p>
              <div
                className="tier-guide-list"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "20px",
                  marginTop: "20px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src="/img/Bronze.png"
                    alt="Bronze"
                    style={{ width: "40px", marginRight: "10px" }}
                  />
                  <span>
                    <strong>Bronze:</strong> 0점 이상
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src="/img/Silver.png"
                    alt="Silver"
                    style={{ width: "40px", marginRight: "10px" }}
                  />
                  <span>
                    <strong>Silver:</strong> 400점 이상
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src="/img/Gold.png"
                    alt="Gold"
                    style={{ width: "40px", marginRight: "10px" }}
                  />
                  <span>
                    <strong>Gold:</strong> 1000점 이상
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src="/img/Platinum.png"
                    alt="Platinum"
                    style={{ width: "40px", marginRight: "10px" }}
                  />
                  <span>
                    <strong>Platinum:</strong> 1600점 이상
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src="/img/Emerald.png"
                    alt="Emerald"
                    style={{ width: "40px", marginRight: "10px" }}
                  />
                  <span>
                    <strong>Emerald:</strong> 2400점 이상
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src="/img/Diamond.png"
                    alt="Diamond"
                    style={{ width: "40px", marginRight: "10px" }}
                  />
                  <span>
                    <strong>Diamond:</strong> 3200점 이상
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src="/img/Master.png"
                    alt="Master"
                    style={{ width: "40px", marginRight: "10px" }}
                  />
                  <span>
                    <strong>Master:</strong> 6000점 이상
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src="/img/Challenger.png"
                    alt="Challenger"
                    style={{ width: "40px", marginRight: "10px" }}
                  />
                  <span>
                    <strong>Challenger:</strong> 12000점 이상
                  </span>
                </div>
              </div>

              <div className="tier-calculation">
                <h3>1. 점수</h3>
                <ul>
                  <li>- 챌린지 성공 시 지급</li>
                  <li>- 챌린지 중단 보상으로 추가 획득</li>
                  <li>- 챌린지 포기 시 점수 회수(-100점)</li>
                </ul>

                <h3>2. 참고</h3>
                <ul>
                  <li>- 본차 진행하는 챌린지는 점수 지급 없음(학습차)</li>
                  <li>
                    - 일일 챌린지는 달성/미달성 기준으로 점수 지급 또는 회수
                  </li>
                </ul>
              </div>
            </div>

            <div className="tier-section">
              <h2 className="tier-section-title">챌린지 점수 지급 기준</h2>
              <p className="tier-subtitle">1등: 100% 점수 획득</p>
              <p className="tier-note">2등 이하: 0% 점수 획득</p>

              <table className="tier-score-table">
                <thead>
                  <tr>
                    <th>구분</th>
                    <th>점수</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1등</td>
                    <td>100%</td>
                  </tr>
                  <tr>
                    <td>2등 이하</td>
                    <td>0%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default TierGuide;

import React from 'react';
import Footer from './Footer';
import { TIER_GUIDE } from '../../constants/tiers';

function TierGuide() {
  return (
    <>
      <div className="tier-guide-view">
        <div className="tier-guide-container">
          <h1 className="tier-guide-title">티어 전척도 가이드</h1>
          
          <div className="tier-icons-row">
            {TIER_GUIDE.map((tier, index) => (
              <div key={index} className="tier-item">
                <img src={tier.image} alt={tier.name} className="tier-icon-img" />
                <p className="tier-score">{tier.minScore.toLocaleString()}</p>
              </div>
            ))}
          </div>

          <div className="tier-content-row">
            <div className="tier-section">
              <h2 className="tier-section-title">티어 산정 기준</h2>
              <p className="tier-description">티어는 오직 점수 기준으로만 산정됩니다.</p>
              
              <div className="tier-calculation">
                <h3>1. 점수</h3>
                <ul>
                  <li>-챌린지 성공 시 지급</li>
                  <li>-챌린지 중단 보상으로 추가 획득</li>
                  <li>-챌린지 포기 시 점수 회수(-100점)</li>
                </ul>

                <h3>2. 참고</h3>
                <ul>
                  <li>-본차 진행하는 챌린지는 점수 지급 없음(학습차)</li>
                  <li>-일일 챌린지는 달성/미달성 기준으로 점수 지급 또는 회수</li>
                </ul>
              </div>
            </div>

            <div className="tier-section">
              <h2 className="tier-section-title">챌린지 점수 지급 기준</h2>
              <p className="tier-subtitle">개인 진행도 기반 순위 보상 안내</p>
              <p className="tier-note">(1등 제외 후 비율 산정 1등은 +150)</p>
              
              <table className="tier-score-table">
                <thead>
                  <tr>
                    <th>구분</th>
                    <th>점수</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>상위</td>
                    <td>+100</td>
                  </tr>
                  <tr>
                    <td>중위</td>
                    <td>+50</td>
                  </tr>
                  <tr>
                    <td>하위</td>
                    <td>-30</td>
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

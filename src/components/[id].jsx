import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ChallengeDetail = () => {
  const { id } = useParams(); // URL에서 챌린지 ID를 가져옵니다.
  const [progress, setProgress] = useState([]);

  // 4번 기능: 서버에서 멤버 진행 현황 가져오기
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch(`/api/challenges/${id}/progress`, {
          headers: {
            // 팀원들이 만든 보안 토큰이 필요할 수 있습니다. 
            // 우선은 토큰 없이 호출해보고, 에러가 나면 토큰을 추가합시다.
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
          }
        });
        const result = await response.json();
        if (result.success) {
          setProgress(result.data); // 가져온 데이터를 저장
        }
      } catch (error) {
        console.error("진행 현황 로드 실패:", error);
      }
    };

    fetchProgress();
  }, [id]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>📊 멤버 진행 현황 (챌린지 ID: {id})</h2>
      <table border="1" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>멤버 이름</th>
            <th>날짜</th>
            <th>공부 시간(분)</th>
            <th>인증 여부</th>
          </tr>
        </thead>
        <tbody>
          {progress.map((item, index) => (
            <tr key={index}>
              <td>{item.username}</td>
              <td>{item.date}</td>
              <td>{item.study_time_minutes}분</td>
              <td>{item.is_checked ? '✅ 완료' : '❌ 미완료'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ChallengeDetail;
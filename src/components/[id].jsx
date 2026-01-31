import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ChallengeDetail = () => {
  const { id } = useParams(); 
  const [progress, setProgress] = useState([]);

  // [4번 기능] 서버에서 멤버 진행 현황 가져오기
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch(`/api/challenges/${id}/progress`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
          }
        });
        const result = await response.json();
        if (result.success) {
          setProgress(result.data); 
        }
      } catch (error) {
        console.error("진행 현황 로드 실패:", error);
      }
    };
    fetchProgress();
  }, [id]);

  // ★ [5번 기능: 위치 1] 종료 처리를 위한 함수 (로직 구역)
  const handleCompleteChallenge = async () => {
    if (!window.confirm("정말로 이 챌린지를 종료하시겠습니까?")) return;

    try {
      const response = await fetch(`/api/challenges/${id}/complete`, {
        method: 'POST', // 데이터 수정을 위한 POST 방식 [Saved Information]
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const result = await response.json();

      if (result.success) {
        alert("챌린지가 종료되었습니다!");
        window.location.reload(); // 성공 시 화면 갱신
      }
    } catch (error) {
      console.error("종료 처리 실패:", error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>📊 멤버 진행 현황 (챌린지 ID: {id})</h2>
      
      {/* 4번 기능의 표(Table) 영역 */}
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

      {/* ★ [5번 기능: 위치 2] 표 바로 아래에 종료 버튼 배치 (UI 구역) */}
      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <button 
          onClick={handleCompleteChallenge}
          style={{
            padding: '12px 24px',
            backgroundColor: '#ff4d4f', // 눈에 잘 띄는 빨간색 계열
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Challenge Complete (챌린지 종료하기)
        </button>
      </div>
    </div>
  );
};

export default ChallengeDetail;
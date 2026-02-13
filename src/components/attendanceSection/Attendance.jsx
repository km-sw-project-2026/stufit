import React, { useState, useEffect } from 'react';
import CustomAlertModal from '../modal/CustomAlertModal';

function Attendance() {
  const [checkedDays, setCheckedDays] = useState(Array(7).fill(false));
  const [lastCheckDate, setLastCheckDate] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const points = ["100P", "120P", "140P", "160P", "180P", "200P", "220P"];

  const todayIndex = new Date().getDay();
  const todayDateString = new Date().toISOString().split('T')[0];

  // 🚀 1. 유저 변경 감지 및 데이터 동기화 로직
  useEffect(() => {
    const fetchAttendance = async () => {
      const userId = localStorage.getItem('userId');
      
      // 🧹 혼선을 주는 기존 로컬 저장소 데이터를 강제로 삭제합니다.
      localStorage.removeItem('stufit_attendance'); 

      if (!userId || userId === "null" || userId === "undefined") {
        setCheckedDays(Array(7).fill(false));
        return;
      }

      try {
        // 캐시 방지를 위해 타임스탬프(t)를 추가하여 항상 최신 DB 값을 가져옵니다.
        const response = await fetch(`/api/attendance?userId=${userId}&t=${new Date().getTime()}`);
        
        if (response.ok) {
          const data = await response.json();
          const newCheckedDays = Array(7).fill(false);
          
          const today = new Date();
          const sunday = new Date(today);
          sunday.setDate(today.getDate() - today.getDay());
          sunday.setHours(0, 0, 0, 0); 

          // 서버 DB에 기록된 날짜들로만 체크 표시를 생성합니다.
          if (data.logs && Array.isArray(data.logs)) {
            data.logs.forEach(log => {
              const logDate = new Date(log.date);
              if (logDate >= sunday) {
                newCheckedDays[logDate.getDay()] = true;
              }
            });
          }

          setCheckedDays(newCheckedDays);
          
          if (data.logs && data.logs.some(log => log.date === todayDateString)) {
            setLastCheckDate(todayDateString);
          }
        } else {
          setCheckedDays(Array(7).fill(false));
        }
      } catch (error) {
        console.error("출석 데이터 로딩 실패:", error);
      }
    };

    fetchAttendance();
  }, [todayDateString, localStorage.getItem('userId')]);

  const showAlert = (msg) => {
    setAlertMessage(msg);
    setIsAlertOpen(true);
  };

  const handleCardClick = async (index) => {
    if (index !== todayIndex) {
      showAlert(`오늘은 ${days[todayIndex]}요일입니다. 해당 요일에만 출석 가능해요!`);
      return;
    }
    if (lastCheckDate === todayDateString) {
      showAlert("오늘 출석은 이미 완료되었습니다. 내일 다시 와주세요!");
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId || userId === "null") {
      showAlert("로그인이 필요한 서비스입니다.");
      return;
    }

    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, date: todayDateString })
      });

      if (response.ok) {
        const newCheckedDays = [...checkedDays];
        newCheckedDays[index] = true;
        setCheckedDays(newCheckedDays);
        setLastCheckDate(todayDateString);
        
        showAlert(`${days[index]}요일 출석 완료! 랭킹 포인트가 반영되었습니다.`);
      } else {
        const errorData = await response.json();
        showAlert(errorData.message || "출석 처리 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("Attendance error:", error);
      showAlert("서버와 통신할 수 없습니다.");
    }
  };

  // 기존 디자인 코드는 그대로 유지합니다. [cite: 2026-02-13]
  return (
    <div className="attendance-section">
      <div className="attendance-header">
        <h1>출석체크</h1>
        <p>7일 연속 출석시 400포인트 지급!</p>
      </div>
      
      <div className="attendance-container">
        <div className="attendance-board">
          <div className="attendance-days">
            {days.map((day, idx) => (
              <span key={day} className={idx === todayIndex ? "today-label" : ""}>
                {day} {idx === todayIndex && "(TODAY)"}
              </span>
            ))}
          </div>
          <div className="attendance-cards">
            {points.map((point, index) => (
              <div 
                key={index} 
                className={`att-card ${checkedDays[index] ? 'checked' : ''} ${index === todayIndex && !checkedDays[index] ? 'today-active' : ''}`} 
                onClick={() => handleCardClick(index)}
              >
                <span className="label">일일 포인트</span>
                <span className="point">{point}</span>
                {checkedDays[index] && (
                  <img src="/img/attendance-check.png" alt="출석완료" className="stamp-img" />
                )}
              </div>
            ))}
          </div>
        </div> 

        <div className="attendance-footer-outside">
          총 연속 출석체크일 수 : <span className="total-days-count">{checkedDays.filter(Boolean).length}</span>일
        </div>
      </div>

      {isAlertOpen && (
        <CustomAlertModal 
          message={alertMessage} 
          onClose={() => setIsAlertOpen(false)} 
        />
      )}
    </div>
  );
}

export default Attendance;
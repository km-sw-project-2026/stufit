// function Attendance(){
//   return(
//                 <div className="attendance-section">
//                     <div className="attendance-header">
//                         <h1>출석체크</h1>
//                         <p>7일 연속 출석시 400포인트 지급!</p>
//                     </div>
//                     <div className="attendance-container">
//                         <div className="attendance-board">
//                             {/* <!-- 일주일 요일 표시 (일요일부터 토요일까지) --> */}
//                             <div className="attendance-days">
//                                 <span>SUN</span>
//                                 <span>MON</span>
//                                 <span>TUE</span>
//                                 <span>WED</span>
//                                 <span>THU</span>
//                                 <span>FRI</span>
//                                 <span>SAT</span>
//                             </div>
//                             {/* <!-- 각 요일별 출석체크 카드 (일일 포인트 표시) --> */}
//                             <div className="attendance-cards">
//                                 <div className="att-card">
//                                     <span className="label">일일 포인트</span>
//                                     <span className="point">100P</span>
//                                 </div>
//                                 <div className="att-card">
//                                     <span className="label">일일 포인트</span>
//                                     <span className="point">120P</span>
//                                 </div>
//                                 <div className="att-card">
//                                     <span className="label">일일 포인트</span>
//                                     <span className="point">140P</span>
//                                 </div>
//                                 <div className="att-card">
//                                     <span className="label">일일 포인트</span>
//                                     <span className="point">160P</span>
//                                 </div>
//                                 <div className="att-card">
//                                     <span className="label">일일 포인트</span>
//                                     <span className="point">180P</span>
//                                 </div>
//                                 <div className="att-card">
//                                     <span className="label">일일 포인트</span>
//                                     <span className="point">200P</span>
//                                 </div>
//                                 <div className="att-card">
//                                     <span className="label">일일 포인트</span>
//                                     <span className="point">220P</span>
//                                 </div>
//                             </div>
//                         </div>
//                         {/* <!-- 연속 출석 일수 표시 --> */}
//                         <div className="attendance-footer">
//                             총 연속 출석체크일 수 : <span id="attendance-count">0</span>일
//                         </div>
//                     </div>
//                 </div> 
//   );
// }
// export default Attendance;


// ---------------------------------------------------------



import React, { useState, useEffect } from 'react';

function Attendance() {
  const [checkedDays, setCheckedDays] = useState(Array(7).fill(false));
  const [lastCheckDate, setLastCheckDate] = useState(null); // 마지막 출석 '날짜' 저장

  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const points = ["100P", "120P", "140P", "160P", "180P", "200P", "220P"];

  // 오늘 요일 인덱스 (0: 일요일, 1: 월요일, ..., 6: 토요일)
  const todayIndex = new Date().getDay();
  // 오늘 날짜 문자열 (예: "2024-05-20") - 하루 한 번 체크용
  const todayDateString = new Date().toLocaleDateString();

  useEffect(() => {
    const savedData = localStorage.getItem('stufit_attendance');
    if (savedData) {
      const { days, date } = JSON.parse(savedData);
      setCheckedDays(days);
      setLastCheckDate(date);
    }
  }, []);

  const handleCardClick = (index) => {
    // 1. 오늘 요일인지 확인
    if (index !== todayIndex) {
      alert(`오늘은 ${days[todayIndex]}요일입니다. ${days[index]}요일 칸은 클릭할 수 없어요!`);
      return;
    }

    // 2. 이미 오늘 출석했는지 확인 (날짜 비교)
    if (lastCheckDate === todayDateString) {
      alert("오늘 출석은 이미 완료되었습니다. 내일 다시 와주세요!");
      return;
    }

    // 3. 출석 처리
    const newCheckedDays = [...checkedDays];
    newCheckedDays[index] = true;
    
    setCheckedDays(newCheckedDays);
    setLastCheckDate(todayDateString);

    localStorage.setItem('stufit_attendance', JSON.stringify({
      days: newCheckedDays,
      date: todayDateString
    }));

    alert(`${days[index]}요일 출석 완료! 포인트가 지급되었습니다.`);
  };

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
            {points.map((point, index) => {
              const isToday = index === todayIndex;
              const isChecked = checkedDays[index];

              return (
                <div 
                  key={index} 
                  className={`att-card 
                    ${isChecked ? 'checked' : ''} 
                    ${isToday && !isChecked ? 'today-active' : ''} 
                    ${!isToday && !isChecked ? 'locked' : ''}`
                  } 
                  onClick={() => handleCardClick(index)}
                >
                  <span className="label">일일 포인트</span>
                  <span className="point">{point}</span>
                  {isChecked && (
                    <img 
                      src="/img/attendance check.png" 
                      alt="출석완료" 
                      className="stamp-img" 
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="attendance-footer">
          총 출석일 수 : <span>{checkedDays.filter(Boolean).length}</span>일
        </div>
      </div>
    </div>
  );
}

export default Attendance;
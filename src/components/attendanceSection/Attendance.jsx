



// import React, { useState, useEffect } from 'react';
// import CustomAlertModal from '../modal/CustomAlertModal';

// function Attendance() {
//   const [checkedDays, setCheckedDays] = useState(Array(7).fill(false));
//   const [lastCheckDate, setLastCheckDate] = useState(null);
//   const [isAlertOpen, setIsAlertOpen] = useState(false);
//   const [alertMessage, setAlertMessage] = useState("");

//   const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
//   const points = ["100P", "120P", "140P", "160P", "180P", "200P", "220P"];

//   const todayIndex = new Date().getDay();
//   const todayDateString = new Date().toLocaleDateString();

//   useEffect(() => {
//     const savedData = localStorage.getItem('stufit_attendance');
//     if (savedData) {
//       const { days, date } = JSON.parse(savedData);
//       setCheckedDays(days);
//       setLastCheckDate(date);
//     }
//   }, []);

//   const showAlert = (msg) => {
//     setAlertMessage(msg);
//     setIsAlertOpen(true);
//   };

//   const handleCardClick = (index) => {
//     if (index !== todayIndex) {
//       showAlert(`오늘은 ${days[todayIndex]}요일입니다. 해당 요일에만 출석 가능해요!`);
//       return;
//     }
//     if (lastCheckDate === todayDateString) {
//       showAlert("오늘 출석은 이미 완료되었습니다. 내일 다시 와주세요!");
//       return;
//     }
//     const newCheckedDays = [...checkedDays];
//     newCheckedDays[index] = true;
//     setCheckedDays(newCheckedDays);
//     setLastCheckDate(todayDateString);
//     localStorage.setItem('stufit_attendance', JSON.stringify({
//       days: newCheckedDays,
//       date: todayDateString
//     }));
//     showAlert(`${days[index]}요일 출석 완료! 포인트가 지급되었습니다.`);
//   };

//   return (
//     <div className="attendance-section">
//       <div className="attendance-header">
//         <h1>출석체크</h1>
//         <p>7일 연속 출석시 400포인트 지급!</p>
//       </div>
      
//       <div className="attendance-container">
//         {/* --- 흰색 박스 시작 --- */}
//         <div className="attendance-board">
//           <div className="attendance-days">
//             {days.map((day, idx) => (
//               <span key={day} className={idx === todayIndex ? "today-label" : ""}>
//                 {day} {idx === todayIndex && "(TODAY)"}
//               </span>
//             ))}
//           </div>
//           <div className="attendance-cards">
//             {points.map((point, index) => (
//               <div 
//                 key={index} 
//                 className={`att-card ${checkedDays[index] ? 'checked' : ''} ${index === todayIndex && !checkedDays[index] ? 'today-active' : ''}`} 
//                 onClick={() => handleCardClick(index)}
//               >
//                 <span className="label">일일 포인트</span>
//                 <span className="point">{point}</span>
//                 {checkedDays[index] && (
//                   <img src="/img/attendance-check.png" alt="출석완료" className="stamp-img" />
//                 )}
//               </div>
//             ))}
//           </div>
//         </div> 
//         {/* --- 흰색 박스 끝 (</div>) --- */}

//         {/* ✅ 여기가 중요합니다! 박스 바깥(아래)으로 뺐습니다. */}
//         <div className="attendance-footer-outside">
//           총 연속 출석체크일 수 : <span className="total-days-count">{checkedDays.filter(Boolean).length}</span>일
//         </div>
//       </div>

//       {isAlertOpen && (
//         <CustomAlertModal 
//           message={alertMessage} 
//           onClose={() => setIsAlertOpen(false)} 
//         />
//       )}
//     </div>
//   );
// }

// export default Attendance;


// --------------------------------------------------------------



// ----------------------   원래 쓰던거



// import React, { useState, useEffect } from 'react';
// import CustomAlertModal from '../modal/CustomAlertModal';

// function Attendance() {
//   const [checkedDays, setCheckedDays] = useState(Array(7).fill(false));
//   const [lastCheckDate, setLastCheckDate] = useState(null);
//   const [isAlertOpen, setIsAlertOpen] = useState(false);
//   const [alertMessage, setAlertMessage] = useState("");

//   const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
//   const points = ["100P", "120P", "140P", "160P", "180P", "200P", "220P"];

//   const todayIndex = new Date().getDay();
//   const todayDateString = new Date().toLocaleDateString();

//   useEffect(() => {
//     const savedData = localStorage.getItem('stufit_attendance');
//     if (savedData) {
//       const { days, date } = JSON.parse(savedData);
//       setCheckedDays(days);
//       setLastCheckDate(date);
//     }
//   }, []);

//   const showAlert = (msg) => {
//     setAlertMessage(msg);
//     setIsAlertOpen(true);
//   };

//   const handleCardClick = async (index) => {
//     if (index !== todayIndex) {
//       showAlert(`오늘은 ${days[todayIndex]}요일입니다. 해당 요일에만 출석 가능해요!`);
//       return;
//     }
//     if (lastCheckDate === todayDateString) {
//       showAlert("오늘 출석은 이미 완료되었습니다. 내일 다시 와주세요!");
//       return;
//     }

//     // 🚀 서버(DB)에 출석 기록 보내기
//     const userId = localStorage.getItem('userId'); // 로그인 시 저장된 userId 가져오기
    
//     if (!userId) {
//       showAlert("로그인이 필요한 서비스입니다.");
//       return;
//     }

//     try {
//       // 랭킹 시스템과 연동된 서버 경로로 출석 정보 전송
//       const response = await fetch('/api/attendance', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId, date: todayDateString })
//       });

//       if (response.ok) {
//         // 성공 시 화면 UI 업데이트
//         const newCheckedDays = [...checkedDays];
//         newCheckedDays[index] = true;
//         setCheckedDays(newCheckedDays);
//         setLastCheckDate(todayDateString);
        
//         localStorage.setItem('stufit_attendance', JSON.stringify({
//           days: newCheckedDays,
//           date: todayDateString
//         }));
        
//         showAlert(`${days[index]}요일 출석 완료! 랭킹 포인트가 반영되었습니다.`);
//       } else {
//         showAlert("출석 처리 중 오류가 발생했습니다.");
//       }
//     } catch (error) {
//       console.error("Attendance error:", error);
//       showAlert("서버와 통신할 수 없습니다.");
//     }
//   };

//   return (
//     <div className="attendance-section">
//       <div className="attendance-header">
//         <h1>출석체크</h1>
//         <p>7일 연속 출석시 400포인트 지급!</p>
//       </div>
      
//       <div className="attendance-container">
//         <div className="attendance-board">
//           <div className="attendance-days">
//             {days.map((day, idx) => (
//               <span key={day} className={idx === todayIndex ? "today-label" : ""}>
//                 {day} {idx === todayIndex && "(TODAY)"}
//               </span>
//             ))}
//           </div>
//           <div className="attendance-cards">
//             {points.map((point, index) => (
//               <div 
//                 key={index} 
//                 className={`att-card ${checkedDays[index] ? 'checked' : ''} ${index === todayIndex && !checkedDays[index] ? 'today-active' : ''}`} 
//                 onClick={() => handleCardClick(index)}
//               >
//                 <span className="label">일일 포인트</span>
//                 <span className="point">{point}</span>
//                 {checkedDays[index] && (
//                   <img src="/img/attendance-check.png" alt="출석완료" className="stamp-img" />
//                 )}
//               </div>
//             ))}
//           </div>
//         </div> 

//         <div className="attendance-footer-outside">
//           총 연속 출석체크일 수 : <span className="total-days-count">{checkedDays.filter(Boolean).length}</span>일
//         </div>
//       </div>

//       {isAlertOpen && (
//         <CustomAlertModal 
//           message={alertMessage} 
//           onClose={() => setIsAlertOpen(false)} 
//         />
//       )}
//     </div>
//   );
// }

// export default Attendance;



// -----------------------------------------------------------







// ------------------위에 코드에서 또 수정


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
  const todayDateString = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD 형식 안전하게 생성

  useEffect(() => {
    const fetchAttendance = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId || userId === "null" || userId === "undefined") {
        setCheckedDays(Array(7).fill(false));
        return;
      }
      try {
        // 캐시 방지 타임스탬프 추가
        const response = await fetch(`/api/attendance?userId=${userId}&t=${new Date().getTime()}`);
        if (response.ok) {
          const data = await response.json();
          const newCheckedDays = Array(7).fill(false);
          
          // 이번 주 일요일 구하기 (기준점)
          const today = new Date();
          const sunday = new Date(today);
          sunday.setDate(today.getDate() - today.getDay());
          sunday.setHours(0, 0, 0, 0);

          if (data.logs && Array.isArray(data.logs)) {
            data.logs.forEach(log => {
              // 서버에서 온 log.date ("YYYY-MM-DD")를 날짜 객체로 변환
              const logDate = new Date(log.date + "T00:00:00"); 

              // 핵심: 이번 주 일요일 이후의 기록만 해당 요일 인덱스에 정확히 매핑
              if (logDate >= sunday) {
                const dayIndex = logDate.getDay(); 
                newCheckedDays[dayIndex] = true; // 기록이 실존하는 요일만 도장 찍기
              }
            });
            
            // 오늘 날짜 출석 여부 업데이트
            const hasCheckedToday = data.logs.some(log => log.date === todayDateString);
            if (hasCheckedToday) setLastCheckDate(todayDateString);
          }
          setCheckedDays(newCheckedDays);
        }
      } catch (error) {
        console.error('출석 데이터 로딩 실패:', error);
      }
    };
    fetchAttendance();
    // 유저가 바뀌어도 데이터를 새로 불러오도록 의존성 배열 보강
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
      showAlert('오늘 출석은 이미 완료되었습니다. 내일 다시 와주세요!');
      return;
    }
    const userId = localStorage.getItem('userId');
    if (!userId || userId === 'null') {
      showAlert('로그인이 필요한 서비스입니다.');
      return;
    }
    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, date: todayDateString })
      });
      if (response.ok) {
        // 성공 시 화면 즉시 반영
        const nextCheckedDays = [...checkedDays];
        nextCheckedDays[index] = true;
        setCheckedDays(nextCheckedDays);
        setLastCheckDate(todayDateString);
        showAlert(`${days[index]}요일 출석 완료! 랭킹 포인트가 반영되었습니다.`);
      } else {
        const errorData = await response.json();
        showAlert(errorData.message || '출석 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Attendance error:', error);
      showAlert('서버와 통신할 수 없습니다.');
    }
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
              <span key={day} className={idx === todayIndex ? 'today-label' : ''}>
                {day} {idx === todayIndex && '(TODAY)'}
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
                {checkedDays[index] && <img src="/img/attendance-check.png" alt="출석완료" className="stamp-img" />}
              </div>
            ))}
          </div>
        </div>
        <div className="attendance-footer-outside">
          총 이번 주 출석일 수 : <span className="total-days-count">{checkedDays.filter(Boolean).length}</span>일
        </div>
      </div>
      {isAlertOpen && <CustomAlertModal message={alertMessage} onClose={() => setIsAlertOpen(false)} />}
    </div>
  );
}

export default Attendance;
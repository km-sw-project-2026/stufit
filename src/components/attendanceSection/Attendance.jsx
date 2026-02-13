


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



// ----------------------------------  DB에 잘 되게 수정한 코드?



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
  // DB(TEXT 타입) 규격에 맞게 YYYY-MM-DD 형식으로 고정
  const todayDateString = new Date().toISOString().split('T')[0];

  // 🚀 1. 페이지 로드 시 DB에서 해당 사용자의 출석 데이터 가져오기
  useEffect(() => {
    const fetchAttendance = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      try {
        const response = await fetch(`/api/attendance?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          // 서버에서 받아온 이번 주 출석 리스트(날짜들)를 기반으로 checkedDays 업데이트
          const newCheckedDays = Array(7).fill(false);
          
          // 이번 주의 시작일(일요일) 계산
          const today = new Date();
          const sunday = new Date(today);
          sunday.setDate(today.getDate() - today.getDay());
          
          data.logs.forEach(log => {
            const logDate = new Date(log.date);
            // 해당 로그가 이번 주인지 확인 후 인덱스에 체크
            if (logDate >= sunday) {
              newCheckedDays[logDate.getDay()] = true;
            }
          });

          setCheckedDays(newCheckedDays);
          // 오늘 이미 출석했는지 확인
          if (data.logs.some(log => log.date === todayDateString)) {
            setLastCheckDate(todayDateString);
          }
        }
      } catch (error) {
        console.error("출석 데이터 로딩 실패:", error);
      }
    };

    fetchAttendance();
  }, [todayDateString]);

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
    if (!userId) {
      showAlert("로그인이 필요한 서비스입니다.");
      return;
    }

    try {
      // 🚀 2. 서버(D1 DB)에 출석 기록 저장 요청
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

  // ... (아래 return 부분은 디자인 보존을 위해 기존과 동일하게 유지)
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
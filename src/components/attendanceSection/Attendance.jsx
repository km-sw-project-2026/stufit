


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


import React, { useState, useEffect } from 'react';
import CustomAlertModal from '../modal/CustomAlertModal';

function Attendance() {
  const [checkedDays, setCheckedDays] = useState(Array(7).fill(false));
  const [lastCheckDate, setLastCheckDate] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const points = ["100P", "120P", "140P", "160P", "180P", "200P", "220P"];

  const todayIndex = new Date().getDay();
  const todayDateString = new Date().toLocaleDateString();

  useEffect(() => {
    // 로컬스토리지에서 저장된 데이터 로드
    const savedData = localStorage.getItem('stufit_attendance');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setCheckedDays(parsed.days || Array(7).fill(false));
        setLastCheckDate(parsed.date || null);
      } catch (e) {
        console.error('localStorage 파싱 오류:', e);
      }
    }
  }, []);

  const showAlert = (msg) => {
    setAlertMessage(msg);
    setIsAlertOpen(true);
  };

  const handleCardClick = async (index) => {
    if (isLoading) return; // 중복 클릭 방지

    if (index !== todayIndex) {
      showAlert(`오늘은 ${days[todayIndex]}요일입니다. 해당 요일에만 출석 가능해요!`);
      return;
    }
    
    if (lastCheckDate === todayDateString) {
      showAlert("오늘 출석은 이미 완료되었습니다. 내일 다시 와주세요!");
      return;
    }

    // 🚀 서버(DB)에 출석 기록 보내기
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      showAlert("로그인이 필요한 서비스입니다.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: parseInt(userId, 10), date: todayDateString })
      });

      const responseData = await response.json();
      console.log('출석 응답:', responseData, '상태:', response.status);

      if (response.ok) {
        // ✅ state와 localStorage 동시 업데이트
        const newCheckedDays = [...checkedDays];
        newCheckedDays[index] = true;
        
        // 상태 업데이트
        setCheckedDays(newCheckedDays);
        setLastCheckDate(todayDateString);
        
        // localStorage 업데이트
        localStorage.setItem('stufit_attendance', JSON.stringify({
          days: newCheckedDays,
          date: todayDateString
        }));
        
        console.log('업데이트됨:', newCheckedDays);
        showAlert(responseData.message || `${days[index]}요일 출석 완료! ${responseData.rewardPoints}P가 지급되었습니다.`);
      } else {
        console.error('API 실패:', response.status, responseData);
        showAlert(responseData.message || "출석 처리 중 오류가 발생했습니다. (상태: " + response.status + ")");
      }
    } catch (error) {
      console.error("Attendance error:", error);
      showAlert("서버와 통신할 수 없습니다. 네트워크를 확인해주세요.");
    } finally {
      setIsLoading(false);
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



// ------------------------------------------------


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

//   // 🚀 서버 연동을 위해 async 함수로 변경
//   const handleCardClick = async (index) => {
//     if (index !== todayIndex) {
//       showAlert(`오늘은 ${days[todayIndex]}요일입니다. 해당 요일에만 출석 가능해요!`);
//       return;
//     }
//     if (lastCheckDate === todayDateString) {
//       showAlert("오늘 출석은 이미 완료되었습니다. 내일 다시 와주세요!");
//       return;
//     }

//     // 1. 유저 정보 및 인증 토큰 가져오기
//     const userId = localStorage.getItem('userId');
//     const token = localStorage.getItem('token'); // 👈 401 에러 방지를 위해 토큰 확인

//     if (!userId || !token) {
//       showAlert("로그인이 필요한 서비스입니다.");
//       return;
//     }

//     try {
//       // 2. 서버 DB에 출석 정보 전송
//       const response = await fetch('/api/attendance', {
//         method: 'POST',
//         headers: { 
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}` // 👈 인증 헤더 추가
//         },
//         body: JSON.stringify({ userId, date: todayDateString })
//       });

//       if (response.ok) {
//         // 3. 서버 저장 성공 시 화면 UI 업데이트
//         const newCheckedDays = [...checkedDays];
//         newCheckedDays[index] = true;
//         setCheckedDays(newCheckedDays);
//         setLastCheckDate(todayDateString);
        
//         localStorage.setItem('stufit_attendance', JSON.stringify({
//           days: newCheckedDays,
//           date: todayDateString
//         }));
        
//         showAlert(`${days[index]}요일 출석 완료! 랭킹 포인트가 반영되었습니다.`);
//       } else if (response.status === 401) {
//         showAlert("인증이 만료되었습니다. 다시 로그인해주세요.");
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









function AttendanceSection({ attendanceCount }) {
  const days = [
    { day: "SUN", points: "100P" },
    { day: "MON", points: "120P" },
    { day: "TUE", points: "140P" },
    { day: "WED", points: "160P" },
    { day: "THU", points: "180P" },
    { day: "FRI", points: "200P" },
    { day: "SAT", points: "220P" },
  ];

  return (
    <div className="attendance-section hidden">
      <div className="attendance-header">
        <h1>출석체크</h1>
        <p>7일 연속 출석시 400포인트 지급!</p>
      </div>
      <div className="attendance-container">
        <div className="attendance-board">
          <div className="attendance-days">
            {days.map((item, idx) => (
              <span key={idx}>{item.day}</span>
            ))}
          </div>
          <div className="attendance-cards">
            {days.map((item, idx) => (
              <div key={idx} className="att-card">
                <span className="label">일일 포인트</span>
                <span className="point">{item.points}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="attendance-footer">
          총 연속 출석체크일 수 : <span>{attendanceCount}</span>일
        </div>
      </div>
    </div>
  );
}

export default AttendanceSection;

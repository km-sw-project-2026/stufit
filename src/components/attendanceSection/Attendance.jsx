function Attendance(){
  return(
                <div className="attendance-section">
                    <div className="attendance-header">
                        <h1>출석체크</h1>
                        <p>7일 연속 출석시 400포인트 지급!</p>
                    </div>
                    <div className="attendance-container">
                        <div className="attendance-board">
                            {/* <!-- 일주일 요일 표시 (일요일부터 토요일까지) --> */}
                            <div className="attendance-days">
                                <span>SUN</span>
                                <span>MON</span>
                                <span>TUE</span>
                                <span>WED</span>
                                <span>THU</span>
                                <span>FRI</span>
                                <span>SAT</span>
                            </div>
                            {/* <!-- 각 요일별 출석체크 카드 (일일 포인트 표시) --> */}
                            <div className="attendance-cards">
                                <div className="att-card">
                                    <span className="label">일일 포인트</span>
                                    <span className="point">100P</span>
                                </div>
                                <div className="att-card">
                                    <span className="label">일일 포인트</span>
                                    <span className="point">120P</span>
                                </div>
                                <div className="att-card">
                                    <span className="label">일일 포인트</span>
                                    <span className="point">140P</span>
                                </div>
                                <div className="att-card">
                                    <span className="label">일일 포인트</span>
                                    <span className="point">160P</span>
                                </div>
                                <div className="att-card">
                                    <span className="label">일일 포인트</span>
                                    <span className="point">180P</span>
                                </div>
                                <div className="att-card">
                                    <span className="label">일일 포인트</span>
                                    <span className="point">200P</span>
                                </div>
                                <div className="att-card">
                                    <span className="label">일일 포인트</span>
                                    <span className="point">220P</span>
                                </div>
                            </div>
                        </div>
                        {/* <!-- 연속 출석 일수 표시 --> */}
                        <div className="attendance-footer">
                            총 연속 출석체크일 수 : <span id="attendance-count">0</span>일
                        </div>
                    </div>
                </div> 
  );
}
export default Attendance;
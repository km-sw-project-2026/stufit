
// function EditChallengeModal() {
//     return (
//         <div id="edit-challenge-modal" className="popup-modal hidden">
//             <div className="popup-overlay"></div>
//             <div className="popup-content">
//                 <div className="form-group">
//                     <label>챌린지 이름</label>
//                     <input type="text" id="edit-challenge-name" placeholder="예: 기말고사 성적내기" />
//                 </div>
//                 <div className="form-group">
//                     <label>내 이름</label>
//                     <input type="text" id="edit-challenge-user" placeholder="예: 김예선" />
//                 </div>
//                 <div className="form-row">
//                     <div className="form-group half">
//                         <label>기간 (일)</label>
//                         <input type="number" id="edit-challenge-duration" placeholder="30" />
//                     </div>
//                     <div className="form-group half">
//                         <label>카테고리</label>
//                         <div className="select-wrapper">
//                             <select id="edit-challenge-category" defaultValue="">
//                                 <option value="" disabled>예: 공부</option>
//                                 <option value="study">공부</option>
//                                 <option value="exercise">운동</option>
//                                 <option value="daily">일상</option>
//                             </select>
//                             <div className="select-arrow">
//                                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="form-group">
//                     <label>목표</label>
//                     <input type="text" id="edit-challenge-goal" placeholder="예: 아침 6시 기상" />
//                 </div>
//                 <div className="form-group">
//                     <label>코드 입력 (선택)</label>
//                     <input type="text" id="edit-challenge-code" placeholder="예: KIM" />
//                 </div>
//                 <button className="update-challenge-btn start-challenge-btn">수정 완료하기</button>
//             </div>
//         </div>
//     );
// };
// export default EditChallengeModal;


// ----------------------------------------------------------


//  미리 짜둔 데이터로 실행 

// import React, { useState } from 'react';

// function EditChallengeModal({ challenge, onClose, onSuccess }) {
//     // 1. 기존 데이터를 입력창에 미리 채워둡니다.
//     const [title, setTitle] = useState(challenge?.title || '');
//     const [name, setName] = useState(challenge?.name || '');
//     const [goal, setGoal] = useState(challenge?.goal || '');
//     const [category, setCategory] = useState(challenge?.category || 'EXERCISE');
//     const [duration, setDuration] = useState('3'); // 사진 기반 기본값
//     const [code, setCode] = useState(challenge?.challenge_code || '');

//     // 2. 수정 완료 버튼 클릭 시 실행
//     const handleSubmit = (e) => {
//         e.preventDefault();

//         // 부모 컴포넌트의 handleUpdateLocal로 데이터를 보냅니다.
//         const updatedData = {
//             ...challenge,
//             title,
//             name,
//             goal,
//             category,
//             challenge_code: code
//         };

//         onSuccess(updatedData); // 화면 업데이트 실행
//         alert("수정이 완료되었습니다! (로컬 테스트)");
//     };

//     // 모달 배경 스타일
//     const overlayStyle = {
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         width: '100%',
//         height: '100%',
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         zIndex: 1000
//     };

//     // 모달 창 스타일 (사진 image_8fc5d4 반영)
//     const modalStyle = {
//         backgroundColor: 'white',
//         padding: '40px',
//         borderRadius: '30px',
//         width: '100%',
//         maxWidth: '500px',
//         boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
//     };

//     const inputGroupStyle = {
//         marginBottom: '20px'
//     };

//     const labelStyle = {
//         display: 'block',
//         marginBottom: '8px',
//         fontWeight: 'bold',
//         fontSize: '0.9rem'
//     };

//     const inputStyle = {
//         width: '100%',
//         padding: '12px 15px',
//         borderRadius: '10px',
//         border: '1px solid #ccc',
//         fontSize: '1rem',
//         boxSizing: 'border-box'
//     };

//     return (
//         <div style={overlayStyle} onClick={onClose}>
//             <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
//                 <form onSubmit={handleSubmit}>
//                     <div style={inputGroupStyle}>
//                         <label style={labelStyle}>챌린지 이름</label>
//                         <input 
//                             style={inputStyle} 
//                             value={title} 
//                             onChange={(e) => setTitle(e.target.value)} 
//                         />
//                     </div>

//                     <div style={inputGroupStyle}>
//                         <label style={labelStyle}>내 이름</label>
//                         <input 
//                             style={inputStyle} 
//                             value={name} 
//                             onChange={(e) => setName(e.target.value)} 
//                         />
//                     </div>

//                     <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
//                         <div style={{ flex: 1 }}>
//                             <label style={labelStyle}>기간 (일)</label>
//                             <input 
//                                 type="number" 
//                                 style={inputStyle} 
//                                 value={duration} 
//                                 onChange={(e) => setDuration(e.target.value)} 
//                             />
//                         </div>
//                         <div style={{ flex: 1 }}>
//                             <label style={labelStyle}>카테고리</label>
//                             <select 
//                                 style={inputStyle} 
//                                 value={category} 
//                                 onChange={(e) => setCategory(e.target.value)}
//                             >
//                                 <option value="EXERCISE">운동</option>
//                                 <option value="STUDY">공부</option>
//                                 <option value="DAILY">일상</option>
//                             </select>
//                         </div>
//                     </div>

//                     <div style={inputGroupStyle}>
//                         <label style={labelStyle}>목표</label>
//                         <input 
//                             style={inputStyle} 
//                             value={goal} 
//                             onChange={(e) => setGoal(e.target.value)} 
//                         />
//                     </div>

//                     <div style={inputGroupStyle}>
//                         <label style={labelStyle}>코드 입력 (선택)</label>
//                         <input 
//                             style={inputStyle} 
//                             value={code} 
//                             onChange={(e) => setCode(e.target.value)} 
//                         />
//                     </div>

//                     <button 
//                         type="submit"
//                         style={{
//                             width: '100%',
//                             padding: '15px',
//                             backgroundColor: '#1f6157',
//                             color: 'white',
//                             border: 'none',
//                             borderRadius: '10px',
//                             fontSize: '1.1rem',
//                             fontWeight: 'bold',
//                             cursor: 'pointer',
//                             marginTop: '10px'
//                         }}
//                     >
//                         수정 완료하기
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// }

// export default EditChallengeModal;


// ------------------------------------------------------------


// // 미리 짜둔 데이터가 없는 것 


import React, { useState } from 'react';

function EditChallengeModal({ challenge, onClose, onSuccess }) {
    // 1. 부모로부터 받은 현재 챌린지 데이터를 초기값으로 설정합니다.
    const [title, setTitle] = useState(challenge?.title || '');
    const [name, setName] = useState(challenge?.name || '');
    const [goal, setGoal] = useState(challenge?.goal || '');
    const [category, setCategory] = useState(challenge?.category || 'EXERCISE');
    const [duration, setDuration] = useState('3'); // 기본값 3일

    // 2. 수정 완료 버튼 클릭 시 실행
    const handleSubmit = (e) => {
        e.preventDefault();

        // 부모 컴포넌트로 전달할 데이터 객체 생성
        const updatedData = {
            ...challenge, // 기존 ID 등 유지
            title: title,
            name: name,
            goal: goal,
            category: category
        };

        // ⭐️ 서버에 보내는 대신 부모의 handleUpdateLocal을 실행합니다.
        onSuccess(updatedData); 
        alert("수정이 완료되었습니다!");
    };

    // 모달 디자인 (사진 image_8fc5d4 스타일 반영)
    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    };

    const modalStyle = {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '30px',
        width: '100%',
        maxWidth: '450px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
    };

    const inputStyle = {
        width: '100%',
        padding: '12px',
        borderRadius: '10px',
        border: '1px solid #ddd',
        marginBottom: '20px',
        boxSizing: 'border-box',
        fontSize: '1rem'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '8px',
        fontWeight: 'bold',
        fontSize: '0.9rem',
        color: '#333'
    };

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                <h2 style={{ marginBottom: '30px', textAlign: 'center', color: '#1f6157' }}>챌린지 수정하기</h2>
                
                <form onSubmit={handleSubmit}>
                    <label style={labelStyle}>챌린지 이름</label>
                    <input 
                        style={inputStyle} 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        placeholder="예: 매일 물 2L 마시기"
                    />

                    <label style={labelStyle}>내 이름</label>
                    <input 
                        style={inputStyle} 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                    />

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>기간 (일)</label>
                            <input 
                                type="number"
                                style={inputStyle} 
                                value={duration} 
                                onChange={(e) => setDuration(e.target.value)} 
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>카테고리</label>
                            <select 
                                style={inputStyle} 
                                value={category} 
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="EXERCISE">운동</option>
                                <option value="STUDY">공부</option>
                                <option value="DAILY">일상</option>
                            </select>
                        </div>
                    </div>

                    <label style={labelStyle}>목표</label>
                    <textarea 
                        style={{ ...inputStyle, height: '80px', resize: 'none' }} 
                        value={goal} 
                        onChange={(e) => setGoal(e.target.value)} 
                    />

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button 
                            type="button" 
                            onClick={onClose}
                            style={{ flex: 1, padding: '15px', border: '1px solid #ddd', borderRadius: '10px', background: 'white', cursor: 'pointer' }}
                        >
                            취소
                        </button>
                        <button 
                            type="submit"
                            style={{ flex: 2, padding: '15px', backgroundColor: '#1f6157', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                            수정 완료하기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditChallengeModal;
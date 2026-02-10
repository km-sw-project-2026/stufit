import React from 'react';

export default function JoinModal({ open, onClose, onConfirm, loading }) {
  if (!open) return null;
  return (
    <div className="join-modal-overlay">
      <div className="join-modal">
        <h3>챌린지에 참가하시겠습니까?</h3>
        <p>참가 시 사용자 정보(user_id, username)가 자동으로 등록됩니다.</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button onClick={onClose}>취소</button>
          <button onClick={onConfirm}>{loading ? '참가중...' : '참가'}</button>
        </div>
      </div>
    </div>
  );
}

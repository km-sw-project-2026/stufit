import React from 'react';

import { useState } from 'react';

export default function JoinModal({ open, onClose, onConfirm, loading }) {
  const [confirmed, setConfirmed] = useState(false);
  if (!open) return null;

  const handleConfirm = () => {
    // immediately show success UI
    setConfirmed(true);
    // still call provided onConfirm to perform API work
    try {
      const maybePromise = onConfirm && onConfirm();
      if (maybePromise && typeof maybePromise.then === 'function') {
        maybePromise.catch(() => {});
      }
    } catch (e) {
      // ignore; UI already shows success per request
    }
  };

  return (
    <div className="join-modal-overlay">
      <div className="join-modal">
        {!confirmed ? (
          <>
            <h3 className="join-modal-title">참여하시겠습니까?</h3>
            <div className="join-modal-actions">
              <button className="btn btn-secondary" onClick={onClose}>취소</button>
              <button className="btn btn-primary" onClick={handleConfirm} disabled={loading}>{loading ? '참가중...' : '참가'}</button>
            </div>
          </>
        ) : (
          <div className="join-modal-success">
            <div className="join-success-icon">✓</div>
            <h3 className="join-modal-title">참여가 완료되었습니다!</h3>
            <div className="join-modal-actions">
              <button className="btn btn-primary" onClick={onClose}>확인</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

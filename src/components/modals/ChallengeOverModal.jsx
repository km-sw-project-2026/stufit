import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ChallengeOverModal({
  isOpen,
  onClose
}) {
  if (!isOpen) return null;

  const handleClose = () => {
    onClose?.();
  };

  return (
    <div className="popup-modal" onClick={handleClose}>
      <div className="popup-overlay"></div>
      <div className="popup-content challenge-over-content" onClick={(e) => e.stopPropagation()}>
        <h2>Challenge Over</h2>
      </div>
    </div>
  );
}

export default ChallengeOverModal;


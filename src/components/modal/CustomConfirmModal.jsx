function CustomConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div
      id="custom-confirm-modal"
      className="popup-modal"
      style={{
        zIndex: 20000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        inset: 0,
      }}
    >
      <div
        className="popup-overlay"
        style={{
          background: "rgba(0,0,0,0.4)",
          position: "absolute",
          inset: 0,
        }}
        onClick={onCancel}
      ></div>
      <div
        className="popup-content custom-confirm-popup"
        style={{ position: "relative", zIndex: 1 }}
      >
        <p id="custom-confirm-msg" className="confirm-msg">
          {message}
        </p>
        <div className="confirm-btn-row">
          <button
            id="custom-confirm-cancel"
            className="confirm-btn-cancel"
            onClick={onCancel}
          >
            취소
          </button>
          <button
            id="custom-confirm-ok"
            className="confirm-btn-ok"
            onClick={onConfirm}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomConfirmModal;

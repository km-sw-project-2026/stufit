function CustomPromptModal() {
  return (
    <div
      id="custom-prompt-modal"
      className="popup-modal hidden"
      style={{
        zIndex: 20010,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="popup-overlay"
        style={{ background: "rgba(0,0,0,0.4)" }}
      ></div>
      <div className="popup-content custom-prompt-popup">
        <h3 id="custom-prompt-title" className="prompt-title">
          입력해주세요
        </h3>
        <input type="text" id="custom-prompt-input" className="prompt-input" />
        <div className="confirm-btn-row">
          <button id="custom-prompt-cancel" className="confirm-btn-cancel">
            취소
          </button>
          <button id="custom-prompt-ok" className="confirm-btn-ok">
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomPromptModal;

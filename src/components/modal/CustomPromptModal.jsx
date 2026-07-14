import { useState, useEffect } from "react";

function CustomPromptModal({
  isOpen,
  onClose,
  onSubmit,
  title = "입력해주세요",
  initialValue = "",
  placeholder = "",
  multiline = false,
}) {
  const [inputValue, setInputValue] = useState(initialValue);

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue, isOpen]);

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onSubmit(inputValue.trim());
      setInputValue("");
      onClose();
    }
  };

  const handleCancel = () => {
    setInputValue("");
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !multiline) {
      handleSubmit();
    } else if (e.key === "Enter" && multiline && e.ctrlKey) {
      handleSubmit();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="popup-modal"
      style={{
        zIndex: 20010,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="popup-overlay"
        style={{ background: "rgba(0,0,0,0.5)" }}
        onClick={handleCancel}
      ></div>
      <div
        className="popup-content custom-prompt-popup"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="prompt-title">{title}</h3>
        {multiline ? (
          <textarea
            className="prompt-input prompt-textarea"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoFocus
            rows={4}
          />
        ) : (
          <input
            type="text"
            className="prompt-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoFocus
          />
        )}
        {multiline && <p className="prompt-hint">Ctrl + Enter로 저장</p>}
        <div className="confirm-btn-row">
          <button className="confirm-btn-cancel" onClick={handleCancel}>
            취소
          </button>
          <button className="confirm-btn-ok" onClick={handleSubmit}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomPromptModal;

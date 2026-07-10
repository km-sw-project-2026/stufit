import React from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

function CustomAlertModal({ message, onClose }) {
  return (
    <Modal open={true} onClose={onClose}>
      <div
        style={{
          padding: "var(--space-10)",
          textAlign: "center",
          minWidth: "320px",
        }}
      >
        <p
          style={{
            marginBottom: "var(--space-6)",
            fontSize: "var(--text-lg)",
            color: "var(--color-text)",
            lineHeight: "var(--leading-normal)",
            fontWeight: 500,
          }}
        >
          {message}
        </p>
        <Button variant="primary" onClick={onClose}>
          확인
        </Button>
      </div>
    </Modal>
  );
}

export default CustomAlertModal;

import Modal from "../ui/Modal";
import Button from "../ui/Button";

function CustomConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <Modal open={true} onClose={onCancel} overlayOpacity={0.4}>
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
            fontSize: "var(--text-base)",
            color: "var(--color-text)",
            lineHeight: "var(--leading-normal)",
          }}
        >
          {message}
        </p>
        <div
          style={{
            display: "flex",
            gap: "var(--space-3)",
            justifyContent: "center",
          }}
        >
          <Button variant="secondary" onClick={onCancel}>
            취소
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            확인
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default CustomConfirmModal;

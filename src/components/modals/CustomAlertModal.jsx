import Modal from "../ui/Modal";
import Button from "../ui/Button";

function CustomAlertModal({ onClose, message = "알림입니다" }) {
  return (
    <Modal open={true} onClose={onClose} style={{ zIndex: 100000 }} contentZIndex={100001}>
      <div
        style={{
          padding: "var(--space-10)",
          textAlign: "center",
          minWidth: "320px",
        }}
      >
        <p
          style={{
            marginBottom: "25px",
            fontSize: "var(--text-lg)",
            color: "var(--color-text)",
            lineHeight: "var(--leading-normal)",
            fontWeight: 500,
          }}
        >
          {message}
        </p>
        <Button
          variant="primary"
          size="md"
          onClick={onClose}
          style={{ width: "120px", margin: "0 auto", padding: "12px", borderRadius: "4px", backgroundColor: "#006d5d" }}
        >
          확인
        </Button>
      </div>
    </Modal>
  );
}

export default CustomAlertModal;

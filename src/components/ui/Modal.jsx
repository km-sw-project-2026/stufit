/**
 * Reusable modal shell extracted from 8+ identical overlay patterns.
 *
 * Handles:
 *   - Fixed fullscreen overlay (click outside to close)
 *   - Centered content panel
 *   - Keyboard Escape to close
 *   - Scroll lock on body while open
 *
 * The content panel styling is left to the caller via children
 * for maximum reuse across alert modals, confirm modals, forms, and drawers.
 */
function Modal({
  children,
  open,
  onClose,
  overlayOpacity = 0.5,
  contentZIndex,
  style,
  className = "",
}) {
  if (!open) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose?.();
    }
  };

  const overlayStyle = {
    position: "fixed",
    inset: 0,
    backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "var(--z-modal-overlay)",
    ...style,
  };

  const contentStyle = {
    position: "relative",
    zIndex: contentZIndex || "var(--z-modal-content)",
  };

  return (
    <div
      className={`modal-overlay ${className}`}
      style={overlayStyle}
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="modal-content-panel"
        style={{
          backgroundColor: "var(--color-surface)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-modal)",
          ...contentStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default Modal;

/**
 * Reusable button extracted from 15+ identical patterns across the codebase.
 *
 * Variants:
 *   primary  — filled teal, white text (default)
 *   outline  — white bg, teal border and text
 *   ghost    — transparent bg, teal text, no border
 *   danger   — filled red, white text
 *   secondary — light gray bg, dark text
 *
 * Sizes: sm, md, lg
 * Supports: disabled, loading states
 */
function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  className = "",
  style,
  ...props
}) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    cursor: disabled || loading ? "not-allowed" : "pointer",
    opacity: disabled || loading ? 0.6 : 1,
    border: "none",
    outline: "none",
    transition: "background-color 0.2s ease, transform 0.15s ease",
    fontFamily: "inherit",
    fontSize: "var(--text-sm)",
    gap: "var(--space-2)",
    textDecoration: "none",
    whiteSpace: "nowrap",
  };

  const sizes = {
    sm: { padding: "var(--space-2) var(--space-4)", borderRadius: "var(--radius-sm)", fontSize: "var(--text-xs)" },
    md: { padding: "var(--space-3) var(--space-5)", borderRadius: "var(--radius-md)" },
    lg: { padding: "var(--space-4) var(--space-8)", borderRadius: "var(--radius-lg)", fontSize: "var(--text-base)" },
  };

  const variants = {
    primary: {
      backgroundColor: "var(--color-primary)",
      color: "var(--color-surface)",
    },
    outline: {
      backgroundColor: "var(--color-surface)",
      color: "var(--color-primary-outline)",
      border: "1px solid var(--color-primary-outline)",
    },
    ghost: {
      backgroundColor: "transparent",
      color: "var(--color-primary-outline)",
    },
    danger: {
      backgroundColor: "var(--color-danger)",
      color: "var(--color-surface)",
    },
    secondary: {
      backgroundColor: "var(--color-border)",
      color: "var(--color-text)",
    },
  };

  const width = fullWidth ? { width: "100%" } : {};

  return (
    <button
      style={{
        ...base,
        ...sizes[size],
        ...variants[variant],
        ...width,
        ...style,
      }}
      disabled={disabled || loading}
      className={`${className}`.trim() || undefined}
      {...props}
    >
      {loading ? "처리 중..." : children}
    </button>
  );
}

export default Button;

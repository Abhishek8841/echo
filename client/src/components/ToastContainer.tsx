import { useToast } from "../hooks/useToast";
import type { ToastType } from "../context/ToastContext";

const icons: Record<ToastType, string> = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
};

const colors: Record<ToastType, { bg: string; border: string; icon: string }> = {
    success: {
        bg: "rgba(74, 170, 87, 0.08)",
        border: "rgba(74, 170, 87, 0.25)",
        icon: "#4DAA57",
    },
    error: {
        bg: "rgba(235, 87, 87, 0.08)",
        border: "rgba(235, 87, 87, 0.25)",
        icon: "#EB5757",
    },
    warning: {
        bg: "rgba(224, 165, 56, 0.08)",
        border: "rgba(224, 165, 56, 0.25)",
        icon: "#E0A538",
    },
    info: {
        bg: "rgba(55, 53, 47, 0.06)",
        border: "rgba(55, 53, 47, 0.15)",
        icon: "#787774",
    },
};

const ToastContainer = () => {
    const { toasts, removeToast } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div
            style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
                left: "20px",
                zIndex: 9999,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: "8px",
                pointerEvents: "none",
            }}
        >
            {toasts.map((toast) => {
                const c = colors[toast.type];
                return (
                    <div
                        key={toast.id}
                        onClick={() => removeToast(toast.id)}
                        style={{
                            pointerEvents: "auto",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "10px 16px",
                            background: "white",
                            border: `1px solid ${c.border}`,
                            borderRadius: "10px",
                            boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
                            cursor: "pointer",
                            maxWidth: "380px",
                            width: "fit-content",
                            animation: toast.exiting
                                ? "toast-slide-out 0.25s ease-in forwards"
                                : "toast-slide-in 0.3s ease-out both",
                        }}
                    >
                        <span
                            style={{
                                width: "22px",
                                height: "22px",
                                borderRadius: "50%",
                                backgroundColor: c.bg,
                                color: c.icon,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "11px",
                                fontWeight: 600,
                                flexShrink: 0,
                            }}
                        >
                            {icons[toast.type]}
                        </span>
                        <span
                            style={{
                                fontSize: "13px",
                                color: "#37352F",
                                lineHeight: 1.4,
                            }}
                        >
                            {toast.message}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default ToastContainer;

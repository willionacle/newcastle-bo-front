import { CSSProperties } from "react";

interface Props {
  size?: "sm" | "md" | "lg";
  collapsed?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}

const sizePx = { sm: 18, md: 28, lg: 40 };

const RPLogo = ({ size = "md", collapsed = false, onClick, style }: Props) => {
  const fontSize = collapsed ? sizePx.md : sizePx[size];
  const dotSize = Math.max(4, Math.round(fontSize * 0.18));

  return (
    <div
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: dotSize,
        padding: collapsed ? "6px 10px" : "8px 14px",
        borderRadius: 12,
        background:
          "linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #1e1b4b 100%)",
        color: "#ffffff",
        cursor: onClick ? "pointer" : "default",
        userSelect: "none",
        boxShadow: "0 6px 16px rgba(79,70,229,0.25)",
        ...style,
      }}
    >
      <span
        style={{
          fontWeight: 800,
          fontSize,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          fontFamily: "'Noto Sans KR', sans-serif",
        }}
      >
        RP
      </span>
      <span
        aria-hidden
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: "50%",
          background: "#a5b4fc",
        }}
      />
    </div>
  );
};

export default RPLogo;

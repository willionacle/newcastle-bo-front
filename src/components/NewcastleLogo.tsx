import { CSSProperties } from "react";
import logo from "@/assets/img/newcastle-logo.png";

interface Props {
  size?: "sm" | "md" | "lg";
  collapsed?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}

const heightPx = { sm: 24, md: 36, lg: 52 };

const NewcastleLogo = ({ size = "md", collapsed = false, onClick, style }: Props) => (
  <img
    src={logo}
    alt="뉴캐슬"
    onClick={onClick}
    draggable={false}
    style={{
      height: collapsed ? heightPx.sm : heightPx[size],
      width: "auto",
      maxWidth: "100%",
      objectFit: "contain",
      cursor: onClick ? "pointer" : "default",
      userSelect: "none",
      ...style,
    }}
  />
);

export default NewcastleLogo;

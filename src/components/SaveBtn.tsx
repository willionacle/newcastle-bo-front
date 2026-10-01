import { SaveOutlined } from "@ant-design/icons";
import { Button, ButtonProps } from "antd";
import { CSSProperties } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  size?: ButtonProps["size"];
  noStyle?: boolean;
  block?: ButtonProps["block"];
  type?: "button" | "submit" | "reset" | undefined;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  customStyle?: CSSProperties;
  className?: string;
}

const SaveBtn = ({ size, className = "", noStyle, block, type = "submit", onClick, disabled, loading, customStyle }: Props) => {
  const { t } = useTranslation();

  const style: CSSProperties = {
    marginLeft: "auto",
    display: "block",
  };

  return (
    <Button
      className={className}
      shape={size ? "default" : "round"}
      icon={<SaveOutlined />}
      style={!noStyle ? {...style, ...customStyle} : undefined}
      htmlType={type}
      size={size ?? "middle"}
      block={block}
      onClick={onClick}
      disabled={disabled}
      loading={loading}
    >
      {t("global.save")}
    </Button>
  );
};

export default SaveBtn;

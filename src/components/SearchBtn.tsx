import { SearchOutlined } from "@ant-design/icons";
import { Button, ButtonProps } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

interface Props {
  size?: ButtonProps["size"];
  block?: ButtonProps["block"];
  style?: React.CSSProperties;
}

const SearchBtn = ({ size, block, style }: Props) => {
  const { t } = useTranslation();

  return (
    <Button
      shape={size ? "default" : "round"}
      icon={<SearchOutlined />}
      htmlType="submit"
      size={size ?? "middle"}
      block={block}
      style={style}
    >
      {t("global.search")}
    </Button>
  );
};

export default SearchBtn;

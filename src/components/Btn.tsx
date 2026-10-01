import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { Button, ButtonProps } from "antd";
import { useTranslation } from "react-i18next";

interface Props {
  btnType: "search" | "create" | "show" | "edit" | "save" | "delete";
  size?: ButtonProps["size"];
  type?: ButtonProps["type"];
  htmlType?: ButtonProps["htmlType"];
  style?: ButtonProps["style"];
  onClick?: ButtonProps["onClick"];
  block?: ButtonProps["block"];
}

const Btn = ({
  btnType,
  block,
  htmlType,
  onClick,
  size,
  style,
  type,
}: Props) => {
  const { t } = useTranslation();
  let title: string;
  const btnProps: ButtonProps = { block, htmlType, onClick, size, style, type };

  switch (btnType) {
    case "search":
      title = t("global.search");
      break;

    case "save":
      title = t("global.save");
      break;

    case "show":
      title = "";
      btnProps.shape = "circle";
      btnProps.icon = <EyeOutlined />;
      break;

    case "edit":
      title = "";
      btnProps.shape = "circle";
      btnProps.icon = <EditOutlined />;
      break;

    case "create":
      title = t("global.create");
      btnProps.icon = <SaveOutlined />;
      btnProps.shape = "round";
      break;

    case "delete":
      title = "";
      btnProps.icon = <DeleteOutlined />;
      btnProps.shape = "circle";
      break;

    default:
      title = "";
      break;
  }

  return <Button {...btnProps}>{title}</Button>;
};

export default Btn;

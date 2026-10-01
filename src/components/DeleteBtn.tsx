import { DeleteOutlined } from "@ant-design/icons";
import { Button, Popconfirm, message } from "antd";
import { useTranslation } from "react-i18next";

interface Props {
  handleDelete: () => void;
  label?: string;
}

const DeleteBtn = ({ handleDelete, label }: Props) => {
  const { t } = useTranslation();

  const cancel = () => {
    message.info(`${t("global.delete")} ${t("global.cancel")}`);
  };

  const confirm = () => {
    handleDelete();
  };

  return (
    <Popconfirm
      title={t("global.delete")}
      onCancel={cancel}
      onConfirm={confirm}
    >
      <Button icon={<DeleteOutlined />} shape={label ? "default" : "circle"}>{label}</Button>
    </Popconfirm>
  );
};

export default DeleteBtn;

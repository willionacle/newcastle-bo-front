import { ReloadOutlined } from "@ant-design/icons";
import { Button, Popconfirm, message } from "antd";
import { useTranslation } from "react-i18next";

interface Props {
  handleReset: () => void;
  label?: string;
}

const ResetBtn = ({ handleReset, label }: Props) => {
  const { t } = useTranslation();

  const cancel = () => {
    message.info(`${t("global.refresh")} ${t("global.cancel")}`);
  };

  const confirm = () => {
    handleReset();
  };

  return (
    <Popconfirm
      title={t("global.refresh")}
      onCancel={cancel}
      onConfirm={confirm}
    >
      <Button icon={<ReloadOutlined />} shape={label ? "default" : "circle"}>{label}</Button>
    </Popconfirm>
  );
};

export default ResetBtn;

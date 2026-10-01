import { Modal } from "antd";
import i18next from "@/i18n/i18n";
import List from "./List";

interface Props {
  depositMethod?: string;
  onCancel: () => void;
}

export default function DepositMethodUserListModal({
  depositMethod,
  onCancel,
}: Props) { 

  return (
    <Modal
      title={i18next.t("title.userListTitle")}
      open={!!depositMethod}
      onCancel={onCancel}
      footer={null}
      centered
      width={"80%"}
      destroyOnClose
    >
      {depositMethod && (
        <List depositMethod={depositMethod} />
      )}
    </Modal>
  );
}
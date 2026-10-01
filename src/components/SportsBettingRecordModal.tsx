import { Modal } from "antd";
import { useTranslation } from "react-i18next";
import SportsBettingRecordTable from "./SportsBettingRecordTable";

const SportsBettingRecordModal = ({ isOpen, close, matchId, betType }: any) => {
  const { t } = useTranslation();
  return (
    <Modal
      title={t("sportsBet.recordTitle")}
      open={isOpen}
      onCancel={close}
      width={1000}
      footer={null}
    >
      <SportsBettingRecordTable matchId={matchId} betType={betType} />
    </Modal>
  );
};

export default SportsBettingRecordModal;

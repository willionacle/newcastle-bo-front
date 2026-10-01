import { useEffect, useState } from "react";
import { Button, Input, Modal, Space, notification } from "antd";
import { useTranslation } from "react-i18next";
import { BetLogData } from "@/api/betting-logs/get";
import { cancelBetLogAPI } from "@/api/betting-logs/cancel";

const { TextArea } = Input;

interface Props {
  open: boolean;
  record?: BetLogData;
  onClose: () => void;
  onCancelled: () => void;
}

const CancelBetModal = ({ open, record, onClose, onCancelled }: Props) => {
  const { t } = useTranslation();
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setReason("");
  }, [record]);

  const handleCancel = async () => {
    if (!record) return;

    setSubmitting(true);
    try {
      const res = await cancelBetLogAPI(record.id, reason.trim());
      const {
        data: { code, message },
      } = res;

      if (code === 0) {
        notification.success({ message: t("toast.common.updateSuccess") });
        onCancelled();
      } else {
        notification.error({ message });
      }
    } catch (error) {
      notification.error({ message: t("toast.common.updateFailed") });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      title={t("betting.cancelBet")}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={480}
    >
      {record && (
        <>
          <p>
            {record.username} · {record.bet_type} · {record.bet_amount}
          </p>
          <TextArea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t("betting.cancelReason")}
          />
          <Space style={{ marginTop: 12 }}>
            <Button danger type="primary" loading={submitting} onClick={handleCancel}>
              {t("global.cancel")}
            </Button>
          </Space>
        </>
      )}
    </Modal>
  );
};

export default CancelBetModal;

import { useState } from "react";
import i18next from "@/i18n/i18n";
import { Button, message, Modal, notification } from "antd";
import { api } from "@/api/axios";
import useUserStore from "@/store/user.store";
import { useTranslation } from "react-i18next";

const GlobalForcedWithdrawalOff = ({ mutate }: { mutate: any }) => {
  const { t } = useTranslation();
  const { token } = useUserStore.getState();
  const [loading, setLoading] = useState(false);

  const handleGlobalOff = () => {
    Modal.confirm({
      title: i18next.t("title.confirmProceed"),
      content: i18next.t("title.forcedOffContent"),
      okText: i18next.t("title.yes"),
      okType: 'primary',
      cancelText: i18next.t("title.no"),
      cancelButtonProps:{
        style: {
          backgroundColor: '#e0e7ff',
          color:"#4f46e5",
          border:"1px solid #0000001a"
        },
      },
      okButtonProps: {
        style: {
          backgroundColor: '#4f46e5',
        },
      },
      onOk: async () => {
        setLoading(true);
        try {
          const res = await api.setForcedWithdrawalOff(token);

          if (res.data.code == 0) {
            notification.success({
              message: t("toast.common.statusChangeSuccess"),
            });
          } else {
            notification.success({
              message: res.data.message,
            });
          }

          if (mutate) mutate();
        } catch (error) {
          console.error(error);
          message.error(t("toast.common.updateFailedSettings"));
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <Button
      size="small"
      loading={loading}
      onClick={handleGlobalOff}
    >
      전체 Off
    </Button>
  );
};

export default GlobalForcedWithdrawalOff;

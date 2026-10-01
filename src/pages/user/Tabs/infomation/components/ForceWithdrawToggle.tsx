import { Switch, Popconfirm, Flex, notification } from "antd";
import i18next from "@/i18n/i18n";
import { useState } from "react";
import { api } from "@/api/axios";
import useUserStore from "@/store/user.store";
interface ForceWithdrawToggleProps {
  username: string | null;
  checked: boolean;
  mutate: () => void;
  data: any;
}

const ForceWithdrawToggle = ({
  username,
  checked,
  mutate,
  data,
}: ForceWithdrawToggleProps) => {
  const { token,userid } = useUserStore.getState();
  const [loading, setLoading] = useState(false);

  const handleToggle = async (newValue: boolean) => {
    if (!username) return;

    setLoading(true);
    try {
      if (data) {
        const res = await api.updateUser(
          {
            ...data,
            userid: userid,
            password: undefined,
            local_grade_config: data.local_grade_config ?? "automatic",
            is_allowed_forced_withdrawal: newValue ? 1 : 0,
          },
          token,
        );
        if (res.data.code == 0) {
          notification.success({
            message: i18next.t("toast.common.statusChangeSuccess"),
          });
        } else {
          notification.success({
            message: res.data.message,
          });
        }
      }

      mutate();
    } catch (error) {
      notification.error({
        message: i18next.t("toast.common.statusChangeFailed"),
      });
    } finally {
      mutate();
      setLoading(false);
    }
  };

  return (
    <Flex justify="flex-end" align="center" style={{ height: "100%" }}>
      <Popconfirm
        title={i18next.t("title.forcedWithdrawalStatusChange")}
        description={i18next.t("user.confirmForceWithdraw", { state: checked ? i18next.t("regulation.rg006") : i18next.t("regulation.rg005") })}
        onConfirm={() => handleToggle(!checked)}
        okText={i18next.t("global.true")}
        cancelText={i18next.t("title.no")}
        disabled={loading}
      >
        <Switch checked={checked} loading={loading} />
      </Popconfirm>
    </Flex>
  );
};

export default ForceWithdrawToggle;

import useUserStore from "@/store/user.store";
import instance from "../axios";
import { notification } from "antd";
import i18next from "@/i18n/i18n";

export const deleteSpecialGame = async (id: number) => {
  const { token } = useUserStore.getState();

  try {
    const res = await instance.delete(`/api/special-games/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { data } = res;

    if (data.code === 0) {
      notification.success({
        message: i18next.t("global.success"),
        description: data.message || i18next.t("toast.common.deleteSuccess"),
      });
      return true;
    } else {
      notification.error({
        message: i18next.t("toast.common.error"),
        description: data.message || i18next.t("toast.common.deleteFailed"),
      });
      return false;
    }
  } catch (error: any) {
    notification.error({
      message: i18next.t("toast.common.error"),
      description: error.response?.data?.message || i18next.t("toast.common.deleteFailed"),
    });
    return false;
  }
};

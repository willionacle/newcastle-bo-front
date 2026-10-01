import i18next from "@/i18n/i18n";
import useUserStore from "@/store/user.store";
import axios from "axios";

export const deleteBonusAPI = async (id: number) => {
  const token = useUserStore.getState().token;

  try {
    const res = await axios.delete(
      `${import.meta.env.VITE_SPORTSAPI_URL}/sports/bonus/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res;
  } catch (error: any) {
    if (error.response) {
      return {
        status: error.response.status,
        data: {
          message: error.response.data.message,
        },
      };
    } else {
      return { status: 500, message: i18next.t("toast.common.serverUnreachable") };
    }
  }
};

export const deleteCombineAPI = async (id: number) => {
  const token = useUserStore.getState().token;

  try {
    const res = await axios.delete(
      `${import.meta.env.VITE_SPORTSAPI_URL}/sports/combine/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res;
  } catch (error: any) {
    if (error.response) {
      return {
        status: error.response.status,
        data: {
          message: error.response.data.message,
        },
      };
    } else {
      return { status: 500, message: i18next.t("toast.common.serverUnreachable") };
    }
  }
};

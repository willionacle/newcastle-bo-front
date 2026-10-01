import i18next from "@/i18n/i18n";
import useUserStore from "@/store/user.store";
import axios from "axios";

export const createVrCombineAPI = async (formData: any) => {
  const token = useUserStore.getState().token;

  try {
    const res = await axios.post(
      `${import.meta.env.VITE_SPORTSAPI_URL}/vr/combine`,
      formData,
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
export const createVrBonusAPI = async (formData: any) => {
  const token = useUserStore.getState().token;

  try {
    const res = await axios.post(
      `${import.meta.env.VITE_SPORTSAPI_URL}/vr/bonus`,
      formData,
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

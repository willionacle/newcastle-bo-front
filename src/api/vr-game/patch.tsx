import i18next from "@/i18n/i18n";
import useUserStore from "@/store/user.store";
import axios from "axios";

export const updateVrSportsConfig = async (formData: any) => {
  const token = useUserStore.getState().token;

  try {
    const res = await axios.patch(
      `${import.meta.env.VITE_SPORTSAPI_URL}/vr/config/sports`,
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

export const updateVrConfig = async (formData: any) => {
  const token = useUserStore.getState().token;

  try {
    const res = await axios.patch(
      `${import.meta.env.VITE_SPORTSAPI_URL}/vr/config`,
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

export const updateVrCombine = async (formData: any) => {
  const token = useUserStore.getState().token;

  try {
    const res = await axios.patch(
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

export const updateVrMarketAPI = async (formData: any) => {
  const token = useUserStore.getState().token;

  try {
    const res = await axios.patch(
      `${import.meta.env.VITE_SPORTSAPI_URL}/vr/market`,
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

export const updateVrBonusAPI = async (formData: any) => {
  const token = useUserStore.getState().token;

  try {
    const res = await axios.patch(
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

export const updateVrLeagueAPI = async (formData: any) => {
  const token = useUserStore.getState().token;

  try {
    const res = await axios.patch(
      `${import.meta.env.VITE_SPORTSAPI_URL}/vr/league`,
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

export const updateVrBetHistoryAPI = async (formData: any) => {
  const token = useUserStore.getState().token;

  try {
    const res = await axios.patch(
      `${import.meta.env.VITE_SPORTSAPI_URL}/vr/history`,
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

export const updateVrBetDetailAPI = async (formData: any) => {
  const token = useUserStore.getState().token;

  try {
    const res = await axios.patch(
      `${import.meta.env.VITE_SPORTSAPI_URL}/vr/history/detail`,
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

export const updateVrRateConfigAPI = async (formData: any) => {
  const token = useUserStore.getState().token;

  try {
    const res = await axios.patch(
      `${import.meta.env.VITE_SPORTSAPI_URL}/vr/config/rate`,
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

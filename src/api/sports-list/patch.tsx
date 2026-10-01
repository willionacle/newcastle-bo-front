import i18next from "@/i18n/i18n";
import useUserStore from "@/store/user.store";
import axios from "axios";

export const updateSportsConfig = async (formData: any) => {
  const token = useUserStore.getState().token;

  try {
    const res = await axios.patch(
      `${import.meta.env.VITE_SPORTSAPI_URL}/sports/config`,
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

export const updateSportsBonusAPI = async (formData: any) => {
  const token = useUserStore.getState().token;

  try {
    const res = await axios.patch(
      `${import.meta.env.VITE_SPORTSAPI_URL}/sports/bonus`,
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

export const updateSportsCombineAPI = async (formData: any) => {
  const token = useUserStore.getState().token;

  try {
    const res = await axios.patch(
      `${import.meta.env.VITE_SPORTSAPI_URL}/sports/combine`,
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

export const updateSportsMarketAPI = async (formData: any) => {
  const token = useUserStore.getState().token;

  try {
    const res = await axios.patch(
      `${import.meta.env.VITE_SPORTSAPI_URL}/sports/market`,
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

export const updateSportsMarketStatusAPI = async (formData: any) => {
  const token = useUserStore.getState().token;

  try {
    const res = await axios.patch(
      `${import.meta.env.VITE_SPORTSAPI_URL}/sports/market/status`,
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

export const updateSportsMatchAPI = async (formData: any) => {
  const token = useUserStore.getState().token;

  try {
    const res = await axios.patch(
      `${import.meta.env.VITE_SPORTSAPI_URL}/sports/match`,
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

export const updateSportsOddsAPI = async (formData: any) => {
  const token = useUserStore.getState().token;

  try {
    const res = await axios.patch(
      `${import.meta.env.VITE_SPORTSAPI_URL}/sports/odds`,
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

export const updateSportsBetHistoryAPI = async (formData: any) => {
  const token = useUserStore.getState().token;

  try {
    const res = await axios.patch(
      `${import.meta.env.VITE_SPORTSAPI_URL}/sports/history`,
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

export const updateSportsBetDetailAPI = async (formData: any) => {
  const token = useUserStore.getState().token;

  try {
    const res = await axios.patch(
      `${import.meta.env.VITE_SPORTSAPI_URL}/sports/history/detail`,
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

export const updateSportsMatchScoreAPI = async (formData: any) => {
  const token = useUserStore.getState().token;

  try {
    const res = await axios.patch(
      `${import.meta.env.VITE_SPORTSAPI_URL}/sports/score`,
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

export const updateMatchDeleteAPI = async (id: number, isDelete: number) => {
  const token = useUserStore.getState().token;

  try {
    const res = await axios.patch(
      `${import.meta.env.VITE_SPORTSAPI_URL}/sports/match/delete`,
      {
        id,
        isDelete,
      },
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

export const updateSportsRateConfigAPI = async (formData: any) => {
  const token = useUserStore.getState().token;

  try {
    const res = await axios.patch(
      `${import.meta.env.VITE_SPORTSAPI_URL}/sports/config/rate`,
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

export const updateSportsResultPerMarketAPI = async (formData: any) => {
  const token = useUserStore.getState().token;

  try {
    const res = await axios.patch(
      `${import.meta.env.VITE_SPORTSAPI_URL}/sports/result/market`,
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

export const updateSportsResultPerMarketScoreAPI = async (formData: any) => {
  const token = useUserStore.getState().token;

  try {
    const res = await axios.patch(
      `${import.meta.env.VITE_SPORTSAPI_URL}/sports/result/market/score`,
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

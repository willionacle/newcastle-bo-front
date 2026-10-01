import useUserStore from "@/store/user.store";
import axios from "axios";

export const getVrSportsConfigListAPI = async () => {
  const token = useUserStore.getState().token;

  const res = await axios.get(
    `${import.meta.env.VITE_SPORTSAPI_URL}/vr/config/sports`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const getVrSportsConfigViewAPI = async (id: string) => {
  const token = useUserStore.getState().token;

  const res = await axios.get(
    `${import.meta.env.VITE_SPORTSAPI_URL}/vr/config/sports/view?id=${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const getVrConfigAPI = async () => {
  const token = useUserStore.getState().token;

  const res = await axios.get(
    `${import.meta.env.VITE_SPORTSAPI_URL}/vr/config`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const getVrCombineListAPI = async (params: any) => {
  const token = useUserStore.getState().token;

  const res = await axios.get(
    `${import.meta.env.VITE_SPORTSAPI_URL}/vr/combine`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    }
  );

  return res.data;
};

export const getVrCombineViewAPI = async (id: string) => {
  const token = useUserStore.getState().token;

  const res = await axios.get(
    `${import.meta.env.VITE_SPORTSAPI_URL}/vr/combine/view?id=${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const getVrMarketListAPI = async (params: any) => {
  const token = useUserStore.getState().token;

  const res = await axios.get(
    `${import.meta.env.VITE_SPORTSAPI_URL}/vr/market`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    }
  );

  return res.data;
};

export const getVrBonusListAPI = async () => {
  const token = useUserStore.getState().token;

  const res = await axios.get(
    `${import.meta.env.VITE_SPORTSAPI_URL}/vr/bonus`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const getVrBonusViewAPI = async (id: string) => {
  const token = useUserStore.getState().token;

  const res = await axios.get(
    `${import.meta.env.VITE_SPORTSAPI_URL}/vr/bonus/view?id=${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const getVrLeagueListAPI = async () => {
  const token = useUserStore.getState().token;

  const res = await axios.get(
    `${import.meta.env.VITE_SPORTSAPI_URL}/vr/league`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const getVrBetHistoryAPI = async (params: any) => {
  const token = useUserStore.getState().token;

  const res = await axios.get(
    `${import.meta.env.VITE_SPORTSAPI_URL}/vr/history`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    }
  );

  return res.data;
};

export const getVrBetHistoryViewAPI = async (params: any) => {
  const token = useUserStore.getState().token;

  const res = await axios.get(
    `${import.meta.env.VITE_SPORTSAPI_URL}/vr/history/view`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    }
  );

  return res.data;
};

export const getVrRateConfigAPI = async () => {
  const token = useUserStore.getState().token;

  const res = await axios.get(
    `${import.meta.env.VITE_SPORTSAPI_URL}/vr/config/rate`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

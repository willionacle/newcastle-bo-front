import useUserStore from "@/store/user.store";
import axios from "axios";

export const getSportsConfigAPI = async () => {
  const token = useUserStore.getState().token;

  const res = await axios.get(
    `${import.meta.env.VITE_SPORTSAPI_URL}/sports/config`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const getSportsBonusListAPI = async () => {
  const token = useUserStore.getState().token;

  const res = await axios.get(
    `${import.meta.env.VITE_SPORTSAPI_URL}/sports/bonus`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const getSportsBonusViewAPI = async (id: string) => {
  const token = useUserStore.getState().token;

  const res = await axios.get(
    `${import.meta.env.VITE_SPORTSAPI_URL}/sports/bonus/view?id=${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const getSportsCombineListAPI = async (params: any) => {
  const token = useUserStore.getState().token;

  const res = await axios.get(
    `${import.meta.env.VITE_SPORTSAPI_URL}/sports/combine`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    }
  );

  return res.data;
};

export const getSportsCombineViewAPI = async (id: string) => {
  const token = useUserStore.getState().token;

  const res = await axios.get(
    `${import.meta.env.VITE_SPORTSAPI_URL}/sports/combine/view?id=${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const getSportsMarketListAPI = async (params: any) => {
  const token = useUserStore.getState().token;

  const res = await axios.get(
    `${import.meta.env.VITE_SPORTSAPI_URL}/sports/market`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    }
  );

  return res.data;
};

export const getSportsMarketViewAPI = async (id: string) => {
  const token = useUserStore.getState().token;

  const res = await axios.get(
    `${import.meta.env.VITE_SPORTSAPI_URL}/sports/market/view?id=${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const getSportsListAPI = async (params: any) => {
  const token = useUserStore.getState().token;

  const res = await axios.get(
    `${import.meta.env.VITE_SPORTSAPI_URL}/sports/match`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    }
  );

  return res.data;
};

export const getSportsBetListAPI = async (params: any) => {
  const token = useUserStore.getState().token;

  const res = await axios.get(
    `${import.meta.env.VITE_SPORTSAPI_URL}/sports/matchbet`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    }
  );

  return res.data;
};

export const getSportsMatchViewAPI = async (id: string) => {
  const token = useUserStore.getState().token;

  const res = await axios.get(
    `${import.meta.env.VITE_SPORTSAPI_URL}/sports/match/view?id=${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const getSportsBetHistoryAPI = async (params: any) => {
  const token = useUserStore.getState().token;

  const res = await axios.get(
    `${import.meta.env.VITE_SPORTSAPI_URL}/sports/history`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    }
  );

  return res.data;
};

export const getSportsBetHistoryViewAPI = async (params: any) => {
  const token = useUserStore.getState().token;

  const res = await axios.get(
    `${import.meta.env.VITE_SPORTSAPI_URL}/sports/history/view`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    }
  );

  return res.data;
};

export const getSportsScorePreviewAPI = async (params: any) => {
  const token = useUserStore.getState().token;

  const res = await axios.get(
    `${import.meta.env.VITE_SPORTSAPI_URL}/sports/score/preview`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    }
  );

  return res;
};

export const getSportsRateConfigAPI = async () => {
  const token = useUserStore.getState().token;

  const res = await axios.get(
    `${import.meta.env.VITE_SPORTSAPI_URL}/sports/config/rate`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

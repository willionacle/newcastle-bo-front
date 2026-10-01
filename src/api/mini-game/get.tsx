import useUserStore from "@/store/user.store";
import axios from "axios";

export const getMiniConfigAPI = async () => {
  const token = useUserStore.getState().token;

  const res = await axios.get(
    `${import.meta.env.VITE_SPORTSAPI_URL}/mini/config`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const getMiniBetTypeListAPI = async (params: any) => {
  const token = useUserStore.getState().token;

  const res = await axios.get(
    `${import.meta.env.VITE_SPORTSAPI_URL}/mini/bettype`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    }
  );

  return res.data;
};

export const getMiniBetTypeViewAPI = async (id: string) => {
  const token = useUserStore.getState().token;

  const res = await axios.get(
    `${import.meta.env.VITE_SPORTSAPI_URL}/mini/bettype/view?id=${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const getMiniBetHistoryAPI = async (params: any) => {
  const token = useUserStore.getState().token;

  const res = await axios.get(
    `${import.meta.env.VITE_SPORTSAPI_URL}/mini/history`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    }
  );

  return res.data;
};

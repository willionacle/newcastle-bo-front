import useUserStore from "@/store/user.store";
import instance from "../axios";

export const updateWeeklyLossingAPI = async (body: any) => {
  const token = useUserStore.getState().token;

  return await instance.post("/updatelossingconfig", body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

import useUserStore from "@/store/user.store";
import instance from "../axios";

export const createHeroManagementAPI = async (body: any) => {
  const token = useUserStore.getState().token;

  return await instance.post("/hero-managements", body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

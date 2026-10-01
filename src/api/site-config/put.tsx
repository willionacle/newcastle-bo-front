import useUserStore from "@/store/user.store";
import instance from "../axios";

export const updateSiteConfigAPI = async (body: any) => {
  const token = useUserStore.getState().token;

  return await instance.put("/site-config", body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

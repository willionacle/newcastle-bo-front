import useUserStore from "@/store/user.store";
import instance from "../axios";

export const meApi = async () => {
  const {token, userid} = useUserStore.getState();
  const res = await instance.post("/validatetoken", {userid},
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

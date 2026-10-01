import useUserStore from "@/store/user.store";
import instance from "../axios";

export const deleteRegulationAPI = (id: number) => {
  const {token, userid} = useUserStore.getState();

  return instance.post("/deleteregulation", {userid: userid, id: id}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

import useUserStore from "@/store/user.store";
import instance from "../axios";

export const deleteNoticeAPI = (id: number) => {
  const {token, userid} = useUserStore.getState();

  return instance.post("/deletenotice", {userid: userid, id: id}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

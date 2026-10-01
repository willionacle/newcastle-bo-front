import useUserStore from "@/store/user.store";
import instance from "../axios";
import { WhiteListData } from "./get";

export const deleteWhiteList = async (id: WhiteListData["id"]) => {
  const {token, userid} = useUserStore.getState();

  const res = await instance.post("deletewhiteip",{
    "userid"        : userid,
    "id"            : id
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
};

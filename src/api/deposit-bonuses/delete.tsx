import useUserStore from "@/store/user.store";
import instance from "../axios";

export const deleteDepositBonuses = async (id: number) => {
  const {token, userid} = useUserStore.getState();
  return await instance.post(`/deletedepositbonus`, {
    userid: userid,
    id: id
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

import useUserStore from "@/store/user.store";
import instance from "@/api/axios";
import { AxiosResponse } from "axios";
import { DefaultResponseInterface } from "@/api/types";

interface UpdateMissionBody {
  id: number,
  status: number
  username: string;
}

export const updateMissionProgressAPI = async (
  data: UpdateMissionBody,
) => {
  const {token, userid} = useUserStore.getState();

  const res = await instance.post<undefined, AxiosResponse<DefaultResponseInterface<undefined>>>(`/updateuserprogress`, {userid, ...data}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
};

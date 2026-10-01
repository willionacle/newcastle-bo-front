import useUserStore from "@/store/user.store";
import instance from "../axios";
import { PostAddRes } from "../types";
import { AxiosResponse } from "axios";

export interface UserBirthdayBody {
  username: string;
  birthday: string;
}

export const updateUserBirthday = async (body: UserBirthdayBody) => {
  const {token, userid} = useUserStore.getState();

  const res = await instance.patch<UserBirthdayBody, AxiosResponse<PostAddRes>>("/api/users/update-birthday", {...body, userid}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
};

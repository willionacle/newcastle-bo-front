import { AxiosResponse } from "axios";
import instance from "../axios";
import useUserStore from "@/store/user.store";

export interface PostFindPhoneNumber {
  username: string;
  userid?: number;
}

export interface ResPostFindPhoneNumber {
  code: number;
  data: {
    phonenumber?: string;
  };
  message: string;
}

export const findPhoneNumberAPI = async (body: PostFindPhoneNumber) => {
  const {token, userid} = useUserStore.getState();

  const res = await instance.post<
    undefined,
    AxiosResponse<ResPostFindPhoneNumber>
  >("/findphonenumber", {...body, userid: userid}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

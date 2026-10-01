import useUserStore from "@/store/user.store";
import instance from "../axios";
import { UVBody } from "./post";
import { UVAccountData } from "./get";

interface UVAccountUpdateBody extends UVBody {
  id: number;
}

interface UVAccountFullUpdateBody extends Partial<UVAccountData> {}

export const updateUVAccount = async (body: UVAccountUpdateBody) => {
  const {token, userid} = useUserStore.getState();

  return await instance.post(
    "/updatevirtualaccount",
    { ...body, userid },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const fullUpdateUVAccount = async (body: UVAccountFullUpdateBody) => {
  const {token, userid} = useUserStore.getState();

  return await instance.post(
    "/fullupdate",
    { ...body, userid },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

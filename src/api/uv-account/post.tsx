import useUserStore from "@/store/user.store";
import instance from "../axios";

export interface UVBody {
  type: string; // if reg_type 0,  v-account1 |  v-account2, else if reg_type >= 1, usdt
  title: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  reg_type: number; //0 - no type / 1 - level / 2 - grade / 3 - excel
  reg_level: string | null; // if reg_type 0, null, else if reg_type is 1 else null  multiple select
  reg_grade: string | null; // if reg_type 0, null, else if reg_type is 2 else null multiple select
  reg_excel: string | null; // if reg_type 0, null, else if reg_type is 3 else null  use the media uploader
}

export const craeteUVAccount = async (body: UVBody) => {
  const {token, userid} = useUserStore.getState();

  return await instance.post(
    "/addvirtualaccount",
    { ...body, userid },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

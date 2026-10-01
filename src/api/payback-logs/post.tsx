import useUserStore from "@/store/user.store";
import instance from "../axios";
import { mutate } from "swr";
import { PaybackListData } from "./get";

interface Body {
  id: number;
  amount: number
}

export const updatePaybackAmountAPI = async (data: Body) => {
  const {token,userid} = useUserStore.getState();

  const res = await instance.post("/updatepaybackamount", {
    userid,
    ...data
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res) {
    mutate("/paybacklist");
  }

  return res;
};

interface RowData extends Omit<Body, "amount"> {
  status: number;
}

interface PaymentData extends Pick<PaybackListData, | "system_note"> {
  data: RowData[],
}

export const postPaybackAmountAPI = async (data: PaymentData) => {
  const {token,userid} = useUserStore.getState();

  const res = await instance.post("/paymentamount", {
    userid,
    ...data
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res) {
    mutate("/paybacklist");
  }

  return res;
};
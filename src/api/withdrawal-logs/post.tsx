import useUserStore from "@/store/user.store";
import instance from "../axios";
import { mutate } from "swr";
import { UpdatePaymentBody } from "../deposit-logs/post";
import { DepositLogs } from "../deposit-logs/get";

export const updateWithdrawalStatus = async (body: UpdatePaymentBody) => {
  const token = useUserStore.getState().token;

  if (!Array.isArray(body.id)) {
    await instance.post("/custom/withdrawal-status", body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } else {
    await Promise.all(
      body.id.map(
        async (item) =>
          await instance.post(
            "/updatewithdrawstatus",
            { ...body, id: item },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
      )
    );
  }

  mutate("/custom/withdrawals");
};


export const updateWithdrawalRollingStatus = async (body: {
  id: number;
  status: DepositLogs["status"];
}) => {
  const token = useUserStore.getState().token;

  await instance.put("/updatewithdrawrolling", body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateWithdrawalLossingStatus = async (body: {
  id: number;
  status: DepositLogs["status"];
}) => {
  const token = useUserStore.getState().token;

  await instance.put("/updatewithdrawlossing", body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
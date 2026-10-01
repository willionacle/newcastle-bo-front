import useUserStore from "@/store/user.store";
import instance from "../axios";
import { DepositLogs } from "./get";

export interface UpdatePaymentBody {
  id: string | string[];
  status: DepositLogs["status"];
}

export const updateDepositStatus = async (body: UpdatePaymentBody) => {
  const token = useUserStore.getState().token;

  if (!Array.isArray(body.id)) {
    await instance.post("/custom/deposit-status", body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } else {
    await Promise.all(
      body.id.map(
        async (item) =>
          await instance.post(
            "/custom/deposit-status",
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
};

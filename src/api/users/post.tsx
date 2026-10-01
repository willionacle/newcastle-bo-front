import useUserStore from "@/store/user.store";
import instance from "../axios";
import { User } from "./get";
import { mutate } from "swr";
import { stringify } from "qs";

export interface CreateUserBody {
  username: User["username"];
  password: string;
  accountName: User["accountName"];
  phoneNumber: string;
  agent_id: User["username"];
  userLevel: User["user_level"];
  status: User["status"];
  bankName: User["bankName"];
  accountNumber: User["accountNumber"];
  userRealName: User["userRealName"];
  rollingCasinoPercentage: User["rollingCasinoPercentage"];
  rollingSlotPercentage: User["rollingSlotPercentage"];
  rollingMiniGamePercentage: User["rollingMiniGamePercentage"];
  rollingSportsPercentage: User["rollingSportsPercentage"];
  lossingPointPercentage: User["lossingPointPercentage"];
  rollingPointType: User["rollingPointType"];
  lossingPointType: User["lossingPointType"];
  treeDepth?: User["tree_depth"];
  levelType: User["levelType"];
  depositTotal: number;
  betTotal: number;
  withdrawalTotal: number;
}

export const createUserAPI = async (body: CreateUserBody) => {
  const token = useUserStore.getState().token;

  return await instance.post("/custom/createUser", body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createAgentAPI = async (body: CreateUserBody) => {
  const token = useUserStore.getState().token;

  const res = await instance.post("/custom/createAgent", body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res) {
    const queryData = {
      filters: {
        treeDepth: {
          $eq: body.treeDepth,
        },
      },
    };

    const query = stringify(queryData, { encodeValuesOnly: true });

    mutate(["/users", query]);
  }

  return res;
};

interface Body {
  newPassword: string;
  username: User["username"];
}

export const changePassword = async (body: Body) => {
  const token = useUserStore.getState().token;

  const res = await instance.post(`/custom/change-password`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
};


export const increaseBalanceAPI = async (body: {
  amount: number;
  username: string;
}) => {
  const {token, userid} = useUserStore.getState();

  await instance.post(`/addagentbalance`, {...body, userid}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const decreaseBalanceAPI = async (body: {
  amount: number;
  username: string;
}) => {
  const {token, userid} = useUserStore.getState();

  await instance.post(`/deductagentbalance`, {...body, userid}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
// PASSWORD_RESET_AND_IMPERSONATION_FRONTEND_INTEGRATION.md §2 "로그인 대행".
// `data.token` is a real player session (30 idle minutes, slides like any
// login) — issuing it ends the member's own session. The panel never shows
// or stores it beyond building the player-site hand-over URL (§4).
// Refusals are HTTP 200 `code: 1` (not found / admin or agent / SUSPENDED).
export interface ImpersonateData {
  username: string;
  token: string;
  expiresInMinutes: number;
  expiresAt: string;
}

export const impersonateUserAPI = async (
  username: string
): Promise<{ code: number; message: string; data?: ImpersonateData }> => {
  const token = useUserStore.getState().token;

  const { data } = await instance.post(
    `/api/users/${encodeURIComponent(username)}/impersonate`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      silent: true,
    }
  );

  return data;
};

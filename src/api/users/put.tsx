import useUserStore from "@/store/user.store";
import instance from "../axios";
import { User } from "./get";
import { AgentType } from "../types";

export interface UpdateUserBody {
  username: User["username"];
  accountName: User["accountName"];
  rollingCasinoPercentage: User["rollingCasinoPercentage"];
  rollingSlotPercentage: User["rollingSlotPercentage"];
  rollingMiniGamePercentage: User["rollingMiniGamePercentage"];
  rollingSportsPercentage: User["rollingSportsPercentage"];
  lossingPointPercentage: User["lossingPointPercentage"];
  lossingPointType: User["lossingPointType"];
  rollingPointType: User["rollingPointType"];
  status: User["status"];
  accountNumber: User["accountNumber"];
  bankName: User["bankName"];
  userLevel: User["user_level"];
  userRealName: User["userRealName"];
  levelType: User["levelType"];
  depositTotal: number;
  betTotal: number;
  withdrawalTotal: number;
}

export interface UpdatePhoneNumberBody {
  phoneNumber: string;
}

export const updateUserAPI = async (
  id: User["id"],
  body: UpdateUserBody | UpdatePhoneNumberBody
) => {
  const token = useUserStore.getState().token;

  const res = await instance.put("/users/" + id, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
};

export const updateUserNoteAPI = async (
  id: User["id"],
  body: {
    userMemo1: string;
    userMemo2: string;
    userMemo3: string;
    userMemo4: string;
    userMemo5: string;
    userMemo6: string;
  }
) => {
  const token = useUserStore.getState().token;

  const res = await instance.put("/users/" + id, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
};

export const updatestatusAPI = async (
  id: User["id"],
  body: { status: User["status"] }
) => {
  const token = useUserStore.getState().token;

  const res = await instance.put("/users/" + id, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
};

export const updateAgentLossing = async (
  id: User["id"],
  body: {
    lossing_point_percentage: AgentType["agent_lossing_point_percentage"];
    settlement_cycle: AgentType["settlement_cycle"];
    settlement_cycle_day: AgentType["settlement_cycle_day"];
  }
) => {
  const token = useUserStore.getState().token;

  const res = await instance.put(`/users/${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
};

export const updateUserAgent = async (
  username: string,
  agentUsername: string
) => {
  const token = useUserStore.getState().token;

  return await instance.put(
    "/users/update-agent",
    { username, agentUsername },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};



export const updateSubs = async (body: {
  type: string;
  status: number;
  username: string | undefined
}) => {
  const { token, userid } = useUserStore.getState();
  return await instance.post(
    "/updatesubs",
    { ...body, userid },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

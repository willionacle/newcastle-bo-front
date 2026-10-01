import useUserStore from "@/store/user.store";
import instance from "../axios";
import { User } from "../users/get";

interface SaveSubscriptionBody {
  username: User["username"];
  channelSubscription: boolean;
  subscriptionDate: string;
}

export const saveSubscriptionAPI = async (body: SaveSubscriptionBody) => {
  const token = useUserStore.getState().token;

  return await instance.post("/custom/save-subscription", body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

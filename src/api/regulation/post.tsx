import useUserStore from "@/store/user.store";
import instance from "../axios";

export const creaetNotice = (body: any) => {
  const token = useUserStore.getState().token;

  instance.post("/notices", body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

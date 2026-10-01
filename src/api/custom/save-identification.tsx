import useUserStore from "@/store/user.store";
import instance from "../axios";

interface SaveIdentificationBody {
  username: string;
  identification: boolean;
  identificationDate: string;
}

export const saveIdentificationAPI = async (body: SaveIdentificationBody) => {
  const token = useUserStore.getState().token;

  return await instance.post("/custom/save-identification", body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

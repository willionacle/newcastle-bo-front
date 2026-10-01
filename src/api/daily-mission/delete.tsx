// import useUserStore from "@/store/user.store";
// import instance from "../axios";
// import { Strapi } from "../types/strapi";
// import { mutate } from "swr";

// export const deleteMission = async (id:number) => {
//   const token = useUserStore.getState().token;

//   const res = await instance.delete(`/deletemissiongroupings/${id}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   // if (res) {
//   //   mutate("/events");
//   // }

//   return res;
// };
import useUserStore from "@/store/user.store";
import instance from "../axios";

export const deleteMission = async (group_id: number) => {
  const { token, userid } = useUserStore.getState();

  const res = await instance.post(
    "/deletemissiongroupings",
    { userid: userid, group_id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res;
};
export const deleteCoupon = async (id: number, type?: string) => {
  const { token, userid } = useUserStore.getState();

  const url = type === 'coupon' ? "/deletemissioncoupon" : "/deletemission"

  const res = await instance.post(
    url,
    { userid: userid, id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res;
};

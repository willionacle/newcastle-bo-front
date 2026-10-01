// import useUserStore from "@/store/user.store";
// import instance from "../axios";
// import { BettingLogs } from "./get";

// interface Body {
//   betId: BettingLogs["betId"];
// }

// export const betinfoAPI = async (body: Body) => {
//   const token = useUserStore.getState().token;

//   const res = await instance.post<Body, any>("/tple/betinfo", body, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   return res.data;
// };

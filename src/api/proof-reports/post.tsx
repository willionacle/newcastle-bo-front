import useUserStore from "@/store/user.store";
import instance from "../axios";
import { AxiosResponse } from "axios";

/**
 * 거래 보고 재전송.
 *
 * code 0 = 벤더가 수락, code 1 = 벤더가 거절하고 message 에 사유가 담긴다.
 * 실패한 재전송은 오류가 아니라 업무 결과이므로 throw 하지 않고 그대로
 * 돌려준다 — 호출부에서 code 로 분기한다. 이미 ok 인 건은 백엔드가 거부한다.
 */
export const retryProofReportAPI = async (id: number) => {
  const { token } = useUserStore.getState();

  const res = await instance.post<
    undefined,
    AxiosResponse<{ code: number; message: string }>
  >(
    `/api/proof-reports/${id}/retry`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

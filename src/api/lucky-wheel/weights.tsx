import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import { ApiResponse, Weight, WeightData, WeightSaveResponse } from "./types";

// 가중치 조회 (등급별)
export const useLuckyWheelWeights = (grade?: number) => {
  const { token } = useUserStore.getState();

  const fetcher = async (url: string) => {
    const res = await instance.get<undefined, AxiosResponse<ApiResponse<WeightData>>>(
      url,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  };

  const endpoint = grade
    ? `/api/wheel/weights/${grade}`
    : `/api/wheel/weights`;

  return useSWR(endpoint, fetcher);
};

// 가중치 저장 (일괄 교체)
export const saveLuckyWheelWeights = async (grade: number, weights: Weight[]) => {
  const { token } = useUserStore.getState();

  const res = await instance.put<any, AxiosResponse<ApiResponse<WeightSaveResponse>>>(
    `/api/wheel/weights/${grade}`,
    {
      weights
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res;
};

// 모든 등급의 가중치 조회
export const useAllGradeWeights = () => {
  const { token } = useUserStore.getState();

  const fetcher = async () => {
    const grades = [1, 2, 3, 4, 5, 6, 7];
    const promises = grades.map(grade =>
      instance.get<undefined, AxiosResponse<ApiResponse<Weight[]>>>(
        `/api/wheel/weights/${grade}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
    );

    const responses = await Promise.all(promises);
    return responses.map(res => res.data.data);
  };

  return useSWR('/api/wheel/weights/all', fetcher);
};
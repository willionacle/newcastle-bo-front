import { stringify } from "qs";
import usePagination from "./usePagination";
import { useState } from "react";

export interface WithdrawalQueryOption {
  filter?: {
    page?: number;
    limit?: number;
    orderBy?: string;
    order?: string;
    startDate?: string | null;
    endDate?: string | null;
  }
}

const useWithdrawalQuery = (option?: WithdrawalQueryOption) => {
  const { paginationQuery, paginationProps } = usePagination(option?.filter);
  const [filters, setFilters] = useState<WithdrawalQueryOption['filter']>(option?.filter);
  
  // 새 API 파라미터 형식으로 쿼리 생성 (레거시 정렬 파라미터 제외)
  const queryParams: any = {
    page: paginationQuery?.page || filters?.page || 1,
    limit: paginationQuery?.limit || filters?.limit || 100,
    orderBy: filters?.orderBy || 'createdAt',
    order: filters?.order || 'DESC',
  };
  
  // 날짜 파라미터는 값이 있을 때만 추가
  if (filters?.startDate) {
    queryParams.startDate = filters.startDate;
  }
  if (filters?.endDate) {
    queryParams.endDate = filters.endDate;
  }
  
  const query = stringify(queryParams);
  
  return { paginationProps, setFilters, query };
};

export default useWithdrawalQuery;
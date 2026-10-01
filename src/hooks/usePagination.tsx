import { PaginationProps } from "antd";
import { useSearchParams } from "react-router-dom";
import { PaginationData } from "@/api/lucky-wheel/types";

interface Props {
  custom?: boolean;
  limit?: number;
  current?: number;
  page?: number
}

const usePagination = (props: Props | undefined) => {
  const [searchParam, setSearchParam] = useSearchParams();
  const limit = searchParam.get("limit") ?? props?.limit ?? 100
  const page = searchParam.get("page") ?? "1";


  const handlePagination = (page: number, _pageSize: number) => {
    searchParam.set("page", page.toString());
    setSearchParam(searchParam)
    
  }
  const handlePageSizeChange = (_current: number, pageSize: number) => {
    searchParam.set("page", "1");
    searchParam.set("limit", pageSize.toString());
    setSearchParam(searchParam)
  }

  const paginationProps = (totalOrData: number | undefined | PaginationData): PaginationProps => {
    // New structure detection (for Lucky Wheel)
    if (typeof totalOrData === 'object' && totalOrData !== null) {
      return {
        current: totalOrData.page || Number(page),
        defaultPageSize: Number(limit),
        total: totalOrData.totalCount,
        pageSizeOptions: [10, 50, 100, 300, 500],
        showSizeChanger: true,
        onChange: handlePagination,
        onShowSizeChange: handlePageSizeChange,
        pageSize: Number(limit)
      };
    }

    // Backward compatibility for existing code
    return {
      current: Number(page),
      defaultPageSize: Number(limit),
      total: totalOrData as number | undefined,
      pageSizeOptions: [10, 50, 100, 300, 500],
      showSizeChanger: true,
      onChange: handlePagination,
      onShowSizeChange: handlePageSizeChange,
      pageSize: Number(limit)
    };
  };

  const paginationQuery = {
    page: page,
    limit: limit
  }

  return {
    paginationProps,
    paginationQuery,
  };
};

export default usePagination;

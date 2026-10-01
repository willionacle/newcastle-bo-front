import { useMemo, useState } from "react";
import { Option } from "./useQuery";
import { PaginationData } from "@/api/lucky-wheel/types";
import { PaginationProps, TableColumnGroupType, TableColumnType } from "antd";
import { stringify } from "qs";

// Same with useQuery but not persisted with URL search params.
const useStateQuery = (option?: Option) => {
  const [filters, setFilters] = useState<Option['filter']>(option?.filter);

   // Pagination
  const limit = useMemo(() => filters?.limit || 100, [filters?.limit]);
  const page = useMemo(() => filters?.page || 1, [filters?.page]);

  const handlePagination = (page: number, _pageSize: number) => {
    setFilters((prev) => ({...prev, page}));
  }

  const handlePageSizeChange = (_current: number, pageSize: number) => {
    setFilters((prev) => ({
      ...prev, 
      page: 1,
      limit: pageSize
    }));
  }

  const paginationProps = (totalOrData: number | undefined | PaginationData): PaginationProps => {
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

  // Sorting
  const currSort = useMemo(() => filters?.columnby ?? (filters?.columnby ? filters?.columnby : "id"), [filters?.columnby]);
  const order = useMemo(() => filters?.orderby ?? (filters?.orderby ? filters?.orderby : "DESC"), [filters?.orderby]);

  const changeSortKey = (key: string) => {
  
    if (key === currSort) {
      setFilters((prev) => ({
        ...prev,
        orderby: `${order === "desc" ? "asc" : "desc"}`
      }))
    } else {
      setFilters((prev) => ({
        ...prev,
        columnby: key,
        orderby: "desc",
      }))
    }

    setFilters((prev) => ({
      ...prev,
      page: 1,
    }))
  };
  
  const onHeaderCell = <T,>(
    column: TableColumnType<T> | TableColumnGroupType<T>
  ) => {
    return {
      onClick: () => {
        console.log('column click', column.key)
        changeSortKey(column.key as string)
      },
    };
  };

  const sort = {
    orderby   : order,
    columnby  : currSort
  }

  const query = useMemo(() => stringify({
    // ...defaultFilter,
    ...filters,
    ...sort,
    ...paginationQuery,
    dateRange: undefined,
  }), [filters, sort, paginationQuery]);

  return {
    paginationProps,
    onHeaderCell,
    setFilters,
    query,
  };
}

export default useStateQuery;
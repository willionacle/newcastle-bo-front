import { stringify } from "qs";
import usePagination from "./usePagination";
import useSort from "./useSort";
import { useState } from "react";

export interface Option {
  filter?: {
    columnby? : string;
    orderby?  : string;
    page?     : number;
    limit?    : number;
    [key: string] : any;
  }
}

const useQuery = (option?: Option) => {
  const { paginationQuery, paginationProps } = usePagination(
    option?.filter
  );

  const { sort, onHeaderCell } = useSort(option?.filter);
  const [filters, setFilters] = useState<Option['filter']>(option?.filter);
  const query = stringify({
    ...filters,
    ...sort,
    ...paginationQuery
  })

  return { paginationProps, onHeaderCell, setFilters, filters, query };
};

export default useQuery;

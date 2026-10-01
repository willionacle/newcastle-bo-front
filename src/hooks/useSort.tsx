import { TableColumnGroupType, TableColumnType } from "antd";
import { useSearchParams } from "react-router-dom";

export type OnHeaderCellType = <T>(
  column: TableColumnType<T> | TableColumnGroupType<T>
) => {
  onClick: () => void;
};

const useSort = ({orderby, columnby}: any) => {
  const [searchParam, setSearchParam] = useSearchParams();
  const sort = searchParam.get("columnby") ?? (columnby ? columnby : "id");
  const order = searchParam.get("orderby") ?? (orderby ? orderby : "desc");



  const changeSortKey = (key: string) => {
    // const [sortKey, orderBy] = sort.split(":");

    if (key === sort) {
      searchParam.set(
        "orderby",
        `${order === "desc" ? "asc" : "desc"}`
      );
    } else {
      searchParam.set("columnby", key);
      searchParam.set("orderby", 'desc');
    }

    searchParam.set("page", "1");
    setSearchParam(searchParam);
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

  return { 
    sort: {
      orderby   : order,
      columnby  : sort
    },
    onHeaderCell 
  };
};

export default useSort;

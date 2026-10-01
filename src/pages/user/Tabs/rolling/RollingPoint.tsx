import { Divider } from "antd";
import List from "./List";
import { findRollingAPI } from "@/api/rolling-points/get";
import Filter from "./Filter";
import { ResUser } from "@/api/types";

interface Props {
  data: ResUser['data'] | undefined;
}

const RollingPoint = ({ data }: Props) => {
  const { swr, onHeaderCell, paginationProps, setFilters } = findRollingAPI(
    data?.username
  );

  return (
    <>
      <Filter setFilter={setFilters} user={data} />
      <Divider />
      <List
        data={swr.data?.data}
        loading={swr.isLoading}
        onHeaderCell={onHeaderCell}
        pagination={paginationProps(swr.data?.totalitems)}
      />
    </>
  );
};

export default RollingPoint;

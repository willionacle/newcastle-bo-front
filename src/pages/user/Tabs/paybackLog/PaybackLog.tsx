import { findPaybackLogAPI } from "@/api/payback-logs/get";
import List from "./List";
import Filter from "./Filter";
import { Divider } from "antd";
import { ResUser } from "@/api/types";

interface Props {
  data: ResUser['data'] | undefined;
}

const PaybackLog = ({ data }: Props) => {
  const { swr, onHeaderCell, paginationProps, setFilters } = findPaybackLogAPI(
    data?.username
  );

  return (
    <>
      <Filter setFilters={setFilters} user={data} />
      <Divider />
      <List
        data={swr.data?.data ?? []}
        loading={swr.isLoading}
        pagination={paginationProps(swr.data?.totalitems)}
        onHeaderCell={onHeaderCell}
      />
    </>
  );
};

export default PaybackLog;

import { findLoginRecords } from "@/api/login-records/get";
import List from "./List";
import { Divider } from "antd";
import Filter from "./Filter";
import { ResUser } from "@/api/types";

interface Props {
  data: ResUser['data'] | undefined;
}

const LoginLog = (props: Props) => {
  const { swr, onHeaderCell, paginationProps, setFilters } = findLoginRecords(
    props.data?.username
  );

  return (
    <>
      <Filter setFilter={setFilters} user={props.data} />
      <Divider />
      <List
        data={swr.data?.data}
        totalItems={swr.data?.totalitems || 0} 
        loading={swr.isLoading}
        onHeaderCell={onHeaderCell}
        pagination={paginationProps(swr.data?.totalitems)}
      />
    </>
  );
};

export default LoginLog;

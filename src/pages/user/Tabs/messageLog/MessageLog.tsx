import { userDetailMessageLog } from "@/api/messages/get";
import { Divider } from "antd";
import Filter from "./Filter";
import List from "./List";
import { ResUser } from "@/api/types";

interface Props {
  data: ResUser['data'] | undefined;
}

const MessageLog = (props: Props) => {
  const { swr, onHeaderCell, paginationProps, setFilters } = userDetailMessageLog(props.data?.username);

  return (
    <>
      <Filter setFilter={setFilters} user={props.data} />
      <Divider />
      <List
        data={swr.data?.data}
        loading={swr.isLoading}
        onHeaderCell={onHeaderCell}
        pagination={paginationProps(swr.data?.totalitems)}
        mutate={swr.mutate}
      />
    </>
  );
};

export default MessageLog;

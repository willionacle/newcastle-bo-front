import { Divider } from "antd";
import List from "./List";
import Filter from "./Filter";
import { getBetBlockstAPI } from "@/api/bet-block/get";

interface Props {
  vendor_id?: string;
}

const GameTableList = (props: Props) => {
  const { swr, onHeaderCell, paginationProps, setFilters } = getBetBlockstAPI(props);

  return (
    <>
      <Filter setFilters={setFilters} />
      <Divider />
      <List
        data={swr.data && swr.data.data ? swr.data.data : []}
        loading={swr.isLoading}
        onHeaderCell={onHeaderCell}
        pagination={paginationProps(swr.data?.totalitems)}
        mutate={swr.mutate}
        vendor_id={props.vendor_id}
      />
    </>
  );
};

export default GameTableList;

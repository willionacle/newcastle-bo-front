import { User } from "@/api/users/get";
import Filter from "./Filter";
import { findItemSaleAPI } from "@/api/item-sale/get";
import { Divider } from "antd";
import List from "./List";

interface Props {
  user: User | undefined;
}

const ItemLog = ({ user }: Props) => {
  const { swr, onHeaderCell, paginationProps, setFilters } = findItemSaleAPI(
    user?.username
  );

  return (
    <>
      <Filter setFilter={setFilters} user={user} />
      <Divider />
      <List
        data={swr.data?.data ?? []}
        loading={swr.isLoading}
        pagination={paginationProps(swr.data?.meta.pagination.total)}
        onHeaderCell={onHeaderCell}
        mutate={swr.mutate}
      />
    </>
  );
};

export default ItemLog;

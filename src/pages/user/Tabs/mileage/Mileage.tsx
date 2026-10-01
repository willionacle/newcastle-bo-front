import { mileageAPI } from "@/api/mileage/get";
import Filter from "./Filter";
import { User } from "@/api/users/get";
import { Divider } from "antd";
import List from "./List";

interface Props {
  user: User | undefined;
}

const Mileage = ({ user }: Props) => {
  const { swr, onHeaderCell, paginationProps, setFilters } = mileageAPI(
    user?.username
  );

  return (
    <>
      <Filter setFilter={setFilters} user={user} />
      <Divider />
      <List
        data={swr.data?.data}
        loading={swr.isLoading}
        onHeaderCell={onHeaderCell}
        pagination={paginationProps(swr.data?.meta.pagination.total)}
      />
    </>
  );
};

export default Mileage;

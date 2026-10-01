import { userUpdateLogAPI } from "@/api/user-update-log/get";
import { ResUser } from "@/api/types";
import { Divider } from "antd";
import Filter from "./Filter";
import List from "../../update-log/List";

interface Props {
  data: ResUser["data"] | undefined;
}

// 회원 상세 > 회원정보변경내역: 전체 변경내역 페이지(/user/update-log)의 목록을 이 회원으로 고정해 재사용한다
const UpdateLog = ({ data }: Props) => {
  const { swr, onHeaderCell, paginationProps, setFilters } = userUpdateLogAPI(
    data?.username
  );

  return (
    <>
      <Filter setFilters={setFilters} user={data} />
      <Divider />
      <List
        data={swr.data?.data?.items ?? []}
        loading={swr.isLoading}
        onHeaderCell={onHeaderCell}
        pagination={paginationProps(
          swr.data?.data?.pagination?.totalItems ?? 0
        )}
        hideUserColumns
      />
    </>
  );
};

export default UpdateLog;

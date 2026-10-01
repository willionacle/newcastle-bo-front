import i18next from "@/i18n/i18n";
import { Card, Divider } from "antd";
import Breadcrumb from "@/components/Breadcrumb";
import List from "./List";
import Filter from "./Filter";
import { gradeChangeLogsAPI } from "@/api/grade-change-logs/get";

const GradeChangeLog = () => {
  const { swr, onHeaderCell, paginationProps, setFilters } = gradeChangeLogsAPI();

  return (
    <Card>
      <Breadcrumb replace={i18next.t("sidemenu.gradeChangeLog")}/>
      <Divider />
      <Filter setFilter={setFilters} />
      <Divider />
      <List
        data={swr.data?.data ?? []}
        loading={swr.isLoading}
        onHeaderCell={onHeaderCell}
        pagination={paginationProps(swr.data?.totalCount ?? 0)}
        mutate={swr.mutate}
      />
    </Card>
  );
};

export default GradeChangeLog;
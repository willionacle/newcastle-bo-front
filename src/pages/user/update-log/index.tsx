import { Card, Divider, Flex } from "antd";
import Breadcrumb from "@/components/Breadcrumb";
import List from "./List";
import Filter from "./Filter";
import { userUpdateLogAPI } from "@/api/user-update-log/get";
import { useTranslation } from "react-i18next";

const UpdateLog = () => {
  const { t } = useTranslation();
  const { swr, onHeaderCell, paginationProps, setFilters } = userUpdateLogAPI();

  return (
    <Card>
      <Flex align="center" justify="space-between">
        <Breadcrumb replace={t("col.memberInfoChangeLog")} />
      </Flex>
      <Divider />
      <Filter setFilters={setFilters} />
      <Divider />
      <List
        data={swr.data?.data?.items ?? []}
        loading={swr.isLoading}
        onHeaderCell={onHeaderCell}
        pagination={paginationProps(swr.data?.data?.pagination?.totalItems ?? 0)}
      />
    </Card>
  );
};

export default UpdateLog;

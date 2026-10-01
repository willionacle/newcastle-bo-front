import Breadcrumb from "@/components/Breadcrumb";
import { Alert, Card, Divider, Flex } from "antd";
import List from "./List";
import { balanceLogsAPI } from "@/api/balance-logs/get";
import Filter from "./Filter";
import { useTranslation } from "react-i18next";
import DownloadExcelBtn from "./DownloadExcelBtn";

const BalanceLogs = () => {
  const { swr, paginationProps, onHeaderCell, setFilters } =
    balanceLogsAPI();
  const { t } = useTranslation();

  // 서버가 알지 못하는 레코드타입은 문자 그대로 매칭되어 아무것도 반환하지 않는다.
  // 그리드가 비어 보이는 이유를 운영자가 알 수 있도록 노출한다.
  const unmappedRecordTypes = swr.data?.unmappedRecordTypes;

  return (
    <Card>
      <Flex align="center" justify="space-between">
        <Breadcrumb replace={t("col.allMembersMoneyLog")} />

        <DownloadExcelBtn />
      </Flex>
      <Divider />
      <Filter setFilters={setFilters} />
      {unmappedRecordTypes?.length ? (
        <Alert
          style={{ marginTop: 8 }}
          type="warning"
          showIcon
          message={t("user.unmappedRecordTypes", {
            types: unmappedRecordTypes.join(", "),
          })}
          description={t("user.unmappedRecordTypesDesc")}
        />
      ) : null}
      <Divider />
      <List
        data={swr.data ? swr.data.data : []}
        loading={swr.isLoading}
        pagination={paginationProps(swr.data?.totalitems)}
        onHeaderCell={onHeaderCell}
      />
    </Card>
  );
};

export default BalanceLogs;

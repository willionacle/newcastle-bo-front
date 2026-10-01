import i18next from "@/i18n/i18n";
import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider, Flex } from "antd";
import List from "./List";
import { withdrawalLogs } from "@/api/withdrawal-logs/get";
import Filter from "./Filter";
import { useTranslation } from "react-i18next";
import useUserStore from "@/store/user.store";
import { parse, stringify } from "qs";
import { api } from "@/api/axios";
import DownloadXlsx2 from "@/components/DownloadXlsx2";
import { GF } from "@/utils/GlobalFunctions";

const Withdraw = () => {
  const { token } = useUserStore.getState();
  const { swr, onHeaderCell, paginationProps, setFilters, query } = withdrawalLogs();
  const { t } = useTranslation();

  const getListForExcel = async () => {
    const reqParams = query ? {...parse(query), limit: 999999} : {}
    try {
      const res = await api.getWtihdrawList(stringify(reqParams), token)
      const {data: { code }} = res
      if (code == 0) {
        return GF.withdrawCSVData(res.data.data)
      } else {
        return []
      }
    } catch (error) {
      console.error(error)
      return []
    }
  }

  return (
    <>
      <Card>
        <Flex align="center" justify="space-between">
          <Breadcrumb replace={t("sidemenu.sm012")} />
          <DownloadXlsx2 fileName={i18next.t("sidemenu.sm011")} getMethod={getListForExcel} />
        </Flex>
        <Divider />
        <Filter setFilters={setFilters} />
        <Divider />
        <List
          data={swr.data ? swr.data.data : []}
          totals={swr.data && swr.data.totals ? swr.data.totals : {total_withdrawal_applied: 0, total_withdrawal_waiting: 0}}
          loading={swr.isLoading}
          onHeaderCell={onHeaderCell}
          mutate={swr.mutate}
          pagination={paginationProps(swr.data?.totalitems)}
        />
      </Card>
    </>
  );
};

export default Withdraw;

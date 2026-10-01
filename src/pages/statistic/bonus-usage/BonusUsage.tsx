import i18next from "@/i18n/i18n";
import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider, Flex } from "antd";
import Filter from "./Filter";
import List from "./List";
import DownloadXlsx from "@/components/DownloadXlsx";
import { BonusUsageData, bonusUsageStatistics } from "@/api/cs-statics/bonus-usage";
import { parse } from "qs";
import { useMemo } from "react";

interface ExcelReportType {
  "입금보너스명": string;
  "보너스금액": number;
  "입금금액": number;
  "신청횟수": number;
  "신청유저수": number;
}

const BonusUsage = () => {
  const { swr, onHeaderCell, setFilters, paginationProps, query } = bonusUsageStatistics();
  const newFilter = useMemo(() => {
    return parse(query) as unknown as {bonus_name: string}
  },[query]);
  console.log("query", newFilter.bonus_name)

  const sortResData = (data: BonusUsageData[] | undefined) => {
    const arr = [] as ExcelReportType[]
    console.log(data)
    if (data !== undefined && data !== null && data.length > 0) {
      data.map((item: BonusUsageData) => {
        arr.push({
          "입금보너스명": item.bonus_name,
          "보너스금액": item.bonus_amount,
          "입금금액": item.deposit_amount,
          "신청횟수": item.bonus_count_application,
          "신청유저수": item.bonus_count_used,
        })
      })
    }
    return arr
  }

  return (
    <Card>
      <Flex justify="space-between">
        <Breadcrumb />
        <DownloadXlsx data={swr.data && swr.data.data ? sortResData(swr.data?.data) : []} fileName={i18next.t("sidemenu.sm055")} />
      </Flex>
      <Divider />
      <Filter setFilter={setFilters} data={swr.data?.data ?? []} loading={swr.isLoading}  />
      <Divider />
      <List 
        data={(swr.data?.data ?? [])
          .filter(item => 
            newFilter.bonus_name ? 
            item.bonus_name.includes(newFilter.bonus_name) : 
            // item.bonus_name
            //   .replace(/[\t\n\r]+/g, "")
            //   .replace(/\s+/g, " ")
            //   .trim() === newFilter.bonus_name : 
            true
          )
        } 
        loading={swr.isLoading} 
        onHeaderCell={onHeaderCell} 
        pagination={paginationProps(swr.data?.totalitems)} 
      />
    </Card>
  );
};

export default BonusUsage;

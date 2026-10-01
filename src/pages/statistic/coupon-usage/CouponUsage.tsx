import i18next from "@/i18n/i18n";
import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider, Flex } from "antd";
import Filter from "./Filter";
import List from "./List";
import DownloadXlsx from "@/components/DownloadXlsx";
import { CombinedUsageData, couponUsageStatistics } from "@/api/cs-statics/coupon-usage";

interface ExcelReportType {
  "구분": string;
  "쿠폰명/등급": string;
  "쿠폰내용": string;
  "사용금액": number;
  "사용횟수": number;
  "사용유저수": number;
}

const CouponUsage = () => {
  const { swr, onHeaderCell, setFilters, paginationProps } = couponUsageStatistics();

  const sortResData = (data: CombinedUsageData[] | undefined) => {
    const arr = [] as ExcelReportType[]
    console.log(data)
    if (data !== undefined && data !== null && data.length > 0) {
      data.map((item: CombinedUsageData) => {
        arr.push({
          "구분": item.type === 'wheel' ? i18next.t("storeSetting.ss007") : i18next.t("topNavi.tn030"),
          "쿠폰명/등급": item.type === 'wheel' ? `Grade ${item.grade}` : item.name,
          "쿠폰내용": item.type === 'wheel' ? '-' : item.couponContent,
          "사용금액": item.amount,
          "사용횟수": item.type === 'wheel' ? item.usage_count : item.usageCount,
          "사용유저수": item.type === 'wheel' ? item.user_count : item.userCount,
        })
      })
    }
    return arr
  }

  return (
    <Card>
      <Flex justify="space-between">
        <Breadcrumb />
        <DownloadXlsx data={swr.data && swr.data.data ? sortResData(swr.data?.data) : []} fileName={i18next.t("sidemenu.sm054")} />
      </Flex>
      <Divider />
      <Filter setFilter={setFilters} />
      <Divider />
      <List 
        data={swr.data?.data ?? []} 
        totals={swr?.data?.totals?.[0]}
        loading={swr.isLoading} 
        onHeaderCell={onHeaderCell} 
        pagination={paginationProps(swr.data?.totalitems)} 
      />
    </Card>
  );
};

export default CouponUsage;

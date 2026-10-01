import i18next from "@/i18n/i18n";
import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider, Flex } from "antd";
import Filter from "./Filter";
import List from "./List";
import DownloadXlsx from "@/components/DownloadXlsx";
import {
  CombinedUsageData,
  combinedUsageStatistics,
} from "@/api/cs-statics/combined-usage";
import { GF } from "@/utils/GlobalFunctions";

interface ExcelReportType {
  구분: string;
  "쿠폰명/등급": string;
  쿠폰내용: string;
  "사용금액/보너스금액": number;
  입금금액: number | string;
  "사용횟수/신청횟수": number;
  "사용유저수/신청유저수": number;
}

const CombinedUsage = () => {
  const { swr, onHeaderCell, setFilters, paginationProps } =
    combinedUsageStatistics();

  const sortResData = (data: CombinedUsageData[] | undefined) => {
    const arr = [] as ExcelReportType[];

    if (data !== undefined && data !== null && data.length > 0) {
      data.forEach((item: CombinedUsageData) => {
        if (item.type === "coupon") {
          arr.push({
            구분: i18next.t("topNavi.tn030"),
            "쿠폰명/등급": item.name,
            쿠폰내용: item.couponContent,
            "사용금액/보너스금액": item.amount,
            입금금액: "-",
            "사용횟수/신청횟수": item.usageCount,
            "사용유저수/신청유저수": item.userCount,
          });
        } else if (item.type === "wheel") {
          arr.push({
            구분: i18next.t("storeSetting.ss007"),
            "쿠폰명/등급": `${GF.handleGradeStrVal(item.grade)}`,
            쿠폰내용: "-",
            "사용금액/보너스금액": item.amount,
            입금금액: "-",
            "사용횟수/신청횟수": item.usage_count,
            "사용유저수/신청유저수": item.user_count,
          });
        } else if (item.type === "bonus") {
          arr.push({
            구분: i18next.t("sidemenu.bonus"),
            "쿠폰명/등급": item.bonusName,
            쿠폰내용: "-",
            "사용금액/보너스금액": item.bonusAmount,
            입금금액: item.depositAmount,
            "사용횟수/신청횟수": item.bonusCountApplication,
            "사용유저수/신청유저수": item.bonusCountUsed,
          });
        } else if (item.type === "lossing-point-total") {
          arr.push({
            구분: i18next.t("sidemenu.payback"),
            "쿠폰명/등급": i18next.t("stat.paybackPayout"),
            쿠폰내용: "-",
            "사용금액/보너스금액": item.amount,
            입금금액: "-",
            "사용횟수/신청횟수": item.usageCount,
            "사용유저수/신청유저수": item.userCount,
          });
        } else if (item.type === "referral-point-total") {
          arr.push({
            구분: i18next.t("col.referralPoint"),
            "쿠폰명/등급": i18next.t("stat.referralPointPayout"),
            쿠폰내용: "-",
            "사용금액/보너스금액": item.amount,
            입금금액: "-",
            "사용횟수/신청횟수": item.usageCount,
            "사용유저수/신청유저수": item.userCount,
          });
        }
      });
    }
    return arr;
  };

  return (
    <Card>
      <Flex justify="space-between">
        <Breadcrumb replace={i18next.t("sidemenu.combinedUsageStats")} />
        <DownloadXlsx
          data={swr.data && swr.data.data ? sortResData(swr.data?.data) : []}
          fileName="bonus"
        />
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

export default CombinedUsage;

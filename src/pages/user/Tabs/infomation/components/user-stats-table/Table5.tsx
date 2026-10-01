import i18next from "@/i18n/i18n";
import "../../UserDwStyle.css";
import { Flex, Spin } from "antd";
import { useEffect, useState } from "react";
import CommaNumber from "@/components/CommaNumber";
import { StatType3, StatTypeRes3 } from "../../UserDw";
import Percentage from "@/components/Percentage";

interface Props {
  data: any;
}

const Table5 = ({ data }: Props) => {
  const [statistics, setStatistics] = useState<StatType3[]>([]);

  const handleRowTHeadText = (key: string) => {
    const thPair: any = {
      all: i18next.t("userStats.total"),
      all90: i18next.t("userStats.last90Days"),
      all30: i18next.t("userStats.last30Days"),
      all7: i18next.t("userStats.last7Days"),
      allToday: i18next.t("userStats.today"),
    };

    return thPair[key];
  };

  const manipulateData = () => {
    const arr: StatType3[] = [];
    const dwData = data;
    for (const [index, item] of Object.entries(dwData)) {
      const statItem = item as StatTypeRes3;

      arr.push({
        thTitle: handleRowTHeadText(index),
        totalRollingPoints: statItem.totalRollingPoints ?? 0,
        totalCoupons: statItem.totalCoupons ?? 0,
        totalDepositBonus: statItem.totalDepositBonus ?? 0,
        totalLuckyWheelCoupons: statItem.totalLuckyWheelCoupons ?? 0,
        totalPaybackPoints: statItem.totalPaybackPoints ?? 0,
        totalReferralPoints: statItem.totalReferralPoints ?? 0,
        totalBonus: statItem.totalBonus ?? 0,
        totalRate: statItem.totalRate ?? 0,
      });
    }
    setStatistics(arr);
  };

  useEffect(() => {
    if (data) {
      manipulateData();
    }
  }, [data]);

  return data ? (
    <table className="userinfo-table variant-lime">
      <thead>
        <tr>
          <th colSpan={100} className="top-th">{i18next.t("userStats.bonusData")}</th>
        </tr>
        <tr>
          <th>{i18next.t("col.category")}</th>
          <th>{i18next.t("col.rollingPoint")}</th>
          <th>{i18next.t("topNavi.tn030")}</th>
          <th>{i18next.t("col.depositBonus")}</th>
          <th>{i18next.t("userStats.luckyWheelTicket")}</th>
          <th>{i18next.t("col.paybackPoint")}</th>
          <th>{i18next.t("userStats.referralPoint")}</th>
          <th>{i18next.t("userStats.bonusTotal")}</th>
          <th>{i18next.t("userStats.bonusRate")}</th>
        </tr>
      </thead>
      <tbody>
        {statistics.map((item, key) => (
          <tr key={key}>
            <th>{item.thTitle}</th>
            <td>{<CommaNumber value={item.totalRollingPoints} onlyNumber />}</td>
            <td>{<CommaNumber value={item.totalCoupons} onlyNumber />}</td>
            <td>{<CommaNumber value={item.totalDepositBonus} onlyNumber />}</td>
            <td>{<CommaNumber value={item.totalLuckyWheelCoupons} onlyNumber />}</td>
            <td>{<CommaNumber value={item.totalPaybackPoints} onlyNumber />}</td>
            <td>{<CommaNumber value={item.totalReferralPoints} onlyNumber />}</td>
            <td>{<CommaNumber value={item.totalBonus} />}</td>
            <td>{<Percentage value={item.totalRate * 100} />}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <Flex justify="center">
      <Spin/>
    </Flex>
  );
};

export default Table5;

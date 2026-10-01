import i18next from "@/i18n/i18n";
import "../../UserDwStyle.css";
import { Flex, Spin } from "antd";
import { useEffect, useState } from "react";
import CommaNumber from "@/components/CommaNumber";
import { StatType, StatTypeRes } from "../../UserDw";
import Percentage from "@/components/Percentage";

interface Props {
  data: any;
}

const Table1 = ({ data }: Props) => {
  const [statistics, setStatistics] = useState<StatType[]>([]);

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
    const arr: StatType[] = [];
    const dwData = data;
    for (const [index, item] of Object.entries(dwData)) {
      const statItem = item as StatTypeRes;

      arr.push({
        thTitle: handleRowTHeadText(index),
        deposit: statItem.totalDeposit ?? 0,
        depositCount: statItem.depositCount ?? 0,
        averageCharge: statItem.depositAverage ?? 0,
        withdrawal: statItem.totalWithdraw ?? 0,
        depWith: statItem.depWithAmount ?? 0,
        winLoss: statItem.winLoss ?? 0,
        entryExit: statItem.entryExit ?? 0,
        rollingRate: statItem.rollingRate ?? 0,
        bet: statItem.betAmount ?? 0,
        totalBonus: statItem.totalBonus ?? 0,
        totalRolling: statItem.totalRolling ?? 0,
        bonusPercentage: statItem.bonusPercentage ?? 0,
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
    <table className="userinfo-table variant-orange">
      <thead>
        <tr>
          <th colSpan={100} className="top-th">{i18next.t("userStats.inOutData")}</th>
        </tr>
        <tr>
          <th className="">{i18next.t("col.category")}</th>
          <th>{i18next.t("col.deposit")}</th>
          <th>{i18next.t("col.depositCount")}</th>
          <th>{i18next.t("userStats.avgDeposit")}</th>
          <th>{i18next.t("topNavi.tn016")}</th>
          <th>{i18next.t("col.netDeposit")}</th>
          <th>{i18next.t("userStats.totalBetPnl")}</th>
          <th>{i18next.t("userStats.inOutPayback")}</th>
          <th>{i18next.t("userStats.rollingRate")}</th>
        </tr>
      </thead>
      <tbody>
        {statistics.map((item, key) => (
          <tr key={key}>
            <th>{item.thTitle}</th>
            <td>{<CommaNumber value={item.deposit} onlyNumber />}</td>
            <td>{<CommaNumber value={item.depositCount} onlyNumber />}</td>
            <td>{<CommaNumber value={item.averageCharge} onlyNumber />}</td>
            <td>{<CommaNumber value={item.withdrawal} onlyNumber />}</td>
            <td>{<CommaNumber value={item.depWith} onlyNumber />}</td>
            <td>{<CommaNumber value={item.winLoss} onlyNumber />}</td>
            <td>{<Percentage value={item.entryExit * 100} />}</td>
            <td>{<Percentage value={item.rollingRate * 100} onlyNumber/>}</td>
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

export default Table1;

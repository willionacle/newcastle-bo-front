import i18next from "@/i18n/i18n";
import "../../UserDwStyle.css";
import { Flex, Spin } from "antd";
import { useEffect, useState } from "react";
// import CommaNumber from "@/components/CommaNumber";
import { StatType2, StatTypeRes2 } from "../../UserDw";
import Percentage from "@/components/Percentage";

interface Props {
  data: any;
}

const Table4 = ({ data }: Props) => {
  const [statistics, setStatistics] = useState<StatType2[]>([]);

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
    const arr: StatType2[] = [];
    const dwData = data;
    for (const [index, item] of Object.entries(dwData)) {
      const statItem = item as StatTypeRes2;

      arr.push({
        thTitle: handleRowTHeadText(index),
        btiLive: statItem.btiLive ?? 0,
        btiPrematch: statItem.btiPrematch ?? 0,
        ksports: statItem.ksports ?? 0,
        live: statItem.live ?? 0,
        minigame: statItem.minigame ?? 0,
        slot: statItem.slot ?? 0,
        vr: statItem.vr ?? 0,
        total: statItem.total ?? 0,
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
    <table className="userinfo-table variant-purple">
      <thead>
        <tr>
          <th colSpan={100} className="top-th">{i18next.t("userStats.betPaybackData")}</th>
        </tr>
        <tr>
          <th>{i18next.t("col.category")}</th>
          <th>{i18next.t("memberDetail.mis131")}</th>
          <th>{i18next.t("memberDetail.mis132")}</th>
          <th>{i18next.t("sportCat.overseasLive")}</th>
          <th>{i18next.t("sportCat.overseasPrematch")}</th>
          <th>{i18next.t("sportCat.domesticSports")}</th>
          <th>{i18next.t("sportCat.virtualSports")}</th>
          <th>{i18next.t("sportCat.mini")}</th>
          <th>{i18next.t("userStats.totalBetPayback")}</th>
        </tr>
      </thead>
      <tbody>
        {statistics.map((item, key) => (
          <tr key={key}>
            <th>{item.thTitle}</th>
            <td>{<Percentage value={item.live * 100} />}</td>
            <td>{<Percentage value={item.slot * 100} />}</td>
            <td>{<Percentage value={item.btiLive * 100} />}</td>
            <td>{<Percentage value={item.btiPrematch * 100} />}</td>
            <td>{<Percentage value={item.ksports * 100} />}</td>
            <td>{<Percentage value={item.vr * 100} />}</td>
            <td>{<Percentage value={item.minigame * 100}/>}</td>
            <td>{<Percentage value={item.total * 100} />}</td>
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

export default Table4;

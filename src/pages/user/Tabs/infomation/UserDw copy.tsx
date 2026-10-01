import { dwStatusAPI } from "@/api/custom/dwStatus";
import "./UserDwStyle.css";
import { Spin } from "antd";
import { ResUser } from "@/api/types";
import { useEffect, useState } from "react";
import CommaNumber from "@/components/CommaNumber";
import Percentage from "@/components/Percentage";
// import CommaNumber2 from "@/components/CommaNumber2";

interface Props {
  user: ResUser["data"] | undefined;
}

interface StatTypeRes {
  totalDeposit: number;
  depositCount: number;
  depositAverage: number;
  totalWithdraw: number;
  depWithAmount: number;
  entryExit: number;
  betAmount: number;
  rollingRate: number;
  winLoss: number;
  totalBonus: number;
  totalRolling: number;
  bonusPercentage: number;
}

interface StatType {
  thTitle: string;
  deposit: number;
  depositCount: number;
  averageCharge: number;
  withdrawal: number;
  depWith: number;
  entryExit: number;
  bet: number;
  rollingRate: number;
  winLoss: number;
  totalBonus: number;
  totalRolling: number;
  bonusPercentage: number;
}

const UserDw = ({ user }: Props) => {
  const dwData = dwStatusAPI(user?.username).data;
  const [statistics, setStatistics] = useState<StatType[]>([]);

  const handleRowTHeadText = (key: string) => {
    const thPair: any = {
      all: "총",
      all30: "최근30일",
      all7: "이번주",
      allToday: "당일",
    };

    return thPair[key];
  };

  const manipulateData = () => {
    const arr: StatType[] = [];
    const data = dwData?.data;
    for (const [index, item] of Object.entries(data)) {
      const statItem = item as StatTypeRes;

      arr.push({
        thTitle: handleRowTHeadText(index),
        deposit: statItem.totalDeposit ?? 0,
        depositCount: statItem.depositCount ?? 0,
        averageCharge: statItem.depositAverage ?? 0,
        withdrawal: statItem.totalWithdraw ?? 0,
        depWith: statItem.depWithAmount ?? 0,
        entryExit: (statItem.entryExit ?? 0) * 100,
        bet: statItem.betAmount ?? 0,
        rollingRate: statItem.rollingRate ?? 0,
        winLoss: statItem.winLoss ?? 0,
        totalBonus: statItem.totalBonus ?? 0,
        totalRolling: statItem.totalRolling ?? 0,
        bonusPercentage: statItem.bonusPercentage ?? 0,
      });
    }
    setStatistics(arr);
  };

  useEffect(() => {
    if (dwData && dwData?.data) {
      manipulateData();
    }
  }, [dwData]);

  return dwData ? (
    <table className="userinfo-table">
      <thead>
        <tr>
          <th>구분</th>
          <th>입금</th>
          <th>입금건수</th>
          <th>평균충전</th>
          <th>출금</th>
          <th>입출차액</th>
          <th>베팅</th>
          <th>입출환수</th>
          <th>롤링률</th>
          <th>베팅손익</th>
          <th>보너스총</th>
          <th>롤링P</th>
          <th>보너스%</th>
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
            <td>{<CommaNumber value={item.bet} onlyNumber />}</td>
            <td>{<Percentage value={item.entryExit} />}</td>
            <td>{<CommaNumber value={item.rollingRate * 100} isPercentage/>}</td>
            <td>{<CommaNumber value={item.winLoss} onlyNumber />}</td>
            <td>{<CommaNumber value={item.totalBonus} onlyNumber />}</td>
            <td>{<CommaNumber value={item.totalRolling} onlyNumber />}</td>
            <td>{<Percentage value={item.bonusPercentage} />}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <Spin />
  );
};

export default UserDw;

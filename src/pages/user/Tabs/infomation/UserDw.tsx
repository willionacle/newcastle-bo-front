import { dwStatusNewAPI } from "@/api/custom/dwStatus";
import "./UserDwStyle.css";
import { ResUser } from "@/api/types";
import Table1 from "./components/user-stats-table/Table1";
import Table2 from "./components/user-stats-table/Table2";
import { Space } from "antd";
import Table3 from "./components/user-stats-table/Table3";
import Table4 from "./components/user-stats-table/Table4";
import Table5 from "./components/user-stats-table/Table5";

interface Props {
  user: ResUser["data"] | undefined;
}

export interface StatTypeRes {
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
  totalRolling?: number;
  bonusPercentage: number;
}
export interface StatTypeRes2 {
  btiLive: number,
  btiPrematch: number,
  ksports: number,
  live: number,
  minigame: number,
  slot: number,
  vr: number,
  total: number,
}
export interface StatTypeRes3 {
  username?: string;
  totalRollingPoints: number;
  totalCoupons: number;
  totalDepositBonus: number;
  totalLuckyWheelCoupons: number;
  totalPaybackPoints: number;
  totalReferralPoints: number;
  totalBonus: number;
  totalRate: number;
}

export interface StatType {
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
  totalRolling?: number;
  bonusPercentage: number;
}
export interface StatType2 extends StatTypeRes2{
  thTitle: string;
}
export interface StatType3 extends StatTypeRes3{
  thTitle: string;
}

const UserDw = ({ user }: Props) => {
  const dwData = dwStatusNewAPI(user?.username).data;

  return (
    <Space direction="vertical" content="center" size={10} style={{ width: "75%",margin:"auto",display:"flex" }}>
      <Table1 data={dwData?.data.table_1} />
      <Table5 data={dwData?.data.table_5} />
      <Table2 data={dwData?.data.table_2} />
      <Table3 data={dwData?.data.table_3} />
      <Table4 data={dwData?.data.table_4} />
    </Space>
  );
};

export default UserDw;

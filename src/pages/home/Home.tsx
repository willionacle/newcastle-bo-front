import { Card, Col, Row } from "antd";
import DashboardTable from "./components/table/DashboardTable";
import DepositBettingBarChart from "./components/chart/DepositBettingBarChart";
// import PaybackLineChart from "./components/chart/PaybackLineChart";
import BonusLineChart from "./components/chart/BonusLineChart";
import RollingLineChart from "./components/chart/RollingLineChart";
import BonusMemberLineChart from "./components/chart/BonusMemberLineChart";
import CouponMemberLineChart from "./components/chart/CouponMemberLineChart";
// import PaybackGradeLineChart from "./components/chart/PaybackGradeLineChart";
import BettingAmountBarChart from "./components/chart/BettingAmountLineChart";
import BettingGradeLineChart from "./components/chart/BettingGradeLineChart";
import BettingAmounTable from "./components/table/betting-amount-count/BettingAmountCount";
import UserBettorGradeBarChart from "./components/chart/UserBettorGradeBarChart";
import UserGradeLineChart from "./components/chart/UserGradeLineChart";
import DailyUserUniqueLineChart from "./components/chart/DailyUserUniqueLineChart";

const Home = () => {

  return (
    <Row gutter={[8, 8]} style={{textAlign: 'center'}}>
      <Col span={24}>
        <Card style={{height: '100%'}}>
          <DashboardTable />
        </Card>
      </Col>
      <Col span={24}>
        <Card style={{height: '100%'}}>
          <BettingAmounTable />
        </Card>
      </Col>
      {/* Charts */}
      <Col xs={24} md={12}>
        <Card style={{height: '100%'}}>
          {/* <DailyUserLineChart /> */}
          <DailyUserUniqueLineChart />
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card style={{height: '100%'}}>
          <UserBettorGradeBarChart /> { /* Comparison of Total vs. Betting Users by Grade (Today) */}
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card style={{height: '100%'}}>
          <UserGradeLineChart /> {/* Number of users by rank (based on the last 30 days) */}
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card style={{height: '100%'}}>
          <BettingGradeLineChart />
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card style={{height: '100%'}}>
          <DepositBettingBarChart />
        </Card>
      </Col>
      {/* <Col span={12}>
        <Card style={{height: '100%'}}>
          <PaybackLineChart />
        </Card>
      </Col> */}
      <Col xs={24} md={12}>
        <Card style={{height: '100%'}}>
          <BettingAmountBarChart />
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card style={{height: '100%'}}>
          <BonusLineChart />
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card style={{height: '100%'}}>
          <RollingLineChart />
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card style={{height: '100%'}}>
          <BonusMemberLineChart />
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card style={{height: '100%'}}>
          <CouponMemberLineChart />
        </Card>
      </Col>
    </Row>
  );
};

export default Home;

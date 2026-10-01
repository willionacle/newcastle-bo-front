import Breadcrumb from "@/components/Breadcrumb";
import { Button, Card, Divider, Flex, Modal, Tabs, TabsProps, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import UserInfo from "./Tabs/infomation/UserInfo";
import UserNote from "./Tabs/infomation/UserNote";
import RollingPoint from "./Tabs/rolling/RollingPoint";
import LoginLog from "./Tabs/loginLog/LoginLog";
import BettingLog from "./Tabs/bettingLog/BettingLog";
import UserDw from "./Tabs/infomation/UserDw";
import CouponTap from "./Tabs/coupon/CouponTap";
import DepositLog from "./Tabs/depositLog/DepositLog";
import MoneyLog from "./Tabs/moneyLog/MoneyLog";
import ReferralLog from "./Tabs/referralLog/ReferralLog";
import PaybackLog from "./Tabs/paybackLog/PaybackLog";
import ReferralList from "./Tabs/referralList/ReferralList";
import { useState } from "react";
// import UserGameBalance from "./Tabs/gameBalance/UserInfo";
import { stringify } from "qs";
import dayjs from "dayjs";
import EditIcon from "@/assets/img/icons/edit-user.svg?react";
import RefreshIcon from "@/assets/img/icons/refresh.svg?react";
import ListIcon from "@/assets/img/icons/todo.svg?react";
import Panel from "@/components/Panel";
import { User } from "@/api/types";
import Message from "../payment/deposit/Message";
import { InboxOutlined } from "@ant-design/icons";
import StatsSubTabs from "./Tabs/userStats/sub-tab/SubTab";
import { findUsersAPI } from "@/api/users/get";
import AppliedRulesPanel from "@/components/transaction-rules/AppliedRulesPanel";
import UserSearchSelect from "@/components/UserSearchSelect";
import MessageLog from "./Tabs/messageLog/MessageLog";
import UpdateLog from "./Tabs/updateLog/UpdateLog";
import { SensitiveViewProvider } from "@/components/SensitiveViewProvider";
// import LuckyWheelCoupon from "../promotion/lucky-wheel/tabs/CouponsTab";

const UserDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { data, isLoading, mutate } = findUsersAPI(id);
  const [searchParams, _] = useSearchParams();
  const navigate = useNavigate();
  const {pathname} = useLocation();
  const [username, setUsername] = useState<string | undefined>(undefined);

  const items: TabsProps["items"] = [
    {
      key: "userInfo",
      label: t("memberDetail.mis001"),
      children: (
        <>
        <Typography.Paragraph strong>
          {t("memberDetail.mis001")}
        </Typography.Paragraph>
        <UserInfo data={data} loading={isLoading} mutate={mutate} />
        <Divider />
        
        <Panel title={t("memberDetail.mis095")}>
          <UserNote
            data={data}
            id={data?.id}
            mutate={mutate}
          />
        </Panel>
      </>
      ),
    },
    {
      key: "dailystats",
      label: t("col.periodStats"),
      // children: <DailyStatistic data={data as User} asUserTabContent />,
      children: <StatsSubTabs data={data as User} />,
    },
    {
      key: "dwstat",
      label: t("col.dataStats"),
      children: <UserDw user={data} />,
    },
    // {
    //   key: "info",
    //   label: "게임사별베팅통계",
    //   children: <TopInfo username={data?.username} />,
    // },
    // {
    //   key: "user-game-balance",
    //   label: t("게임사별보유머니"),
    //   children: (
    //     <>
    //       <Typography.Paragraph strong>{t("게임사별보유머니")}</Typography.Paragraph>
    //       <UserGameBalance data={data} loading={isLoading} />
    //     </>
    //   ),
    // },
    {
      key: "moneyLog",
      label: t("memberDetail.mis027"),
      children: (
        <>
          <Typography.Paragraph strong>
            {t("memberDetail.mis027")}
          </Typography.Paragraph>
          <MoneyLog user={data} />
        </>
      ),
    },
    {
      key: "deposit-log",
      label: t("col.depositWithdrawalLog"),
      children: (
        <>
          <Typography.Paragraph strong>{t("col.depositWithdrawalLog")}</Typography.Paragraph>
          <DepositLog user={data} />
        </>
      ),
    },
    {
      key: `bettingLog`,
      label: t("memberDetail.mis049"),
      children: (
        <>
          <Typography.Paragraph strong>
            {t("memberDetail.mis049")}
          </Typography.Paragraph>
          <BettingLog user={data} />
        </>
      ),
    },
    {
      key: "rollingPoint",
      label: t("col.rollingPointLog"),
      children: (
        <>
          <Typography.Paragraph strong>
            {t("col.rollingPointLog")}
          </Typography.Paragraph>
          <RollingPoint data={data} />
        </>
      ),
    },
    {
      key: "paybackLog",
      label: t("col.paybackPoint"),
      children: (
        <>
          <Typography.Paragraph strong>
            {t("col.paybackPoint")}
          </Typography.Paragraph>
          <PaybackLog data={data} />
        </>
      ),
    },
    {
      key: "appliedRules",
      label: t("memberDetail.appliedRules"),
      children: (
        <>
          <Typography.Paragraph strong>{t("memberDetail.appliedRules")}</Typography.Paragraph>
          <AppliedRulesPanel username={data?.username} />
        </>
      ),
    },
    {
      key: "loginLog",
      label: t("memberDetail.mis043"),
      children: (
        <>
          <Typography.Paragraph strong>
            {t("memberDetail.mis043")}
          </Typography.Paragraph>
          <LoginLog data={data} />
        </>
      ),
    },
    // { key: "editLog", label: t("memberDetail.mis075") },
    {
      key: "couponLog",
      label: t("memberDetail.mis113"),
      children: (
        <>
          <Typography.Paragraph strong>
            {t("memberDetail.mis113")}
          </Typography.Paragraph>
          <CouponTap user={data} />
        </>
      ),
    },
    // {
    //   key: "luckyWheelCouponLog",
    //   label: i18next.t("user.luckyWheelLog"),
    //   children: (
    //     <>
    //       <Typography.Paragraph strong>
    //         {i18next.t("user.luckyWheelLog")}
    //       </Typography.Paragraph>
    //       <LuckyWheelCoupon username={data?.username} isUserTab />
    //     </>
    //   ),
    // },
    {
      key: "referralLog",
      label: t("col.referralPoint"),
      children: (
        <>
          <Typography.Paragraph strong>{t("col.referralPoint")}</Typography.Paragraph>
          <ReferralLog data={data} />
        </>
      ),
    },
    {
      key: "referralList",
      label: t("col.referralList"),
      children: (
        <>
          <Typography.Paragraph strong>
            {t("col.referralList")}
          </Typography.Paragraph>
          <ReferralList data={data} />
        </>
      ),
    },
    {
      key: "messageLog",
      label: t("memberDetail.messageLog"),
      children: (
        <>
          <Typography.Paragraph strong>
            {t("memberDetail.messageLog")}
          </Typography.Paragraph>
          <MessageLog data={data} />
        </>
      ),
    },
    {
      key: "updateLog",
      label: t("col.memberInfoChangeLog"),
      children: (
        <>
          <Typography.Paragraph strong>
            {t("col.memberInfoChangeLog")}
          </Typography.Paragraph>
          <UpdateLog data={data} />
        </>
      ),
    },
  ];

  return (
    <Card>
      <Flex align="center" gap={"1em"}>
        <div style={{ whiteSpace: "nowrap", flexShrink: 0 }}>
          <Breadcrumb
            replace={`${t("memberDetail.mis000")} [${data?.username ?? ''}] [${data?.user_real_name ?? ''}]`}
          />
        </div>

        <div style={{ flex: 1, minWidth: 160, maxWidth: 480 }}>
          <UserSearchSelect />
        </div>

        <Flex gap={"0.5em"} style={{ flexShrink: 0, marginLeft: "auto" }}>
          <Button className="user-button" icon={<InboxOutlined />}  onClick={() => setUsername(data?.username)}>
            쪽지
          </Button>
          <Button className="user-button" icon={<EditIcon />}  onClick={() => navigate(`/user/edit/${id}`)}>
            편집
          </Button>
          <Button className="user-button alt" icon={<RefreshIcon />} onClick={() => { location.reload(); }}>
            새로고침
          </Button>
          <Button className="user-button alt" icon={<ListIcon />} onClick={() => navigate("/user")} >
            목록
          </Button>
        </Flex>
      </Flex>
      <Divider />
      {!isLoading && (
        <Tabs
          type="card"
          centered
          items={items}
          defaultActiveKey={searchParams.get("tab") ?? "userInfo"}
          activeKey={searchParams.get("tab") ?? "userInfo"}
          onChange={(key) => {
            // setSearchParams({ tab: key });
            if (key === 'bettingLog') {
              navigate(`${pathname}?tab=${key}&${stringify({dateRange: [dayjs().tz().startOf('day').format(), dayjs().tz().endOf('day').format()]})}`);
            } else if (key === 'info') {
              navigate(`${pathname}?tab=${key}&${stringify({dateRangeT: [dayjs().tz().startOf('day').format(), dayjs().tz().endOf('day').format()]})}`);
            } else if (key === 'loginLog' || key === 'messageLog') {
              navigate(`${pathname}?tab=${key}&${stringify({dateRange: [dayjs().startOf('month').format(), dayjs().endOf('month').format()]})}`);
            } else if (key === 'dailystats') {
              navigate(`${pathname}?tab=${key}&${stringify({dateRange: [dayjs().tz().startOf('day').format(), dayjs().tz().endOf('day').format()]})}`);
            } else {
              navigate(`${pathname}?tab=${key}`)
            }
            mutate();
          }}
        />
      )}
      <Modal
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
        destroyOnClose
        open={username ? true : false}
        onCancel={() => setUsername(undefined)}
        centered
        width={"80%"}
        styles={{
          content: {
            paddingTop: "3rem",
          },
        }}
      >
        <Breadcrumb replace={username} />
        <Divider />
        <Message username={username} setUsername={setUsername} />
      </Modal>      
    </Card>
  );
};

// Sensitive-data view tokens live only while this member's page is open;
// keying by the route id drops them when the operator moves to another member.
const UserDetailPage = () => {
  const { id } = useParams();
  return (
    <SensitiveViewProvider key={id}>
      <UserDetail />
    </SensitiveViewProvider>
  );
};

export default UserDetailPage;

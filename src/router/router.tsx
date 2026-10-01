import { createBrowserRouter, RouteObject } from "react-router-dom";
import LangReactive from "@/i18n/LangReactive";
import ErrorPage from "../pages/error/ErrorPage";
import PrivateRouter from "./PrivateRouter";
import SuperAdminRoute from "./SuperAdminRoute";
import Login from "../pages/login/Login";
import ConfigProvider from "@/provider/configProviderProps";
import Home from "@/pages/home/Home";
import DailyStatistic from "@/pages/statistic/daily/DailyStatistic";
import DailyAgent from "@/pages/statistic/agent/DailyAgent";
import DailyUser from "@/pages/statistic/user/DailyUser";
import UserList from "@/pages/user/UserList";
import Agent from "@/pages/agent/agentList/Agent";
import AgentCommission from "@/pages/agent/agentCommission/AgentCommission";
import Deposit from "@/pages/payment/deposit/Deposit";
import Withdraw from "@/pages/payment/withdraw/Withdraw";
import BettingRecord from "@/pages/betting/record/BettingRecord";
import SportsBettingRecord from "@/pages/betting/record/SportsBettingRecord";
import MiniBettingRecord from "@/pages/betting/record/MiniBettingRecord";
import DepositBonus from "@/pages/promotion/depositBonus/DepositBonus";
import Coupon from "@/pages/promotion/coupon/Coupon";
import Payback from "@/pages/promotion/payback/Payback";
import LevelSetting from "@/pages/system/level/LevelSetting";
import Referral from "@/pages/promotion/referral/Referral";
import ReferralPayout from "@/pages/promotion/referral/ReferralPayout";
import Message from "@/pages/system/message/Message";
import Banner from "@/pages/system/banner/Banner";
import PhoneLog from "@/pages/admin/phoneLog/PhoneLog";
import AdminLoginLog from "@/pages/admin/loginLog/AdminLoginLog";
import Sessions from "@/pages/admin/sessions/Sessions";
import AdminAccounts from "@/pages/admin/accounts/AdminAccounts";
import AdminAccountsAudit from "@/pages/admin/accounts/Audit";
import UserDetail from "@/pages/user/UserDetail";
import BannerCreate from "@/pages/system/banner/BannerCreate";
import MessageCreate from "@/pages/system/message/MessageCreate";
import BannerEdit from "@/pages/system/banner/BannerEdit";
import Layout from "@/layout/Layout";
import DepositBonusCreate from "@/pages/promotion/depositBonus/DepositBonusCreate";
import CouponCreate from "@/pages/promotion/coupon/CouponCreate";
import UserCreate from "@/pages/user/UserCreate";
import Event from "@/pages/system/event/Event";
import EventCreate from "@/pages/system/event/EventCreate";
import EventEdit from "@/pages/system/event/EventEdit";
import Notice from "@/pages/system/notice/Notice";
import Inquiry from "@/pages/system/inquiry/Inquiry";
import InquiryTemplates from "@/pages/system/inquiry-templates/InquiryTemplates";
import TransactionRules from "@/pages/system/transaction-rules/TransactionRules";
import TransactionRulesPreview from "@/pages/system/transaction-rules-preview/TransactionRulesPreview";
import BonusPolicy from "@/pages/system/bonus-policy/BonusPolicy";
import NoticeCreate from "@/pages/system/notice/NoticeCreate";
import Regulation from "@/pages/system/regulation/Regulation";
import RegulationCreate from "@/pages/system/regulation/RegulationCreate";
import UserEdit from "@/pages/user/UserEdit";
import Maintenance from "@/pages/system/maintenance/Maintenance";
import LevelAccount from "@/pages/system/level-account/LevelAccount";
import LevelAccountForm from "@/pages/system/level-account/LevelAccountForm";
import DepositBonusLog from "@/pages/promotion/depositBonusLog/DepositBonusLog";
import Attendance from "@/pages/promotion/attendance/Attendance";
import AttendanceLog from "@/pages/promotion/attendance-log/AttendanceLog";
import HighStakes from "@/pages/promotion/high-stakes/HighStakes";
import PaybackLog from "@/pages/promotion/paybackLog/PaybackLog";
import ReferralLog from "@/pages/promotion/referralLog/ReferralLog";
import LevelEdit from "@/pages/system/level/LevelEdit";
import BlockList from "@/pages/admin/blockList/BlockList";
import SmsLog from "@/pages/user/smsLog/SmsLog";
import Fake from "@/pages/payment/fake/Fake";
import FakeCreate from "@/pages/payment/fake/FakeCreate";
import WithdrawDetail from "@/pages/payment/withdraw/WithdrawDetail";
import HeroManagement from "@/pages/system/hero-management/HeroManagement";
import HeroManagementCreate from "@/pages/system/hero-management/HeroManagementCreate";
import HeroManagementEdit from "@/pages/system/hero-management/HeroManagementEdit";
import UserBet from "@/pages/statistic/userBet/UserBet";
import LevelCreate from "@/pages/system/level/LevelCreate";
import LevelUp from "@/pages/statistic/levelup/LevelUp";
import CouponName from "@/pages/promotion/coupon-name/CouponName";
import CouponNameCreate from "@/pages/promotion/coupon-name/CouponNameCreate";
import CouponUsage from "@/pages/statistic/coupon-usage/CouponUsage";
import BonusUsage from "@/pages/statistic/bonus-usage/BonusUsage";
import LevelUpLog from "@/pages/user/levelup-log/LevelUpLog";
import UserLoginLog from "@/pages/user/loginlog/UserLoginLog";
import LoginEnvChangeLog from "@/pages/user/login-env-change-log/LoginEnvChangeLog";
import TotalRecord from "@/pages/betting/totalrecord/TotalRecord";
import CouponApplication from "@/pages/promotion/coupon-application/CouponApplication";
import HighValueUser from "@/pages/user/highvalue/HighValueList";
import UpdateLog from "@/pages/user/update-log";
import AgentTable from "@/pages/agent/agent/AgentTable";
import WithdrawAgent from "@/pages/payment/withdraw-agent/WithdrawAgent";
import WithdrawAgentDetail from "@/pages/payment/withdraw-agent/WithdrawAgentDetail";
import AgentBalanceLog from "@/pages/agent/balanceLog/AgentBalanceLog";
import AgentPeriod from "@/pages/statistic/agent-period/AgentPeriod";
import MissionGroupCreate from "@/pages/event/daily-mission-group/MissionGroupCreate";
import MissionGroupEdit from "@/pages/event/daily-mission-group/MissionEdit";
import DailyMissionGroupSetting from "@/pages/event/daily-mission-group/DailyMissionGroupSetting";
import MissionCoupon from "@/pages/event/mission-coupon-item/MissionCoupon";
import MissionCouponCreate from "@/pages/event/mission-coupon-item/MissionCouponCreate";
import MissionCouponEdit from "@/pages/event/mission-coupon-item/MissionCouponEdit";
import MissionEvents from "@/pages/event/mission-events/MissionEvents";
import DepositSMS from "@/pages/payment/deposit-sms/DepositSMS";
import GradeAccount from "@/pages/system/grade-account/GradeAccount";
import GradeAccountForm from "@/pages/system/grade-account/GradeAccountForm";
import VirtualAccount from "@/pages/system/virtual-account/VirtualAccount";
import VirtualAccountForm from "@/pages/system/virtual-account/VirtualAccountForm";
import USDTAccount from "@/pages/system/usdt-account/USDTAccount";
import GradeSettings from "@/pages/system/grade-settings/GradeSettings";
import USDTAccountForm from "@/pages/system/usdt-account/USDTAccountForm";
import USDTDailyStasts from "@/pages/statistic/usdt-daily/USDTDailyStasts";
import RollingSettings from "@/pages/system/rolling-settings/RollingSettings";
import SiteSettings from "@/pages/system/site-settings/SiteSettings";
import SiteMaintenance from "@/pages/system/site-maintenance/SiteMaintenance";
import SiteProfile from "@/pages/system/site-profile/SiteProfile";
import SportsConfig from "@/pages/sports/config/Config";
import SportsRateConfig from "@/pages/sports/config/RateConfig";
import SportsCombineList from "@/pages/sports/combine/List";
import SportsCombineCreate from "@/pages/sports/combine/Create";
import SportsCombineEdit from "@/pages/sports/combine/Edit";
import SportsBonusList from "@/pages/sports/bonus/List";
import SportsBonusCreate from "@/pages/sports/bonus/Create";
import SportsBonusEdit from "@/pages/sports/bonus/Edit";
import SportsMarketList from "@/pages/sports/market/List";
import SportsMarketEdit from "@/pages/sports/market/Edit";
import SportsMatchList from "@/pages/sports/match/List";
import SportsMatchBetList from "@/pages/sports/match/Bet";
import SportsMatchEdit from "@/pages/sports/match/Edit";
import SportsMatchCreate from "@/pages/sports/match/Create";
import SportsV3TicketsList from "@/pages/sports-v3/tickets/List";
import SportsV3TicketDetail from "@/pages/sports-v3/tickets/Detail";
// ITF sports admin controls (sportgames/internationalgames/specialsportgames boards)
// — a separate module from src/pages/sports/* above, which governs the older
// sport_widget_v3 vendor odds screen on a different backend.
import SportsAdminOddsList from "@/pages/sports-admin/odds/List";
import SportsAdminLimitsList from "@/pages/sports-admin/limits/List";
import SportsAdminComboRulesList from "@/pages/sports-admin/combo-rules/List";
import SportsV3SettlementsList from "@/pages/sports-v3/settlements/List";
import SportsV3BonusList from "@/pages/sports-v3/bonus/List";
import SpecialGames from "@/pages/special-games/SpecialGames";
import SpecialGamesCreate from "@/pages/special-games/SpecialGamesCreate";
import MiniConfig from "@/pages/mini/MiniConfig";
import MiniBetTypeList from "@/pages/mini/MiniBetTypeList";
import MiniBetTypeEdit from "@/pages/mini/MiniBetTypeEdit";
import ProofReports from "@/pages/payment/proof-reports/ProofReports";
import DepositMethod from "@/pages/payment/deposit-method/DepositMethod";
import DepositMethodCreate from "@/pages/payment/deposit-method/DepositMethodCreate";
import VrBettingRecord from "@/pages/betting/record/VrBettingRecord";
import VrConfig from "@/pages/vr/config/Config";
import VrSportsConfigList from "@/pages/vr/config/SportsConfigList";
import VrSportsConfigEdit from "@/pages/vr/config/SportsConfigEdit";
import VrCombineList from "@/pages/vr/combine/List";
import VrCombineEdit from "@/pages/vr/combine/Edit";
import VrCombineCreate from "@/pages/vr/combine/Create";
import VrMarketList from "@/pages/vr/market/List";
import VrBonusList from "@/pages/vr/bonus/List";
import VrBonusEdit from "@/pages/vr/bonus/Edit";
import VrBonusCreate from "@/pages/vr/bonus/Create";
import VrLeagueList from "@/pages/vr/league/List";
import VrRateConfig from "@/pages/vr/config/RateConfig";
import MessageTemplate from "@/pages/system/message-template/MessageTemplate";
import MessageTemplateCreate from "@/pages/system/message-template/MessageTemplateCreate";
import MessageTemplateEdit from "@/pages/system/message-template/MessageTemplateEdit";
import GradeChangeLog from "@/pages/user/grade-change-log/GradeChangeLog";
import LuckyWheelAdmin from "@/pages/promotion/lucky-wheel/LuckyWheelAdmin";
import DepositBonusV2 from "@/pages/promotion/depositBonusV2/DepositBonusV2";
import DepositBonusV2Create from "@/pages/promotion/depositBonusV2/DepositBonusV2Create";
import BalanceLogs from "@/pages/user/balance-logs/BalanceLogs";
import CombinedUsage from "@/pages/statistic/combined-usage/CombinedUsage";
import Matches from "@/pages/system/stream/matches/Matches";
import StreamEvent from "@/pages/system/stream/events/StreamEvent";
import StreamEventCreate from "@/pages/system/stream/events/StreamEventCreate";
import StreamEventEdit from "@/pages/system/stream/events/StreamEventEdit";
import SportsMarketRecord from "@/pages/sports-market/SportsMarket";
import SportGames from "@/pages/sports/games/SportGames";
import ChatSettings from "@/pages/system/stream/chat/ChatSettings";
import ChatSettingsCreate from "@/pages/system/stream/chat/ChatSettingsCreate";
import CategorySettings from "@/pages/system/stream/categories/CategorySettings";
import LeagueSettings from "@/pages/system/stream/leagues/LeagueSettings";
import ChatUserTab from "@/pages/system/stream/chat/user/ChatUserTab";
import MiraKnowledge from "@/pages/mira/knowledge";
import MiraAgentPrompt from "@/pages/mira/agent-prompt";
import PartnerManagement from "@/pages/partner-management/PartnerManagement";

// Wrap every routed element so its subtree re-renders in place on a language
// change (no remount/refetch) — see src/i18n/LangReactive.tsx.
const wrapRoutes = (routes: RouteObject[]): RouteObject[] =>
  routes.map((route) => {
    const r: any = { ...route };
    if (r.element) r.element = <LangReactive>{r.element}</LangReactive>;
    if (r.children) r.children = wrapRoutes(r.children);
    return r;
  });

const CreateRouter = () => {
  const router = createBrowserRouter(wrapRoutes([
    {
      path: "/",
      element: (
        <ConfigProvider>
          <Layout>
            <PrivateRouter />
          </Layout>
        </ConfigProvider>
      ),
      errorElement: <ErrorPage />,

      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "statistic",
          children: [
            {
              index: true,
              element: <DailyStatistic />,
            },
            {
              path: "agent",
              element: <DailyAgent />,
            },
            {
              path: "agent-period",
              element: <AgentPeriod />,
            },
            {
              path: "user",
              element: <DailyUser />,
            },
            {
              path: "user-bet",
              element: <UserBet />,
            },
            {
              path: "usdt-daily",
              element: <USDTDailyStasts />,
            },
            {
              path: "level-up",
              element: <LevelUp />,
            },
            {
              path: "coupon-usage",
              element: <CouponUsage />,
            },
            {
              path: "bonus-usage",
              element: <BonusUsage />,
            },
            {
              path: "combined-usage",
              element: <CombinedUsage />,
            },
          ],
        },
        {
          path: "user",
          children: [
            {
              index: true,
              element: <UserList />,
            },
            {
              path: "observation",
              element: <UserList />,
            },
            {
              path: "royalblack",
              element: <UserList />,
            },
            {
              path: ":id",
              element: <UserDetail />,
            },
            {
              path: "create",
              element: <UserCreate />,
            },
            {
              path: "edit/:id",
              element: <UserEdit />,
            },
            {
              path: "sms-log",
              element: <SmsLog />,
            },
            {
              path: "levelup-log",
              element: <LevelUpLog />,
            },
            {
              path: "grade-change-log",
              element: <GradeChangeLog />,
            },
            {
              path: "login-log",
              element: <UserLoginLog />,
            },
            {
              path: "login-env-change-log",
              element: <LoginEnvChangeLog />,
            },
            {
              path: "highvalue",
              element: <HighValueUser />,
            },
            {
              path: "balance-logs",
              element: <BalanceLogs />,
            },
            {
              path: "update-log",
              element: <UpdateLog />,
            },
          ],
        },
        {
          path: "agent",
          children: [
            {
              index: true,
              element: <Agent />,
            },
            {
              path: "table",
              element: <AgentTable />,
            },
            {
              path: "commission",
              element: <AgentCommission />,
            },
            {
              path: "withdraw",
              children: [
                { index: true, element: <WithdrawAgent /> },
                {
                  path: ":username",
                  element: <WithdrawAgentDetail />,
                },
              ],
            },
            {
              path: "balance-log",
              element: <AgentBalanceLog />,
            },
          ],
        },
        {
          path: "partner-management",
          element: <PartnerManagement />,
        },
        {
          path: "payment",
          children: [
            {
              index: true,
              element: <Deposit />,
            },
            {
              path: "withdraw",
              children: [
                {
                  index: true,
                  element: <Withdraw />,
                },

                { path: ":id", element: <WithdrawDetail /> },
              ],
            },
            {
              path: "sms",
              element: <DepositSMS />,
            },
            {
              path: "proof-reports",
              element: <ProofReports />,
            },
            {
              path: "fake",
              children: [
                { index: true, element: <Fake /> },
                { path: "create", element: <FakeCreate /> },
                { path: "edit/:id", element: <FakeCreate /> },
              ],
            },
            {
              path: "deposit-method",
              element: <DepositMethod />,
            },
            {
              path: "deposit-method/create",
              element: <DepositMethodCreate />,
            },
          ],
        },
        {
          path: "betting",
          children: [
            { index: true, element: <BettingRecord /> },
            { path: "sports-market", element: <SportsMarketRecord /> },
            { path: "sport-games", element: <SportGames /> },
            { path: "totalrecord", element: <TotalRecord /> },
            {
              path: "matchbet",
              children: [
                { index: true, element: <SportsMatchBetList /> },
                { path: "create", element: <SportsMatchCreate /> },
                { path: ":id", element: <SportsMatchEdit /> },
              ],
            },
            { path: "sports", element: <SportsBettingRecord /> },
            { path: "mini", element: <MiniBettingRecord /> },
            { path: "vr", element: <VrBettingRecord /> },
          ],
        },
        {
          path: "sports-v3",
          children: [
            { index: true, element: <SportsV3TicketsList /> },
            { path: "tickets", element: <SportsV3TicketsList /> },
            { path: "tickets/:ticketId", element: <SportsV3TicketDetail /> },
            { path: "settlements", element: <SportsV3SettlementsList /> },
            { path: "bonus", element: <SportsV3BonusList /> },
          ],
        },
        {
          path: "promotion",
          children: [
            {
              children: [
                {
                  index: true,
                  element: <DepositBonus />,
                },
                { path: "create", element: <DepositBonusCreate /> },
                { path: "edit/:id", element: <DepositBonusCreate /> },
              ],
            },
            {
              path: "deposit-bonus-log",
              children: [
                {
                  index: true,
                  element: <DepositBonusLog />,
                },
              ],
            },
            {
              path: "deposit-bonus-v2",
              children: [
                {
                  index: true,
                  element: <DepositBonusV2 />,
                },
                { path: "create", element: <DepositBonusV2Create /> },
                { path: "edit/:id", element: <DepositBonusV2Create /> },
              ],
            },
            {
              path: "attendance",
              children: [
                {
                  index: true,
                  element: <Attendance />,
                },
              ],
            },
            {
              path: "high-stakes",
              children: [
                {
                  index: true,
                  element: <HighStakes />,
                },
              ],
            },
            {
              path: "attendance-log",
              children: [
                {
                  index: true,
                  element: <AttendanceLog />,
                },
              ],
            },
            {
              path: "coupon-name",
              children: [
                {
                  index: true,
                  element: <CouponName />,
                },
                {
                  path: "create",
                  element: <CouponNameCreate />,
                },
                { path: "edit/:id", element: <CouponNameCreate /> },
              ],
            },
            {
              path: "coupon",
              children: [
                {
                  index: true,
                  element: <Coupon />,
                },
                {
                  path: "create",
                  element: <CouponCreate />,
                },
              ],
            },
            {
              path: "coupon-application",
              children: [
                {
                  index: true,
                  element: <CouponApplication />,
                },
              ],
            },
            // { path: "coupon-log", element: <CouponLog /> },
            { path: "payback", element: <Payback /> },
            { path: "payback-log", element: <PaybackLog /> },
            {
              path: "referral",
              element: <Referral />,
            },
            {
              path: "referral-payout",
              element: <ReferralPayout />,
            },
            {
              path: "referral-log",
              element: <ReferralLog />,
            },
            {
              path: "lucky-wheel",
              element: <LuckyWheelAdmin />,
            },
          ],
        },
        {
          path: "event",
          children: [
            {
              index: true,
              path: "mission-event-list",
              element: <MissionEvents />,
            },
            {
              path: "daily-mission-group-setting",
              children: [
                {
                  index: true,
                  element: <DailyMissionGroupSetting />,
                },
                {
                  path: "create",
                  element: <MissionGroupCreate />,
                },
                {
                  path: "edit/:id",
                  element: <MissionGroupEdit />,
                },
              ],
            },
            {
              path: "mission-coupon-setting",
              children: [
                {
                  path: ":type", // mission or coupon
                  element: <MissionCoupon />,
                },
                {
                  path: ":type/create",
                  element: <MissionCouponCreate />,
                },
                {
                  path: ":type/edit/:id",
                  element: <MissionCouponEdit />,
                },
              ],
            },
          ],
        },
        {
          path: "system",
          children: [
            {
              path: "grade-settings",
              element: <GradeSettings />,
            },
            {
              path: "rolling-settings",
              element: <RollingSettings />,
            },
            {
              path: "level",
              children: [
                { index: true, element: <LevelSetting /> },
                { path: ":id", element: <LevelEdit /> },
                { path: "create", element: <LevelCreate /> },
              ],
            },
            {
              path: "level-account",
              children: [
                { index: true, element: <LevelAccount /> },
                { path: ":id", element: <LevelAccountForm /> },
                { path: "create", element: <LevelAccountForm /> },
              ],
            },
            {
              path: "grade-account",
              children: [
                { index: true, element: <GradeAccount /> },
                { path: ":id", element: <GradeAccountForm /> },
                { path: "create", element: <GradeAccountForm /> },
              ],
            },
            {
              path: "virtual-account",
              children: [
                { index: true, element: <VirtualAccount /> },
                { path: ":id", element: <VirtualAccountForm /> },
                { path: "create", element: <VirtualAccountForm /> },
              ],
            },
            {
              path: "usdt-account",
              children: [
                { index: true, element: <USDTAccount /> },
                { path: ":id", element: <USDTAccountForm /> },
                { path: "create", element: <USDTAccountForm /> },
              ],
            },
            {
              path: "message",
              children: [
                { index: true, element: <Message /> },
                {
                  path: "create",
                  element: <MessageCreate />,
                },
              ],
            },
            {
              path: "message-template",
              children: [
                { index: true, element: <MessageTemplate /> },
                {
                  path: "create",
                  element: <MessageTemplateCreate />,
                },
                {
                  path: "edit/:id",
                  element: <MessageTemplateEdit />,
                },
              ],
            },
            {
              path: "banner",
              children: [
                {
                  index: true,
                  element: <Banner />,
                },
                {
                  path: "create",
                  element: <BannerCreate />,
                },
                {
                  path: "edit/:id",
                  element: <BannerEdit />,
                },
              ],
            },
            {
              path: "event",
              children: [
                {
                  index: true,
                  element: <Event />,
                },
                {
                  path: "create",
                  element: <EventCreate />,
                },
                {
                  path: "edit/:id",
                  element: <EventEdit />,
                },
              ],
            },
            {
              path: "notice",
              children: [
                {
                  index: true,
                  element: <Notice />,
                },
                {
                  path: "create",
                  element: <NoticeCreate />,
                },
                {
                  path: "edit/:id",
                  element: <NoticeCreate />,
                },
              ],
            },
            {
              path: "inquiry",
              children: [
                {
                  index: true,
                  element: <Inquiry />,
                },
              ],
            },
            {
              path: "inquiry-templates",
              children: [
                {
                  index: true,
                  element: <InquiryTemplates />,
                },
              ],
            },
            {
              path: "transaction-rules",
              children: [
                {
                  index: true,
                  element: <TransactionRules />,
                },
              ],
            },
            {
              path: "transaction-rules/preview",
              children: [
                {
                  index: true,
                  element: <TransactionRulesPreview />,
                },
              ],
            },
            {
              path: "bonus-policy",
              children: [
                {
                  index: true,
                  element: <BonusPolicy />,
                },
              ],
            },
            {
              path: "maintenance",
              element: <Maintenance />,
            },
            {
              path: "hero-management",
              children: [
                {
                  index: true,
                  element: <HeroManagement />,
                },
                {
                  path: "create",
                  element: <HeroManagementCreate />,
                },
                {
                  path: "edit/:id",
                  element: <HeroManagementEdit />,
                },
              ],
            },
            {
              path: "regulation",
              children: [
                {
                  index: true,
                  element: <Regulation />,
                },
                {
                  path: "create",
                  element: <RegulationCreate />,
                },
                {
                  path: "edit/:id",
                  element: <RegulationCreate />,
                },
              ],
            },
            {
              path: "site-settings",
              element: <SiteSettings />,
            },
            {
              path: "site-maintenance",
              element: <SiteMaintenance />,
            },
            {
              path: "site-profile",
              element: <SiteProfile />,
            },
          ],
        },
        {
          path: "admin",
          children: [
            { path: "block-ip", element: <BlockList /> },
            { path: "phone-log", element: <PhoneLog /> },
            { path: "login-log", element: <AdminLoginLog /> },
            { path: "sessions", element: <Sessions /> },
            {
              // Super-admin only. The sidebar already hides these two, but the
              // URL resolves for anyone who types it.
              element: <SuperAdminRoute />,
              children: [
                { path: "accounts", element: <AdminAccounts /> },
                { path: "accounts/audit", element: <AdminAccountsAudit /> },
              ],
            },
          ],
        },
        {
          path: "sports",
          children: [
            {
              path: "match",
              children: [
                { index: true, element: <SportsMatchList /> },
                { path: "create", element: <SportsMatchCreate /> },
                { path: ":id", element: <SportsMatchEdit /> },
              ],
            },
            {
              path: "config",
              children: [
                { index: true, element: <SportsConfig /> },
                { path: "rate", element: <SportsRateConfig /> },
              ],
            },
            {
              path: "market",
              children: [
                { index: true, element: <SportsMarketList /> },
                { path: ":id", element: <SportsMarketEdit /> },
              ],
            },
            {
              path: "combine",
              children: [
                { index: true, element: <SportsCombineList /> },
                { path: ":id", element: <SportsCombineEdit /> },
                { path: "create", element: <SportsCombineCreate /> },
              ],
            },
            {
              path: "bonus",
              children: [
                { index: true, element: <SportsBonusList /> },
                { path: ":id", element: <SportsBonusEdit /> },
                { path: "create", element: <SportsBonusCreate /> },
              ],
            },
          ],
        },
        {
          path: "sports-admin",
          children: [
            { path: "odds", element: <SportsAdminOddsList /> },
            { path: "limits", element: <SportsAdminLimitsList /> },
            { path: "combo-rules", element: <SportsAdminComboRulesList /> },
          ],
        },
        {
          path: "special-games",
          children: [
            { index: true, element: <SpecialGames /> },
            { path: "create", element: <SpecialGamesCreate /> },
            { path: "edit/:id", element: <SpecialGamesCreate /> },
          ],
        },
        {
          path: "mini",
          children: [
            {
              path: "config",
              element: <MiniConfig />,
            },
            {
              path: "bet-type",
              children: [
                { index: true, element: <MiniBetTypeList /> },
                { path: ":id", element: <MiniBetTypeEdit /> },
              ],
            },
          ],
        },
        {
          path: "vr",
          children: [
            {
              path: "config",
              children: [
                { index: true, element: <VrConfig /> },
                { path: "sports", element: <VrSportsConfigList /> },
                { path: "sports/:id", element: <VrSportsConfigEdit /> },
                { path: "rate", element: <VrRateConfig /> },
              ],
            },
            {
              path: "combine",
              children: [
                { index: true, element: <VrCombineList /> },
                { path: ":id", element: <VrCombineEdit /> },
                { path: "create", element: <VrCombineCreate /> },
              ],
            },
            {
              path: "market",
              children: [{ index: true, element: <VrMarketList /> }],
            },
            {
              path: "bonus",
              children: [
                { index: true, element: <VrBonusList /> },
                { path: ":id", element: <VrBonusEdit /> },
                { path: "create", element: <VrBonusCreate /> },
              ],
            },
            {
              path: "league",
              children: [{ index: true, element: <VrLeagueList /> }],
            },
          ],
        },
        {
          path: "stream",
          children: [
            {
              path: "matches",
              element: <Matches />,
            },
            {
              path: "events",
              children: [
                {
                  index: true,
                  element: <StreamEvent />,
                },
                {
                  path: "create",
                  element: <StreamEventCreate />,
                },
                {
                  path: "edit/:id",
                  element: <StreamEventEdit />,
                },
              ],
            },
            {
              path: "categories",
              children: [
                {
                  index: true,
                  element: <CategorySettings />,
                },
              ],
            },
            {
              path: "leagues",
              children: [
                {
                  index: true,
                  element: <LeagueSettings />,
                },
              ],
            },
            {
              path: "chat-settings",
              children: [
                {
                  index: true,
                  element: <ChatSettings />,
                },
                {
                  path: "create",
                  element: <ChatSettingsCreate />,
                },
              ],
            },
            {
              path: "chat-user-list",
              // element: <ChatUserTab />,
              children: [
                {
                  index: true,
                  element: <ChatUserTab />,
                },
                {
                  path: "create",
                  element: <ChatSettingsCreate />,
                },
              ],
            },
          ],
        },
        {
          path: "mira",
          children: [
            {
              path: "knowledge",
              element: <MiraKnowledge />,
            },
            {
              path: "agent-prompt",
              element: <MiraAgentPrompt />,
            },
          ],
        },
      ],
    },
    {
      path: "/login",

      element: (
        <ConfigProvider>
          <Login />
        </ConfigProvider>
      ),
    },
  ]));

  return router;
};

export default CreateRouter;

import { useTranslation } from "react-i18next";
import Dashboard from "@/assets/menu/dashboard.svg?react";
import Member from "@/assets/menu/member.svg?react";
import Partner from "@/assets/menu/agent.svg?react";
import Payment from "@/assets/menu/payment.svg?react";
import Betting from "@/assets/menu/betting.svg?react";
import Promotion from "@/assets/menu/promotion.svg?react";
import System from "@/assets/menu/system.svg?react";
import Admin from "@/assets/menu/admin.svg?react";
// import GameSettings from "@/assets/menu/game-settings.svg?react";
import Bonus from "@/assets/menu/bonus.svg?react";
import Coupon from "@/assets/menu/coupon.svg?react";
// import Mission from "@/assets/menu/mission.svg?react";
import Payback from "@/assets/menu/payback.svg?react";
import Referral from "@/assets/menu/referral.svg?react";
// import LiveStream from "@/assets/menu/live-stream.svg?react";
// import Event from "@/assets/menu/event.svg?react";

import dayjs from "dayjs";
import { stringify } from "qs";
import topbarStore from "@/store/topbar.store";
import useSiteProfileStore from "@/store/site-profile.store";
import useAdminAccessStore from "@/store/admin-access.store";
import { ReactElement } from "react";

interface ChildrenProp {
  key: string;
  label: string;
  basePath?: string;
  badge?: number;
  menuNo?: number;
  icon?: React.ReactNode;
  children?: ChildrenProp[];
}

interface UseMenuProps {
  key: string;
  label: string;
  icon: ReactElement;
  children: ChildrenProp[];
}

const useMenu = () => {
  const { t } = useTranslation();
  const data = topbarStore.getState();
  // Bound to hideSportsMenus, not preset === "CASINO_ONLY" — an operator
  // who switches sports off by hand lands on CUSTOM, and a preset compare
  // would leave the sports-admin menu visible for a product they no longer
  // run. See PRODUCT_PROFILE_FRONTEND_INTEGRATION.md §2.
  const hideSportsMenus = useSiteProfileStore.getState().data?.hideSportsMenus ?? false;
  // No server-derived flag for this one — the special switch is read straight
  // from categories. Defaults to visible while the profile is still loading.
  const categories = useSiteProfileStore.getState().data?.categories;
  const hideSpecialMenus = categories?.special === false;
  // Tri-state: null means the super-admin probe has not answered yet. Anything
  // but a definite true hides 관리자 계정 관리, so a privileged entry never
  // flashes in and back out while the page loads.
  const hideAdminAccountMenus = useAdminAccessStore.getState().isSuperAdmin !== true;
  // 게임 관리 has to land on a lobby tab that survives the same filtering in
  // GameCategoryBtn (useCategoryVisibility) — first switched-on lobby wins,
  // in the order the tabs are rendered.
  const maintenanceCategory = !hideSportsMenus
    ? "sports-lobby"
    : categories?.slot !== false
    ? "slot-lobby"
    : categories?.minigame !== false
    ? "minigame-lobby"
    : "live-lobby";
  const items: UseMenuProps[] = [
    // DASHBOARD
    {
      key: "statistic",
      label: t("sidemenu.tn001"),
      icon: <Dashboard />,
      children: [
        {
          key: "/",
          label: t("sidemenu.dashboardSummary"),
          menuNo: 1,
        },
        {
          key: "/statistic",
          label: t("sidemenu.sm002"),
          menuNo: 2,
        },
        // {
        //   key: "/statistic/agent",
        //   label: t("sidemenu.sm003"),
        // },
        {
          key: "/statistic/user",
          label: t("sidemenu.sm004"),
          menuNo: 3,
        },
        {
          key: `/betting/totalrecord?${stringify({
            dateRangeT: [
              dayjs().tz().startOf("month").format(),
              dayjs().tz().endOf("month").format(),
            ],
            game_category: "",
          })}`,
          basePath: "/betting/totalrecord",
          // label: t("게임사별 베팅통계"),
          label: t("sidemenu.sm059"),
          menuNo: 4,
        },
        {
          key: "/statistic/usdt-daily",
          label: t("sidemenu.usdtDailyStats"),
          menuNo: 5,
        },

        // {
        //   key: "/statistic/user-bet",
        //   label: t("sidemenu.sm049"),
        // },
        // {
        //   key: "/statistic/level-up",
        //   label: t("sidemenu.sm051"),
        // },
        // {
        //   key: "/statistic/coupon-usage",
        //   label: t("sidemenu.sm054"),
        // },
        // {
        //   key: "/statistic/bonus-usage",
        //   label: t("sidemenu.sm055"),
        // },
        {
          key: "/statistic/combined-usage",
          label: t("sidemenu.combinedUsageStats"),
          menuNo: 6,
        },
      ],
    },
    // User Management
    {
      key: "user",
      label: t("sidemenu.sm005"),
      icon: <Member />,
      children: [
        {
          key: "/user",
          label: t("sidemenu.sm006"),
          menuNo: 7,
        },
        {
          key: `/user/observation?status=OBSERVATION`,
          basePath: "/user/observation",
          label: t("sidemenu.sm063"),
          menuNo: 8,
        },
        {
          key: `/user/royalblack?status=ROYALBLACK`,
          basePath: "/user/royalblack",
          label: t("sidemenu.royalBlackMembers"),
          menuNo: 9,
        },
        {
          key: `/user/login-log?${stringify({
            dateRange: [
              dayjs().startOf("month").format(),
              dayjs().endOf("month").format(),
            ],
          })}`,
          label: t("sidemenu.sm058"),
          basePath: "/user/login-log",
          menuNo: 10,
        },
        // hidden for now — see review item 10 (Login History vs Login Environment History)
        // {
        //   key: "/user/login-env-change-log",
        //   label: t("sidemenu.loginEnvChangeLog"),
        //   menuNo: 11,
        // },
        {
          key: "/user/levelup-log",
          label: t("sidemenu.sm056"),
          menuNo: 12,
        },
        {
          key: `/user/grade-change-log?${stringify({
            dateRange: [
              dayjs().tz().startOf("month").format(),
              dayjs().tz().endOf("month").format(),
            ],
          })}`,
          basePath: "/user/grade-change-log",
          label: t("sidemenu.gradeChangeLog"),
          menuNo: 13,
        },
        {
          key: "/user/balance-logs",
          label: t("sidemenu.allMembersMoneyLog"),
          menuNo: 14,
        },
        // hidden for now — see review item 11 (Member Information Change History)
        // {
        //   key: "/user/update-log",
        //   label: t("sidemenu.memberInfoChangeLog"),
        //   menuNo: 15,
        // },
        {
          key: "/user/sms-log",
          label: t("sidemenu.sm047"),
          menuNo: 16,
        },
      ],
    },
    // Payments
    {
      key: "payment",
      label: t("sidemenu.sm010"),
      icon: <Payment />,
      children: [
        {
          key: `/payment?${stringify({
            dateRange: [
              dayjs().tz().startOf("month").format(),
              dayjs().tz().endOf("month").format(),
            ],
          })}`,
          basePath: "/payment",
          label: t("sidemenu.sm011"),
          badge: data.deposit_applied ?? 0,
          menuNo: 17,
        },
        {
          key: `/payment/withdraw?${stringify({
            dateRangeW: [
              dayjs().tz().startOf("month").format(),
              dayjs().tz().endOf("month").format(),
            ],
          })}`,
          basePath: "/payment/withdraw",
          label: t("sidemenu.sm012"),
          badge: data.withdraw_applied,
          menuNo: 18,
        },
        {
          key: `/payment/sms?${stringify({
            dateRange: [
              dayjs().tz().startOf("month").format(),
              dayjs().tz().endOf("month").format(),
            ],
          })}`,
          basePath: "/payment/sms",
          label: t("sidemenu.autoDepositUnprocessed"),
          menuNo: 19,
        },
        {
          key: "/payment/proof-reports",
          label: t("sidemenu.proofReports"),
        },
        // {
        //   key: "/payment/fake",
        //   label: t("sidemenu.sm048"),
        // },
        // {
        //   key: "/system/level-account",
        //   label: t("sidemenu.sm042"),
        // },
        // {
        //   key: "/system/grade-account",
        //   label: t("등급 별 입금 계좌"),
        // },
        // {
        //   key: "/system/virtual-account",
        //   label: t("가상계좌 설정"),
        // },
        // {
        //   key: "/system/usdt-account",
        //   label: t("계좌별 입금 설정"),
        // },
        {
          key: "/payment/deposit-method",
          label: t("sidemenu.depositMethodSettings"),
          menuNo: 20,
        },
      ],
    },
    // Deposit Account Setting
    // {
    //   key: 'depositsettings',
    //   label: '입금계좌 설정',
    //   icon: <System />,
    //   children: [
    //     {
    //       key: "/system/level-account",
    //       label: t("sidemenu.sm042"),
    //     },
    //     {
    //       key: "/system/grade-account",
    //       label: t("등급 별 입금 계좌"),
    //     },
    //     {
    //       key: "/system/virtual-account",
    //       label: t("가상계좌 설정"),
    //     },
    //     {
    //       key: "/system/usdt-account",
    //       label: t("계좌별 입금 설정"),
    //     },
    //   ]
    // },
    // Betting Management
    {
      key: "betting",
      label: t("sidemenu.sm013"),
      icon: <Betting />,
      children: [
        {
          key: `/betting?${stringify({
            dateRange: [
              dayjs().tz().startOf("month").format(),
              dayjs().tz().endOf("month").format(),
            ],
          })}`,
          basePath: "/betting",
          label: t("sidemenu.sm014"),
          menuNo: 21,
        },
        // {
        //   key: `/betting/sports-market?${stringify({
        //     dateRange: [
        //       dayjs().tz().startOf("month").format(),
        //       dayjs().tz().endOf("month").format(),
        //     ],
        //   })}`,
        //   basePath: "/betting/sports-market",
        //   label: t("sidemenu.matchBettingRecords"),
        //   menuNo: 22,
        // },
        {
          key: "/betting/sport-games",
          basePath: "/betting/sport-games",
          label: t("sidemenu.sportGames"),
          menuNo: 55,
        },
        //  {
        //    key: `/betting/matchbet?${stringify({
        //     dateRange: [
        //       dayjs().tz().startOf("month").format(),
        //       dayjs().tz().endOf("month").format(),
        //     ],
        //   })}`,
        //   label: t("sidemenu.matchBettingRecordsDomestic"),
        // },
        // {
        //   key: `/betting/sports?${stringify({
        //     dateRange: [
        //       dayjs().tz().startOf("month").format(),
        //       dayjs().tz().endOf("month").format(),
        //     ],
        //   })}`,
        //   basePath: "/betting/sports",
        //   label: t("sidemenu.domesticSportsBettingRecords"),
        // },
        // {
        //   key: `/betting/mini?${stringify({
        //     dateRange: [
        //       dayjs().tz().startOf("day").format(),
        //       dayjs().tz().endOf("day").format(),
        //     ],
        //   })}`,
        //   basePath: "/betting/mini",
        //   label: t("미니게임 베팅 기록"),
        // },
        // {
        //   key: `/betting/vr?${stringify({
        //     dateRange: [
        //       dayjs().tz().startOf("month").format(),
        //       dayjs().tz().endOf("month").format(),
        //     ],
        //   })}`,
        //   basePath: "/betting/vr",
        //   label: t("sidemenu.vrBettingRecords"),
        // },
      ],
    },
    // Sportsbook v3 (TiketPay) — hidden from the sidebar per request
    // {
    //   key: "sports-v3",
    //   label: t("sidemenu.sportsbookV3"),
    //   icon: <Betting />,
    //   children: [
    //     {
    //       key: "/sports-v3/tickets",
    //       label: t("sidemenu.bettingTickets"),
    //       menuNo: 23,
    //     },
    //     {
    //       key: "/sports-v3/settlements",
    //       label: t("sidemenu.settlementCashout"),
    //       menuNo: 24,
    //     },
    //     {
    //       key: "/sports-v3/bonus",
    //       label: t("sidemenu.bonus"),
    //       menuNo: 25,
    //     },
    //   ],
    // },
    // Special Games
    {
      key: "special-games",
      label: t("sidemenu.specialGames"),
      icon: <Betting />,
      children: [
        {
          key: "/special-games",
          label: t("sidemenu.specialGamesList"),
          menuNo: 56,
        },
      ],
    },
    // ITF sports admin controls (odds/limits/combo rules/settlement) — a new,
    // separate module from the legacy "sports" section further below, which is
    // commented out and governs the old sport_widget_v3 vendor odds screen.
    {
      key: "sports-admin",
      label: t("sportsAdmin.menuGroup"),
      icon: <Betting />,
      children: [
        {
          key: "/sports-admin/odds",
          label: t("sportsAdmin.oddsMenu"),
          menuNo: 60,
        },
        {
          key: "/sports-admin/limits",
          label: t("sportsAdmin.limitsMenu"),
          menuNo: 61,
        },
        {
          key: "/sports-admin/combo-rules",
          label: t("sportsAdmin.comboRulesMenu"),
          menuNo: 62,
        },
      ],
    },
    // Partner Management — read-only distributor tree + downline deposit/withdrawal/earnings view
    // (client request #13). Separate from the legacy "Agent" module below (still hidden).
    {
      key: "partner-management",
      label: t("sidemenu.partnerManagement"),
      icon: <Partner />,
      children: [
        {
          key: "/partner-management",
          label: t("sidemenu.partnerManagement"),
          menuNo: 67,
        },
      ],
    },
    // Agent
    // {
    //   key: "agent",
    //   label: t("sidemenu.sm007"),
    //   icon: <Agent />,
    //   children: [
    //     {
    //       key: "/agent/table",
    //       label: t("sidemenu.agentList"),
    //       menuNo: 26,
    //     },
    //     {
    //       key: "/agent?agent_id=1&key=1",
    //       basePath: "/agent",
    //       label: t("sidemenu.sm008"),
    //       menuNo: 27,
    //     },
    //     {
    //       key: `/agent/withdraw?${stringify({
    //         dateRange: [
    //           dayjs().startOf("month").format(),
    //           dayjs().endOf("month").format(),
    //         ],
    //       })}`,
    //       label: t("sidemenu.commissionManagement"),
    //       basePath: "/agent/withdraw",
    //       menuNo: 28,
    //     },
    //     {
    //       key: "/statistic/agent",
    //       label: t("sidemenu.sm003"),
    //       menuNo: 29,
    //     },
    //     {
    //       key: "/statistic/agent-period",
    //       label: t("sidemenu.agentPeriodStats"),
    //       menuNo: 30,
    //     },
    //     {
    //       key: `/agent/balance-log?${stringify({
    //         dateRangeM: [
    //           dayjs().tz().startOf("month").format(),
    //           dayjs().tz().endOf("month").format(),
    //         ],
    //       })}`,
    //       basePath: "/agent/balance-log",
    //       label: t("sidemenu.sm061"),
    //       menuNo: 31,
    //     },
    //   ],
    // },
    // Sports
    // {
    //   key: "sports",
    //   label: t("스포츠 관리"),
    //   icon: <Betting />,

    // },
    // MINI GAME
    // {
    //   key: "mini",
    //   label: t("미니게임 관리"),
    //   icon: <Betting />,
    //   children: [
    //     {
    //       key: "/mini/config",
    //       label: t("미니게임 게임 설정"),
    //     },
    //     {
    //       key: "/mini/bet-type",
    //       label: t("미니게임 베팅 설정"),
    //     },
    //   ],
    // },

    // // Event
    // {
    //   key: "event",
    //   label: t("sidemenu.sm064"),
    //   icon: <Event />,
    //   children: [
    //     {
    //       key: "/event/mission-event-list",
    //       label: t("sidemenu.sm065"),
    //     },
    //     {
    //       key: "/event/daily-mission-group-setting",
    //       label: t("sidemenu.sm066"),
    //     },
    //     {
    //       key: "/event/mission-coupon-setting/mission",
    //       label: t("sidemenu.sm070"),
    //     },
    //     {
    //       key: "/event/mission-coupon-setting/coupon",
    //       label: t("sidemenu.sm071"),
    //     },
    //   ],
    // },
    // Promotion
    {
      key: "promotion",
      label: t("sidemenu.sm015"),
      icon: <Promotion />,
      children: [
        {
          key: "coupon",
          icon: <Coupon />,
          label: t("sidemenu.coupon"),
          children: [
            {
              key: "/promotion/coupon-name",
              label: t("sidemenu.sm052"),
              menuNo: 32,
            },
            {
              key: "/promotion/coupon",
              label: t("sidemenu.sm053"),
              menuNo: 33,
            },
            {
              key: "/promotion/coupon-application",
              label: t("sidemenu.sm060"),
              menuNo: 34,
            },
          ],
        },
        {
          key: "deposit-bonus",
          icon: <Bonus />,
          label: t("sidemenu.depositBonusGroup"),
          children: [
            // {
            //   key: "/promotion",
            //   label: t("sidemenu.sm016"),
            // },
            {
              key: "/promotion/deposit-bonus-v2",
              label: t("sidemenu.sm016"),
              menuNo: 35,
            },
            {
              key: "/promotion/deposit-bonus-log",
              label: t("sidemenu.sm043"),
              menuNo: 36,
            },
          ],
        },
        {
          key: "payback",
          icon: <Payback />,
          label: t("sidemenu.payback"),
          children: [
            {
              key: "/promotion/payback",
              label: t("sidemenu.sm019"),
              menuNo: 37,
            },
            {
              key: "/promotion/payback-log",
              label: t("sidemenu.sm044"),
              menuNo: 38,
            },
          ],
        },
        {
          key: "recommendation",
          icon: <Referral />,
          label: t("sidemenu.referralGroup"),
          children: [
            {
              key: "/promotion/referral",
              label: t("sidemenu.sm024"),
              menuNo: 39,
            },
            {
              key: "/promotion/referral-payout",
              label: t("sidemenu.sm074"),
              menuNo: 59,
            },
            {
              key: "/promotion/referral-log",
              label: t("sidemenu.sm057"),
              menuNo: 40,
            },
          ],
        },
        // Daily attendance check (출석체크) — client request #19. Rewards
        // grid + settings on one screen; the claim log is separate, same
        // split as deposit-bonus / deposit-bonus-log above.
        {
          key: "attendance",
          icon: <Bonus />,
          label: t("sidemenu.attendanceGroup"),
          children: [
            {
              key: "/promotion/attendance",
              label: t("sidemenu.attendanceSettings"),
              menuNo: 69,
            },
            {
              key: "/promotion/attendance-log",
              label: t("sidemenu.attendanceLog"),
              menuNo: 70,
            },
          ],
        },
        // High-stakes bet alert (고액배팅) — client requests #20 / #20-1.
        // Threshold grid + history live on one page (tabs), unlike
        // attendance's split — see HighStakes.tsx.
        {
          key: "high-stakes",
          icon: <Betting />,
          label: t("sidemenu.highStakesGroup"),
          children: [
            {
              key: "/promotion/high-stakes",
              label: t("sidemenu.highStakes"),
              menuNo: 71,
            },
          ],
        },
        // {
        //   key: "mission-group",
        //   icon: <Mission />,
        //   label: t("sidemenu.missionGroup"),
        //   children: [
        //     {
        //       key: "/event/mission-event-list",
        //       label: t("sidemenu.sm065"),
        //     },
        //     {
        //       key: "/event/daily-mission-group-setting",
        //       label: t("sidemenu.sm066"),
        //     },
        //     {
        //       key: "/event/mission-coupon-setting/mission",
        //       label: t("sidemenu.sm070"),
        //     },
        //     {
        //       key: "/event/mission-coupon-setting/coupon",
        //       label: t("sidemenu.sm071"),
        //     },
        //   ],
        // },
        // {
        //   key: "/promotion/lucky-wheel",
        //   label: t("sidemenu.luckyWheelSettings"),
        // },
        // {
        //   key: "/promotion/coupon-log",
        //   label: t("sidemenu.sm034"),
        // },
      ],
    },
    // System Setting
    {
      key: "system",
      label: t("sidemenu.sm020"),
      icon: <System />,
      children: [
        // {
        //   key: "/system/daily-mission",
        //   label: t("sidemenu.sm062"),
        // },
        {
          key: "/system/grade-settings",
          label: t("sidemenu.gradeSettings"),
          menuNo: 41,
        },
        {
          key: "/system/rolling-settings",
          label: t("sidemenu.rollingDeductionSettings"),
          menuNo: 42,
        },
        {
          key: "/system/level",
          label: t("sidemenu.sm021"),
          menuNo: 43,
        },
        // {
        //   key: "/system/level-account",
        //   label: t("sidemenu.sm042"),
        // },
        {
          key: "/system/message",
          label: t("sidemenu.sm022"),
          menuNo: 44,
        },
        {
          key: "/system/message-template",
          label: t("sidemenu.sm073"),
          menuNo: 45,
        },
        {
          key: "/system/banner",
          label: t("sidemenu.sm023"),
          menuNo: 46,
        },
        {
          key: "/system/event",
          label: t("sidemenu.sm035"),
          menuNo: 47,
        },
        {
          key: "/system/notice",
          label: t("sidemenu.sm038"),
          menuNo: 48,
        },
        {
          key: "/system/inquiry",
          label: t("sidemenu.inquiryManagement"),
          menuNo: 57,
        },
        {
          key: "/system/inquiry-templates",
          label: t("sidemenu.inquiryTemplateManagement"),
          menuNo: 63,
        },
        {
          key: "/system/transaction-rules",
          label: t("sidemenu.transactionRules"),
          menuNo: 64,
        },
        {
          key: "/system/transaction-rules/preview",
          label: t("sidemenu.transactionRulesPreview"),
          menuNo: 65,
        },
        {
          key: "/system/bonus-policy",
          label: t("sidemenu.bonusPolicy"),
          menuNo: 66,
        },
        {
          // Lands on a category tab that still exists — lobbies for
          // switched-off products are filtered out of GameCategoryBtn.
          key: `/system/maintenance?game_category=${maintenanceCategory}`,
          basePath: "/system/maintenance",
          label: t("sidemenu.sm041"),
          menuNo: 49,
        },
        {
          key: "/system/site-settings",
          label: t("sidemenu.siteSettings"),
          menuNo: 50,
        },
        {
          key: "/system/site-maintenance",
          label: t("sidemenu.siteMaintenance"),
          menuNo: 68,
        },
        {
          key: "/system/site-profile",
          label: t("sidemenu.siteProfile"),
          menuNo: 72,
        },
        // {
        //   key: "game-settings",
        //   icon: <GameSettings width={14} />,
        //   label: t("게임설정"),
        //   children: [
        //     {
        //       key: "domestic-sports",
        //       label: t("국내스포츠"),
        //       children: [
        //         {
        //           key: `/sports/match?${stringify({
        //             dateRange: [
        //               dayjs().tz().startOf("day").format(),
        //               dayjs().tz().endOf("day").format(),
        //             ],
        //           })}`,
        //           basePath: "/sports/match",
        //           label: t("스포츠 경기 관리"),
        //         },
        //         {
        //           key: "/sports/config",
        //           label: t("스포츠 게임 설정"),
        //         },
        //         {
        //           key: "/sports/config/rate",
        //           label: t("스포츠 환수율 설정"),
        //         },
        //         {
        //           key: "/sports/combine",
        //           label: t("스포츠 조합 설정"),
        //         },
        //         {
        //           key: "/sports/market",
        //           label: t("스포츠 마켓 설정"),
        //         },
        //         {
        //           key: "/sports/bonus",
        //           label: t("스포츠 보너스 설정"),
        //         },
        //       ],
        //     },
        //     {
        //       key: "mini",
        //       label: t("미니게임"),
        //       children: [
        //         {
        //           key: "/mini/config",
        //           label: t("미니게임 설정"),
        //         },
        //         {
        //           key: "/mini/bet-type",
        //           label: t("미니게임 베팅설정"),
        //         },
        //       ],
        //     },
        //     // VR GAME
        //     {
        //       key: "vr",
        //       label: t("가상게임 관리"),
        //       children: [
        //         {
        //           key: "/vr/config/sports",
        //           label: t("가상게임 종목 설정"),
        //         },
        //         {
        //           key: "/vr/league",
        //           label: t("가상게임 리그 설정"),
        //         },
        //         {
        //           key: "/vr/config",
        //           label: t("가상게임 게임 설정"),
        //         },
        //         {
        //           key: "/vr/config/rate",
        //           label: t("가상게임 환수율 설정"),
        //         },
        //         {
        //           key: "/vr/combine",
        //           label: t("가상게임 조합 설정"),
        //         },
        //         {
        //           key: "/vr/market",
        //           label: t("가상게임 마켓 설정"),
        //         },
        //         {
        //           key: "/vr/bonus",
        //           label: t("가상게임 보너스 설정"),
        //         },
        //       ],
        //     },
        //   ],
        // },
        {
          key: "/system/hero-management",
          label: t("sidemenu.heroImageSettings"),
          menuNo: 51,
        },
        // Hidden 2026-08-27: create/edit UI (button, filter, content preview)
        // was already disabled here, leaving a page that can't add or show
        // content — see CS_REPLY_TEMPLATES task list item #5. User-facing
        // links to the sport/betting regulation pages this feeds are hidden
        // too (rp-user-front). Route stays registered.
        // {
        //   key: "/system/regulation",
        //   label: t("sidemenu.regulationManagement"),
        //   menuNo: 52,
        // },
        // {
        //   key: "stream-community",
        //   icon: <LiveStream width={20} />,
        //   label: t("클럽관리"),
        //   children: [
        //     {
        //       key: "/stream/matches",
        //       label: t("col.streamingList"),
        //     },
        //     {
        //       key: "/stream/leagues",
        //       label: t("col.leagueManagement"),
        //     },
        //     {
        //       key: "/stream/categories",
        //       label: t("col.sportManagement"),
        //     },
        //     {
        //       key: "/stream/events",
        //       label: t("col.event2"),
        //     },
        //     // {
        //     //   key: "chat-settings",
        //     //   label: t("채팅설정"),
        //     //   children: [
        //     //     {
        //     //       key: "/stream/chat-settings",
        //     //       label: t("채팅설정"),
        //     //     },
        //     //     {
        //     //       key: "/stream/chat-user-list",
        //     //       label: t("채팅유저리스트"),
        //     //     },
        //     //   ]
        //     // },
        //     // {
        //     //   key: "/stream/chat-settings",
        //     //   label: t("col.chatBannedWordSettings"),
        //     // },
        //     {
        //       key: "/stream/chat-user-list",
        //       label: t("채팅설정"),
        //     },
        //   ],
        // },
      ],
    },
    // Admin Authority
    {
      key: "admin",
      label: t("sidemenu.sm025"),
      icon: <Admin />,
      children: [
        {
          key: "/admin/block-ip",
          label: t("sidemenu.sm046"),
          menuNo: 53,
        },
        // {
        //   key: "/admin/phone-log",
        //   label: t("sidemenu.sm027"),
        // },
        {
          key: "/admin/login-log",
          label: t("sidemenu.sm028"),
          menuNo: 54,
        },
        {
          key: "/admin/sessions",
          label: t("sidemenu.sessionManagement"),
          menuNo: 58,
        },
        {
          key: "/admin/accounts",
          label: t("sidemenu.adminAccounts"),
          menuNo: 73,
        },
        {
          key: "/admin/accounts/audit",
          label: t("sidemenu.adminAccountsAudit"),
          menuNo: 74,
        },
      ],
    },
  ];

  // Hiding is not access control — endpoints still answer. This is only
  // about not showing an operator a product they don't sell.
  // Group keys and child paths mixed in one set — children are matched on
  // basePath where they have one, since their key carries a query string.
  const hiddenKeys = new Set<string>();
  if (hideSportsMenus) {
    hiddenKeys.add("sports-admin");
    // ITF 경기/배당 목록 lives under 배팅 관리, not the sports group.
    hiddenKeys.add("/betting/sport-games");
  }
  if (hideSpecialMenus) hiddenKeys.add("special-games");
  if (hideAdminAccountMenus) {
    hiddenKeys.add("/admin/accounts");
    hiddenKeys.add("/admin/accounts/audit");
  }
  if (!hiddenKeys.size) return items;

  return items
    .filter((item) => !hiddenKeys.has(item.key))
    .map((item) => ({
      ...item,
      children: item.children.filter((child) => !hiddenKeys.has(child.basePath ?? child.key)),
    }));
};

export default useMenu;

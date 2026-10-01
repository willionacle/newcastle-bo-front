import i18next from "@/i18n/i18n";
import {
  Button,
  // Checkbox,
  // Col,
  Flex,
  Form,
  List,
  Modal,
  notification,
  // Row,
} from "antd";
import { useTranslation } from "react-i18next";
import { itemStyle, listItemStyle, listStyle } from "./UserInfoStyle";
import DateText from "@/components/DateText";
import UserStatusSelector from "@/components/UserStatusSelector";
import SaveBtn from "@/components/SaveBtn";
import { useEffect, useState } from "react";
import { depositAccountAPI, DepositAccountResponse } from "@/api/deposit-account/get";
import AdminAdjustment from "./AdminAdjustment";
import Coupon from "./Coupon";
// import { getEvoMoneyAPI, getPPMoneyAPI } from "@/api/transfer/get";
import { ResUser } from "@/api/types";
import { resetLoginAttemptsAPI, updateUserStatusAPI } from "@/api/users/patch";
import PhoneButton from "@/components/PhoneButton";
import { GF } from "@/utils/GlobalFunctions";
import { levelConfingAPI } from "@/api/level-configs/get";
import UserRollingPointType from "./components/UserRollingPointType";
import UserLossingPointType from "./components/UserLossingPointType";
import UserRollingSettings from "./components/UserRollingSetting";
// import CommaNumber from "@/components/CommaNumber";
import UserLuckyWheelForm from "./components/UserLuckyWheelForm";
import SubsCheckBoxForm from "./components/SubsCheckBoxForm";
// import UserBdayForm from "./components/UserBdayForm";
import UserBirthdayForm from "./components/UserBirthdayForm";
import { Link } from "react-router-dom";
import ForceWithdrawToggle from "./components/ForceWithdrawToggle";
import { ImpersonateButton, SetPasswordButton } from "./components/MemberSessionActions";
import GlobalForcedWithdrawalOff from "./components/GlobalForcedWithdrawalOff";
// import FormItem from "antd/es/form/FormItem";
// import { changePassword } from "@/api/users/post";

interface Props {
  data: ResUser["data"] | undefined;
  loading: boolean;
  mutate: any;
}

export const pointTypeLabels: Record<string, string> = {
  LEVEL: i18next.t("user.levelBasedSetting"),
  OFF: i18next.t("user.noPayment"),
  INDIVIDUAL: i18next.t("user.individualSetting"),
};

const UserInfo = ({ data, loading, mutate }: Props) => {
  const { t } = useTranslation();
  const {
    username = "",
    balance,
    user_level,
    rolling_point,
    created_at = "",
    agent_username,
    // phone_number,
    user_status,
    user_real_name,
    lossing_point,
    // referral,
    referral_point,
    coupon_total,
    referral_total,
    sports_waiting,
    subs_kakao,
    subs_tele,
    ref_id,
    ref_username,
    ref_user_real_name
  } = data ?? {};
  // const ppMoney = getPPMoneyAPI(username);
  const { swr: levelConfig } = levelConfingAPI();

  const [form] = Form.useForm<{
    user_status: ResUser["data"]["user_status"];
  }>();
  const [isModalOpen, setIsModalOpen] = useState("");
  const [isCouponOpen, setIsCouponOpen] = useState(false);
  const [isLuckyOpen, setIsLuckyOpen] = useState(false);
  const [depositMethodData, setDepositMethodData] = useState<DepositAccountResponse | null>(null);

  const handleSubmit = async (e: {
    user_status: ResUser["data"]["user_status"];
  }) => {
    try {
      if (data?.username) {
        const res = await updateUserStatusAPI({
          username: data.username,
          user_status: e.user_status,
        });

        if (res.code === 0) {
          notification.success({
            message: res.message || i18next.t("toast.common.statusChangeSuccess"),
          });
        } else if (res.code === 404) {
          notification.error({
            message: res.message || i18next.t("user.userNotFound"),
          });
        } else {
          notification.error({
            message: res.message || i18next.t("toast.common.statusChangeFailed"),
          });
        }
      }
    } catch (error) {
      notification.error({
        message: i18next.t("toast.common.statusChangeFailed"),
      });
    } finally {
      mutate();
    }
  };

  const handleResetLoginAttempts = async () => {
    if (!data?.username) return;
    try {
      const res = await resetLoginAttemptsAPI(data.username);
      if (res.code === 0) {
        notification.success({
          message: t("toast.user.resetSuccess"),
        });
        mutate();
      } else {
        notification.error({
          message: res.message || t("toast.user.resetFailed"),
        });
      }
    } catch (error) {
      notification.error({
        message: t("toast.user.resetFailed"),
      });
    }
  };

  // const handleChangePw = async (e: { password: string }) => {
  //   if (decode_password) {
  //     try {
  //       if (
  //         await changePassword({
  //           newPassword: e.password,
  //           username,
  //         })
  //       ) {
  //         notification.success({ message: "비밀번호 변경 성공" });
  //         mutate();
  //       }
  //     } catch (error) {
  //       notification.error({ message: "비밀번호 변경 실패" });
  //     }
  //   }
  // };

  useEffect(() => {
    if (data) {
      form.setFieldsValue({ user_status: data.user_status });
    }
  }, [data]);

  // Fetch deposit accounts data
  useEffect(() => {
    const fetchDepositAccounts = async () => {
      if (data?.username) {
        const result = await depositAccountAPI(data.username);
        setDepositMethodData(result);
      }
    };
    
    fetchDepositAccounts();
  }, [data?.username]);

  const dataSource = [
    { // left 1
      key: "username",
      title: t("memberDetail.mis002"),
      value: username,
    },
    { // right 1
      key: "balance",
      title: t("memberDetail.mis014"),
      value: (
        <Flex align="center">
          <div style={{ flex: 1 }}>
            {balance ? balance.toLocaleString() : "-"}
          </div>

          <Button
            className="user-button alt"
            size="small"
            style={{
              marginLeft: "0.3rem",
            }}
            onClick={() => setIsModalOpen("balance")}
          >
            증감
          </Button>
        </Flex>
      ),
    },
    { // left 2
      key: "user_real_name",
      title: t("memberDetail.mis016"),
      value: user_real_name ? user_real_name : "-",
    },

   
    { // right 4
      key: "sports",
      title: t("col.sportsPending"),
      value: sports_waiting ? (sports_waiting ?? 0).toLocaleString() : "-",
    },

    { // left 3
      key: "birthday",
      title: t("col.birthday"),
       value: <UserBirthdayForm birthday={data?.birthday || ""} username={username} mutate={mutate} />,
    },

    { // left 3
      key: "forced_withdrawal",
      title: (
        <Flex justify="space-between" align="center">
          {t("col.forcedWithdrawal")}
          <GlobalForcedWithdrawalOff mutate={mutate} />
        </Flex>
      ),
      value: <ForceWithdrawToggle checked={data?.isAllowedForcedWithdrawal === 1} username={username} mutate={mutate} data={data}/>,
    },
    
    // { // right 3
    //   key: "pp",
    //   title: t("프레그마틱"),
    //   value: ppMoney.data
    //     ? (ppMoney.data.data ? ppMoney.data.data.balance : 0).toLocaleString()
    //     : "-",
    // },
    { // left 4
      key: "user_status",
      title: t("col.status"),
      value: (
        <Form
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "0.25rem",
          }}
          onFinish={handleSubmit}
          form={form}
        >
          <UserStatusSelector initialValue={user_status} noLabel small />
          <SaveBtn className="user-button alt" size="small" />
        </Form>
      ),
    },
    { // right 5
      key: "rolling_point",
      title: t("memberDetail.mis015"),
      value: (
        <Flex align="center">
          <div style={{ flex: 1 }}>
            {rolling_point ? rolling_point.toLocaleString() : "-"}
          </div>
          <Button
            className="user-button alt"
            size="small"
            style={{
              marginLeft: "0.3rem",
            }}
            onClick={() => setIsModalOpen("rolling")}
          >
            증감
          </Button>
        </Flex>
      ),
    },

    
    { // left 5
      key: "level",
      title: t("memberDetail.mis003"), // 레벨
      value: user_level ? user_level : "-",
    },

    { // right 6
      key: "lossing_point",
      title: t("col.paybackPoint"),
      value: (
        <Flex>
          <div style={{ flex: 1 }}>
            {lossing_point ? lossing_point.toLocaleString() : "-"}
          </div>
          <Button
            className="user-button alt"
            size="small"
            style={{
              marginLeft: "0.3rem",
            }}
            onClick={() => setIsModalOpen("lossing")}
          >
            증감
          </Button>
        </Flex>
      ),
    },
    
    
    { // left 6
      key: "grade",
      title: t("col.grade"),
      value: GF.getGradeDisplay({
        userGrade: data?.user_grade ?? null,
        userGradeDay: data?.user_grade_day ?? null,
        localGradeConfig: data?.local_grade_config,
        isRecentDeposit: data?.last_deposit_date
          ? (Date.now() - new Date(data.last_deposit_date
            .replace("T", " ")
            .replace("Z", "")
            .split(".")?.[0])
            .getTime()) / (1000 * 60 * 60 * 24) <= 30
          : false,
      }),
    },

    { // right 7
      key: "referral_point",
      title: t("col.referralPoint"),
      value: referral_point ? referral_point?.toLocaleString() : 0,
    },
    

    { // left 7 — plaintext password is gone from the platform
      // (PASSWORD_RESET_AND_IMPERSONATION_FRONTEND_INTEGRATION.md §1);
      // the row now holds the two endpoints that replaced it.
      key: "pw",
      title: t("col.password"),
      value: (
        <Flex align="center" gap="0.3rem" wrap="wrap">
          <SetPasswordButton username={username || undefined} />
          <ImpersonateButton username={username || undefined} />
        </Flex>
      ),
    },

    { // right 8
      key: "coupon_total",
      title: t("col.availableCoupon"),
      value: (
        <Flex align="center">
          <div style={{ flex: 1 }}>
            {coupon_total ? coupon_total.toLocaleString() : 0}
          </div>
          <Button
            className="user-button alt"
            size="small"
            style={{
              marginLeft: "0.3rem",
            }}
            onClick={() => setIsCouponOpen(true)}
          >
            {i18next.t("moneyType.pay")}
          </Button>
        </Flex>
      ),
    },
    
    
    { // left 7a
      key: "telcode",
      title: t("col.carrier"),
      value: data?.telcode ?? "-",
    },

    // { // right 9
    //   key: "luckywheel_coupon",
    //   title: t("col.luckyWheelCoupon"),
    //   value: (
    //     <Flex align="center">
    //       <div style={{ flex: 1 }}>
    //         <CommaNumber value={data?.luckywheel_coupon} />
    //       </div>
    //       <Button
    //         className="user-button alt"
    //         size="small"
    //         style={{
    //           marginLeft: "0.3rem",
    //         }}
    //         onClick={() => setIsLuckyOpen(true)}
    //       >
    //         {i18next.t("moneyType.pay")}
    //       </Button>
    //     </Flex>
    //   ),
    // },
    

     { // left 8
      key: "phone",
      title: t("memberDetail.mis017"),
      // value: phone_number,
      value: (
        <div style={{ display: "flex", alignItems: "center" }}>
          <PhoneButton
            className="user-button alt"
            style={{ marginTop: 6 }}
            data={{ username }}
          />
        </div>
      ),
    },

    { // right 10
      key: "paymentMethod",
      title: t("col.depositType"),
      value: depositMethodData?.data?.map((item: any) => {
        if (item.inUse)
          return <span style={{ marginRight: "0.3rem" }}>{item.title}</span>;
      }),
    },
    
    
    { // right 11
      key: "created_at",
      title: t("memberDetail.mis023"),
      value: <DateText date={created_at} timeStamp />,
    },

    { // left 9
      key: "subs_kakao",
      title: t("col.subscribeFollow"),
      value: <SubsCheckBoxForm types={{kakao:subs_kakao ?? 0,telegram:subs_tele ?? 0}} username={data?.username}/>,
    },

    {
      key: "ref_id",
      title: t("col.upperReferrer"),
      value: ref_id ?<Link to={`/user/${ref_id}`}>{ref_username ?? "-"} {ref_user_real_name ?? "-"}</Link> :"-",
    },

    { // left 10
      key: "depositAccount",
      title: t("col.withdrawalAccountInfo"),
      value: `${data?.bank_name} ${data?.account_number}`,
    },

    { // right 12
      key: "rolling_point_type",
      title: t("memberDetail.mis139"), // 롤링포인트설정
      value: (
        <UserRollingPointType
          levelConfig={levelConfig.data ? levelConfig.data.data : []}
          rollingPointType={data?.rolling_point_type}
          userLevel={user_level}
        />
      ),
    },

    { // left 11
      key: "usdtAccount",
      title: t("col.usdtWalletAddress"),
      value: data?.wallet_address ?? "-",
    },

    
    // {
    //   key: "topAgent",
    //   title: t("memberDetail.mis025"),
    //   value: "-",
    // },

    { // right 13
      key: "referral_total",
      title: t("col.totalReferrers"),
      value: (
        <div style={{ flex: 1 }}>
          {referral_total ? referral_total.toLocaleString() : 0}
        </div>
      ),
    },

    { // left 12
      key: "agent",
      title: t("memberDetail.mis026"),
      value: agent_username ? agent_username : "-",
    },
    

    { // right 14
      key: "lossing_pointType",
      title: t("col.paybackPointSetting"), // Payback point setting
      value: (
        <UserLossingPointType
          levelConfig={levelConfig.data ? levelConfig.data.data : []}
          data={data}
          userLevel={user_level}
        />
      ),
    },

    { // left 13
      key: "totaldeposit",
      title: t("col.totalDeposit"),
      value: data?.deposit_total ? data?.deposit_total.toLocaleString() : 0,
    },
  

    { // right 15
      key: "leveltype",
      title: t("col.levelUpSetting"),
      value: data?.level_type == "AUTO" ? i18next.t("user.autoLevelUp") : i18next.t("user.manualLevelUp"),
    },

     { // left 14
      key: "totalwithdraw",
      title: t("col.totalWithdrawal"),
      value: data?.withdrawal_total
        ? data?.withdrawal_total.toLocaleString()
        : 0,
    },

    { // right 16
      key: "rollingdeductionsetting",
      title: t("col.appLoginHistory"),
      value: data?.has_app_login ? "O" : "X",
    },

    { // left 15
      key: "totalbet",
      title: t("col.totalBetAmount"),
      value: (
        (data?.initial_bet_total ?? 0) + (data?.bet_total ?? 0)
      ).toLocaleString(),
    },

    {
      key: "rollingdeductionsetting",
      title: t("col.rollingDeductionSetting"),
      value: <UserRollingSettings data={data} />,
    },

    {
      key: "failed_login_attempts",
      title: t("col.failedLoginAttempts"),
      value: (
        <Flex align="center">
          <div style={{ flex: 1 }}>
            {data?.failed_login_attempts ?? 0}
            {(data?.failed_login_attempts ?? 0) >= 3 && (
              <span style={{ color: "red", marginLeft: 8, fontWeight: "bold" }}>LOCKED</span>
            )}
          </div>
          <Button
            className="user-button alt"
            size="small"
            danger
            style={{ marginLeft: "0.3rem" }}
            onClick={handleResetLoginAttempts}
            disabled={(data?.failed_login_attempts ?? 0) === 0}
          >
            {t("user.resetLoginAttempts")}
          </Button>
        </Flex>
      ),
    },
  ];

  return (
    <>
      <Modal
        open={isModalOpen !== ""}
        title={i18next.t("memberDetail.mis032")}
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
        centered
        destroyOnClose
        onCancel={() => setIsModalOpen("")}
      >
        <AdminAdjustment type={isModalOpen} data={data} mutate={mutate} />
      </Modal>

      <Modal
        open={isCouponOpen}
        title={i18next.t("memberDetail.mis091")}
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
        centered
        destroyOnClose
        onCancel={() => setIsCouponOpen(false)}
      >
        <Coupon data={data} mutate={mutate} />
      </Modal>
      <Modal
        open={isLuckyOpen}
        title={i18next.t("title.luckyWheelCouponIssue")}
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
        centered
        destroyOnClose
        onCancel={() => setIsLuckyOpen(false)}
      >
        <UserLuckyWheelForm data={data} mutate={mutate} />
      </Modal>
      <List
        loading={loading}
        style={listStyle}
        grid={{ column: 2, gutter: 0 }}
        dataSource={dataSource}
        renderItem={(item) => (
          <List.Item style={listItemStyle}>
            <div style={itemStyle(true)}>{item.title}</div>
            <div style={itemStyle()}>{item.value}</div>
          </List.Item>
        )}
      />
    </>
  );
};

export default UserInfo;

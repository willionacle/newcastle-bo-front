import i18next from "@/i18n/i18n";
import { Button, Card, Col, Flex, Form, Grid, Input, Layout, Row } from "antd";
import {
  headerCardStyle,
  headerMoreBtn,
  headerMoreControls,
  headerStatGroup,
  headerStyle,
} from "./HeaderStyle";
// import HeaderItem1 from "./HeaderItem1";
import HeaderItem3 from "./HeaderItem3";
import HeaderItem4 from "./HeaderItem4";
import HeaderItem5 from "./HeaderItem5";
import { RecentTrans, StatsDataType, SWRRes } from "@/api/cs-statics/totalStatics";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import NavClickable from "@/components/NavClickable";
import { stringify } from "qs";
import dayjs from "dayjs";
import USDTExchangeRate from "./USDTExchangeRate";
import UserIcon from "@/assets/img/icons/account-circle-outline.svg?react";
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import HeaderItem3a from "./HeaderItem3a";
import HeaderItem3b from "./HeaderItem3b";
import HeaderItem3c from "./HeaderItem3c";
import { socket } from "@/api/socket";
import { Howl } from "howler";
import notifSound from "@/assets/audio/notifSound.mp3";
import SoundToggle from "./SoundToggle";
import { notification } from "antd";
import useHighStakesAlerts from "@/hooks/useHighStakesAlerts";
import HeaderHighStakes from "./HeaderHighStakes";
import { proofReportSummaryAPI } from "@/api/proof-reports/get";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface NewInquiryPayload {
  inquiry: { id: number; username: string; category: string; title: string; createdAt: string };
  pendingCount: number;
}

const Header = ({ open, setOpen }: Props) => {
  const [data, setData] = useState<StatsDataType | null>(null);
  const [recentTrans, setRecentTrans] = useState<RecentTrans | undefined>(undefined);
  const [pendingInquiryCount, setPendingInquiryCount] = useState(0);
  const navigate = useNavigate();
  const soundRef = useRef<Howl | null>(null);
  const { unseenCount: highStakesCount, resetUnseen: resetHighStakesCount } = useHighStakesAlerts();
  const isMobile = !(Grid.useBreakpoint().md ?? true);
  // 거래 보고(ezvoucher). 나머지 상단바 수치와 달리 소켓 푸시가 아니라 REST 폴링이다.
  const { summary: proofSummary } = proofReportSummaryAPI();

  const stopSound = () => {
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current = null;
    }
  };

  useEffect(() => {
    const handleFetchTopBar = (payload: unknown) => {
      const { data: res } = payload as { data: SWRRes };
      const { code, data, data2 } = res;
      if (code === 0) {
        setData(data);
        setRecentTrans(data2);
      }
    };

    socket.on("fetchTopBar", handleFetchTopBar);
    socket.emit("topBarStatisticsOnLoad", { message: "TOPBAR SOCKET LOADED" });

    return () => {
      socket.off("fetchTopBar", handleFetchTopBar);
    };
  }, []);

  useEffect(() => {
    const handleInquiryCount = (payload: { pendingCount: number }) => {
      setPendingInquiryCount(payload?.pendingCount ?? 0);
    };

    const handleNewInquiry = (payload: NewInquiryPayload) => {
      setPendingInquiryCount(payload?.pendingCount ?? 0);
      notification.info({
        message: i18next.t("topNavi.tn041"),
        description: `${payload.inquiry.username} · ${payload.inquiry.title}`,
        onClick: () => navigate("/system/inquiry"),
      });
    };

    socket.on("inquiryCount", handleInquiryCount);
    socket.on("newInquiry", handleNewInquiry);
    socket.emit("inquiryCountOnLoad");

    return () => {
      socket.off("inquiryCount", handleInquiryCount);
      socket.off("newInquiry", handleNewInquiry);
    };
  }, [navigate]);

  useEffect(() => {
    const depositApplied = data?.deposit_applied || 0;
    const withdrawApplied = data?.withdraw_applied || 0;
    const userUnverified = data?.user_unverified || 0;
    const couponApplied = data?.coupon_applied || 0;
    const manualMission = data?.manual_mission || 0;
    const highValueUser = data?.high_value_user || 0;

    const shouldPlaySound =
      depositApplied > 0 ||
      withdrawApplied > 0 ||
      userUnverified > 0 ||
      couponApplied > 0 ||
      manualMission > 0 ||
      highValueUser > 0 ||
      pendingInquiryCount > 0;

    if (shouldPlaySound) {
      if (!soundRef.current) {
        soundRef.current = new Howl({
          src: [notifSound],
          loop: true,
        });
        soundRef.current.play();
      }
    } else {
      stopSound();
    }
  }, [data, pendingInquiryCount]);

  return (
    <Layout.Header style={headerStyle(open, isMobile)}>
      <Card
        style={headerCardStyle(open)}
        styles={{
          body: {
            padding: '1rem 1rem 0',
            height: '100%',
            // scroll instead of clipping when the dense stat tables exceed the
            // fixed header height / viewport width (e.g. longer en/fil labels)
            overflow: 'auto',
          },
        }}
      >
        {open && (
          <>
            {/* <SimpleBar style={headerCardStyle()} autoHide={false}> */}
              {/* <div style={headerListWrapper}> */}
                {/* wrap on mobile: the no-wrap desktop row assumes ~1000px+
                    of min-width stat panels side by side, which just
                    squeezes/clips on a phone instead of stacking */}
                <Row gutter={[7, 7]} wrap={isMobile}>
                  {/* <Col flex={'auto'} style={{minWidth: 160}}>
                    <HeaderItem1 data={data} loading={data ? false : true} />
                  </Col> */}
                  <Col flex={'auto'}>
                    <HeaderItem3 data={data} loading={data ? false : true} stopSound={stopSound} />
                  </Col>
                  <Col flex={'auto'}>
                    <HeaderItem3c data={recentTrans} total={data?.total_holding} loading={recentTrans ? false : true} />
                  </Col>
                  <Col flex={'auto'}>
                    <HeaderItem3a data={recentTrans} loading={recentTrans ? false : true} />
                  </Col>
                  <Col flex={'auto'}>
                    <HeaderItem3b data={recentTrans} loading={recentTrans ? false : true} />
                  </Col>
                  <Col xs={24} md={12}>
                    <HeaderItem4 loading={data ? false : true} data={data} />
                  </Col>
                  <Col flex={'auto'} style={{minWidth: 250}}>
                    <HeaderItem5 loading={data ? false : true} data={data} />
                  </Col>
                  <Col flex={'auto'}>
                    <HeaderHighStakes count={highStakesCount} onClick={() => { stopSound(); resetHighStakesCount(); }} />
                  </Col>
                </Row>
              {/* </div> */}
            {/* </SimpleBar> */}

            <Flex align="center" gap={4}>
              <div style={{ margin: '8px 0 0', marginLeft: 'auto' }}>
                <SoundToggle />
              </div>
              <Button
                  type="text"
                  size="small"
                  icon={<DownloadOutlined rotate={180} />}
                  style={{
                    borderWidth: 1,
                    borderColor: 'var(--primary)',
                    margin: '8px 0 0',
                    position: 'relative',
                    zIndex: '1'
                  }}
                  onClick={() => {
                    setOpen((oldState) => !oldState);
                    socket.emit("topBarStatistics");
                  }}
                >{i18next.t("sportsScore.close")}</Button>
            </Flex>
          </>
        )}

        {!open && (
          <div style={headerMoreBtn}>
            <div style={headerStatGroup}>
              <NavClickable
                className={(data?.deposit_applied ?? 0) > 0 ? "header-alert-blink" : undefined}
                onBeforeNavigate={stopSound}
                to={`/payment?${stringify({
                  dateRange: [
                    dayjs().tz().startOf("day").format(),
                    dayjs().tz().endOf("day").format(),
                  ],
                  status: 'Applied'
                })}`}
              >
                {i18next.t("topNavi.tn035")} {(data?.deposit_applied ?? 0).toLocaleString()}
              </NavClickable>
              {/* <div
                onClick={(e) => handleTapClick(e, `/payment?${stringify({
                  dateRange: [
                    dayjs().tz().startOf("day").format(),
                    dayjs().tz().endOf("day").format(),
                  ],
                  status: 'Waiting'
                })}`)}
              >
                입금대기 {(data?.deposit_waiting ?? 0).toLocaleString()}
              </div> */}
              <NavClickable
                className={(data?.withdraw_applied ?? 0) > 0 ? "header-alert-blink" : undefined}
                onBeforeNavigate={stopSound}
                to={`/payment/withdraw?${stringify({
                  dateRangeW: [
                    dayjs().tz().startOf("day").format(),
                    dayjs().tz().endOf("day").format(),
                  ],
                  status: 'Applied'
                })}`}
              >
                {i18next.t("topNavi.tn036")} {data?.withdraw_applied ?? 0}
              </NavClickable>
              <NavClickable
                className={(data?.user_unverified ?? 0) > 0 ? "header-alert-blink" : undefined}
                onBeforeNavigate={stopSound}
                to="/user?status=UNVERIFIED"
              >
                {i18next.t("topNavi.tn037")} {data?.user_unverified ?? 0}
              </NavClickable>
              <NavClickable
                onBeforeNavigate={stopSound}
                to={`/promotion/coupon-application?${stringify({
                  status: {label: 'Applied', value: 0, key: 0}
                })}`}
              >
                {i18next.t("topNavi.tn038")} {data?.coupon_applied ?? 0}
              </NavClickable>
              <NavClickable onBeforeNavigate={stopSound} to="/event/mission-event-list">
                {i18next.t("topNavi.tn039")} {(data?.manual_mission ?? 0)}
              </NavClickable>
              <NavClickable
                className={pendingInquiryCount > 0 ? "header-alert-blink" : undefined}
                onBeforeNavigate={stopSound}
                to="/system/inquiry"
              >
                {i18next.t("topNavi.tn041")} {pendingInquiryCount}
              </NavClickable>
              <NavClickable onBeforeNavigate={stopSound} to="/user?is_online=1">{i18next.t("topNavi.tn004")} {(data?.online_users ?? 0).toLocaleString()}</NavClickable>
              <NavClickable onBeforeNavigate={stopSound} to="/user">
                {i18next.t("topNavi.tn040")} {(data?.user_active ?? 0).toLocaleString()}
              </NavClickable>
              {/* <div onClick={(e) => handleTapClick(e, `/user/highvalue?provider_id=evo&columnby=evo_balance&orderby=desc&is_online=1`)}>고액 {(data?.high_value_user ?? 0).toLocaleString()}</div> */}
              <NavClickable onBeforeNavigate={stopSound} to="/user/highvalue?high_value=1&columnby=balance&orderby=desc">{i18next.t("topNavi.tn032")} {(data?.high_value_user ?? 0).toLocaleString()}</NavClickable>
              {/* 고액배팅 (bet-size alert, request 20) -- distinct from tn032 above, which is balance-based */}
              <NavClickable
                className={highStakesCount > 0 ? "header-alert-blink" : undefined}
                onBeforeNavigate={() => { stopSound(); resetHighStakesCount(); }}
                to="/promotion/high-stakes?tab=history"
              >
                {i18next.t("topNavi.highStakes")} {highStakesCount.toLocaleString()}
              </NavClickable>
              {/* 거래 보고 미해결. reportingEnabled=false 인 사이트는 보고 자체를
                  안 하므로 "0건"을 띄우지 않고 아예 감춘다. 점멸은 창 단위인
                  counts.failed 가 아니라 전체 기간 기준 needsAttention 에 묶는다 --
                  지난주 실패도 여전히 벤더에 닿지 않은 돈이다. */}
              {proofSummary?.reportingEnabled && (
                <NavClickable
                  className={proofSummary.needsAttention ? "header-alert-blink" : undefined}
                  onBeforeNavigate={stopSound}
                  to="/payment/proof-reports"
                >
                  {i18next.t("topNavi.proofReports")} {proofSummary.unresolved.toLocaleString()}
                </NavClickable>
              )}

              <Form
                style={{
                  alignItems: "center",
                  display: "flex",
                  width: 272
                }}
                onFinish={(e) => {
                  if (e.username !== "") {
                    navigate("user?username=" + e.username);
                  }
                }}
              >
                <Form.Item noStyle name={"username"} className="custom-input-number" initialValue={""}>
                  <Input className="custom-input-number" addonBefore={<UserIcon height={16} fill="#aaa" />} size="small" />
                </Form.Item>
                <Button icon={<SearchOutlined />} htmlType="submit" size='small' style={{
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  }}>{i18next.t("global.search")}</Button>
              </Form>
            </div>

            <div style={headerMoreControls}>
              <USDTExchangeRate />
              <div style={{ display: 'flex', alignItems: 'center', margin: 'auto 8px' }}>
                <SoundToggle />
              </div>
              <Button
                type="text"
                size="small"
                icon={<DownloadOutlined />}
                style={{
                  borderWidth: 1,
                  borderColor: 'var(--primary)',
                  margin: 'auto 0'
                }}
                onClick={() => {
                  setOpen((oldState) => !oldState);
                  socket.emit("topBarStatistics");
                }}
              >{i18next.t("header.open")}</Button>
            </div>
          </div>
        )}
      </Card>
    </Layout.Header>
  );
};

export default Header;

import { Button, Divider, Flex, Modal, Tabs, Tag, Tooltip } from "antd";
import i18next from "@/i18n/i18n";
import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import useGetItemData from "@/hooks/useGetItemData";
import dayjs from "dayjs";
import { parse, stringify } from "qs";
// import DepositLog from "@/pages/user/Tabs/depositLog/DepositLog";
import MoneyInfo from "./detail/moneyinfo/MoneyInfo";
// import UserGameBalance from "@/pages/user/Tabs/gameBalance/UserInfo";
import MoneyLog from "@/pages/user/Tabs/moneyLog/MoneyLog";
import { withdrawalBetSummaryAPI } from "@/api/withdrawal-detail/post";
import { ResUser } from "@/api/types";
import { WithdrawalLogData } from "@/api/withdrawal-logs/get";
import AdminAdjustment from "@/pages/user/Tabs/infomation/AdminAdjustment";
import UserGradeDisplay from "@/components/UserGradeDisplay";
import { useTranslation } from "react-i18next";
import MemberStatus from "@/components/MemberStatus";
import ChangePaymentState from "@/components/ChangePaymentState";
import UserDw from "@/pages/user/Tabs/infomation/UserDw";

interface Prop {
  id?: number;
  withdrawData?: WithdrawalLogData;
  mutate?: any;
}

const WithdrawDetail = ({ id, withdrawData, mutate }: Prop) => {
  const { t } = useTranslation();
  const [searchParam, setSearchParam] = useSearchParams();
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const navigate = useNavigate()
  const username = searchParam.get('usernameD')
  const betSummarySwr = withdrawalBetSummaryAPI(username || undefined)
  const { search, pathname } = useLocation()
  const [isModalOpen, setIsModalOpen] = useState("");
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  // const { id } = useParams();
  const {data, getItem} = useGetItemData({
    id: Number(id)
  }, 'getUser')

   const handleRefresh = () => setRefreshKey(prev => prev + 1);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  }


  const setDateRanges = async () => {
    try {
      await getItem()
      
      // 새 API 데이터가 로드되면 날짜 설정
      if (betSummarySwr.data?.data) {
        const startDate = dayjs(betSummarySwr.data.data.lastDepositDate).toDate()
        const endDate = betSummarySwr.data.data.lastWithdrawRequestDate 
          ? dayjs(betSummarySwr.data.data.lastWithdrawRequestDate).toDate()
          : dayjs().endOf('day').toDate() // lastWithdrawRequestDate가 없으면 오늘 23:59:59
        
        const query = {
          ...parse(search.replace('?', '')),
          dateRangeMI: [dayjs(startDate).format(), dayjs(endDate).format()],
          dateRangeM: [dayjs(startDate).format(), dayjs(endDate).format()],
          dateRangeB: [dayjs(startDate).format(), dayjs(endDate).format()],
          dateRangeD: [dayjs(startDate).format(), dayjs(endDate).format()],
        }

        navigate({
          pathname: pathname,
          search: stringify(query)
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (betSummarySwr.data?.data) {
      setDateRanges()
    }
  }, [betSummarySwr.data])
  
  useEffect(() => {
    getItem()
  }, [])

  return (
    <>
    <Modal
        open={statsModalOpen}
        title={i18next.t("col.dataStats")}
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
        centered
        destroyOnClose
        onCancel={() => setStatsModalOpen(false)}
        width={1500}
        styles={{
          body: {
            maxHeight: "80vh",
            overflowY: "auto",
          },
        }}
      >
        <UserDw user={data}/>
    </Modal>
    <Modal
        open={isModalOpen !== ""}
        title={i18next.t("memberDetail.mis032")}
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
        centered
        destroyOnClose
        onCancel={() => setIsModalOpen("")}
      >
        <AdminAdjustment 
          type={isModalOpen} 
          data={data} 
          onSuccess={async () => {
            await getItem(); 

            if (betSummarySwr.mutate) {
              await betSummarySwr.mutate();
            }

            if (mutate) {
              await mutate();
            }

            handleRefresh()

            setIsModalOpen("");
          }}
          mutate={mutate}
        />
      </Modal>
      <Flex align="center" gap={20}>
        <Breadcrumb replace={searchParam.get('usernameD')} />|
        <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
          {data?.user_real_name}
        </div>
        <Flex align="center">
          <Tag style={{ fontSize: "16px", padding: "8px" }}>
          <Flex gap={10}>
            <Tooltip title={t("memberInfo.mi035")}>
              <UserGradeDisplay
                grade={data?.user_grade}
                lastDepositDate={data?.last_deposit_date}
                localGradeConfig={data?.local_grade_config}
                userGradeDay={data?.user_grade_day}
              />
              &nbsp;
            </Tooltip>
            <span>|</span>
            <Tooltip title={t("deposit.de019")}>{data?.user_level}</Tooltip>
            <span>|</span>
            <Tooltip title={t("deposit.de002")}>
              <MemberStatus value={data?.user_status} />
              &nbsp;
            </Tooltip>
          </Flex>
        </Tag>
        <Button
          style={{
              marginLeft: "0.3rem",
            }}
          onClick={() => setStatsModalOpen(true)}
          >
            데이터통계
        </Button>
        </Flex>
        {data?.user_memo_4 && (
          <div style={{ fontSize: "12px",maxWidth:"520px" }}>{data?.user_memo_4}</div>
        )}
        
        <Flex style={{ marginLeft: "auto", marginRight: "30px" }}>
          {(withdrawData?.status === "Applied" || withdrawData?.status === "Waiting") && <div>
          <ChangePaymentState
            id={String(id)}
            payment="WITHDRAW"
            value="Applied"
            type={withdrawData?.transaction_type}
            mutate={mutate}
            large
            cancelOnly
          />
          </div>}
            <Button
              className="user-button alt"
              style={{
                marginLeft: "0.3rem",
              }}
              onClick={() => setIsModalOpen("balance")}
            >
              증감
          </Button>
        </Flex>
       {/*<div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
          {searchParam.get('account_name')}
        </div>
         <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
            <CommaNumber value={withdrawSum?.data.withdrawal} onlyNumber />
        </div>
        <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
            <CommaNumber value={withdrawSum?.data.betresult} onlyNumber />
        </div>
        <div>
          {data && (
            <>
              <ChangePaymentState
                id={Number(searchParam.get('trans_id'))}
                payment="WITHDRAW"
                value={withdrawSum?.data2.status ?? 'Waiting'}
                mutate={getBreadCrumbsInfo}
              />
              <StateTag value={withdrawSum?.data2.status ?? 'Waiting'} />
            </>
          )}
        </div> */}
      </Flex>

      <Divider />
      {/* <TopInfo
        data={topInfo.data}
        loading={topInfo.isLoading}
        setFilter={setTopInfoFilter}
        startDate={data?.data.baseDate}
        endDate={data?.data.endDate}
        lastDepositDate={data?.data.lastDepositDate}
      /> */}
      {data && (
        // <TopInfo username={data?.username} lastDepositDate={betSummarySwr.data?.data?.lastDepositDate} endDate={dayjs().endOf('day').format()} />
        <MoneyInfo username={data?.username} lastDepositDate={betSummarySwr.data?.data?.lastDepositDate} lastWithdrawRequestDate={betSummarySwr.data?.data?.lastWithdrawRequestDate} endDate={dayjs().endOf('day').format()} id={id} selectedDate={selectedDate} user={data}/>
      )}
      {data && (
        <Tabs
          type="card"
          onChange={() => {
            searchParam.set("page", "1");
            setSearchParam(searchParam);
          }}
          items={[
            // {
            //   label: "머니로그",
            //   key: "money",
            //   children: (
            //     <DepositLog user={data} />
            //   ),
            // },
            {
              label: i18next.t("memberDetail.mis027"),
              key: "money",
              children: (
                <MoneyLog
                  key={refreshKey}
                  user={data as ResUser['data']}
                  onDateSelect={handleDateSelect}
                  lastDepositDate={betSummarySwr.data?.data?.lastDepositDate}
                  lastWithdrawRequestDate={betSummarySwr.data?.data?.lastWithdrawRequestDate}
                />
              ),
            },
            // {
            //   label: "게임머니",
            //   key: "user-game-balance",
            //   children: (
            //     <UserGameBalance data={data} />
            //   ),
            // },
            // {
            //   label: "베팅로그",
            //   key: "betting",
            //   children: (
            //     <BettingLog user={data} />
            //   ),
            // },
          ]}
        />
      )}
    </>
  );
};

export default WithdrawDetail;

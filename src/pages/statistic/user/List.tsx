import { Table, TableProps } from "antd";
import { useTranslation } from "react-i18next";
import { UserDailyStatsData } from "@/api/cs-statics/user-daily-stats";
import CommaNumber from "@/components/CommaNumber";
import { OnHeaderCellType } from "@/hooks/useSort";
import DateText from "@/components/DateText";
import { PaginationProps } from "antd/lib";
import { Link, useLocation } from "react-router-dom";
import { GF } from "@/utils/GlobalFunctions";
import Today90Ratio from "./component/Today90Ratio";
import { parse } from "qs";
import ColorizeUsername from "@/components/ColorizeUsername";
import AgentUsername from "@/components/AgentUsername";

interface Props {
  loading: boolean;
  data: UserDailyStatsData[] | undefined;
  onHeaderCell: OnHeaderCellType;
  pagination: PaginationProps;
  totalItems?: number; 
  /** When set (e.g. inside a modal), used instead of the URL's game_category. */
  gameCategory?: string;
}

const List = ({ data, loading, onHeaderCell, pagination,totalItems = 0, gameCategory }: Props) => {
  const { t } = useTranslation();
  const { search } = useLocation();
  const query = parse(search.replace("?", ""));
  const category = gameCategory !== undefined ? gameCategory : query?.game_category;
  const isSports = ["itf_parlay", "itf_intl_parlay", "itf_special_parlay"].includes((category as string) || "");
  // const isSlot = category == "slot";
  const isLive = category == "live";
  const isAll = category === "";
  const page = pagination.current || 0
  const limit = pagination.pageSize || 0
  // betSum이 존재하는 유저만 필터링
  // const filteredData = data?.filter(
  //   (user) =>
  //     user.betSum !== undefined && user.betSum !== null && user.betSum > 0
  // );

  // ID / 이름 /레벨/상태/총판/추천인

  const columnsArray: TableProps<UserDailyStatsData>["columns"] = [
    {
      title: "No",
      align: "center",
      render: (_value, _record, index) => GF.noOrderFormatter({totalItems,page,limit,index}),
    },
    {
      title: t("ID"),
      dataIndex: "username",
      key: "username",
      align: "center",
      render: (value, record) => (
        <Link to={`/user/${record.user_id}`}><ColorizeUsername username={value} /></Link>
      ),
    },
    {
      title: t("col.name"),
      dataIndex: "user_real_name",
      key: "user_real_name",
      align: "center",
    },
    {
      title: t("memberInfo.mi035"),
      dataIndex: "user_grade",
      key: "user_grade",
      align: "center",
      width: "60px",
      render: (value) => (
        <div className="text-nowrap" style={{ textWrap: "nowrap" }}>
          {GF.handleGradeStrVal(value)}
        </div>
      ),
    },
    {
      title: t("col.level"),
      dataIndex: "user_level",
      key: "user_level",
      align: "center",
      width: "5%",

      render: (value: number) => (
        <div style={{ minWidth: "30px" }}>{value ?? "-"}</div>
      ),
    },
    {
      title: t("col.rolling190"),
      dataIndex: "roll_1",
      key: "roll_1",
      align: "center",
      width: "5%",
      render: (value: number, record) => (
        <Today90Ratio today={value} past90={record.roll_90} record={record} />
      ),
      hidden:!isAll
    },
    {
      title: t("col.payout190"),
      dataIndex: "return_1",
      key: "return_1",
      align: "center",
      width: "5%",
      render: (value: number, record) => (
        <Today90Ratio today={value} past90={record.return_90} record={record} />
      ),
      hidden:!isAll
    },
    {
      title: t("col.balance"),
      dataIndex: "balance",
      key: "balance",
      align: "center",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
      hidden:!isAll
    },
    {
      title: t("col.depositAmount"),
      dataIndex: "deposit_sum",
      key: "deposit_sum",
      align: "center",
      render: (value: number, record) => <CommaNumber value={value + record.u_deposit_sum} onlyNumber />,
      hidden:!isAll
    },
    {
      title: t("col.depositCount"),
      dataIndex: "deposit_count",
      key: "deposit_count",
      align: "center",
      width: "5%",
      render: (value: number, record) => (
        <div style={{ minWidth: "46px" }}>
          <CommaNumber value={value + record.u_deposit_count} onlyNumber />
        </div>
      ),
      hidden:!isAll
    },
    // {
    //   title: t("col.depositBonus"),
    //   dataIndex: "bonus_total",
    //   key: "bonus_total",
    //   align: "center",
    //   render: (value: number) => <CommaNumber value={value} onlyNumber />,
    // },
    {
      title: t("col.withdrawalAmount"),
      dataIndex: "withdrawal_sum",
      key: "withdrawal_sum",
      align: "center",
      render: (value: number, record) => <CommaNumber value={value + record.u_withdrawal_sum} onlyNumber />,
      hidden:!isAll
    },
    // {
    //   title: t("col.withdrawalCount"),
    //   dataIndex: "total_withdrawal_count",
    //   key: "total_withdrawal_count",
    //   align: "center",
    //   render: (value: number) => <CommaNumber value={value} onlyNumber />,
    // },
    {
      title: t("col.netDeposit"),
      dataIndex: "dw_sum",
      key: "dw_sum",
      align: "center",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
      hidden:!isAll
    },
    {
      title: t("col.betAmount"),
      dataIndex: "bet_sum",
      key: "bet_sum",
      align: "center",
      width: "5%",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
      className: 'td-bg-3'
    },
    // {
    //   title: t("col.winningAmount"),
    //   dataIndex: "win_sum",
    //   key: "win_sum",
    //   align: "center",
    //   render: (value: number) => <CommaNumber value={value} onlyNumber />,
    // },
    {
      title: t("col.betDifference"),
      dataIndex: "bw_sum",
      key: "bw_sum",
      align: "center",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
      className: 'td-bg-4'
    },
    {
      title: t("col.rollingPoint"),
      dataIndex: "rolling_point_sum",
      key: "rolling_point_sum",
      align: "center",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
    },
    {
      title: t("col.totalBonus"),
      dataIndex: "bonus_total",
      key: "bonus_total",
      align: "center",
      render: (value: number, record) => <CommaNumber value={value + (record.u_deposit_bonus_sum_usdt || 0)} onlyNumber />,
      hidden:isSports || isLive
    },
    {
      title: t("col.status"),
      dataIndex: "user_status",
      key: "user_status",
      align: "center",
      width: "10%",
      render: (value) => {
        let status = "";
        if (value === "ACTIVE") status = t("memberInfoEdit.mie010");
        if (value === "ROYALBLACK") return t("memberInfo.royalBlack");

        if (value === "DEACTIVATED") status = t("memberInfoEdit.mie013");

        if (value === "SUSPENDED") status = t("memberInfoEdit.mie012");

        if (value === "UNVERIFIED") status = t("memberInfoEdit.mie034");

        if (value === "OBSERVATION") status = t("memberInfo.mi036");

        return (
          <div
            className="text-nowrap"
            style={{
              textWrap: "nowrap",
              color: value === "OBSERVATION" ? "var(--ant-color-error)" : "",
            }}
          >
            {status}
          </div>
        );
      },
    },
    {
      title: t("col.agent"),
      dataIndex: "agent_id",
      key: "agent_id",
      align: "center",
      render: (value, record) => <AgentUsername treeDepth={record.tree_depth} username={value} />,
    },
    {
      title: t("col.referrer"),
      dataIndex: "referral",
      key: "referral",
      align: "center",
      width: "5%",
      render: (value: string) => value ?? "-",
    },
    {
      title: t("col.recentDeposit"),
      dataIndex: "last_deposit_date",
      key: "last_deposit_date",
      align: "center",
      width: "7%",
      render: (value: string) => (
        <div style={{ textWrap: "nowrap" }}>
          <DateText date={value} />
        </div>
      ),
    },
    {
      title: t("col.recentAccess"),
      dataIndex: "last_active_at",
      key: "last_active_at",
      align: "center",
      width: "7%",
      render: (value: string) => (
        <div style={{ textWrap: "nowrap" }}>
          <DateText date={value} />
        </div>
      ),
    },
    // {
    //   title: t("global.action"),
    //   fixed: "right",
    //   key: "action",
    //   align: "center",
    //   render: (_: any, record) => (
    //     <Space>
    //       <DetailBtn link={`/user/${record.user_id}`} />
    //     </Space>
    //   ),
    // },
  ];

  const columns = columnsArray.map((item) =>
    item.key !== "action" && item.key ? { ...item, onHeaderCell } : item
  );

  return (
    <>
      <Table
        sticky
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey={"id"}
        tableLayout="auto"
        scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
        pagination={pagination}
      />
    </>
  );
};

export default List;

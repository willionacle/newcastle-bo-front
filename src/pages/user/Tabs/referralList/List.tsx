import { ReferralDetail } from "@/api/referral-logs/get";
import CommaNumber from "@/components/CommaNumber";
import DateText from "@/components/DateText";
import { OnHeaderCellType } from "@/hooks/useSort";
import { PaginationProps, Table } from "antd";
import { TableProps } from "antd/lib";
import { useTranslation } from "react-i18next";
import ReferralPaymentBtn from "./paymentButtons/ReferralPaymentButtons";
import { KeyedMutator } from "swr";
import { Link } from "react-router-dom";
interface Props {
  data: ReferralDetail[] | undefined;
  loading: boolean;
  pagination: PaginationProps | false;
  onHeaderCell: OnHeaderCellType;
  mutate: KeyedMutator<any>
  referralUsername?: string;
}

const List = ({ data, loading, pagination, onHeaderCell, mutate, referralUsername }: Props) => {
  const { t } = useTranslation();

  const columnsArray: TableProps<ReferralDetail>["columns"] = [
    {
      title: t("#"), // 1
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: t("col.refereeId"), // 2
      dataIndex: "username",
      key: "username",
      align: "center",
      render: (value, record) => (
              <Link to={`/user/${Number(record.userId)}`}>{value}</Link>
      ),
    },
    {
      title: t("col.name"), // 3
      dataIndex: "userRealName",
      key: "userRealName",
      align: "center",
      render: (value: string) => value || "-"
    },
    {
      title: t("col.deposit"), // 4
      dataIndex: "userTotalDeposit",
      key: "userTotalDeposit",
      align: "center",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
    },
    {
      title: t("col.depositCount"), // 4
      dataIndex: "userTotalDepositCount",
      key: "userTotalDepositCount",
      align: "center",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
    },
    {
      title: t("col.netDeposit"), // 5
      dataIndex: "userNetDeposit",
      key: "userNetDeposit",
      align: "center",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
    },
    {
      title: t("col.bet"), // 6
      dataIndex: "totalBet",
      key: "totalBet",
      align: "center",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
    },
    {
      title: t("col.betProfitLoss"), // 7
      dataIndex: "betResult",
      key: "betResult",
      align: "center",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
    },
    {
      title: t("col.joinDate"), // 8
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (value) => <DateText date={value} timeStamp />
    },
    {
      title: t("col.lastAccessDate"), // 9
      dataIndex: "lastLogin",
      key: "lastLogin",
      align: "center",
      render: (value) => <DateText date={value} timeStamp />
    },
    {
      title: t("col.memberStatus"), // 10
      dataIndex: "userStatus",
      key: "userStatus",
      align: "center",
      render: (value) => {
        if (value === "ACTIVE") return t("memberInfoEdit.mie010");
        if (value === "ROYALBLACK") return t("memberInfo.royalBlack");

        if (value === "DEACTIVATED") return t("memberInfoEdit.mie013");

        if (value === "SUSPENDED") return t("memberInfoEdit.mie012");

        if (value === "UNVERIFIED") return t("memberInfoEdit.mie034");

        if (value === "OBSERVATION") return <span style={{color: 'var(--ant-color-error)'}}>{t("memberInfo.mi036")}</span>;
      },
    },
    {
      title: t("col.memberPayoutStatus"), // 11
      align: "center",
      render: (_, record) => <ReferralPaymentBtn record={record} mutate={mutate} referralUsername={referralUsername} />
    },
  ];

  const columns = columnsArray.map((item) =>
    item.key !== "action" && item.key ? { ...item, onHeaderCell } : item
  );

  return (
    <Table
      sticky
      columns={columns}
      dataSource={data}
      tableLayout="auto"
      rowKey={"username"}
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      loading={loading}
      pagination={pagination}
    />
  );
};

export default List;

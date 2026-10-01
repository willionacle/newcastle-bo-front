import { ReferralSummary } from "@/api/referral-logs/get";
import i18next from "@/i18n/i18n";
import { SWRType } from "@/api/types";
import CommaNumber from "@/components/CommaNumber";
import DetailBtn from "@/components/DetailBtn";
import NewColorizeUsername from "@/components/NewColorizeUsername";
import { OnHeaderCellType } from "@/hooks/useSort";
import { PaginationProps, Table, TableProps } from "antd";
import { KeyedMutator } from "swr";

interface Props {
  data: ReferralSummary[] | undefined;
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
  mutate: KeyedMutator<SWRType<ReferralSummary[]>>;
}

const List = ({ data, loading, onHeaderCell, pagination }: Props) => {
  const columnsArray: TableProps["columns"] = [
    // {
    //   title: 'No',
    //   dataIndex: "id",
    //   key: "id",
    //   align: "center",
    //   width: "5%",
    //   // render: (_value, _record, index) => ((data?.length ?? 0) + 1) - (index + 1),
    // },
    // {
    //   title: 'No',
    //   align: "center",
    //   render: (_value, _record, index) => (pagination.total ?? 0) - (((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 100)) - index
    // },
    {
      title: "No",
      align: "center",
      render: (_value, _record, index) => ((data?.length ?? 0) + 1) - (index + 1),
    },
    {
      title: i18next.t("col.referrer"),
      dataIndex: "username",
      key: "username",
      align: "center",
      render: (value) => <NewColorizeUsername value={value} />
    },
    {
      title: i18next.t("title.referrerName"),
      dataIndex: "user_real_name",
      key: "user_real_name",
      align: "center",
      render: (value) => <NewColorizeUsername value={value} />
    },
    {
      title: i18next.t("title.totalReferralsTitle"),
      dataIndex: "referral_count",
      key: "referral_count",
      align: "center",
      render: (value) => <CommaNumber value={value} onlyNumber />
    },
    {
      title: i18next.t("title.depositedReferrals"),
      dataIndex: "deposit_referral_count",
      key: "deposit_referral_count",
      align: "center",
      render: (value) => <CommaNumber value={value} onlyNumber />
    },
    {
      title: i18next.t("title.referralDepositTotal"),
      dataIndex: "amount",
      key: "amount",
      align: "center",
      render: (value) => <CommaNumber value={value} onlyNumber />
    },
    {
      title: i18next.t("col.details"),
      fixed: "right",
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (value) => <DetailBtn link={`/user/${value}?tab=referralList`} />,
    },
  ];

  const columns = columnsArray.map((item) =>
    item.key !== "action" && item.key ? { ...item, onHeaderCell } : item
  );

  return <Table
      sticky  
  dataSource={data}
  columns={columns}
  loading={loading}
  rowKey={"id"}
  scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
  pagination={pagination}
  />;
};

export default List;

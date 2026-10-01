import { ResPostList, ResUser } from "@/api/types";
import AgentUsername from "@/components/AgentUsername";
import CommaNumber from "@/components/CommaNumber";
import DateText from "@/components/DateText";
import DetailBtn from "@/components/DetailBtn";
import EditBtn from "@/components/EditBtn";
import NewColorizeUsername from "@/components/NewColorizeUsername";
import { OnHeaderCellType } from "@/hooks/useSort";
import { GF } from "@/utils/GlobalFunctions";
import { Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { PaginationProps } from "antd/lib";
import { useTranslation } from "react-i18next";
import useUserStore from "@/store/user.store";
import UserStatus from "@/components/UserStatus";
interface Props {
  data?: ResPostList['data'];
  loading: boolean;
  onHeaderCell: OnHeaderCellType;
  pagination: PaginationProps;
}

const List = ({ data, loading, onHeaderCell, pagination }: Props) => {
  const { t } = useTranslation();
  const { username } = useUserStore();

  const columnsArray: ColumnsType<ResUser['data']> = [
    {
      title: 'No',
      align: "center",
      render: (_value, _record, index) => (pagination.total ?? 0) - (((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 100)) - index
      // render: (_value, _record, index) => ((pagination.total ?? 0) + 1) - (index + 1),
    },
    {
      title: t("memberInfo.mi004"),
      dataIndex: "username",
      key: "username",
      align: "center",
      render: (value, record) => <NewColorizeUsername value={value} dateRegistered={record.userRegdate} userStatus={record.userStatus} />
    },
    {
      title: t("memberInfo.mi006"),
      dataIndex: "userRealName",
      key: "userRealName",
      align: "center",
      render: (value, record) => <NewColorizeUsername value={value} dateRegistered={record.userRegdate} userStatus={record.userStatus} />
    },
    {
      title: t("col.birthday"),
      dataIndex: "birthday",
      key: "birthday",
      align: "center",
      render: (value: string, record) => <DateText format="YYYY" date={value ?? record.userbday} />,
    },
    // phone_number 컬럼을 조건부로 추가
    ...(username === 'masterb' || username === 'mastera' ? [{
      title: t("col.phone"),
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      align: "center" as const,
      render: (value: string) => value || '-',
    }] : []),
    {
      title: t("memberInfo.mi035"),
      dataIndex: "userGrade",
      key: "userGradeDay",
      align: "center",
      render: (value, record) => {
        const isRecentDeposit = record?.lastDepositDate
          ? (Date.now() - new Date(record.lastDepositDate).getTime()) / (1000 * 60 * 60 * 24) <= 30
          : false;
        return GF.getGradeDisplay({
          userGrade: value ?? null,
          userGradeDay: record?.userGradeDay ?? null,
          localGradeConfig: record?.localGradeConfig,
          isRecentDeposit,
        });
      },
    },
    {
      title: t("memberInfo.mi007"),
      dataIndex: "userLevel",
      key: "userLevel",
      align: "center",
      render: (value) => value ? value : '-',
    },
    {
      title: t("memberInfo.mi010"),
      dataIndex: "userStatus",
      key: "userStatus",
      align: "center",
      render: (value) => <UserStatus status={value} />,
    },
    //
    {
      title: t("memberInfo.mi008"),
      dataIndex: "agentUsername",
      key: "agentUsername",
      align: "center",
      render: (value, record) => <AgentUsername treeDepth={record.treeDepth} username={value} />,
    },
    {
      title: t("memberInfo.mi009"),
      dataIndex: "referralUsername",
      key: "referralUsername",
      align: "center",
      render: (value) => value ? value : '-',
    },
    {
      title: t("memberInfo.mi019"),
      dataIndex: "balance",
      key: "balance",
      align: "center",
      render: (value: number) => <CommaNumber value={value} />,
    },
    {
      title: t("memberInfo.mi020"),
      dataIndex: "rollingPoint",
      key: "rollingPoint",
      align: "center",
      render: (value: number) => <CommaNumber value={value} />,
    },
    {
      title: t("col.depositCount"),
      dataIndex: "depositCountTotal",
      key: "depositCountTotal",
      align: "center",
      render: (value: number | undefined) => <CommaNumber value={value} />,
    },
    {
      title: t("memberInfo.mi023"),
      dataIndex: "depositTotal",
      key: "depositTotal",
      align: "center",
      render: (value: number | undefined) => <CommaNumber value={value} />,
    },
    {
      title: t("memberInfo.mi024"),
      dataIndex: "withdrawalTotal",
      key: "withdrawalTotal",
      align: "center",
      render: (value: number | undefined) => <CommaNumber value={value} />,
    },
    {
      title: t("memberInfo.mi025"),
      dataIndex: "dwSum",
      key: "dwSum",
      align: "center",
      render: (_: any, record: ResUser['data']) => {
        const { dwSum, depositTotal, withdrawalTotal } = record;
        const value = dwSum === 0 ? (depositTotal ?? 0) - (withdrawalTotal ?? 0) : dwSum;

        return <CommaNumber value={value} />;
      }
    },
    {
      title: t("App"),
      dataIndex: "hasAppLogin",
      key: "hasAppLogin",
      align: "center",
      render: (value: boolean) => (value ? "O" : "X"),
    },
    {
      title: t("memberInfo.mi026"),
      dataIndex: "userRegdate",
      key: "userRegdate",
      align: "center",
      render: (value: string) => <DateText timeStamp date={value} />,
    },
    {
      title: t("col.recentDeposit"),
      dataIndex: "lastDepositDate",
      key: "lastDepositDate",
      align: "center",
      render: (value: string) => <DateText timeStamp date={value} />,
    },
    {
      title: t("col.recentAccess"),
      dataIndex: "lastLogin",
      key: "lastLogin",
      align: "center",
      render: (value: string) => <DateText timeStamp date={value} />,
    },
    // {
    //   title: t("memberInfo.mi027"),
    //   dataIndex: "lastBettingDate",
    //   align: "center",
    //   render: (value: string) => <DateText timeStamp date={value} />,
    // },
    {
      title: t("global.action"),
      fixed: "right",
      key: "action",
      align: "center",
      render: (_: any, record: ResUser['data']) => (
        <Space>
          <DetailBtn link={`/user/${record.id}`} />
          <EditBtn link={`/user/edit/${record.id}`} />
        </Space>
      ),
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
      loading={loading}
      rowKey={"id"}
      tableLayout="auto"
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      pagination={pagination}
    />
  );
};

export default List;

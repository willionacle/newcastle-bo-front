import { User } from "@/api/users/get";
import { WithdrawalLogData } from "@/api/withdrawal-logs/get";
import ColorizeUsername from "@/components/ColorizeUsername";
import DateText from "@/components/DateText";
import { OnHeaderCellType } from "@/hooks/useSort";
import StateTag from "@/pages/payment/StateTag";
import { Table, TableProps } from "antd";
import { PaginationProps } from "antd/lib";
import { useTranslation } from "react-i18next";

interface Props {
  data: WithdrawalLogData[];
  loading: boolean;
  onHeaderCell: OnHeaderCellType;
  pagination: PaginationProps;
}

const List = ({ data, loading, onHeaderCell, pagination }: Props) => {
  const { t } = useTranslation();

  const columnsArray: TableProps<WithdrawalLogData>["columns"] = [
    {
      title: t("#"),
      key: "id",
      dataIndex: "id",
      align: "center",
      render: (value) => value.toLocaleString(),
    },
    {
      title: t("deposit.de007"),
      dataIndex: "username",
      key: "username",
      align: "center",
      render: (value) => <ColorizeUsername username={value} />
    },
    {
      title: t("deposit.de008"),
      dataIndex: "user",
      key: "user_real_name",
      align: "center",
      render: (value, record) =>
        record.user_real_name !== record.account_name ? (
          <span
            style={{
              color: "var(--ant-color-error-text)",
            }}
          >
            {value.user_real_name}
          </span>
        ) : (
          <ColorizeUsername username={record.username} returnRealName />
        ),
    },
    {
      title: t("deposit.de019"),
      dataIndex: "userLevel",
      key: "userLevel",
      align: "center",
    },
    {
      title: t("deposit.de013"),
      dataIndex: "amount",
      key: "amount",
      align: "center",
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: t("deposit.de023"),
      dataIndex: "user",
      key: "bankName",
      align: "center",
      render: (value: User) => value.bankName,
    },
    {
      title: t("deposit.de020"),
      dataIndex: "accountNumber",
      key: "accountNumber",
      align: "center",
    },
    {
      title: t("deposit.de024"),
      dataIndex: "account_name",
      key: "account_name",
      align: "center",
      render: (value, record) =>
        record.user_real_name !== record.account_name ? (
          <span
            style={{
              color: "var(--ant-color-error-text)",
            }}
          >
            {value}
          </span>
        ) : (
          value
        ),
    },
    {
      title: t("deposit.de002"),
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (value: WithdrawalLogData["status"]) => {
        return <StateTag value={value} />;
      },
    },
    {
      title: t("deposit.de017"),
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (value: string) => <DateText date={value} timeStamp />,
    },
    {
      title: t("deposit.de018"),
      dataIndex: "updatedAt",
      key: "updatedAt",
      align: "center",
      render: (value: string) => <DateText date={value} timeStamp />,
    },
    {
      title: t("deposit.de009"),
      dataIndex: "adminId",
      key: "adminId",
      align: "center",
      render: (value) => value ?? "-",
    },
  ];

  const columns = columnsArray.map((item) =>
    item.key !== "action" && item.key ? { ...item, onHeaderCell } : item
  );

  return (
    <>
      <Table
      sticky
        columns={columns}
        loading={loading}
        dataSource={data}
        tableLayout="auto"
        scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
        pagination={pagination}
        rowKey={"id"}
        style={{
          marginTop: "1rem",
        }}
      />
    </>
  );
};

export default List;

import { DepositLogs, depositUserLogsAPI } from "@/api/deposit-logs/get";
import { ResUser } from "@/api/types";
import DateText from "@/components/DateText";
import StateTag from "@/pages/payment/StateTag";
import { Divider, Table } from "antd";
import { TableProps } from "antd/lib";
import { useTranslation } from "react-i18next";
import Filter from "./Filter";
import Tab from "./Tab";
import ColorizeUsername from "@/components/ColorizeUsername";
import { useDepositMethodList } from "@/api/deposit-method/get";
import DepositBonusText from "@/components/DepositBonusText";
import { GF } from "@/utils/GlobalFunctions";

interface Props {
  user: ResUser["data"] | undefined;
}

const DepositLog = ({ user }: Props) => {
  const { t } = useTranslation();
  const { swr, paginationProps, setFilters } = depositUserLogsAPI(
    user?.username,
  );
  const { data: depositMethods } = useDepositMethodList();

  const columnsArray: TableProps<DepositLogs>["columns"] = [
    {
      title: t("#"),
      key: "id",
      dataIndex: "id",
      align: "center",
    },
    {
      title: t("deposit.de007"),
      dataIndex: "username",
      key: "username",
      align: "center",
      render: (value) => <ColorizeUsername username={value} />,
    },
    {
      title: t("deposit.de008"),
      dataIndex: "account_name",
      key: "account_name",
      align: "center",
      render: (value) => value ?? "-",
    },
    {
      title: t("deposit.de019"),
      dataIndex: "user_level",
      key: "user_level",
      align: "center",
      render: (value) => value ?? "-",
    },

    {
      title: t("deposit.de013"),
      dataIndex: "amount",
      key: "amount",
      align: "center",
      render: (value: number) => (
        <span style={{ color: value < 0 ? "var(--ant-color-error-text)" : "" }}>
          {" "}
          {value.toLocaleString()}
        </span>
      ),
    },
    {
      title: t("deposit.de014"),
      dataIndex: "bonus_name",
      key: "bonus_name",
      align: "center",
      render: (value) => <DepositBonusText value={value} />,
    },
    {
      title: t("col.device"),
      dataIndex: "device",
      key: "device",
      align: "center",
      width: 60,
    },
    {
      title: t("col.os"),
      dataIndex: "system",
      key: "system",
      align: "center",
      width: 80,
    },
    {
      title: t("deposit.de002"),
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (value: DepositLogs["status"]) => <StateTag value={value} />,
    },
    {
      title: t("col.depositMethod"),
      dataIndex: "payment_method",
      key: "payment_method",
      align: "center",
      width: 80,
      render: (value: string, record) =>
        record?.list_type === "deposit" && !GF.isLegacyPaymentMethod(value)
          ? depositMethods?.find((item) => item.type === value)?.title || value
          : "-",
    },
    {
      title: t("deposit.de017"),
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      render: (value: string) => <DateText date={value} timeStamp />,
    },
    {
      title: t("deposit.de018"),
      dataIndex: "updated_at",
      key: "updated_at",
      align: "center",
      render: (value: string, record) =>
        record.status !== "Applied" ? <DateText date={value} timeStamp /> : "-",
    },
    {
      title: t("App"),
      dataIndex: "has_app_login",
      key: "has_app_login",
      align: "center",
      render: (value: boolean) => (value ? "O" : "X"),
    },
    {
      title: t("deposit.de009"),
      dataIndex: "admin_id",
      key: "admin_id",
      align: "center",
      render: (value) => value ?? "-",
    },
    {
      title: t("deposit.de009"),
      dataIndex: "admin_id",
      key: "admin_id",
      align: "center",
      render: (value) => value ?? "-",
    },
  ];

  return (
    <>
      <Divider />
      <Filter user={user} setFilters={setFilters} />
      <Tab setFilters={setFilters} />
      <Table
        sticky
        dataSource={swr?.data ? swr?.data.data : []}
        loading={swr.isLoading}
        columns={columnsArray}
        tableLayout="auto"
        rowKey={"id"}
        scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
        pagination={paginationProps(swr?.data?.totalitems)}
      />
    </>
  );
};

export default DepositLog;

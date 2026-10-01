import i18next from "@/i18n/i18n";
import { DepositLogs } from "@/api/deposit-logs/get";
import DateText from "@/components/DateText";
import DetailBtn from "@/components/DetailBtn";
import { Button, Divider, Flex, Modal, Table, TableProps } from "antd";
import { useTranslation } from "react-i18next";
import StateTag from "../StateTag";
import ChangePaymentState from "@/components/ChangePaymentState";
import { useState } from "react";
import { PaginationProps } from "antd/lib";
import { KeyedMutator } from "swr";
import { OnHeaderCellType } from "@/hooks/useSort";
import { MessageFilled } from "@ant-design/icons";
import Message from "./Message";
import Breadcrumb from "@/components/Breadcrumb";
import EditBtn from "@/components/EditBtn";
import { useDepositMethodList } from "@/api/deposit-method/get";
import CommaNumber from "@/components/CommaNumber";
import { ResPostList, SWRType } from "@/api/types";
import { Link } from "react-router-dom";
import { GF } from "@/utils/GlobalFunctions";
import WalletAddress from "@/components/WalletAddress";
import CommaNumber2 from "@/components/CommaNumber2";
import ColorizeUsername from "@/components/ColorizeUsername";
import AgentUsername from "@/components/AgentUsername";
import TruncatedCopy from "@/components/TruncatedCopy";
import DepositBonusText from "@/components/DepositBonusText";
import SummaryInAlert from "@/components/SummaryInAlert";
import commaNumber from "comma-number";
import { useDepositDuplicateCheck } from "@/hooks/useProcessDeposit";

interface Props {
  data: ResPostList["data"];
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
  mutate: KeyedMutator<SWRType<ResPostList[]>>;
  totals: ResPostList["totals"];
}

const List = ({ data, loading, pagination, mutate, totals }: Props) => {
  const { t } = useTranslation();
  const [checked, setChecked] = useState<string[]>([]);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const { data: depositMethods } = useDepositMethodList();
  const duplicateCheckedData = useDepositDuplicateCheck(data);

  const columnsArray: TableProps<DepositLogs>["columns"] = [
    // {
    //   title: t("#"),
    //   key: "id",
    //   dataIndex: "id",
    //   align: "center",
    // },
    {
      title: "No",
      align: "center",
      render: (_value, _record, index) =>
        (pagination.total ?? 0) -
        ((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 100) -
        index,
    },
    {
      title: t("deposit.de012"),
      dataIndex: "agent_username",
      key: "agent_username",
      align: "center",
      render: (value, record) => (
        <AgentUsername treeDepth={record.agent_tree_depth} username={value} />
      ),
    },
    {
      title: t("col.referrer"),
      dataIndex: "referral_username",
      key: "referral_username",
      align: "center",
      render: (value) => (value ? value : "-"),
    },
    {
      title: t("deposit.de007"),
      dataIndex: "username",
      key: "username",
      align: "center",
      render: (value, record) => (
        <Link to={`/user/${record.user_id}`}>
          <ColorizeUsername username={value} />
        </Link>
      ),
    },
    {
      title: t("deposit.de008"),
      dataIndex: "user_real_name",
      key: "user_real_name",
      align: "center",
      render: (_value, record) => (
        <ColorizeUsername username={record.user_real_name} returnRealName />
      ),
    },
    {
      title: t("col.birthday"),
      dataIndex: "userbday",
      key: "userbday",
      align: "center",
      render: (value: string, record) => (
        <DateText format="YYYY" date={value ?? record.birthday} />
      ),
    },
    {
      title: t("col.memberStatus"),
      dataIndex: "user_status",
      key: "user_status",
      align: "center",
      render: (value) => {
        if (value === "ACTIVE") return t("memberInfoEdit.mie010");
        if (value === "ROYALBLACK") return t("memberInfo.royalBlack");

        if (value === "DEACTIVATED") return t("memberInfoEdit.mie013");

        if (value === "SUSPENDED") return t("memberInfoEdit.mie012");

        if (value === "UNVERIFIED") return t("memberInfoEdit.mie034");

        if (value === "OBSERVATION")
          return (
            <span style={{ color: "var(--ant-color-error)" }}>
              {t("memberInfo.mi036")}
            </span>
          );
        if (!value) return "-";
      },
    },
    {
      title: t("memberInfo.mi035"),
      dataIndex: "user_grade",
      key: "user_grade",
      align: "center",
      render: (value) => GF.handleGradeStrVal(value),
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
      render: (value: number) => <CommaNumber value={value} />,
    },
    {
      title: t("col.usdtAmount"),
      dataIndex: "usdt_amount",
      key: "usdt_amount",
      align: "center",
      render: (value: number) => <CommaNumber2 value={value} />,
    },
    {
      title: t("col.usdtAddress"),
      dataIndex: "wallet_address",
      key: "wallet_address",
      align: "center",
      render: (value) => <WalletAddress data={value ?? "-"} />,
    },
    {
      title: t("col.bonusAmount"),
      dataIndex: "bonus_amount",
      key: "bonus_amount",
      align: "center",
      render: (value) => <CommaNumber value={value} />,
    },
    {
      title: t("deposit.de014"),
      dataIndex: "bonus_name",
      key: "bonus_name",
      align: "center",
      render: (value: string, record) => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <DepositBonusText value={value} />
          <TruncatedCopy text={record.oncash_pin} />
        </div>
      ),
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
      render: (value: DepositLogs["status"], record) => {
        if (value === "Applied" || value === "Waiting") {
          return (
            <div style={{ minWidth: 70 }}>
              <ChangePaymentState
                id={record.id}
                value={value}
                payment="DEPOSIT"
                depositBonus={`${record.bonus_name} (${record.bonus_percentage}%)`}
                type={record.payment_method}
                mutate={mutate}
              />
              <StateTag value={value} />
            </div>
          );
        }

        return <StateTag value={value} />;
      },
    },
    {
      title: t("col.autoApproval"),
      dataIndex: "auto_process_status",
      key: "auto_process_status",
      width: 40,
      align: "center",
      render: (value: number) => {
        let newVal = "-";
        if (value === 5) {
          newVal = i18next.t("sidemenu.sm063");
        } else if (value === 1) {
          newVal = i18next.t("payment.autoComplete");
        } else if (value === 2) {
          newVal = i18next.t("payment.duplicateWaiting");
        } else {
          newVal = "-";
        }

        return <span>{newVal}</span>;
      },
    },
    {
      title: t("deposit.de025"),
      dataIndex: "days_since_prev_completed",
      key: "days_since_prev_completed",
      align: "center",
      render: (value: number) => {
        const result = value ? `${value} ${t("col.daysAgo")}` : "-";
        return (
          <span style={{ color: value >= 30 ? "var(--ant-color-error)" : "" }}>
            {result}
          </span>
        );
      },
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
      render: (value: string) => <DateText date={value} timeStamp />,
    },
    // {
    //   title: t("deposit.de009"),
    //   dataIndex: "admin_id",
    //   key: "admin_id",
    //   align: "center",
    //   render: (value) => value ?? "-",
    // },
    {
      title: t("col.depositMethod"),
      dataIndex: "payment_method",
      key: "payment_method",
      align: "center",
      render: (value: string) =>
        GF.isLegacyPaymentMethod(value)
          ? "-"
          : depositMethods?.find((item) => item.type === value)?.title || value,
    },
    {
      title: t("App"),
      dataIndex: "has_app_login",
      key: "has_app_login",
      align: "center",
      render: (value: boolean) => (value ? "O" : "X"),
    },
    {
      title: t("global.action"),
      key: "action",
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <>
          <DetailBtn link={`/user/${record.user_id}`} />
          <EditBtn link={`/user/edit/${record.user_id}`} />
          <Button
            icon={<MessageFilled />}
            shape="circle"
            onClick={() => setUsername(record.username)}
          />
        </>
      ),
    },
  ];

  // const columns = columnsArray.map((item) =>
  //   item.key !== "action" && item.key ? { ...item, onHeaderCell } : item
  // );

  return (
    <>
      <Modal
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
        destroyOnClose
        open={username ? true : false}
        onCancel={() => setUsername(undefined)}
        centered
        width={"80%"}
        styles={{
          content: {
            paddingTop: "3rem",
          },
        }}
      >
        <Breadcrumb replace={username} />
        <Divider />
        <Message username={username} setUsername={setUsername} />
      </Modal>
      <Flex align="center" justify="space-between">
        <div className="">
          <ChangePaymentState
            id={checked}
            payment="DEPOSIT"
            value="Applied"
            large
            mutate={mutate}
            setChecked={setChecked}
          />
        </div>
        <SummaryInAlert
          data={[
            {label: i18next.t("payment.autoApprovalRatio"), value: commaNumber(totals?.total_approval_rate), extra:"%"},
            {label: i18next.t("payment.completedTotal"), value: commaNumber(totals?.total_deposit_completed)},
            {label: i18next.t("payment.requestTotal"), value: commaNumber(totals?.total_deposit_applied)},
            {label: i18next.t("payment.waitingTotal"), value: commaNumber(totals?.total_deposit_waiting)},
          ]}
        />
      </Flex>

      <Table
        sticky
        rowSelection={{
          type: "checkbox",
          selectedRowKeys: checked,
          getCheckboxProps: (record: DepositLogs) => ({
            disabled:
              record.status === "Completed" || record.status === "Cancelled",
          }),
          onChange: (id) => setChecked(id as []),
        }}
        dataSource={duplicateCheckedData}
        rowClassName={(record) =>
          record.is_green ? "deposit-duplicate-highlight" : ""
        }
        loading={loading}
        columns={columnsArray}
        tableLayout="auto"
        rowKey={(record) =>
          `${record.id}-${record.payment_method === "level" ? "bank" : record.payment_method}`
        }
        scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
        style={{
          marginTop: "1rem",
        }}
        pagination={pagination}
      />
    </>
  );
};

export default List;

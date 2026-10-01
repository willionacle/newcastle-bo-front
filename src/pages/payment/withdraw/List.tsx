import i18next from "@/i18n/i18n";
import { WithdrawalLogData } from "@/api/withdrawal-logs/get";
import { Button, Divider, Flex, Modal, Table, TableProps } from "antd";
import { useTranslation } from "react-i18next";
import StateTag from "../StateTag";
import DateText from "@/components/DateText";
import ChangePaymentState from "@/components/ChangePaymentState";
import { useState } from "react";
import { KeyedMutator } from "swr";
import { OnHeaderCellType } from "@/hooks/useSort";
import { PaginationProps } from "antd/lib";
import DetailBtn from "@/components/DetailBtn";
import { MessageFilled } from "@ant-design/icons";
import EditBtn from "@/components/EditBtn";
import Breadcrumb from "@/components/Breadcrumb";
import Message from "../deposit/Message";
import { parse, stringify } from "qs";
import UserIcon from "@/assets/img/user.svg?react";
import CommaNumber from "@/components/CommaNumber";
import { useLocation, useNavigate } from "react-router-dom";
import { ResPostList, SWRType } from "@/api/types";
import WithdrawDetail from "./WithdrawDetail";
import { GF } from "@/utils/GlobalFunctions";
import WalletAddress from "@/components/WalletAddress";
import CommaNumber2 from "@/components/CommaNumber2";
import NewColorizeUsername from "@/components/NewColorizeUsername";
import AgentUsername from "@/components/AgentUsername";
import SummaryInAlert from "@/components/SummaryInAlert";
import commaNumber from "comma-number";
import CopyBtn from "@/components/CopyBtn";

interface Props {
  data: ResPostList['data'];
  loading: boolean;
  onHeaderCell: OnHeaderCellType;
  pagination: PaginationProps;
  mutate: KeyedMutator<SWRType<ResPostList[]>>;
  totals: ResPostList["totals"];
}

const List = ({ data, loading, mutate, pagination, totals }: Props) => {
  const { t } = useTranslation();
  const { search, pathname } = useLocation()
  const [checked, setChecked] = useState<string[]>([]);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [idModalOpen, setIDModalOpen] = useState<number>();
  const [withdrawData, setWithdrawData] = useState<WithdrawalLogData | undefined>();
  const navigate = useNavigate();

  const handleDetailOpen = (record: WithdrawalLogData) => {
    setIDModalOpen(record.user_id)
    setWithdrawData(record)
    const query = {
      ...parse(search.replace('?', '')),
      usernameD: record.username,
      account_nameD: record.account_name,
      amountD: record.amount,
      statusD: record.status,
      trans_idD: record.id,
    }

    navigate({
      pathname: pathname,
      search: stringify(query)
    })
  }

  const columnsArray: TableProps<WithdrawalLogData>["columns"] = [
    // {
    //   title: t("#"),
    //   key: "id",
    //   dataIndex: "id",
    //   align: "center",
    //   render: (value) => value.toLocaleString(),
    // },
    {
      title: 'No',
      align: "center",
      render: (_value, _record, index) => (pagination.total ?? 0) - (((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 100)) - index
    },
    {
      title: t("deposit.de012"),
      dataIndex: "agent_username",
      key: "agent_username",
      align: "center",
      render: (value, record) => <AgentUsername treeDepth={record.agent_tree_depth} username={value} />,
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
      render: (value, record) => <NewColorizeUsername value={value} dateRegistered={record.user_regdate} userStatus={record.user_status} />
    },
    {
      title: t("deposit.de008"),
      dataIndex: "user_real_name",
      key: "user_real_name",
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
          <span className="text-color-blue font-bold">
            {value}
          </span>
        ),
    },
    {
      title: t("col.birthday"),
      dataIndex: "userbday",
      key: "userbday",
      align: "center",
      render: (value: string) => <DateText format="YYYY" date={value} />,
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

        if (value === "SUSPENDED") return <span style={{ color: "var(--ant-color-error)" }}>{t("memberInfoEdit.mie012")}</span>

        if (value === "UNVERIFIED") return  t("memberInfoEdit.mie034")

        if (value === "OBSERVATION")
          return (
            <span style={{ color: "blue" }}>
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
      title: t("deposit.de023"),
      dataIndex: "bank_name",
      key: "bank_name",
      align: "center",
      width:80,
      render: (value, record) => record.withdraw_type !== "oncash" && value,
    },
    {
      title: t("deposit.de020"),
      dataIndex: "account_number",
      key: "account_number",
      align: "center",
      render: (value, record) => record.withdraw_type !== "oncash" ? value : record.oncash_pin,
    },
    {
      title: t("deposit.de024"),
      dataIndex: "account_name",
      key: "account_name",
      align: "center",
      render: (value, record) => record.withdraw_type !== "oncash" && (
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
        )),
    },
    {
      title: t("deposit.de013"),
      dataIndex: "amount",
      key: "amount",
      align: "center",
      render: (value: number,record) => (
        <div style={{display:"flex", gap:"1px"}}>
          <CommaNumber value={value} />
          <CopyBtn
            rowKey={`${record.id}-all`}
            textToCopy={`${record.bank_name}\t${record.account_number}\t${record.account_name}\t${record.amount}`}
          />
        </div>
      ),
    },
    {
      title: t("deposit.de002"),
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (value: WithdrawalLogData["status"], record) => {
        if (value === "Applied" || value === "Waiting") {
          return (
            <>
              <ChangePaymentState
                id={record.id}
                value={value}
                payment="WITHDRAW"
                mutate={mutate}
                type={record.transaction_type}
                withrawType={record.withdraw_type}
                transData={{
                  requestTime: record.created_at,
                  username: record.username
                }}
              />
              <StateTag value={value} />
            </>
          );
        }

        return <StateTag value={value} />;
      },
    },
    {
      title: t("col.memo"),
      dataIndex: "user_memo_4",
      key: "user_memo_4",
      align: "center",
      render: (value: string) => <div style={{width: 65, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{value}</div>,
      hidden:false
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
    {
      title: t("deposit.de009"),
      dataIndex: "admin_id",
      key: "admin_id",
      align: "center",
      render: (value) => value ?? "-",
    },
    {
      title: t("col.depositType"),
      dataIndex: "last_deposit_type",
      key: "last_deposit_type",
      align: "center",
      render: (value: string, record) => {
        if (record.withdraw_type === "oncash") return "ONCASH";
        if (value?.startsWith("v-")) return "BANK";

        return value?.toUpperCase() ?? "-";
      }
    },
    {
      title: t("col.withdrawalType"),
      dataIndex: "transaction_type",
      key: "transaction_type",
      align: "center",
      render: (value: string, record) => record.withdraw_type !== "oncash" ? value.toUpperCase() ?? "-" : "ONCASH",
    },
    {
      title: t("col.verifyCode"),
      dataIndex: "reference_id",
      key: "reference_id",
      align: "center",
    },
    {
      title: t("global.action"),
      key: "systemNote",
      align: "center",
      render: (_, record) => (
        <Flex align="center" justify="center" gap={1}>
          <DetailBtn
            onClick={() => {
              // navigate(
              //   `/payment/withdraw/${record.user_id}?${stringify(
              //     {
              //       usernameD: record.username,
              //       account_nameD: record.account_name,
              //       amountD: record.amount,
              //       statusD: record.status,
              //       trans_idD: record.id,
              //       // page: 1,
              //     },
              //     { encodeValuesOnly: true }
              //   )}`
              // );
              handleDetailOpen(record)
            }}
          />
          <Button
            icon={<UserIcon />}
            shape="circle"
            onClick={() => navigate(`/user/${record.user_id}`)}
          />
          <EditBtn link={`/user/edit/${record.user_id}`} />
          <Button
            icon={<MessageFilled />}
            shape="circle"
            onClick={() => setUsername(record.username)}
          />
        </Flex>
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

      <Modal
        open={idModalOpen !== undefined}
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
        centered
        destroyOnClose
        onCancel={() => setIDModalOpen(undefined)}
        width={'90%'}
        style={{margin: '1rem auto'}}
      >
         <WithdrawDetail mutate={mutate} id={idModalOpen} withdrawData={withdrawData}/>
      </Modal>
      <Flex align="center" justify="space-between">
        <div className="">
          <ChangePaymentState
            id={checked}
            payment="WITHDRAW"
            value="Applied"
            large
            mutate={mutate}
            setChecked={setChecked}
          />
        </div>
        <SummaryInAlert
          data={[
            {label: i18next.t("payment.completedTotal"), value: commaNumber(totals?.total_withdrawal_completed?.total)},
            {label: i18next.t("payment.requestTotal"), value: commaNumber(totals?.total_withdrawal_applied)},
            {label: i18next.t("payment.waitingTotal"), value: commaNumber(totals?.total_withdrawal_waiting)},
          ]}
        />
      </Flex>
      <Table
      sticky 
        rowSelection={{
          type: "checkbox",
          selectedRowKeys: checked,
          getCheckboxProps: (record: WithdrawalLogData) => ({
            disabled:
              record.status === "Completed" || record.status === "Cancelled"
          }),
          onChange: (id) => setChecked(id as []),
        }}
        columns={columnsArray}
        loading={loading}
        dataSource={data}
        tableLayout="auto"
        scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
        pagination={pagination}
        rowKey={(record) => `${record.id}-${record.transaction_type === 'level' ? 'bank' : record.transaction_type}`}
        rowClassName={(record, index) => {
          if (record.transaction_type === "usdt") {
            return "usdt-h-row no-hover"; 
          }
          
          if (record.last_deposit_type === "jeju-virtual") {
            return "jeju-h-row no-hover";
          }

          return index % 2 === 0 ? "white-row" : "gray-row";
        }}
        style={{
          marginTop: "1rem",
        }}
      />
    </>
  );
};

export default List;

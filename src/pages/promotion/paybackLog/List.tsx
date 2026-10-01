import CommaNumber from "@/components/CommaNumber";
import i18next from "@/i18n/i18n";
import DateText from "@/components/DateText";
import { OnHeaderCellType } from "@/hooks/useSort";
import { Button, Flex, Form, InputNumber, notification, PaginationProps, Table, TableProps } from "antd";
import { Link } from "react-router-dom";
import { KeyedMutator } from "swr";
import LossingStatusTag from "./component/LossingTag";
import { SWRType } from "@/api/types";
import { Key, useState } from "react";
import { PaybackListData } from "@/api/payback-logs/get";
import { postPaybackAmountAPI, updatePaybackAmountAPI } from "@/api/payback-logs/post";
import Percentage from "@/components/Percentage";
import AgentUsername from "@/components/AgentUsername";

interface Props {
  data: PaybackListData[];
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
  mutate: KeyedMutator<SWRType<PaybackListData[]>>;
}

const typeText: Record<string, string> = {
  level: i18next.t("col.level"),
  grade: i18next.t("col.grade"),
  write: i18next.t("promotion.entry")
}

const List = ({ data, loading, pagination, mutate, onHeaderCell }: Props) => {
  const [checked, setChecked] = useState<Key[]>([]);
  const [form] = Form.useForm();

  const handleSave =  async (id: number) => {
    try {
      const row = await form.validateFields();
      const updatedAmount = row[`updated_amount-${id}`]
      const res = await updatePaybackAmountAPI({id: id, amount: updatedAmount})
      if (res.data.code == 0) {
        notification.success({message: res.data.message});
      } else {
        notification.error({message: res.data.message});
      }
      console.log("Updated Row:", id, row, updatedAmount);
      // setEditingKey(null);
    } catch (error) {
      console.log("Validation Failed:", error);
    } finally {
      mutate();
    }
  }
  
  const handlePayment =  async () => {
    try {

      const forPayment = data.reduce<{id: number, status: number}[]>((acc, {id}) => {
        if (checked.includes(id)) acc.push({id, status:2})
        return acc;
      }, []);

      const res = await postPaybackAmountAPI({data: forPayment, system_note: ""});
      if (res.data.code == 0) {
        notification.success({message: res.data.message});
        setChecked([]);
        mutate();
      } else {
        notification.error({message: res.data.message});
      }
      // console.log("Paymetn Row:", checked);
      // setEditingKey(null);
    } catch (error) {
      console.log("Validation Failed:", error);
    }
  }
  

  const columns: TableProps["columns"] = [
    { 
      title: i18next.t("col.id"),
      dataIndex: 'username',
      key: 'username',
      align: "center",
      render: (value, record) => <Link to={`/user/${record.user_id}`}>{value}</Link>
    },
    { 
      title: i18next.t("col.name"), 
      dataIndex: 'name',
      key: 'name',
      align: "center" ,
      render: (value) => (value ? value : "-"),
    },
    { 
      title: i18next.t("col.agent"), 
      dataIndex: 'agent_username',
      key: 'agent_username',
      align: "center" ,
      render: (value, record) => <AgentUsername treeDepth={record.tree_depth} username={value} />,
    },
    { 
      title: i18next.t("title.settlementPeriod"), 
      dataIndex: 'settlement_date',
      key: 'settlement_date',
      align: "center" ,
      render: (_value: string, record: PaybackListData) => <div className=""><DateText date={record.start_date} /> - <DateText date={record.end_date} /></div>,
    },
    { 
      title: i18next.t("memberInfo.mi023"), 
      dataIndex: 'deposit_sum',
      key: 'deposit_sum',
      align: "center" ,
      render: (value: number) => <CommaNumber value={value} />,
    },
    { 
      title: i18next.t("memberInfo.mi024"),
      dataIndex: 'withdrawal_sum',
      key: 'withdrawal_sum',
      align: "center", 
      render: (value: number) => <div className="" style={{minWidth: 40}}><CommaNumber value={value}  /></div>,
    },
    { 
      title: i18next.t("memberInfo.mi025"), 
      dataIndex: 'dw_sum',
      key: 'dw_sum',
      align: "center",
      render: (_value: number, record: PaybackListData) => <CommaNumber value={record.deposit_sum - record.withdrawal_sum} />,
    },
    { 
      title: i18next.t("col.balance"), 
      dataIndex: 'reserves',
      key: 'reserves',
      align: "center",
      render: (value) => <div className="" style={{minWidth: 30}}><CommaNumber value={value}  /></div>,
    },
    { 
      title: i18next.t("title.type"), 
      dataIndex: 'type',
      key: 'type',
      align: "center",
      render: (value: string) => typeText[value] || value,
    },
    { 
      title: i18next.t("col.paybackPercent"), 
      dataIndex: 'lossing_percentage',
      key: 'lossing_percentage',
      align: "center",
      render: (value: number) => <div className="" style={{minWidth: 30}}><Percentage value={(value || 0) * 100} onlyNumber /></div>,
    },
    { 
      title: i18next.t("col.payoutAmount"), 
      dataIndex: 'amount',
      key: 'amount',
      align: "center",
      render: (value: number) => <CommaNumber value={value} />,
    },
    { 
      title: i18next.t("title.adjustmentAmount"), 
      dataIndex: 'adjustment_amount',
      key: 'adjustment_amount',
      align: "center",
      width: 200,
      render: (_value: number, record: PaybackListData) => (
        <Flex gap={4} align="center" justify="center" style={{maxWidth: 200}}>
          <Form 
            form={form} 
            component={false} 
            initialValues={{ [`updated_amount-${record.id}`]: record.adjustment_amount ?? 0 }} 
            disabled={record.lossing_format === 'automatic' || record.status === 3} 
          >
            <Form.Item name={`updated_amount-${record.id}`}  noStyle>
              <InputNumber size="small" style={{width: '100%'}} controls />
            </Form.Item>
            <Button htmlType="submit" size="small" onClick={() => handleSave(record.id)}>{i18next.t("sportsBet.edit")}</Button>
          </Form>
        </Flex>
    ),
    },
    { 
      title: i18next.t("title.actualPayout"), 
      dataIndex: 'actual_amount',
      key: 'actual_amount',
      align: "center",
      render: (value: number, record: PaybackListData) => <CommaNumber value={record.status === 2 ? value  : (record.amount + record.adjustment_amount)} />,
    },
    { 
      title: i18next.t("title.payoutDateTimeTitle"), 
      dataIndex: 'updated_at',
      key: 'updated_at',
      align: "center" ,
      render: (value: string) => <DateText date={value} timeStamp />,
    },
    { 
      title: i18next.t("col.payoutStatus"), 
      dataIndex: 'status',
      key: 'status',
      align: "center" ,
      render: (value: number) => <LossingStatusTag status={value} />,
    },
  ];

  const columnsArray = columns.map((item) =>
    item.key !== "action" && item.key ? { ...item, onHeaderCell } : item
  );

  return (
    <>
      <Flex>
        <Button onClick={handlePayment} style={{marginBottom: 10, marginLeft: 'auto'}} disabled={checked.length < 1}>{i18next.t("moneyType.pay")}</Button>
      </Flex>
      <Table
        sticky
        rowSelection={{
          type: "checkbox",
          selectedRowKeys: checked,
          getCheckboxProps: (record: PaybackListData) => ({
            disabled:
             record.lossing_format === 'automatic' || record.status === 2 || record.status === 3,
          }),
          onChange: (key) => setChecked(key),
        }}
        rowKey={'id'}
        dataSource={data}
        loading={loading}
        columns={columnsArray} 
        tableLayout="auto"
        scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
        pagination={pagination}
      />;
    </>
  )
};

export default List;

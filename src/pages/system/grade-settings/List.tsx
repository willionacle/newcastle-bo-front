import { GradePolicyData } from "@/api/grade-policies/get";
import i18next from "@/i18n/i18n";
import { updateGradePolicy, UpdateGradePolicyRequest } from "@/api/grade-policies/put";
import CommaNumber from "@/components/CommaNumber";
import { EditOutlined } from "@ant-design/icons";
import {
  Table,
  TableProps,
  notification,
  Input,
  InputNumber,
  Form,
  Button
} from "antd";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface Props {
  data: GradePolicyData[];
  loading: boolean;
  mutate: KeyedMutator<any>;
}

const List = ({ data, loading, mutate }: Props) => {
  const { t } = useTranslation();
  const [editingKey, setEditingKey] = useState<number | null>(null);
  const [form] = Form.useForm();

  const isEditing = (record: GradePolicyData) => record.gradeId === editingKey;

  const edit = (record: GradePolicyData) => {
    form.setFieldsValue({
      gradeName: record.gradeName,
      minUsageDays: record.minUsageDays,
      gradeUpCoupon: record.gradeUpCoupon,
      paybackRate: record.paybackRate,
      maxPayback: record.maxPayback,
      rollingLivePct: record.rollingLivePct,
      rollingSlotPct: record.rollingSlotPct,
      rollingSportsPct: record.rollingSportsPct,
      rollingMinigamePct: record.rollingMinigamePct,
      totalAmount: record.totalAmount,
      slotAmount: record.slotAmount,
      liveAmount: record.liveAmount,
      sportsAmount: record.sportsAmount,
      minigameAmount: record.minigameAmount,
    });
    setEditingKey(record.gradeId);
  };

  const cancel = () => {
    setEditingKey(null);
  };

  const save = async (gradeId: number) => {
    try {
      const row = await form.validateFields();

      const updateData: UpdateGradePolicyRequest = {
        gradeId,
        gradeName: row.gradeName,
        minUsageDays: row.minUsageDays,
        gradeUpCoupon: row.gradeUpCoupon || null,
        paybackRate: row.paybackRate,
        maxPayback: row.maxPayback,
        rollingLivePct: row.rollingLivePct,
        rollingSlotPct: row.rollingSlotPct,
        rollingSportsPct: row.rollingSportsPct,
        rollingMinigamePct: row.rollingMinigamePct,
        totalAmount: row.totalAmount ?? null,
        slotAmount: row.slotAmount ?? null,
        liveAmount: row.liveAmount ?? null,
        sportsAmount: row.sportsAmount ?? null,
        minigameAmount: row.minigameAmount ?? null,
      };

      const response = await updateGradePolicy(updateData);

      if (response.data.code === 0) {
        notification.success({ message: t("toast.grade.updateSuccess") });
        setEditingKey(null);
        mutate();
      } else {
        notification.error({ message: response.data.message });
      }
    } catch (error) {
      console.error('Update error:', error);
      notification.error({ message: t("toast.common.updateError") });
    }
  };

  const columnsArray: TableProps<GradePolicyData>["columns"] = [
    {
      title: i18next.t("title.gradeId"),
      dataIndex: "gradeId",
      key: "gradeId",
      align: "center",
      width: 80,
    },
    {
      title: i18next.t("title.gradeName"),
      dataIndex: "gradeName",
      key: "gradeName",
      align: "center",
      width: 120,
      render: (text: string, record: GradePolicyData) => {
        const editing = isEditing(record);
        return editing ? (
          <Form.Item
            name="gradeName"
            style={{ margin: 0 }}
            rules={[{ required: true, message: t("validation.enterGradeName") }]}
          >
            <Input maxLength={20} />
          </Form.Item>
        ) : (
          text
        );
      },
    },
    {
      title: i18next.t("title.minUsageDays"),
      dataIndex: "minUsageDays",
      key: "minUsageDays",
      align: "center",
      width: 120,
      render: (value: number, record: GradePolicyData) => {
        const editing = isEditing(record);
        return editing ? (
          <Form.Item
            name="minUsageDays"
            style={{ margin: 0 }}
            rules={[{ required: true, message: t("validation.enterMinUsageDays") }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        ) : (
          `${value}일`
        );
      },
    },
    {
      title: i18next.t("title.gradeUpCoupon"),
      dataIndex: "gradeUpCoupon",
      key: "gradeUpCoupon",
      align: "center",
      width: 140,
      render: (value: number | null, record: GradePolicyData) => {
        const editing = isEditing(record);
        return editing ? (
          <Form.Item
            name="gradeUpCoupon"
            style={{ margin: 0 }}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
            />
          </Form.Item>
        ) : (
          value ? <CommaNumber value={value} /> : "-"
        );
      },
    },
    {
      title: i18next.t("title.paybackRatePct"),
      dataIndex: "paybackRate",
      key: "paybackRate",
      align: "center",
      width: 120,
      render: (value: number, record: GradePolicyData) => {
        const editing = isEditing(record);
        return editing ? (
          <Form.Item
            name="paybackRate"
            style={{ margin: 0 }}
            rules={[{ required: true, message: t("validation.enterPaybackRate") }]}
          >
            <InputNumber
              min={0}
              max={100}
              step={0.001}
              style={{ width: "100%" }}
            />
          </Form.Item>
        ) : (
          `${value}%`
        );
      },
    },
    {
      title: i18next.t("title.maxPaybackTitle"),
      dataIndex: "maxPayback",
      key: "maxPayback",
      align: "center",
      width: 140,
      render: (value: number, record: GradePolicyData) => {
        const editing = isEditing(record);
        return editing ? (
          <Form.Item
            name="maxPayback"
            style={{ margin: 0 }}
            rules={[{ required: true, message: t("validation.enterMaxPayback") }]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
            />
          </Form.Item>
        ) : (
          <CommaNumber value={value} />
        );
      },
    },
    {
      title: i18next.t("title.liveRollingRatePct"),
      dataIndex: "rollingLivePct",
      key: "rollingLivePct",
      align: "center",
      width: 140,
      render: (value: number, record: GradePolicyData) => {
        const editing = isEditing(record);
        return editing ? (
          <Form.Item
            name="rollingLivePct"
            style={{ margin: 0 }}
            rules={[{ required: true, message: t("validation.enterLiveRollingRate") }]}
          >
            <InputNumber
              min={0}
              max={100}
              step={0.001}
              style={{ width: "100%" }}
            />
          </Form.Item>
        ) : (
          `${value}%`
        );
      },
    },
    {
      title: i18next.t("title.slotRollingRatePct"),
      dataIndex: "rollingSlotPct",
      key: "rollingSlotPct",
      align: "center",
      width: 140,
      render: (value: number, record: GradePolicyData) => {
        const editing = isEditing(record);
        return editing ? (
          <Form.Item
            name="rollingSlotPct"
            style={{ margin: 0 }}
            rules={[{ required: true, message: t("validation.enterSlotRollingRate") }]}
          >
            <InputNumber
              min={0}
              max={100}
              step={0.001}
              style={{ width: "100%" }}
            />
          </Form.Item>
        ) : (
          `${value}%`
        );
      },
    },
    {
      title: i18next.t("title.sportsRollingRatePct"),
      dataIndex: "rollingSportsPct",
      key: "rollingSportsPct",
      align: "center",
      width: 140,
      render: (value: number, record: GradePolicyData) => {
        const editing = isEditing(record);
        return editing ? (
          <Form.Item
            name="rollingSportsPct"
            style={{ margin: 0 }}
            rules={[{ required: true, message: t("validation.enterSportsRollingRate") }]}
          >
            <InputNumber
              min={0}
              max={100}
              step={0.001}
              style={{ width: "100%" }}
            />
          </Form.Item>
        ) : (
          `${value}%`
        );
      },
    },
    {
      title: i18next.t("title.minigameRollingRatePct"),
      dataIndex: "rollingMinigamePct",
      key: "rollingMinigamePct",
      align: "center",
      width: 140,
      render: (value: number, record: GradePolicyData) => {
        const editing = isEditing(record);
        return editing ? (
          <Form.Item
            name="rollingMinigamePct"
            style={{ margin: 0 }}
            rules={[{ required: true, message: t("validation.enterMinigameRollingRate") }]}
          >
            <InputNumber
              min={0}
              max={100}
              step={0.001}
              style={{ width: "100%" }}
            />
          </Form.Item>
        ) : (
          `${value}%`
        );
      },
    },
    {
      title: i18next.t("title.gradeDailyBetTotal"),
      dataIndex: "totalAmount",
      key: "totalAmount",
      align: "center",
      width: 160,
      render: (value: number | null, record: GradePolicyData) => {
        const editing = isEditing(record);
        return editing ? (
          <Form.Item
            name="totalAmount"
            style={{ margin: 0 }}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value!.replace(/\$\s?|(,*)/g, "") as any}
            />
          </Form.Item>
        ) : (
          value !== null ? <CommaNumber value={value} /> : i18next.t("status.notSet")
        );
      },
    },
    {
      title: i18next.t("title.gradeDailyBetSlot"),
      dataIndex: "slotAmount",
      key: "slotAmount",
      align: "center",
      width: 160,
      render: (value: number | null, record: GradePolicyData) => {
        const editing = isEditing(record);
        return editing ? (
          <Form.Item
            name="slotAmount"
            style={{ margin: 0 }}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value!.replace(/\$\s?|(,*)/g, "") as any}
            />
          </Form.Item>
        ) : (
          value !== null ? <CommaNumber value={value} /> : i18next.t("status.notSet")
        );
      },
    },
    {
      title: i18next.t("title.gradeDailyBetLive"),
      dataIndex: "liveAmount",
      key: "liveAmount",
      align: "center",
      width: 160,
      render: (value: number | null, record: GradePolicyData) => {
        const editing = isEditing(record);
        return editing ? (
          <Form.Item
            name="liveAmount"
            style={{ margin: 0 }}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value!.replace(/\$\s?|(,*)/g, "") as any}
            />
          </Form.Item>
        ) : (
          value !== null ? <CommaNumber value={value} /> : i18next.t("status.notSet")
        );
      },
    },
    {
      title: i18next.t("title.gradeDailyBetSports"),
      dataIndex: "sportsAmount",
      key: "sportsAmount",
      align: "center",
      width: 160,
      render: (value: number | null, record: GradePolicyData) => {
        const editing = isEditing(record);
        return editing ? (
          <Form.Item
            name="sportsAmount"
            style={{ margin: 0 }}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value!.replace(/\$\s?|(,*)/g, "") as any}
            />
          </Form.Item>
        ) : (
          value !== null ? <CommaNumber value={value} /> : i18next.t("status.notSet")
        );
      },
    },
    {
      title: i18next.t("title.gradeDailyBetMinigame"),
      dataIndex: "minigameAmount",
      key: "minigameAmount",
      align: "center",
      width: 180,
      render: (value: number | null, record: GradePolicyData) => {
        const editing = isEditing(record);
        return editing ? (
          <Form.Item
            name="minigameAmount"
            style={{ margin: 0 }}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value!.replace(/\$\s?|(,*)/g, "") as any}
            />
          </Form.Item>
        ) : (
          value !== null ? <CommaNumber value={value} /> : i18next.t("status.notSet")
        );
      },
    },
    {
      title: i18next.t("title.action"),
      align: "center",
      width: 120,
      render: (_, record: GradePolicyData) => {
        const editing = isEditing(record);
        return editing ? (
          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            <Button
              size="small"
              type="primary"
              onClick={() => save(record.gradeId)}
            >
              저장
            </Button>
            <Button size="small" onClick={cancel}>
              {i18next.t("global.cancel")}
            </Button>
          </div>
        ) : (
          <Button
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => edit(record)}
          />
        );
      },
    },
  ];

  return (
    <Form form={form} component={false}>
      <Table
        sticky
        rowKey="gradeId"
        loading={loading}
        dataSource={data}
        columns={columnsArray}
        tableLayout="auto"
        scroll={{ x: 1400 }}
        pagination={false}
      />
    </Form>
  );
};

export default List;

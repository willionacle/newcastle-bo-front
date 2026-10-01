import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Switch,
  TimePicker,
  Typography,
  notification,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";
import useUserStore from "@/store/user.store";
import AgentSelect from "@/components/AgentSelect";
import SearchableUserSelect from "@/components/SearchableUserSelect";
import SaveBtn from "@/components/SaveBtn";
import { upsertTransactionRuleAPI } from "@/api/transaction-rules/post";
import { TransactionRule, TransactionRuleBody, TransactionRuleMetaData } from "@/api/transaction-rules/types";

const { TextArea } = Input;

interface Props {
  open: boolean;
  data?: TransactionRule;
  meta?: TransactionRuleMetaData;
  onClose: () => void;
  onSaved: () => void;
}

const n = (v: unknown): number | null =>
  v === undefined || v === null || v === "" ? null : (v as number);

const timeToWire = (v?: Dayjs | null): string | null => (v ? v.format("HH:mm") : null);
const timeFromWire = (v: string | null | undefined): Dayjs | undefined =>
  v ? dayjs(v, "HH:mm") : undefined;

const FormModal = ({ open, data, meta, onClose, onSaved }: Props) => {
  const { t } = useTranslation();
  const { token } = useUserStore.getState();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const targetType = Form.useWatch("targetType", form);

  const isEditing = !!data;

  const allFields = useMemo(
    () => [
      ...(meta?.fieldGroups.deposit ?? []),
      ...(meta?.fieldGroups.withdraw ?? []),
      ...(meta?.fieldGroups.bonus ?? []),
    ],
    [meta]
  );

  useEffect(() => {
    if (!open) return;

    const fieldValues: Record<string, unknown> = {};
    allFields.forEach((field) => {
      const raw = (data as Record<string, unknown> | undefined)?.[field];
      if (field === "block_first_bonus") {
        fieldValues[field] = raw === true ? "block" : raw === false ? "allow" : "inherit";
        return;
      }
      if (field === "first_bonus_point_rate") {
        fieldValues[field] = raw == null ? undefined : (raw as number) * 100;
        return;
      }
      if (meta?.timeFields.includes(field)) {
        fieldValues[field] = timeFromWire(raw as string | null);
        return;
      }
      fieldValues[field] = raw ?? undefined;
    });

    form.setFieldsValue({
      name: data?.name ?? "",
      targetType: data?.targetType ?? meta?.targets[0]?.key ?? "global",
      isActive: data?.isActive ?? true,
      memo: data?.memo ?? undefined,
      ...fieldValues,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, data, meta]);

  const bothOrNeitherRule = (fromKey: string, toKey: string) => ({
    validator: async () => {
      const from = form.getFieldValue(fromKey);
      const to = form.getFieldValue(toKey);
      if ((from && !to) || (!from && to)) {
        return Promise.reject(new Error(t("transactionRules.blockWindowBothRequired")));
      }
      return Promise.resolve();
    },
  });

  const renderField = (field: string) => {
    const label = meta?.fieldLabels[field] ?? field;

    if (field === "block_first_bonus") {
      return (
        <Col span={24} key={field}>
          <Form.Item label={label} name={field}>
            <Radio.Group>
              <Radio value="inherit">{t("transactionRules.blockFirstBonus.inherit")}</Radio>
              <Radio value="allow">{t("transactionRules.blockFirstBonus.allow")}</Radio>
              <Radio value="block">{t("transactionRules.blockFirstBonus.block")}</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
      );
    }

    if (field === "first_bonus_point_rate") {
      return (
        <Col span={8} key={field}>
          <Form.Item label={`${label} (%)`} name={field}>
            <InputNumber<number>
              style={{ width: "100%" }}
              min={0}
              max={100}
              formatter={(value) => (value === undefined || value === null ? "" : `${value}%`)}
              parser={(value) => (value ? Number(value.replace(/%\s?/g, "")) : 0)}
            />
          </Form.Item>
        </Col>
      );
    }

    if (meta?.timeFields.includes(field)) {
      const fromKey = field.replace(/_to$/, "_from");
      const toKey = field.replace(/_from$/, "_to");
      const isPaired = fromKey !== toKey && meta.timeFields.includes(fromKey) && meta.timeFields.includes(toKey);
      return (
        <Col span={8} key={field}>
          <Form.Item label={label} name={field} rules={isPaired ? [bothOrNeitherRule(fromKey, toKey)] : []}>
            <TimePicker format="HH:mm" style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      );
    }

    return (
      <Col span={8} key={field}>
        <Form.Item label={label} name={field}>
          <InputNumber<number>
            style={{ width: "100%" }}
            min={0}
            formatter={(value) =>
              value === undefined || value === null
                ? ""
                : `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => (value ? Number(value.replace(/,/g, "")) : 0)}
          />
        </Form.Item>
      </Col>
    );
  };

  const handleSubmit = async (values: Record<string, any>) => {
    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        name: values.name,
        targetType: values.targetType,
        targetValue:
          values.targetType === "global" ? "" : values.targetValue?.value ?? values.targetValue ?? "",
        isActive: !!values.isActive,
        memo: n(values.memo),
      };

      allFields.forEach((field) => {
        if (field === "block_first_bonus") {
          const v = values.block_first_bonus;
          body.block_first_bonus = v === "block" ? true : v === "allow" ? false : null;
          return;
        }
        if (field === "first_bonus_point_rate") {
          body.first_bonus_point_rate =
            values.first_bonus_point_rate == null || values.first_bonus_point_rate === ""
              ? null
              : values.first_bonus_point_rate / 100;
          return;
        }
        if (meta?.timeFields.includes(field)) {
          body[field] = timeToWire(values[field]);
          return;
        }
        body[field] = n(values[field]);
      });

      const res = await upsertTransactionRuleAPI(body as TransactionRuleBody, token);
      const { code, message } = res.data;
      if (code === 0) {
        notification.success({
          message: t(isEditing ? "toast.common.updateSuccess" : "toast.common.createSuccess"),
        });
        onSaved();
      } else {
        notification.error({ message });
      }
    } catch (error) {
      notification.error({ message: t("toast.common.actionFailed") });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      title={isEditing ? t("transactionRules.editTitle") : t("transactionRules.createTitle")}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={880}
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Row gutter={16}>
          <Col span={14}>
            <Form.Item label={t("transactionRules.name")} name="name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label={t("transactionRules.isActive")} name="isActive" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label={t("transactionRules.memo")} name="memo">
              <TextArea rows={2} />
            </Form.Item>
          </Col>
        </Row>

        <Divider />
        <Typography.Text strong>{t("transactionRules.targetSection")}</Typography.Text>
        {isEditing && (
          <Alert
            type="info"
            showIcon
            message={t("transactionRules.targetLockedHint")}
            style={{ margin: "8px 0" }}
          />
        )}
        <Form.Item name="targetType" rules={[{ required: true }]} style={{ marginTop: 8 }}>
          <Radio.Group disabled={isEditing}>
            {meta?.targets.map((tg) => (
              <Radio key={tg.key} value={tg.key}>
                {tg.labelKo}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>

        {targetType === "partner" && (
          <AgentSelect
            name="targetValue"
            required
            label={t("transactionRules.targetValue")}
            initialValue={data?.targetType === "partner" ? data.targetValue : undefined}
          />
        )}
        {targetType === "user" && (
          <SearchableUserSelect
            name={["targetValue"]}
            required
            label={t("transactionRules.targetValue")}
            initialValue={data?.targetType === "user" ? data.targetValue : undefined}
          />
        )}

        <Divider />

        {meta && (
          <>
            <Card size="small" title={t("transactionRules.group.deposit")} style={{ marginBottom: 16 }}>
              <Row gutter={16}>{meta.fieldGroups.deposit.map(renderField)}</Row>
            </Card>
            <Card size="small" title={t("transactionRules.group.withdraw")} style={{ marginBottom: 16 }}>
              <Row gutter={16}>{meta.fieldGroups.withdraw.map(renderField)}</Row>
            </Card>
            <Card size="small" title={t("transactionRules.group.bonus")} style={{ marginBottom: 16 }}>
              <Row gutter={16}>{meta.fieldGroups.bonus.map(renderField)}</Row>
            </Card>
          </>
        )}

        <SaveBtn loading={submitting} />
      </Form>
    </Modal>
  );
};

export default FormModal;

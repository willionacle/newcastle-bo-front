import { Form, Input, Modal, Select, notification } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getDailyMissionGroupListAPI } from "@/api/daily-mission/get";
import {
  createDailyMissionGroupTemplateAPI,
  templateErrorMessage,
} from "@/api/daily-mission/template/mutate";

interface Props {
  open: boolean;
  onClose: () => void;
  /** Fixed source group (row button on the group list). Omit to show a group picker. */
  groupId?: number;
  /** Pre-filled template name (e.g. the source group's name). */
  defaultName?: string;
  onSaved?: () => void;
}

interface FormValues {
  name: string;
  fromGroupId: number;
}

/** Lazily mounted so the group list is only fetched when the picker is shown. */
const GroupPicker = ({ value, onChange, onPick }: {
  value?: number;
  onChange?: (v: number) => void;
  onPick: (name: string) => void;
}) => {
  const { t } = useTranslation();
  const { swr } = getDailyMissionGroupListAPI();
  const options = (swr.data?.data ?? []).map((g) => ({ label: g.name, value: g.id }));

  return (
    <Select
      showSearch
      optionFilterProp="label"
      loading={swr.isLoading}
      options={options}
      value={value}
      placeholder={t("missionTemplate.selectGroup")}
      onChange={(v, option) => {
        onChange?.(v);
        const label = (Array.isArray(option) ? option[0] : option)?.label;
        if (typeof label === "string") onPick(label);
      }}
    />
  );
};

const SaveAsTemplateModal = ({ open, onClose, groupId, defaultName, onSaved }: Props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<FormValues>();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue({ name: defaultName ?? "" });
    }
  }, [open, groupId, defaultName]);

  const handleOk = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      const res = await createDailyMissionGroupTemplateAPI({
        name: values.name.trim(),
        fromGroupId: Number(groupId ?? values.fromGroupId),
      });
      if (res?.code === 0) {
        notification.success({ message: res.message || t("toast.common.saveSuccess") });
        onSaved?.();
        onClose();
      } else {
        notification.error({ message: res?.message || t("global.fail") });
      }
    } catch (error) {
      notification.error({ message: templateErrorMessage(error, t("global.fail")) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      title={groupId ? t("missionTemplate.saveAsTemplate") : t("missionTemplate.createFromGroup")}
      onCancel={onClose}
      onOk={handleOk}
      okText={t("global.save")}
      cancelText={t("global.cancel")}
      confirmLoading={saving}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        {!groupId && (
          <Form.Item
            label={t("missionTemplate.sourceGroup")}
            name="fromGroupId"
            rules={[{ required: true, message: t("missionTemplate.selectGroup") }]}
          >
            <GroupPicker
              onPick={(name) => {
                if (!form.getFieldValue("name")) form.setFieldValue("name", name);
              }}
            />
          </Form.Item>
        )}
        <Form.Item
          label={t("missionTemplate.name")}
          name="name"
          rules={[{ required: true, whitespace: true, message: t("missionTemplate.enterName") }]}
        >
          <Input maxLength={100} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SaveAsTemplateModal;

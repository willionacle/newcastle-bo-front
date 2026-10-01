import { useEffect, useState } from "react";
import {
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Switch,
  Tag,
  notification,
} from "antd";
import { useTranslation } from "react-i18next";
import useUserStore from "@/store/user.store";
import { InquiryTemplate, InquiryTemplatesMetaRes } from "@/api/inquiry-templates/get";
import { createInquiryTemplateAPI, previewInquiryTemplateAPI } from "@/api/inquiry-templates/post";
import { updateInquiryTemplateAPI } from "@/api/inquiry-templates/put";
import SaveBtn from "@/components/SaveBtn";

const { TextArea } = Input;

interface FormData {
  category: string;
  title: string;
  content: string;
  sortOrder?: number;
  isActive: boolean;
}

interface Props {
  open: boolean;
  data?: InquiryTemplate;
  meta?: InquiryTemplatesMetaRes["data"];
  onClose: () => void;
  onSaved: () => void;
}

const FormModal = ({ open, data, meta, onClose, onSaved }: Props) => {
  const { t } = useTranslation();
  const { token } = useUserStore.getState();
  const [form] = Form.useForm<FormData>();
  const content = Form.useWatch("content", form) ?? "";
  const [preview, setPreview] = useState<{ rendered: string; unresolved: string[] } | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    form.setFieldsValue({
      category: data?.category ?? meta?.anyCategory ?? "*",
      title: data?.title ?? "",
      content: data?.content ?? "",
      sortOrder: data?.sortOrder ?? 10,
      isActive: data?.isActive ?? true,
    });
    setPreview(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, data]);

  // Debounced — it's a read, but there is no reason to call it per keystroke.
  useEffect(() => {
    if (!open || !content.trim()) {
      setPreview(null);
      return;
    }

    setPreviewing(true);
    const handle = setTimeout(async () => {
      try {
        const res = await previewInquiryTemplateAPI(content, undefined, token);
        setPreview(res.data?.data ?? null);
      } catch (error) {
        console.error(error);
      } finally {
        setPreviewing(false);
      }
    }, 500);

    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, open]);

  const insertPlaceholder = (tokenStr: string) => {
    const current = form.getFieldValue("content") ?? "";
    form.setFieldValue("content", `${current}${tokenStr}`);
  };

  const handleSubmit = async (values: FormData) => {
    setSubmitting(true);
    try {
      const body = {
        category: values.category,
        title: values.title,
        content: values.content,
        sortOrder: values.sortOrder,
        isActive: values.isActive,
      };

      const res = data
        ? await updateInquiryTemplateAPI(data.id, body, token)
        : await createInquiryTemplateAPI(body, token);

      const { code, message } = res.data;
      if (code === 0) {
        notification.success({
          message: t(data ? "toast.common.updateSuccess" : "toast.common.createSuccess"),
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
      title={data ? t("inquiryTemplate.editTitle") : t("inquiryTemplate.createTitle")}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={720}
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t("inquiryTemplate.category")}
              name="category"
              rules={[{ required: true }]}
            >
              <Select>
                {meta?.categories.map((c) => (
                  <Select.Option key={c.key} value={c.key}>
                    {c.labelKo}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={t("inquiryTemplate.sortOrder")} name="sortOrder">
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={t("inquiryTemplate.isActive")}
              name="isActive"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={t("inquiryTemplate.title")}
              name="title"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Space wrap style={{ marginBottom: 8 }}>
              {meta?.placeholders.map((p) => (
                <Tag
                  key={p.token}
                  style={{ cursor: "pointer" }}
                  onClick={() => insertPlaceholder(p.token)}
                  title={p.description}
                >
                  {p.labelKo}
                </Tag>
              ))}
            </Space>
            <Form.Item
              label={t("inquiryTemplate.content")}
              name="content"
              rules={[{ required: true }]}
            >
              {/* Plain text, not the rich-text editor used for 쪽지 templates —
                  one_to_one_inquiries.answer is a plain TEXT column. */}
              <TextArea rows={6} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <div style={{ color: "var(--ant-color-text-secondary)", fontSize: 12, marginBottom: 4 }}>
              {t("inquiryTemplate.previewLabel")}
            </div>
            <div
              style={{
                whiteSpace: "pre-wrap",
                border: "1px dashed var(--ant-color-split)",
                borderRadius: 4,
                padding: 8,
                minHeight: 60,
                color: previewing ? "var(--ant-color-text-secondary)" : undefined,
              }}
            >
              {preview?.rendered || t("inquiryTemplate.previewEmpty")}
            </div>
            {!!preview?.unresolved?.length && (
              <div style={{ color: "var(--ant-color-warning-text)", fontSize: 12, marginTop: 4 }}>
                {t("inquiryTemplate.unresolvedWarning", { tokens: preview.unresolved.join(", ") })}
              </div>
            )}
          </Col>
        </Row>

        <SaveBtn loading={submitting} />
      </Form>
    </Modal>
  );
};

export default FormModal;

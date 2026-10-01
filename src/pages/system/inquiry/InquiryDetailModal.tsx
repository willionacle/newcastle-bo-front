import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Descriptions,
  Divider,
  Input,
  Modal,
  Select,
  Space,
  notification,
} from "antd";
import { useTranslation } from "react-i18next";
import useUserStore from "@/store/user.store";
import { InquiryItem, InquiryStatus } from "@/api/inquiry/get";
import { answerInquiryAPI, updateInquiryStatusAPI } from "@/api/inquiry/patch";
import { InquiryCategoryOption } from "@/api/inquiry/categories";
import {
  InquiryTemplateRendered,
  inquiryTemplatesForInquiryAPI,
} from "@/api/inquiry-templates/get";
import DateText from "@/components/DateText";

const { TextArea } = Input;

interface Props {
  open: boolean;
  data?: InquiryItem;
  categories: InquiryCategoryOption[];
  onClose: () => void;
  onUpdated: (item: InquiryItem) => void;
}

// Templates come back pre-grouped: this inquiry's own category first, then "*",
// sortOrder within each, most-used first as a tiebreak. Group adjacent runs
// rather than re-sorting, so that ordering is preserved exactly as given.
const groupByCategory = (templates: InquiryTemplateRendered[]) =>
  templates.reduce<{ category: string; items: InquiryTemplateRendered[] }[]>((acc, tpl) => {
    const last = acc[acc.length - 1];
    if (last && last.category === tpl.category) {
      last.items.push(tpl);
    } else {
      acc.push({ category: tpl.category, items: [tpl] });
    }
    return acc;
  }, []);

const InquiryDetailModal = ({ open, data, categories, onClose, onUpdated }: Props) => {
  const { t } = useTranslation();
  const { token } = useUserStore.getState();
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<InquiryStatus | undefined>(data?.status);
  const [submitting, setSubmitting] = useState(false);
  const [templates, setTemplates] = useState<InquiryTemplateRendered[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | undefined>();

  const categoryLabel = (key?: string) =>
    key === "*"
      ? t("inquiryTemplate.anyCategory")
      : categories.find((c) => c.key === key)?.labelKo ?? key ?? "";

  useEffect(() => {
    setAnswer(data?.answer ?? "");
    setStatus(data?.status);
    setSelectedTemplateId(undefined);
  }, [data]);

  useEffect(() => {
    if (!open || !data) {
      setTemplates([]);
      return;
    }

    setTemplatesLoading(true);
    (async () => {
      try {
        const res = await inquiryTemplatesForInquiryAPI(data.id, token);
        setTemplates(res.data?.data?.templates ?? []);
      } catch (error) {
        console.error(error);
      } finally {
        setTemplatesLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, data?.id]);

  const selectedTemplate = templates.find((tpl) => tpl.id === selectedTemplateId);

  const handleSelectTemplate = (id: number) => {
    const tpl = templates.find((t) => t.id === id);
    if (!tpl) return;
    setSelectedTemplateId(id);
    setAnswer(tpl.rendered);
  };

  const handleAnswer = async () => {
    if (!data || !answer.trim()) return;

    setSubmitting(true);
    try {
      const res = await answerInquiryAPI(data.id, answer.trim(), token, selectedTemplateId);
      const {
        data: { code, message, data: updated },
      } = res;

      if (code === 0) {
        notification.success({ message: t("toast.common.updateSuccess") });
        onUpdated(updated);
      } else {
        notification.error({ message });
      }
    } catch (error) {
      notification.error({ message: t("toast.common.updateFailed") });
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (value: InquiryStatus) => {
    if (!data) return;

    setStatus(value);
    try {
      const res = await updateInquiryStatusAPI(data.id, value, token);
      const {
        data: { code, message, data: updated },
      } = res;

      if (code === 0) {
        notification.success({ message: t("toast.common.updateSuccess") });
        onUpdated(updated);
      } else {
        notification.error({ message });
      }
    } catch (error) {
      notification.error({ message: t("toast.common.updateFailed") });
    }
  };

  const groups = groupByCategory(templates);

  return (
    <Modal
      open={open}
      title={data?.title}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={600}
    >
      {data && (
        <>
          <Descriptions column={1} size="small" bordered>
            <Descriptions.Item label={t("inquiry.username")}>
              {data.username}
            </Descriptions.Item>
            <Descriptions.Item label={t("inquiry.category")}>
              {categoryLabel(data.category)}
            </Descriptions.Item>
            <Descriptions.Item label={t("inquiry.createdAt")}>
              <DateText date={data.createdAt} timeStamp />
            </Descriptions.Item>
            <Descriptions.Item label={t("inquiry.status")}>
              <Select
                size="small"
                value={status}
                style={{ width: 140 }}
                onChange={handleStatusChange}
                options={[
                  { value: "pending", label: t("inquiry.statusPending") },
                  { value: "answered", label: t("inquiry.statusAnswered") },
                  { value: "closed", label: t("inquiry.statusClosed") },
                ]}
              />
            </Descriptions.Item>
          </Descriptions>

          <Divider />
          <p style={{ whiteSpace: "pre-wrap" }}>{data.content}</p>

          <Divider />

          <Select
            style={{ width: "100%", marginBottom: 8 }}
            placeholder={t("inquiryTemplate.pickerPlaceholder")}
            loading={templatesLoading}
            value={selectedTemplateId}
            onChange={handleSelectTemplate}
            options={groups.map((group) => ({
              label: categoryLabel(group.category),
              options: group.items.map((tpl) => ({
                value: tpl.id,
                label: tpl.unresolved.length
                  ? `${tpl.title} (${tpl.useCount}) ⚠`
                  : `${tpl.title} (${tpl.useCount})`,
              })),
            }))}
          />

          {!!selectedTemplate?.unresolved.length && (
            <Alert
              type="warning"
              showIcon
              style={{ marginBottom: 8 }}
              message={t("inquiryTemplate.unresolvedWarning", {
                tokens: selectedTemplate.unresolved.join(", "),
              })}
            />
          )}

          <TextArea
            rows={4}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={t("inquiry.answer")}
          />
          <Space style={{ marginTop: 12 }}>
            <Button type="primary" loading={submitting} onClick={handleAnswer}>
              {t("inquiry.submitAnswer")}
            </Button>
          </Space>
        </>
      )}
    </Modal>
  );
};

export default InquiryDetailModal;

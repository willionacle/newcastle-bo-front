import i18next from "@/i18n/i18n";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Switch,
  notification,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import SaveBtn from "@/components/SaveBtn";
import { SpecialGameData } from "@/api/special-games/get";
import { createSpecialGame } from "@/api/special-games/post";
import { updateSpecialGame } from "@/api/special-games/put";

interface ChoiceField {
  label: string;
  odds: number;
}

interface FormProps {
  title: string;
  category?: string;
  betRange?: [Dayjs, Dayjs];
  status?: "draft" | "open" | "closed";
  isVisible: boolean;
  displayOrder?: number;
  note?: string;
  choices?: ChoiceField[];
}

interface Props {
  data?: SpecialGameData;
}

const DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";

const SpecialGamesForm = ({ data }: Props) => {
  const [form] = Form.useForm<FormProps>();
  const navigate = useNavigate();
  const isEdit = !!data;

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        title: data.title,
        category: data.category ?? undefined,
        betRange:
          data.betStartAt && data.betEndAt
            ? [dayjs(data.betStartAt), dayjs(data.betEndAt)]
            : undefined,
        isVisible: data.isVisible,
        displayOrder: data.displayOrder,
        note: data.note ?? undefined,
      });
    }
  }, [data, form]);

  const handleSubmit = async (e: FormProps) => {
    const { title, category, betRange, isVisible, displayOrder, note } = e;

    if (isEdit && data) {
      const res = await updateSpecialGame(data.id, {
        title,
        category,
        betStartAt: betRange?.[0]?.format(DATE_FORMAT),
        betEndAt: betRange?.[1]?.format(DATE_FORMAT),
        isVisible: isVisible ? 1 : 0,
        displayOrder,
        note,
      });
      const { code, message } = res.data;

      if (code === 0) {
        notification.success({ message: message || i18next.t("specialGames.updateSuccess") });
      } else {
        notification.error({ message });
      }
      return;
    }

    const choices = e.choices ?? [];
    if (choices.length < 2) {
      notification.error({ message: i18next.t("specialGames.minChoicesWarning") });
      return;
    }

    const res = await createSpecialGame({
      title,
      category,
      betStartAt: betRange?.[0]?.format(DATE_FORMAT),
      betEndAt: betRange?.[1]?.format(DATE_FORMAT),
      status: e.status,
      isVisible: isVisible ? 1 : 0,
      displayOrder,
      note,
      choices: choices.map((c, index) => ({ label: c.label, odds: c.odds, displayOrder: index })),
    });
    const { code, message } = res.data;

    if (code === 0) {
      notification.success({ message: message || i18next.t("specialGames.createSuccess") });
      navigate("/special-games");
    } else {
      notification.error({ message });
    }
  };

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit} initialValues={{ isVisible: true, status: "draft" }}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label={i18next.t("specialGames.title")}
            name="title"
            rules={[{ required: true }]}
          >
            <Input placeholder={i18next.t("specialGames.titlePlaceholder")} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label={i18next.t("specialGames.category")} name="category">
            <Input />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label={`${i18next.t("specialGames.betStartAt")} / ${i18next.t("specialGames.betEndAt")}`} name="betRange">
            <DatePicker.RangePicker showTime format={DATE_FORMAT} style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        {!isEdit && (
          <Col span={12}>
            <Form.Item label={i18next.t("col.status")} name="status">
              <Radio.Group
                options={[
                  { label: i18next.t("specialGames.statusDraft"), value: "draft" },
                  { label: i18next.t("specialGames.statusOpen"), value: "open" },
                  { label: i18next.t("specialGames.statusClosed"), value: "closed" },
                ]}
              />
            </Form.Item>
          </Col>
        )}

        <Col span={6}>
          <Form.Item label={i18next.t("col.displayOrder")} name="displayOrder">
            <InputNumber style={{ width: "100%" }} min={0} placeholder="0" />
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item label={i18next.t("specialGames.isVisible")} name="isVisible" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label={i18next.t("col.remarks")} name="note">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Col>

        {!isEdit && (
          <Col span={24}>
            <Form.List name="choices" initialValue={[{ label: "", odds: undefined }, { label: "", odds: undefined }]}>
              {(fields, { add, remove }) => (
                <>
                  <label style={{ fontWeight: 500, marginBottom: 10, display: "block" }}>
                    {i18next.t("specialGames.choicesTitle")}
                  </label>

                  {fields.map(({ key, name, ...restField }) => (
                    <Row gutter={16} key={key} align="middle" style={{ marginBottom: 8 }}>
                      <Col span={14}>
                        <Form.Item
                          {...restField}
                          name={[name, "label"]}
                          style={{ marginBottom: 0 }}
                          rules={[{ required: true, message: i18next.t("specialGames.choiceLabelPlaceholder") }]}
                        >
                          <Input placeholder={i18next.t("specialGames.choiceLabelPlaceholder")} />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          name={[name, "odds"]}
                          style={{ marginBottom: 0 }}
                          rules={[{ required: true }]}
                        >
                          <InputNumber min={1} max={1000} step={0.01} style={{ width: "100%" }} placeholder={i18next.t("specialGames.odds")} />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Button
                          danger
                          type="primary"
                          block
                          disabled={fields.length <= 2}
                          onClick={() => remove(name)}
                        >
                          <MinusCircleOutlined />
                        </Button>
                      </Col>
                    </Row>
                  ))}

                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      {i18next.t("specialGames.addChoice")}
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Col>
        )}
      </Row>

      <Divider />
      <SaveBtn />
    </Form>
  );
};

export default SpecialGamesForm;

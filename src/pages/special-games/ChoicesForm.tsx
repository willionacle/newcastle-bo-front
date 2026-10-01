import i18next from "@/i18n/i18n";
import { Button, Col, Form, Input, InputNumber, Row, notification } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { SpecialGameData } from "@/api/special-games/get";
import { updateSpecialGameChoices } from "@/api/special-games/put";
import SaveBtn from "@/components/SaveBtn";

interface ChoiceField {
  label: string;
  odds: number;
}

interface FormProps {
  choices: ChoiceField[];
}

interface Props {
  data: SpecialGameData;
  mutate: () => void;
}

const ChoicesForm = ({ data, mutate }: Props) => {
  const [form] = Form.useForm<FormProps>();

  const handleSubmit = async (e: FormProps) => {
    if (e.choices.length < 2) {
      notification.error({ message: i18next.t("specialGames.minChoicesWarning") });
      return;
    }

    const res = await updateSpecialGameChoices(
      data.id,
      e.choices.map((c, index) => ({ label: c.label, odds: c.odds, displayOrder: index }))
    );
    const { code, message } = res.data;

    if (code === 0) {
      notification.success({ message: message || i18next.t("specialGames.choicesUpdateSuccess") });
      mutate();
    } else {
      notification.error({ message });
    }
  };

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleSubmit}
      initialValues={{
        choices: [...data.choices]
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((c) => ({ label: c.label, odds: c.odds })),
      }}
    >
      <label style={{ fontWeight: 500, marginBottom: 10, display: "block" }}>
        {i18next.t("specialGames.choicesTitle")}
      </label>

      <Form.List name="choices">
        {(fields, { add, remove }) => (
          <>
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
                  <Button danger type="primary" block disabled={fields.length <= 2} onClick={() => remove(name)}>
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

      <SaveBtn />
    </Form>
  );
};

export default ChoicesForm;

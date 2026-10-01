import i18next from "@/i18n/i18n";
import { Checkbox, Col, Form, notification, Row } from "antd";
import SaveBtn from "@/components/SaveBtn";
import { useEffect } from "react";
import { updateSubs } from "@/api/users/put";
import { useTranslation } from "react-i18next";

interface SubStatus {
  kakao: 0 | 1;
  telegram: 0 | 1;
}

interface Props {
  types: SubStatus;
  username: string | undefined;
}

export default function SubsCheckBoxForm({ types,username }: Props) {
  const [form2] = Form.useForm<{ types: string[] }>();
  const { t } = useTranslation();
  const selectedValues = Object.entries(types)
    .filter(([_, status]) => status === 1)
    .map(([key]) => key);

  useEffect(() => {
    form2.setFieldsValue({ types: selectedValues });
  }, [types]);

  const onFinish = async (values: any) => {
    const selected = values.types || [];

    const result: SubStatus = {
      kakao: selected.includes("kakao") ? 1 : 0,
      telegram: selected.includes("telegram") ? 1 : 0,
    };

    const items = Object.entries(result).map(([type, status]) => ({
      type,
      status,
    }));

    items.map(async (item) => {
      try {
        const res = await updateSubs({...item,username});
        const {code, message} = res.data
  
        if (code === 0) {
          notification.success({
            message: t("global.success"),
            type: "success",
          });
        } else {
          notification.error({
            message: message,
            type: "error",
          });
        }
      } catch (error) {
        console.log(error);
      }
    });
  };

  return (
    <Form
      form={form2}
      onFinish={onFinish}
      initialValues={{ types: selectedValues }}
      layout="inline"
    >
      <Row
        style={{ width: "100%", marginTop: "4px" }}
        align="middle"
        justify="space-between"
      >
        <Col>
          <Form.Item
            name="types"
          >
            <Checkbox.Group>
              <Checkbox value="kakao">{i18next.t("user.kakaoFriend")}</Checkbox>
              <Checkbox value="telegram">{i18next.t("user.telegramSub")}</Checkbox>
            </Checkbox.Group>
          </Form.Item>
        </Col>

        <Col>
          <SaveBtn className="user-button alt" size="small" />
        </Col>
      </Row>
    </Form>
  );
}

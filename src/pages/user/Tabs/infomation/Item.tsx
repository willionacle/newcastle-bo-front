import { createItem } from "@/api/custom/createItems";
import { User } from "@/api/users/get";
import ItemSelect, { ItemSelectFormType } from "@/components/ItemSelect";
import SaveBtn from "@/components/SaveBtn";
import { Col, Form, Input, Row, notification } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  data: User | undefined;
}

interface Form {
  gameitemId: ItemSelectFormType;
  systemNote: string;
  username: User["username"];
}

const Item = ({ data }: Props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<Form>();

  const handleSubmit = async (e: Form) => {
    try {
      if (
        await createItem({
          gameitemId: e.gameitemId,
          systemNote: e.systemNote,
          usernames: [e.username],
        })
      ) {
        notification.success({ message: t("toast.item.issueSuccess") });

        form.resetFields();
        form.setFieldsValue({ username: data?.username });
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        username: data.username,
      });
    }
  }, [data]);

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Row gutter={[16, 0]}>
        <Col span={12}>
          <ItemSelect small />
        </Col>

        <Col span={12}>
          <Form.Item name={"systemNote"} label={t("memberDetail.mis090")}>
            <Input size="small" />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item name={"username"} label={t("couponDetail.cpre002")}>
            <Input size="small" disabled />
          </Form.Item>
        </Col>
      </Row>

      <SaveBtn />
    </Form>
  );
};

export default Item;

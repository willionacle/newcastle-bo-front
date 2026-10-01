import i18next from "@/i18n/i18n";
import { getEvoMoneyAPI } from "@/api/transfer/get";
import { CashInOutBody, cashInOut } from "@/api/transfer/post";
import CommaNumber from "@/components/CommaNumber";
import SaveBtn from "@/components/SaveBtn";
import { Alert, Col, Divider, Flex, Form, InputNumber, notification, Radio, Row } from "antd";
import { CSSProperties, useState } from "react";
import { useTranslation } from "react-i18next";
type FormData = CashInOutBody;

const EvoMoneyTransferForm = ({ username,balance,onSuccess }: { username: string;balance: number, onSuccess:()=> void }) => {
  const { data } = getEvoMoneyAPI(username);
  const [form] = Form.useForm<FormData>();
  const {t} = useTranslation()
  const inputStyle: CSSProperties = { width: "100%" };
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormData) => {
    const body = {
      ...e,username:username
    }
    setLoading(true)
    try {
      const res = await cashInOut(body);
      console.log(res)
      const {
        data: { errorcode, message: resMessage },
      } = res;
      if (errorcode == 0) {
        notification.success({message:t("global.success")});
      } else {
        notification.error({ message: resMessage });
      }
    } catch (error) {
      console.error(error);
    }finally{
      onSuccess()
      setLoading(false)
    }
  };

  return (
    <div>
      <Alert
        message={
          <Flex gap={25} align="center" justify="center">
            <Flex gap={5} align="center">
              <span>{i18next.t("user.balanceLabel")}</span>₩
              <span style={{ fontWeight: "700" }}>
                <CommaNumber value={balance} />
              </span>
            </Flex>
            <Flex gap={5} align="center">
              <span>{i18next.t("user.evolutionLabel")}</span>₩
              <span style={{ fontWeight: "700" }}>
                <CommaNumber value={data?.data?.balance} />
              </span>
            </Flex>
          </Flex>
        }
        style={{ marginBottom: "10px" }}
      />
      <Divider/>
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Row gutter={16}>
          <Col span={24} style={{ marginBottom: "-10px" }}>
            <Form.Item name={"type"} initialValue={"in"} label={i18next.t("text.transaction")}  rules={[{ required: true }]}>
              <Radio.Group >
                <Radio value={"in"}>{i18next.t("col.deposit")}</Radio>
                <Radio value={"out"}>{i18next.t("topNavi.tn016")}</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={i18next.t("col.amount")}
              name={"amount"}
              rules={[{ required: true }]}
            >
              <InputNumber min={0} style={inputStyle}/>
            </Form.Item>
          </Col>
        </Row>
        <SaveBtn loading={loading}/>
      </Form>
    </div>
  );
};

export default EvoMoneyTransferForm;

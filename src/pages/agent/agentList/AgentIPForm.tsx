import { Col, Form, Input, Radio, Row, notification } from "antd";
import { titleColStyle2 } from "./AgentStyle";
import { useTranslation } from "react-i18next";
import SaveBtn from "@/components/SaveBtn";
import { mutate } from "swr";
import { stringify } from "qs";
import useUserStore from "@/store/user.store";
import { api } from "@/api/axios";
import { AgentType } from "@/api/types";

interface FormData {
  ip: string;
}

interface Props {
  agent_username: AgentType['agent_username'] | undefined;
}

const AgentIpForm = ({ agent_username }: Props) => {
  const {token, userid} = useUserStore.getState()
  const { t } = useTranslation();

  const handleSubmit = async (e: FormData) => {
    if (!agent_username) {
      notification.error({message: t("global.fail")});
      return;
    }

    const body = {
      userid: userid,
      username: agent_username, 
      ip: e.ip
    }

    const queryData = {
      username  : agent_username,
      userid    : userid,
      page      : 1,
      limit     : 100,
      orderby   : 'desc',
      columnby  : 'id',
      ip        : null
    };

    // const res = await createWhiteList({ data: { user: agent_id, ip: e.ip } });
    try {
      const res = await api.createWhiteIP(body, token)
      const {data: {code, message}} = res
      console.log(res)
  
      if (code == 0) {
        notification.success({message : t("global.success")});
        mutate(["/whiteiplist", stringify(queryData, { encodeValuesOnly: true })]);
      } else {
        notification.success({message : message});
      }
    } catch (error) {
      console.error(error)
    }
  };

  return (
    <Form<FormData> onFinish={handleSubmit}>
      <Row gutter={[10, 0]}>
        <Col span={6} style={titleColStyle2}>
          {t("agent.al013")}
        </Col>

        <Col span={7}>
          <Radio.Group defaultValue={"white"}>
            <Radio value={"open"}>{t("agent.al014")}</Radio>
            <Radio value={"white"}>{t("agent.al015")}</Radio>
          </Radio.Group>
        </Col>

        <Col span={7}>
          <Form.Item
            noStyle
            name={"ip"}
            label={"te"}
            rules={[{ required: true }]}
          >
            <Input placeholder="ex) 111.111.111.111" size="small" />
          </Form.Item>
        </Col>

        <Col span={4}>
          <SaveBtn size="small" noStyle block />
        </Col>
      </Row>
    </Form>
  );
};

export default AgentIpForm;

import Breadcrumb from "@/components/Breadcrumb";
import { Button, Card, Col, Divider, Row, Typography } from "antd";
import { useTranslation } from "react-i18next";
import AgentTreeView from "./AgentTreeView";
import AgentInfo from "./AgentInfo";
import { colStyle, rowStyle } from "./AgentStyle";
import AgentIpForm from "./AgentIPForm";
import { useEffect, useState } from "react";
import { stringify } from "qs";
import AgentIPList from "./AgentIPList";
import AgentManagement from "./AgentManagement";
import AgentLossing from "./AgenLossing";
import useGetItemData from "@/hooks/useGetItemData";
import { agentAPI } from "@/api/agent/get";

const Agent = () => {
  const { t } = useTranslation();
  const [depth, setDepth] = useState(1);
  const [agent_id, setAgentId] = useState<string | undefined>("");
  const [id, setID] = useState<number | null | undefined>();
  const { swr } = agentAPI({
    columnby: 'tree_depth',
    orderby: 'asc'
  });

  const {data: agentRes, getItem} = useGetItemData({
    id: id
  }, 'getUser')

  useEffect(() => {
    if(id) {
      getItem(id)
      console.log('Get Agent', agentRes)
    }
  }, [id])

  return (
    <Card>
      <Breadcrumb />
      <Divider />

      <Row gutter={[8, 16]}>
        <Col span={8}>
          <Typography.Paragraph strong>{t("agent.al001")}</Typography.Paragraph>
          <Divider />
          <AgentTreeView
            agents={swr.data?.data}
            depth={depth}
            depthData={swr.data?.data ?? []}
            setAgentId={setAgentId}
            setDepth={setDepth}
            setID={setID}
          />
        </Col>
        <Col span={16}>
          <Typography.Paragraph strong>{t("agent.al002")}</Typography.Paragraph>
          <Divider />
          <Row gutter={[10, 0]} style={rowStyle}>
            <AgentInfo
              depth={depth}
              info={agentRes}
              agent_id={agent_id}
            />

            <Col span={24} style={colStyle}>
              <AgentIpForm
                agent_username={agentRes ? agentRes.username : undefined}
              />
            </Col>

            <Col span={24}>
              <AgentIPList
                agent_username={agentRes ? agentRes.username : undefined}
              />
            </Col>

            <Col span={24}>
              <AgentLossing
                data={agentRes ? agentRes : undefined}
                mutate={getItem}
              />
            </Col>

            {/* <Col span={24}>
              <AgentRolling />
            </Col> */}

            <AgentManagement />

            <Col
              span={12}
              style={{
                paddingBlock: "1rem",
              }}
            >
              <Button block>정산초기화</Button>
            </Col>

            <Col
              span={12}
              style={{
                paddingBlock: "1rem",
              }}
            >
              <Button
                block
                onClick={() =>
                  window.open(
                    `/user/create?${stringify(
                      { depth: depth ?? 1, agent_username: agent_id, agent_id: id },
                      { encodeValuesOnly: true }
                    )}`
                  )
                }
                htmlType="button"
              >
                하부등록
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default Agent;

import { agentListAPI } from "@/api/agent/get";
import i18next from "@/i18n/i18n";
import { findAgentAPI } from "@/api/agent/post";
import Breadcrumb from "@/components/Breadcrumb";
import useUserStore from "@/store/user.store";
import { Button, Card, Col, Divider, Modal, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
// import AgentForm from "./AgentForm";
import AgentInfo from "./AgentInfo";
import { rowStyle } from "./AgentStyle";
import AgentTreeView from "./AgentTreeView";
// import AgentUpdate from "./AgentUpdate";
import AgentForm from "./AgentForm";
import AgentUpdate from "./AgentUpdate";
import AgentIpForm from "./AgentIPForm";
import AgentIPList from "./AgentIPList";

const SubTitle = styled.h4`
  margin-bottom: 1rem;
`;

export interface AgentInfoProp {
  depth: null;
  agent_username: null;
  agent_id: null;
  parentID?: null | number;
}

const Agent = () => {
  const { t } = useTranslation();
  const [depth, setDepth] = useState(1);
  const [agent_id, setAgentId] = useState<string | undefined>("");
  const [id, setID] = useState<number | null | undefined>();
  const { swr } = agentListAPI();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const username = useUserStore((state) => state.username);
  const { data: agentRes, mutate } = findAgentAPI(id);
  const [agentInfo, setAgentInfo] = useState<AgentInfoProp>({
    depth: null,
    agent_username: null,
    agent_id: null,
    parentID: null,
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    mutate();
    swr.mutate();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    mutate();
    swr.mutate();
  };

  useEffect(() => {
    console.log("AGENT RESSS", agentRes);
    if (agentRes) {
      const depth = agentRes.depth || agentRes.tree_depth || null;
      const parentID = agentRes.parentID || null;
      setAgentInfo({
        depth: depth,
        agent_username: agentRes.username ?? "",
        agent_id: agentRes.id ?? "",
        parentID,
      });
    }
  }, [agentRes]); // agentRes가 변경될 때마다 실행

  return (
    <Card>
      <Breadcrumb replace={t("sidemenu.sm008")} />
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
          <Row justify="space-between" style={{ marginBottom: "12px" }}>
            <SubTitle>{i18next.t("memberDetail.mis001")}</SubTitle>
            <Button
              size="small"
              disabled={agent_id === "" && !id}
              onClick={showModal}
              htmlType="button"
              style={{width: 145}}
            >
              하부등록
            </Button>

            <Modal
              title={i18next.t("title.subRegister")}
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
              footer={null}
              destroyOnClose
            >
              <AgentForm agent={agentInfo} info={agentRes} onSuccess={handleSuccess} />
            </Modal>
          </Row>
          <Row gutter={[10, 0]} style={rowStyle}>
            <AgentInfo depth={depth} info={agentRes} agent_id={agent_id} />
          </Row>
          <Row gutter={[10, 0]} style={rowStyle}>
            <Col span={24} style={{padding: '2rem 4px 1rem'}}>
              <AgentIpForm
                agent_username={agentRes ? agentRes.username : undefined}
              />
            </Col>
            <Col span={24} style={{padding: '1rem 4px'}}>
              <AgentIPList
                agent_username={agentRes ? agentRes.username : undefined}
              />
            </Col>
          </Row>

          <SubTitle>{i18next.t("agentForm.commissionInfo")}</SubTitle>
          <Row gutter={[10, 0]} style={rowStyle}>
            <Col span={24}>
              <AgentUpdate
                data={agentRes ? agentRes : undefined}
                mutate={mutate}
                disabled={(agent_id === "" && !id) || agent_id === username}
              />
            </Col>

            {/* <AgentManagement /> */}
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default Agent;

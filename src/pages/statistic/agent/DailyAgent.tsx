import Breadcrumb from "@/components/Breadcrumb";
import { Card, Col, Divider, Row } from "antd";
import Filter from "./Filter";
import List from "./List";
import { agentListAPI } from "@/api/agent/get";
import { useEffect, useState } from "react";
import AgentTreeView from "@/pages/agent/agentList/AgentTreeView";
import { agentStatsAPI } from "@/api/cs-statics/agent-stats";

const DailyAgent = () => {
  const [depth, setDepth] = useState(1);
  const [_, setID] = useState<number | null | undefined>();
  const [agent_id, setAgentId] = useState<string | undefined>("");
  const { swr } = agentListAPI();
  const { swr: statSwr, setFilters, onHeaderCell } = agentStatsAPI(agent_id);
  console.log('DAILY AGENT',statSwr)

  useEffect(() => {
    console.log(agent_id);
    setFilters((old) => ({ ...old, username: agent_id }));
  }, [agent_id]);

  return (
    <Card>
      <Breadcrumb />
      <Divider />
      <Row>
        <Col lg={24} xs={24}>
          <Filter setFilter={setFilters} />
          <Divider />
        </Col>

        <Col
          lg={6}
          xs={6}
          style={{
            overflowX: "auto",
          }}
        >
          <AgentTreeView
            agents={swr.data?.data}
            depth={depth}
            depthData={swr.data?.data ?? []}
            setAgentId={setAgentId}
            setDepth={setDepth}
            setID={setID}
          />
        </Col>

        <Col lg={18} xs={18} className="pl-6">
          <List {...statSwr} onHeaderCell={onHeaderCell} />
        </Col>
      </Row>
    </Card>
  );
};

export default DailyAgent;

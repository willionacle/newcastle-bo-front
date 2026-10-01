import i18next from "@/i18n/i18n";
import { Col, Flex, Row, Typography } from "antd";
import styles from "@/pages/betting/record/component/result/cards.module.css";
// import { EvoGameInfoData } from "./Baccarat";
import { NewEvoBetData } from "@/api/bet-details/get";

const resultColor: Record<string, string> = {
  Player: "blue",
  Tie: "green",
  Banker: "red",
};

const BaccaratResults = ({ data }: { data?: NewEvoBetData['raw']['data']['result'] }) => {
  if (!data || !data.banker || !data.outcome || !data.player) return;
  return (
    <Row justify={"space-evenly"} align={"middle"}>
      <Col>
        <Flex gap={"1rem"} align="center">
          <Typography.Title level={2} style={{ color: "var(--ant-blue)" }}>
            {data.player.score}
          </Typography.Title>
          {data.player.cards.map((item) => (
            <img
              className={styles.FlipEnterActive}
              height={120}
              src={`/images/cards/${item}.svg`}
            />
          ))}
        </Flex>
        <Typography.Title
          style={{
            color: "var(--ant-blue)",
            textAlign: "center",
            marginTop: "10px",
          }}
        >
          Player
        </Typography.Title>
      </Col>

      <Col style={{ textAlign: "center" }}>
        <Typography.Title
          level={2}
          style={{ color: `var(--ant-${resultColor[data.outcome]})` }}
        >
          {data.outcome}
        </Typography.Title>
        <Typography.Text type="secondary">{i18next.t("col.result")}</Typography.Text>
      </Col>

      <Col>
        <Flex gap={"1rem"} align="center">
          {data.banker.cards.map((item) => (
            <img
              className={styles.FlipEnterActive}
              height={120}
              src={`/images/cards/${item}.svg`}
            />
          ))}
          <Typography.Title level={2} style={{ color: "var(--ant-red)" }}>
            {data.banker.score}
          </Typography.Title>
        </Flex>
        <Typography.Title
          style={{
            color: "var(--ant-red)",
            textAlign: "center",
            marginTop: "10px",
          }}
        >
          Banker
        </Typography.Title>
      </Col>
    </Row>
  );
};

export default BaccaratResults;

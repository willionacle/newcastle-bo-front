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

const DragonTigerResults = ({
  data,
}: {
  data?: NewEvoBetData["raw"]["data"]["result"];
}) => {
  if (!data || !data.dragon || !data.outcome || !data.tiger) return;
  return (
    <Row justify={"space-evenly"} align={"middle"}>
      <Col>
        <Typography.Title
          style={{
            color: "var(--ant-blue)",
            textAlign: "center",
            marginTop: "10px",
          }}
        >
          Dragon
        </Typography.Title>
        <Flex gap={"1rem"} align="center" style={{marginRight:"25px"}}>
          <Typography.Title level={2} style={{ color: "var(--ant-blue)" }}>
            {data.dragon.score}
          </Typography.Title>
          <img
            className={styles.FlipEnterActive}
            height={120}
            src={`/images/cards/${data.dragon.card}.svg`}
          />
        </Flex>
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
        <Typography.Title
          style={{
            color: "var(--ant-red)",
            textAlign: "center",
            marginTop: "10px",
          }}
        >
          Tiger
        </Typography.Title>
        <Flex gap={"1rem"} align="center">
          <img
            className={styles.FlipEnterActive}
            height={120}
            src={`/images/cards/${data.tiger.card}.svg`}
            style={{marginLeft:"25px"}}
          />
          <Typography.Title level={2} style={{ color: "var(--ant-red)" }}>
            {data.tiger.score}
          </Typography.Title>
        </Flex>
      </Col>
    </Row>
  );
};

export default DragonTigerResults;

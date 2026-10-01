import i18next from "@/i18n/i18n";
import { Col, Flex, Row, Typography } from "antd";
import styles from "@/pages/betting/record/component/result/cards.module.css";
// import { EvoGameInfoData } from "./Baccarat";
import { NewEvoBetData } from "@/api/bet-details/get";

const resultColor: Record<string, string> = {
  PlayerWon: "blue",
  Tie: "green",
  BankerWon: "red",
};

const BacboResults = ({
  data,
}: {
  data?: NewEvoBetData["raw"]["data"]["result"];
}) => {
  console.log(data);
  if (!data) return;
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
          Player {data.playerDice.score}
        </Typography.Title>
        <Flex gap={"1rem"} align="center">
          <img
            className={styles.FlipEnterActive}
            height={60}
            src={`/images/dice/dice-0${data.playerDice.first}.png`}
          />
          <img
            className={styles.FlipEnterActive}
            height={60}
            src={`/images/dice/dice-0${data.playerDice.second}.png`}
          />
        </Flex>
      </Col>
      <Col style={{ margin: " 20px" }}>
        <Col style={{ textAlign: "center" }}>
          <Typography.Title
            level={3}
            style={{
              color: `var(--ant-${resultColor[data.outcome]})`,
              marginBottom: "-5px",
            }}
          >
            {data.outcome}
          </Typography.Title>
          <Typography.Text type="secondary">{i18next.t("col.result")}</Typography.Text>
        </Col>
      </Col>

      <Col>
        <Typography.Title
          style={{
            color: "var(--ant-red)",
            textAlign: "center",
            marginTop: "10px",
          }}
        >
          Banker {data.bankerDice.score}
        </Typography.Title>
        <Flex gap={"1rem"} align="center">
          <img
            className={styles.FlipEnterActive}
            height={60}
            src={`/images/dice/dice-0${data.bankerDice.first}.png`}
          />
          <img
            className={styles.FlipEnterActive}
            height={60}
            src={`/images/dice/dice-0${data.bankerDice.second}.png`}
          />
        </Flex>
      </Col>
    </Row>
  );
};

export default BacboResults;

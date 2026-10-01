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

const HoldemResults = ({
  data,
}: {
  data?: NewEvoBetData["raw"]["data"]["result"];
}) => {
  console.log(data);
  if (!data || !data.cards || !data.outcome || !data.player || !data.dealer)
    return;
  return (
    <Row justify={"space-evenly"} align={"middle"}>
      <Col>
        <Typography.Title
          style={{
            color: "var(--ant-red)",
            textAlign: "center",
            marginTop: "10px",
          }}
        >
          Dealer
        </Typography.Title>
        <Flex gap={"1rem"} align="center">
          {/* <Typography.Title level={2} style={{ color: "var(--ant-blue)" }}>
            {data.dealer.rank}
          </Typography.Title> */}
          {data.cards.dealer.map((item) => (
            <img
              className={styles.FlipEnterActive}
              height={120}
              src={`/images/cards/${item}.svg`}
            />
          ))}
        </Flex>
      </Col>

      {/* <Col style={{ textAlign: "center" }}>
        <Typography.Title
          level={2}
          style={{ color: `var(--ant-${resultColor[data.outcome]})` }}
        >
          {data.outcome}
        </Typography.Title>
        <Typography.Text type="secondary">결과</Typography.Text>
      </Col> */}
      <Col style={{ margin: " 20px" }}>
        {/* <Typography.Title
          style={{
            color: `var(--ant-${data.outcome === "Player" ? "blue" : "red"})`,
            textAlign: "center",
            marginTop: "10px",
            fontSize:"20px"
          }}
        >
          {data.outcome}
        </Typography.Title> */}
        <Col style={{ textAlign: "center" }}>
        <Typography.Title
          level={3}
          style={{ color: `var(--ant-${resultColor[data.outcome]})`,marginBottom:"-5px" }}
        >
          {data.outcome}
        </Typography.Title>
        <Typography.Text type="secondary">{i18next.t("col.result")}</Typography.Text>
      </Col>
        <Flex gap={"1rem"} align="center" style={{marginTop:"10px"}}>
          <>
            {data.cards.flop.map((item) => (
              <img
                className={styles.FlipEnterActive}
                height={120}
                src={`/images/cards/${item}.svg`}
              />
            ))}
            {data.cards.river.map((item) => (
              <img
                className={styles.FlipEnterActive}
                height={120}
                src={`/images/cards/${item}.svg`}
              />
            ))}
          </>
        </Flex>
      </Col>

      <Col>
        <Typography.Title
          style={{
            color: "var(--ant-blue)",
            textAlign: "center",
            marginTop: "10px",
          }}
        >
          Player
        </Typography.Title>
        <Flex gap={"1rem"} align="center">
          {data.cards.player.map((item) => (
            <img
              className={styles.FlipEnterActive}
              height={120}
              src={`/images/cards/${item}.svg`}
            />
          ))}
          {/* <Typography.Title level={2} style={{ color: "var(--ant-red)" }}>
            {data.player.rank}
          </Typography.Title> */}
        </Flex>
      </Col>
    </Row>
  );
};

export default HoldemResults;

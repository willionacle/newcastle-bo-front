import i18next from "@/i18n/i18n";
import { Col, Flex, Row, Typography } from "antd";
import styles from "@/pages/betting/record/component/result/cards.module.css";
import { SAGAmingResponseData, SAGBaccCardResult } from "@/api/bet-details/@types/sagaming";
import { outComeResultDetail } from "./Baccarat";

const resultColor: Record<string, string> = {
  Player: "blue",
  Tie: "green",
  Banker: "red",
};

const SuitValueMap: Record<string, string> = {
  1: "S",
  2: "H",
  3: "C",
  4: "D",
}

const transformCardValue = (cardProp?: SAGBaccCardResult): string => {
  if (!cardProp) return "";
  
  let rankValue = cardProp.Rank;
  switch (rankValue) {
    case "1":
      rankValue = "A";
      break;
    case "11":
      rankValue = "J";
      break;
    case "12":
      rankValue = "Q";
      break;
    case "13":
      rankValue = "K";
      break;
    default:
      break;
  }

  return `${rankValue}${SuitValueMap[cardProp.Suit] || cardProp.Suit}`
}

const BaccaratResults = ({ data }: { data?: SAGAmingResponseData  }) => {
  if (!data) return;

  const BaccaratResult = data?.data?.GetAllBetDetailsForTransactionIDResponse?.Result?.BaccaratResult;

  if (!BaccaratResult) return;  

  return (
    <Row justify={"space-evenly"} align={"middle"}>
      <Col>
        <Flex gap={"1rem"} align="center">
          {/* <Typography.Title level={2} style={{ color: "var(--ant-blue)" }}>
            {data.player.score}
          </Typography.Title> */}
          {[
            BaccaratResult.PlayerCard1, 
            BaccaratResult.PlayerCard2, 
            BaccaratResult.PlayerCard3
          ]
            .filter(Boolean)
            .map((card) => (
            <img
              className={styles.FlipEnterActive}
              height={120}
              src={`/images/cards/${transformCardValue(card)}.svg`}
            />)
          )}
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
          style={{ color: `var(--ant-${resultColor[outComeResultDetail(BaccaratResult.ResultDetail)]})` }}
        >
          {outComeResultDetail(BaccaratResult.ResultDetail)}
        </Typography.Title>
        <Typography.Text type="secondary">{i18next.t("col.result")}</Typography.Text>
      </Col>

      <Col>
        <Flex gap={"1rem"} align="center">
          {[
            BaccaratResult.BankerCard1, 
            BaccaratResult.BankerCard2, 
            BaccaratResult.BankerCard3
          ]
            .filter(Boolean)
            .map((card) => (
            <img
              className={styles.FlipEnterActive}
              height={120}
              src={`/images/cards/${transformCardValue(card)}.svg`}
            />)
          )}
          {/* <Typography.Title level={2} style={{ color: "var(--ant-red)" }}>
            {data.banker.score}
          </Typography.Title> */}
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

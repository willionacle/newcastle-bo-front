import i18next from "@/i18n/i18n";
import { Col, Flex, Row, Typography } from "antd";
import styles from "@/pages/betting/record/component/result/cards.module.css";
// import { EvoGameInfoData } from "./Baccarat";
import { HandTypes, NewEvoBetData, SeatTypes } from "@/api/bet-details/get";

const resultColor: Record<string, string> = {
  Win: "blue",
  // Tie: "green",
  Lost: "red",
  Lose: "red",
};

const BlackJackResults = ({ data }: { data?: NewEvoBetData['raw']['data'] }) => {
  if (!data || !data.result || !data.participants || !data.dealer) return;
  
  const hasSeats = !!data?.participants[0]?.seats
  const playerSeat = hasSeats ? 
    Object.keys(data?.participants[0]?.seats)[0] as keyof SeatTypes : 
    Object.keys(data?.participants[0]?.hands)[0] as keyof HandTypes;
  const playerSeatData =  hasSeats ? 
    data.result.seats[playerSeat as keyof SeatTypes] : 
    data.participants[0].hands[playerSeat as keyof HandTypes];

  const dealerCards = hasSeats ? data.result.dealer?.cards : data.result.dealerHand.cards;
  const dealerScore = hasSeats ? data.result.dealer?.score : data.result.dealerHand.score;

  console.log({
    data,
    dealerCards,
    dealerScore,
    playerSeat,
    playerSeatData
  })
  return (
    <Row justify={"space-evenly"} align={"middle"}>
      <Col>
        <Flex gap={"1rem"} align="center">
          <Typography.Title level={2} style={{ color: "var(--ant-blue)" }}>
            {dealerScore}
          </Typography.Title>
          {dealerCards?.map((item) => (
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
          Dealer
        </Typography.Title>
      </Col>

      <Col style={{ textAlign: "center" }}>
        <Typography.Title
          level={2}
          style={{ color: `var(--ant-${resultColor[playerSeatData?.outcome] || "gray"})` }}
        >
          {playerSeatData?.outcome}
        </Typography.Title>
        <Typography.Text type="secondary">{i18next.t("col.result")}</Typography.Text>
      </Col>

      <Col>
        <Flex gap={"1rem"} align="center">
          {playerSeatData?.cards?.map((item) => (
            <img
              className={styles.FlipEnterActive}
              height={120}
              src={`/images/cards/${item}.svg`}
            />
          ))}
          <Typography.Title level={2} style={{ color: "var(--ant-red)" }}>
            {playerSeatData?.score}
          </Typography.Title>
        </Flex>
        <Typography.Title
          style={{
            color: "var(--ant-red)",
            textAlign: "center",
            marginTop: "10px",
          }}
        >
          {playerSeat}
        </Typography.Title>
      </Col>
    </Row>
  );
};

export default BlackJackResults;

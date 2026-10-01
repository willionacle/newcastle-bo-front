import { Col, Flex, Row, Typography } from "antd";
import styles from "@/pages/betting/record/component/result/cards.module.css";

type ParsedGameInfo = {
  P: string[];
  B: string[];
};

interface Prop {
 GameInfo: string;
}

function parseGameInfo(GameInfo: string): ParsedGameInfo {
  const result: ParsedGameInfo = { P: [], B: [] };

  const [playerPart, bankerPart] = GameInfo.split(':');

  const parseSection = (section: string): string[] => {
    const parts = section.split(';').slice(1);
    return parts.map(card => {
      const suit = card[0];
      const value = card.slice(1);
      return `${value}${suit}`;
    });
  };

  if (playerPart.startsWith('P')) {
    result.P = parseSection(playerPart);
  }
  if (bankerPart && bankerPart.startsWith('B')) {
    result.B = parseSection(bankerPart);
  }

  return result;
}


const BaccaratResult = ({GameInfo}: Prop) => {
  if (!GameInfo) return;

  const parsedGameInfo = parseGameInfo(GameInfo);
  console.log('parsed game info', parsedGameInfo)
  return (
    <Row justify={"space-evenly"} align={"middle"}>
      <Col>
        <Flex gap={"1rem"} align="center">
          {/* <Typography.Title level={2} style={{ color: "var(--ant-blue)" }}>
            {data.player.score}
          </Typography.Title> */}
          {parsedGameInfo.P.map((item) => (
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

      {/* <Col style={{ textAlign: "center" }}>
        <Typography.Title
          level={2}
          style={{ color: `var(--ant-${resultColor[data.outcome]})` }}
        >
          {data.outcome}
        </Typography.Title>
        <Typography.Text type="secondary">결과</Typography.Text>
      </Col> */}

      <Col>
        <Flex gap={"1rem"} align="center">
          {parsedGameInfo.B.map((item) => (
            <img
              className={styles.FlipEnterActive}
              height={120}
              src={`/images/cards/${item}.svg`}
            />
          ))}
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
}

export default BaccaratResult
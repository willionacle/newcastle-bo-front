import { Col, Flex, Row, Typography } from "antd";
import styles from "@/pages/betting/record/component/result/cards.module.css";

interface Prop {
  GameInfo: string;
}

interface ParsedGameInfo {
  [key: string]: string; // D -> Dragon, T -> Tiger
}

function parseGameInfo(GameInfo: string): ParsedGameInfo {
  const result: ParsedGameInfo = {};

  const parseSection = (section: string): string => {
    const parts = section.split(";").slice(1); // skip role identifier
    if (!parts[0]) return "";
    const suit = parts[0][0]; // e.g. C, D, H, S
    const value = parts[0].slice(1); // e.g. 2, Q, 10
    return `${value}${suit}`; // e.g. "2C", "QH"
  };

  const sections = GameInfo.split(":");
  for (const section of sections) {
    const role = section[0]; // D = Dragon, T = Tiger
    result[role] = parseSection(section);
  }

  return result;
}

const DragonTigerResult = ({ GameInfo }: Prop) => {
  if (!GameInfo) return null;

  const parsedGameInfo = parseGameInfo(GameInfo);
  console.log("parsed game info", parsedGameInfo);

  return (
    <Row justify="space-evenly" align="middle">
      {/* Dragon */}
      <Col>
        <Flex gap="1rem" align="center" justify="center">
          {parsedGameInfo.D && (
            <img
              className={styles.FlipEnterActive}
              height={120}
              src={`/images/cards/${parsedGameInfo.D}.svg`}
              alt="Dragon Card"
            />
          )}
        </Flex>
        <Typography.Title
          style={{
            color: "var(--ant-blue)",
            textAlign: "center",
            marginTop: "10px",
          }}
        >
          Dragon
        </Typography.Title>
      </Col>

      {/* Tiger */}
      <Col>
        <Flex gap="1rem" align="center"  justify="center">
          {parsedGameInfo.T && (
            <img
              className={styles.FlipEnterActive}
              height={120}
              src={`/images/cards/${parsedGameInfo.T}.svg`}
              alt="Tiger Card"
            />
          )}
        </Flex>
        <Typography.Title
          style={{
            color: "var(--ant-red)",
            textAlign: "center",
            marginTop: "10px",
          }}
        >
          Tiger
        </Typography.Title>
      </Col>
    </Row>
  );
};

export default DragonTigerResult;

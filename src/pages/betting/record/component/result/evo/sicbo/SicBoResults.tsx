import { Flex, Typography } from "antd";
import { NewEvoBetData } from "@/api/bet-details/get";
import styles from "@/pages/betting/record/component/result/cards.module.css";

const SicBoResults = ({ data }: { data?: NewEvoBetData['raw']['data'] }) => {

  const result = data?.result;
  console.log({
    data,
    result,
  })

  if (!result) return;

  return (
    <Flex gap={'1rem'} justify="center" align="center">
      <Flex gap={'1rem'} justify="center" align="center" vertical>
        <Typography.Title style={{
          color: `var(--ant-color-text)`,
          margin: 0
        }}>
          {result.first}
        </Typography.Title>
        <img
          className={styles.FlipEnterActive}
          height={60}
          src={`/images/dice/dice-0${result.first}.png`}
        />
      </Flex>
      <Flex gap={'1rem'} justify="center" align="center" vertical>
        <Typography.Title style={{
          color: `var(--ant-color-text)`,
          margin: 0
        }}>
          {result.second}
        </Typography.Title>
        <img
          className={styles.FlipEnterActive}
          height={60}
          src={`/images/dice/dice-0${result.second}.png`}
        />
      </Flex>
      <Flex gap={'1rem'} justify="center" align="center" vertical>
        <Typography.Title style={{
          color: `var(--ant-color-text)`,
          margin: 0
        }}>
          {result.third}
        </Typography.Title>
        <img
          className={styles.FlipEnterActive}
          height={60}
          src={`/images/dice/dice-0${result.third}.png`}
        />
      </Flex>
      {/* <img
        className={styles.FlipEnterActive}
        height={60}
        src={`/images/dice/dice-0${result.second}.png`}
      />
      <img
        className={styles.FlipEnterActive}
        height={60}
        src={`/images/dice/dice-0${result.third}.png`}
      /> */}
    </Flex>
  );
  
};

export default SicBoResults;

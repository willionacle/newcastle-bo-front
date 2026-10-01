import { Flex } from "antd"
import styles from "@/pages/betting/record/component/result/cards.module.css";

export interface SicboInfo {
  "second": number;
  "third": number;
  "first": number;
}

interface Props {
  GameInfo: SicboInfo
}

const SicBoResults = ({GameInfo}: Props) => {
  if (!GameInfo || !GameInfo.first || !GameInfo.second || !GameInfo.third) return;
  return (
    <Flex gap={'1rem'} justify="center" align="center">
      <img
        className={styles.FlipEnterActive}
        height={60}
        src={`/images/dice/dice-0${GameInfo.first}.png`}
      />
      <img
        className={styles.FlipEnterActive}
        height={60}
        src={`/images/dice/dice-0${GameInfo.second}.png`}
      />
      <img
        className={styles.FlipEnterActive}
        height={60}
        src={`/images/dice/dice-0${GameInfo.third}.png`}
      />
    </Flex>
  )
}

export default SicBoResults;
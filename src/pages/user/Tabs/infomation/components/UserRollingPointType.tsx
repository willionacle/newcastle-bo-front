import i18next from "@/i18n/i18n";

import { LevelConfigData } from '@/api/level-configs/get';
import Percentage from '@/components/Percentage';
import { GF } from '@/utils/GlobalFunctions';
import { Flex } from 'antd';

interface Props {
  levelConfig: LevelConfigData[];
  rollingPointType?: string;
  userLevel?: number;
}

const UserRollingPointType = ({levelConfig, rollingPointType, userLevel}: Props) => {
  const userLevelConfig = levelConfig && levelConfig.find((item) => item.level == userLevel);

  console.log('USER LEVEL CONFIG', userLevelConfig);

  return userLevelConfig && (
    <Flex gap={4} >
      <div className="">
        {GF.translateRollingType(rollingPointType ?? "")}
      </div>
      (<Flex gap={4}>
        <div className="">{i18next.t("user.liveLabel")}</div>
        <Percentage value={(userLevelConfig?.rolling_casino_percentage ?? 0) * 100} />
      </Flex>
      <Flex gap={4}>
        <div className="">{i18next.t("user.slotLabel")}</div>
        <Percentage value={(userLevelConfig?.rolling_slot_percentage ?? 0) * 100} />
      </Flex>
      <Flex gap={4}>
        <div className="">{i18next.t("user.sportsLabel")}</div>
        <Percentage value={(userLevelConfig?.rolling_sports_percentage ?? 0) * 100} />
      </Flex>
      <Flex gap={4}>
        <div className="">{i18next.t("user.minigameLabel")}</div>
        <Percentage value={(userLevelConfig?.rolling_mini_game_percentage ?? 0) * 100} />
      </Flex>)
      {/* {` - 라이브: ${userLevelConfig?.rolling_casino_percentage * 100}% | `} 
      {`슬롯: ${userLevelConfig?.rolling_slot_percentage}% | `} 
      {`스포츠: ${userLevelConfig?.rolling_sports_percentage}% | `} 
      {`미니게임: ${userLevelConfig?.rolling_mini_game_percentage}%`}  */}
    </Flex>
  )
}

export default UserRollingPointType
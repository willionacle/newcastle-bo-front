import i18next from "@/i18n/i18n";

import { LevelConfigData } from '@/api/level-configs/get';
import Percentage from '@/components/Percentage';
import { Flex } from 'antd';
import { pointTypeLabels } from '../UserInfo';
import CommaNumber from '@/components/CommaNumber';

interface Props {
  levelConfig: LevelConfigData[];
  data?: any;
  userLevel?: number;
}

const UserLossingPointType = ({levelConfig, data, userLevel}: Props) => {
  const userLevelConfig = levelConfig && levelConfig.find((item) => item.level == userLevel);

  console.log('USER LEVEL CONFIG', userLevelConfig);

  return userLevelConfig && (
    <Flex gap={4} >
      <div className="">
        {pointTypeLabels[data?.lossing_point_type ?? i18next.t("user.levelBasedSetting")]}
      </div>
      (<Flex gap={4}>
        <Percentage value={(userLevelConfig?.weekly_lossing_percentage ?? 0) * 100} />
        <div className="">{i18next.t("text.max")}</div>
      </Flex>
      <Flex gap={4}>
        <CommaNumber value={(userLevelConfig?.maximum_lossing_amount ? parseInt(userLevelConfig?.maximum_lossing_amount ?? 0) : 0) * 100} />
        <div className="">{i18next.t("user.fixedWonPayment")}</div>
      </Flex>)
    </Flex>
  )
}

export default UserLossingPointType
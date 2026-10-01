import i18next from "@/i18n/i18n";

// import Percentage from '@/components/Percentage';
import Percentage from '@/components/Percentage';
import { Flex } from 'antd';

interface Props {
  data?: any;
}

const UserRollingSettings = ({data}: Props) => {

  return (
    <Flex gap={4} justify='space-between' align='center' style={{
      // maxHeight: '40px', 
      width: '100%'
    }}>
      <Flex gap={2} vertical style={{
        // lineHeight: 1, 
        // marginTop: 9
      }}>
        <div className="">{data?.rolling_payment_onoff == 0 ? i18next.t("user.bulkSetting") : i18next.t("user.individualSetting")}</div>
      </Flex>
      <Flex gap={2} vertical style={{lineHeight: 1, marginTop: 0}}>
        <div className="">{i18next.t("user.liveLabel")}</div>
        <Percentage value={data?.rolling_payment_live ?? 0} />
      </Flex>
      <Flex gap={2} vertical style={{lineHeight: 1, marginTop: 0}}>
        <div className="">{i18next.t("user.slotLabel")}</div>
        <Percentage value={data?.rolling_payment_slot ?? 0} />
      </Flex>
      <Flex gap={2} vertical style={{lineHeight: 1, marginTop: 0}}>
        <div className="">{i18next.t("user.sportsLabel")}</div>
        <Percentage value={data?.rolling_payment_sports ?? 0} />
      </Flex>
      <Flex gap={2} vertical style={{lineHeight: 1, marginTop: 0}}>
        <div className="">{i18next.t("user.minigameLabel")}</div>
        <Percentage value={data?.rolling_payment_minigame ?? 0} />
      </Flex>
      <Flex gap={2} vertical style={{lineHeight: 1, marginTop: 0}}>
        <div className="">{i18next.t("user.fishingLabel")}</div>
        <Percentage value={data?.rolling_payment_fishing ?? 0} />
      </Flex>
      <Flex gap={2} vertical style={{lineHeight: 1, marginTop: 0}}>
        <div className="">{i18next.t("user.boardLabel")}</div>
        <Percentage value={data?.rolling_payment_board ?? 0} />
      </Flex>
      <Flex gap={2} vertical style={{lineHeight: 1, marginTop: 0}}>
        <div className="">{i18next.t("user.etcLabel")}</div>
        <Percentage value={data?.rolling_payment_etc ?? 0} />
      </Flex>
    </Flex>
  )
}

export default UserRollingSettings
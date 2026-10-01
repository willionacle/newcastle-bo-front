import { BetDetailsProp } from "../../../List";
import Baccarat from "../../result/ag/baccarat/Baccarat";
import DragonTiger from "../../result/ag/dragon-tiger/DragonTiger";

interface Prop {
  data?: BetDetailsProp;
}

const AGBetDetails = ({data}: Prop) => {
  if (data?.record && data?.category == 'live' && data?.record?.bet_data?.includes('BAC')) {
    return <Baccarat data={data} />
  }
  
  if (data?.record && data?.category == 'live' && data?.record?.bet_data?.includes('DT')) {
    return <DragonTiger data={data} />
  }
}

export default AGBetDetails;
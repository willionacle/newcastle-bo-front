import { BetDetailsProp } from "../../../List";
import Baccarat from "../../result/sagaming/baccarat/Baccarat";
interface Prop {
  data?: BetDetailsProp;
}

const SAGamingBetDetails = ({ data }: Prop) => {

  console.log('SA BET DETAILS', data)

  if (data?.record && data.record.bet_type.includes('bac')) {
    return <Baccarat data={data} />
  }
  // if (data?.record && data.record.game_division.includes('blackjack')) {
  //   return <BlackJack data={data} />
  // }
  // if (data?.record && data.record.game_division.includes('roulette')) {
  //   return <Roulette data={data} />
  // }
  // if (data?.record && data.record.game_division.includes('sicbo')) {
  //   return <Sicbo data={data} />
  // }
  // if (data?.record && data.record.game_division.includes('holdem')) {
  //   return <Holdem data={data} />
  // }
  // if (data?.record && data.record.game_division.includes('fantan')) {
  //   return <Fantan data={data} />
  // }
  // if (data?.record && data.record.game_division.includes('dragontiger')) {
  //   return <DragonTiger data={data} />
  // }
  // if (data?.record && data.record.game_division.includes('bacbo')) {
  //   return <Bacbo data={data} />
  // }

  // return <EvoRenderHtml data={data} />

  // return (<EvoRenderHtml data={data} />)
};

export default SAGamingBetDetails;

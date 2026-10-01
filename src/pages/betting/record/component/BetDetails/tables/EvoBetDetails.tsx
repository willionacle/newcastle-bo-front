import { BetDetailsProp } from "../../../List";
import Baccarat from "../../result/evo/baccarat/Baccarat";
import Roulette from "../../result/evo/roulette/Roulette";
import BlackJack from "../../result/evo/blackjack/BlackJack";
import Sicbo from "../../result/evo/sicbo/Sicbo";
import Holdem from "../../result/evo/holdem/Holdem";
import Fantan from "../../result/evo/fantan/Fantan";
import DragonTiger from "../../result/evo/dragon-tiger/DragonTiger";
import Bacbo from "../../result/evo/bacbo/Bacbo";
import EvoRenderHtml from "../../result/evo/html/EvoRenderHtml";
interface Prop {
  data?: BetDetailsProp;
}

const EvoBetDetails = ({ data }: Prop) => {

  // console.log('EVO BET DETAILS', data)
  
  if (data?.record && data.record.game_division.includes('baccarat')) {
    return <Baccarat data={data} />
  }
  if (data?.record && data.record.game_division.includes('blackjack')) {
    return <BlackJack data={data} />
  }
  if (data?.record && data.record.game_division.includes('roulette')) {
    return <Roulette data={data} />
  }
  if (data?.record && data.record.game_division.includes('sicbo')) {
    return <Sicbo data={data} />
  }
  if (data?.record && data.record.game_division.includes('holdem')) {
    return <Holdem data={data} />
  }
  if (data?.record && data.record.game_division.includes('fantan')) {
    return <Fantan data={data} />
  }
  if (data?.record && data.record.game_division.includes('dragontiger')) {
    return <DragonTiger data={data} />
  }
  if (data?.record && data.record.game_division.includes('bacbo')) {
    return <Bacbo data={data} />
  }

  return <EvoRenderHtml data={data} />

  // return (<EvoRenderHtml data={data} />)
};

export default EvoBetDetails;

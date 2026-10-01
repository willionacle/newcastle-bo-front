import { Typography } from "antd";
import BetDetail from "./tables/BetDetail"
import { breadcrumbTitleWrapperStyle } from "@/components/BreadcrumbStyle";
import BetTopDetail from "./tables/BetTopDetail";
import { BetDetailsProp } from "../../List";
import PPBetDetails from "./tables/PPBetDetails";
import EvoBetDetails from "./tables/EvoBetDetails";
import CQ9BetDetails from "./tables/CQ9BetDetails";
import BngBetDetails from "./tables/BngBetDetails";
import AGBetDetails from "./tables/AGBetDetails";
import MGBetDetails from "./tables/MGBetDetails";
import BetResultURL from "@/components/BetResultURL";
import EvoslotRenderHtml from "../result/evoslot/EvoslotRenderHtml";
import LotusBetDetails from "../result/lotus/LotusBetDetails";
import KSportsBetDetails from "./tables/KSportsBetDetails";
import EvoplayBetDetails from "../result/evolplay/EvoplayBetDetails";
import ESportsBetDetails from "../result/esports/ESportsBetDetails";
import SAGamingBetDetails from "./tables/SAGamingBetDetails";
import VRBetDetails from "./tables/VRBetDetails";
import SportWidgetV3BetDetails from "./tables/SportWidgetV3BetDetails";

interface Props {
  data?: BetDetailsProp;
}

const BetDetails = ({data}: Props) => {
  console.log('BetDetails', data)
  return (
    <>
      <Typography.Text strong style={{...breadcrumbTitleWrapperStyle, marginBottom: '1rem'}}>
        세부정보
      </Typography.Text>
      {data?.vendor === 'bti' && (
        <>
          <BetTopDetail data={data?.bet_top_details} record={data.record} />
          <BetDetail record={data.record} data={data?.bet_details}  />
        </>
      )}
      {data?.vendor === 'ksports' && (
        <KSportsBetDetails record={data.record!} />
      )}

      {data?.vendor === 'pp' && (
        <PPBetDetails data={data} />
      )}

      {(data?.vendor === 'evo') && (
        <EvoBetDetails data={data} />
      )}

      {data?.vendor === 'cq9' && (
        <CQ9BetDetails data={data} />
      )}

      {data?.vendor === 'BNG' && (
        <BngBetDetails data={data} />
      )}

      {data?.vendor === 'ag' && (
        <AGBetDetails data={data} />
      )}

      {data?.vendor === 'mg' && (
        <MGBetDetails data={data} />
      )}
      {data?.vendor === 'fc' && (
        <BetResultURL data={data} />
      )}
      {data?.vendor === 'og' && (
        <BetResultURL url={data.record?.bet_data_2} />
      )}
      {data?.vendor === 'dg' && (
        <BetResultURL url={data.record?.bet_data_2} />
      )}
      {(data?.vendor === 'evoslot') && (
        <EvoslotRenderHtml data={data} />
      )}
      {data?.vendor === 'pgsoft' && (
        <BetResultURL data={data} />
      )}
      {data?.vendor === 'lotus' && (
        <LotusBetDetails record={data.record!} />
      )}
      {data?.vendor === 'evoplay' && (
        <EvoplayBetDetails record={data.record!} />
      )}
      {data?.vendor === 'eSports' && (
        <ESportsBetDetails record={data.record!} />
      )}
      {data?.vendor === 'buffalo' && (
        <BetResultURL data={data} isHtmlDoc />
      )}
      {data?.vendor === 'sagaming' && (
        <SAGamingBetDetails data={data} />
      )}
      {data?.vendor === 'vr' && (
        <VRBetDetails data={data} />
      )}
      {Array.isArray(data?.record?.legs) && data.record.legs.length > 0 && (
        <SportWidgetV3BetDetails record={data.record!} />
      )}
    </>
  );
};

export default BetDetails;
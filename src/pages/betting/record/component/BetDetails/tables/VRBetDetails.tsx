import { useEffect, useState } from "react";
import { BetDetailsProp } from "../../../List";
import { BetDetailsData } from "../../../types";
import { getVrBetHistoryViewAPI } from "@/api/vr-game/get";
import VrBettingDetail, { VrBetDetail } from "../../result/vr/VrBettingDetail";

interface BetDetails {
  id: number;
  username: string;
  created_at: string;
  key: string;
  status: number;
  total_odds: number;
  bonus_odds?: string;
  bet_amount: number;
  win_amount: number;
  vr_bet_details: VrBetDetail[];
}

interface Prop {
  data?: BetDetailsProp;
}

const VRBetDetails = ({ data }: Prop) => {
  const [details, setDetails] = useState<BetDetails | null>(null);

  useEffect(() => {
    const betDetails = data?.bet_data as unknown as BetDetailsData;

    if (betDetails?.id) {
      const fetchDetails = async () => {
        // setLoading(true);
        try {
          const res = await getVrBetHistoryViewAPI({ id: betDetails.id });
          if (res) {
            console.log("Data fetched successfully:", res);
            setDetails(res);
          }
        } catch (error) {
          console.error("Error fetching VR bet details:", error);
        } 
      };

      fetchDetails();
    }
  }, [data]);

  if (!details) return;

  return <VrBettingDetail data={details} isOpen={true}/>;
};

export default VRBetDetails;

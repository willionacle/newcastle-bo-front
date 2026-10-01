// import ESportsBetDetails from "@/pages/betting/record/component/result/esports/ESportsBetDetails";
import useUserStore from "@/store/user.store";
import axios, { AxiosResponse } from "axios";
import { stringify } from "qs";
import useSWR from "swr";
import { SAGAmingResponseData } from "./@types/sagaming";

interface GetBetDetails {
  gameid?: string;
  transaction_id?: string;
  username: string;
  roundid?: string;
  game?: string;
  game_history?: string;
  created_at?: string;
  session?: string;
}

export interface GameBetDetailsRes<T> {
  html?: string;
  url?: string;
  errorcode: string;
  errors: string;
  data: T;
}

type SeatData = {
  bonusCards: string[];
  cards: string[];
  outcome: string;
  score: number;
};
type HandData = {
  bonusCards: string[];
  cards: string[];
  outcome: string;
  score: number;
};

export type SeatTypes = {
  Seat1: SeatData;
  Seat2: SeatData;
  Seat3: SeatData;
  Seat4: SeatData;
  Seat5: SeatData;
  Seat6: SeatData;
  Seat7: SeatData;
};
export type HandTypes = {
  hand1: HandData;
  hand2: HandData;
  hand3: HandData;
  hand4: HandData;
  hand5: HandData;
  hand6: HandData;
  hand7: HandData;
};

export type RawData = {
  id: string;
  gameProvider: string;
  gameSubProvider: string;
  startedAt: string;
  settledAt: string;
  status: string;
  gameType: string;
  gameSubType: string;
  table: {
    id: string;
    name: string;
  };
  dealer: {
    uid: string;
    name: string;
  };
  currency: string;
  participants: Array<{
    result: {
      link: string;
    };
    casinoId: string;
    playerId: string;
    screenName: string;
    playerGameId: string;
    sessionId: string;
    casinoSessionId: string;
    currency: string;
    bets: Array<{
      code: string;
      stake: number;
      payout: number;
      placedOn: string;
      transactionId: string;
    }>;
    configOverlays: string[];
    subType: string;
    playMode: string;
    channel: string;
    os: string;
    device: string;
    skinId: string;
    brandId: string;
    currencyRateVersion: string;
    status: string;
    commissionMode: string;
    seats: {
      [key: string]: SeatData;
    };
    hands: {
      [key: string]: HandData;
    };
  }>;
  result: {
    redEnvelopePayouts: Record<string, number | string>;
    sideBetPerfectPair: string;
    sideBetPlayerPair: string;
    sideBetBankerBonus: string;
    bankerInsuranceOutcome: string;
    outcome: string;
    sideBetEitherPair: string;
    sideBetBankerPair: string;
    player: {
      score: number;
      rank: number;
      cards: string[];
    };
    sideBetPlayerBonus: string;
    playerInsuranceOutcome: string;
    redEnvelopePayoutsV2: Record<string, number>;
    banker: {
      score: number;
      cards: string[];
    };
    burnedCards: string[];
    dealer: {
      cards: string[];
      score: number;
      rank: number;
    };
    seats: {
      [K in keyof SeatTypes]: SeatTypes[K];
    };
    dealerHand: {
      score: number;
      cards: string[];
    };
    dealtToPlayer: string[];
    outcomes: Array<{
      color: string;
      number: string;
      type: string;
    }>;
    luckyNumbers: Record<string, number>;
    first: number;
    second: number;
    third: number;
    cards: {
      dealer: string[];
      player: string[];
      river: string[];
      flop: string[];
    };
    buttonsCount: string;
    dragon: {
      score: number;
      card: string;
    };
    tiger: {
      score: number;
      card: string;
    };
    playerDice: {
      score: number;
      first: number;
      second: number;
    };
    bankerDice: {
      score: number;
      first: number;
      second: number;
    };
  };
  wager: number;
  payout: number;
};

export type NewEvoBetData = {
  raw: {
    uuid: string;
    timestamp: string;
    data: RawData;
  };
  results: {
    Uuid: string;
    Timestamp: string;
    GameId: string;
    PlayerId: string;
    GameType: string;
    GameSubType: string;
    TableId: string;
    TableName: string;
    DealerName: string;
    StartedAt: string;
    SettledAt: string;
    Status: string;
    Outcome: string;
    Wager: number;
    Payout: number;
    Currency: string;
    ParticipantCurrency: string;
    RenderLink: string;
    Bets: Array<{
      Code: string;
      Stake: number;
      Payout: number;
      PlacedOn: string;
      TransactionId: string;
    }>;
  };
} & RawData

type EvoplayNumStr = string | number;

export type EsportsBetDetails = {
  id: number;
  order_id: string;
  odds: number;
  amount: number;
  bonus: number;
  win_lose: number;
  username: string;
  category_id: number;
  category_type: number;
  winner: number;
  cdnip: number;
  userip: number;
  isalert: boolean;
  money_type: number;
  client_type: number;
  currency_id: number;
  exchange_rate: number;
  show_scale: number;

  create_time: number;        
  game_start_time: number;    
  update_time: number;        
  bonus_time: number;
  cancel_time: number;

  third_mark_id: number;
  game_id: number;
  event_id: number;
  event_name: string;

  game_type_id: number;
  game_name: string;

  play_type_id: number;
  play_name: string;

  team_name_1: string;
  team_name_2: string;
  team_info_desc: string;
  desc: string;

  is_parlay: boolean;
  is_cancel: boolean;
  is_getprize: boolean;
  prize_status: number;
  receive_status: number;
  is_reverse: boolean;

  parlay_info: string;

  regDate: string;
  create_time_kst: string;
  game_start_time_kst: string;
  update_time_kst: string;
  bonus_time_kst: string;
}


export interface EvoplayEvent {
  event_id: string;
  time?: string;
  date?: string;
  type?: string;
  type_code?: number;
  system_id?: string;
  data: EvoplayData;
}

interface EvoplayData {
  balance?: EvoplayNumStr;
  balance_before_pay?: EvoplayNumStr;
  balance_after_pay?: EvoplayNumStr;
  total_bet?: EvoplayNumStr;
  total_win?: EvoplayNumStr;
  payout?: EvoplayNumStr;
  denomination?: EvoplayNumStr;
  pay_for_action_this_round?: EvoplayNumStr;
  multiplier?: EvoplayNumStr;
  lines?: EvoplayNumStr;
  bet?: EvoplayNumStr;
  baraban?: string[][];
  baraban_assets?: string[][];
  pay_lines?: EvoplayPayLine[];
  freespin?: string;
  bonus_buy?: string;
  vendor_id?: string;
  parent_game_id?: string;
  game?: EvoplayGame;
  user?: EvoplayUser;
  currency_rate?: EvoplayCurrencyRate;
  response?: string;
  request?: EvoplayRequest;
  final_action?: string;
  lent_pack_id?: string;
  user_agent?: string;
  tournament?: string | unknown[];
  required_certified_data?: EvoplayCertifiedData;
  analytics_fields?: EvoplayAnalytics;
}

interface EvoplayGame {
  action?: string;
  handler?: string;
  game_id?: string;
  absolute_name?: string;
  game_client_version?: string;
  mobile?: string;
  response?: string;
  round?: {
    round_id?: string;
    win?: EvoplayNumStr;
  };
  multiplier?: EvoplayNumStr;
}

interface EvoplayUser {
  balance?: EvoplayNumStr;
  fun_balance?: EvoplayNumStr;
  points?: EvoplayNumStr;
  currency?: string;
  mode?: string;
  user_id?: string;
  agregator_user_id?: string;
  is_demo?: string;
  wid?: string;
  mode_as_string?: string;
  agregator?: string;
}

interface EvoplayCurrencyRate {
  currency?: string;
  rate?: EvoplayNumStr;
}

interface EvoplayRequest {
  GET?: string;
  POST?: string;
}

interface EvoplayCertifiedData {
  paytable_id?: string;
  game_id?: string;
}

interface EvoplayAnalytics {
  details_is_bonus_buy?: string;
  details_vendor_id?: string;
  details_bet?: EvoplayNumStr;
  details_registration_id?: string;
  details_campaign_id?: string;
  details_gift_spin_done?: string;
  details_original_game_mode?: string;
  real_payment_eur?: EvoplayNumStr;
  total_win_eur?: EvoplayNumStr;
}

interface EvoplayPayLine {
  amount: number;
  pay_lines: number[][];
}


export const getBetDetails = (params: GetBetDetails) => {
  const { username, token } = useUserStore.getState();
  console.log(token);

  const isEvoslot = params.game_history === "evoslot";

  const query = stringify(isEvoslot ? {
    "username": params.username,
    "created_at": params.created_at,
    "transaction_id": params.transaction_id,
  } : {
    username: params.username,
    adminid: username,
    gameid: params.gameid,
  });
  const fetcher = async ([url, query]: [string, string]) => {
    const res = await axios.get<
      undefined,
      AxiosResponse<GameBetDetailsRes<NewEvoBetData>>
    >(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res;
  };

  return useSWR(
    [`${import.meta.env.VITE_GAMEAPI_URL}/transfer/${isEvoslot ? "evoslot" : "evo_tran"}/betdetails`, query],
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnMount: true
    }
  );
};

export type UrlData ={
  url: string;
  data:EvoplayEvent[]
} & EsportsBetDetails

export const getBetDetails2 = (params: GetBetDetails) => {
  const {username, gameid, roundid, game, transaction_id,session} = params
  const { token } = useUserStore.getState();

  let qParams: Record<string, any> = {};

  switch (game) {
    case "fc":
    case "ds":
      qParams = { transaction_id };
      break;

    case "evoplay":
    case "pgsoft":
    case "buffalo":
      qParams = { transaction_id, username };
      break;
    case "esports":
      qParams = { username, session };
      break;

    default:
      qParams = { username, gameid, roundid };
      break;
  }

  const query = stringify(qParams)

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await axios.get<
      undefined,
      AxiosResponse<GameBetDetailsRes<UrlData>>
    >(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res;
  };

  return useSWR(
    [`${import.meta.env.VITE_GAMEAPI_URL}/transfer/${game}/betdetails`, query],
    fetcher
  );
};

export const getSAGBetDetails = (params: GetBetDetails) => {
  const { username, token } = useUserStore.getState();

  const query = stringify({
    "username": username,
    "transaction_id": params.transaction_id,
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await axios.get<
      undefined,
      AxiosResponse<GameBetDetailsRes<SAGAmingResponseData>>
    >(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res;
  };

  return useSWR(
    [`${import.meta.env.VITE_GAMEAPI_URL}/transfer/sagaming/betdetails`, query],
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnMount: true
    }
  );
};
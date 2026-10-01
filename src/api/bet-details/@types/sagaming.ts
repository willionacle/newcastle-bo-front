export interface SAGBetDetail {
  "BetDetail": {
    /** ISO Date string */
    "BetTime": string,
    /** ISO Date string */
    "PayoutTime": string,
    "Username": string,
    "HostID": string,
    "GameID": string,
    "Round": string,
    "Set": string,
    "BetID": string,
    /** KRW */
    "Currency": string,
    /** Amount Number as string */
    "BetAmount": string,
    /** Amount Number as string */
    "Rolling": string,
    /** Amount Number as string */
    "ResultAmount": string,
    /** Amount Number as string */
    "Balance": string,
    "GameType": string,
    "BetType": string,
    "BetSource": string,
    "Detail": string | null,
    "TransactionID": string,
    "BetConfirmation": string
  }
}

export interface SAGBaccCardResult {
  /** string 1-4 Spade, Heart, Club, Diamond */
  "Suit": string; // string 1-4
  /** string 1-13 A, 2-10, J, Q, K */
  "Rank": string; // string 1-13
}

export type SAGBaccaratResult = {
  "BaccaratResult": {
    "PlayerCard1": SAGBaccCardResult;
    "PlayerCard2": SAGBaccCardResult;
    "PlayerCard3"?: SAGBaccCardResult;
    "BankerCard1": SAGBaccCardResult;
    "BankerCard2": SAGBaccCardResult;
    "BankerCard3"?: SAGBaccCardResult;
    "ResultDetail": { // all boolean as string 
      "BRTie": string;
      "BRPlayerWin": string;
      "BRBankerWin": string;
      "BRPlayerPair": string;
      "BRBankerPair": string;
      "BRS2CardsLuckySix": string;
      "BRS3CardsLuckySix": string;
      "BRSSS2CardsLuckySix": string;
      "BRSSS3CardsLuckySix": string;
      "BRSPlayerBonus": string;
      "BRSBankerBonus": string;
      "BRSSTie": string;
      "BRSSPlayerWin": string;
      "BRSSBankerWin": string;
      "BRSSPlayerPair": string;
      "BRSSBankerPair": string;
      "BRPlayerNatural": string;
      "BRBankerNatural": string;
      "BRSSPlayerNatural": string;
      "BRSSBankerNatural": string;
      "BRSAnyPair": string;
      "BRSSSAnyPair": string;
      "BRSPerfectPair": string;
      "BRSSSPerfectPair": string;
      "BRSSSPlayerBonus": string;
      "BRSSSBankerBonus": string;
      "BRSSSLuckySix": string;
      "BRSLuckySix": string;
    }
  }
}

export type SAGAmingBaseData<T = undefined, K = undefined> = {
  "?xml": {
    "@version": string;
    "@encoding": string;
  };
  "GetAllBetDetailsForTransactionIDResponse": {
    "@xmlns:xsd": string;
    "@xmlns:xsi": string;
    "ErrorMsgId": string;
    "ErrorMsg": string;
    "NumOfRecord": string;
    "Result": T;
    "BetDetailList": K;
  }
}

export type SAGBaccaratData = SAGAmingBaseData<SAGBaccaratResult, SAGBetDetail>;

export interface SAGAmingResponseData {
  transactionId: string;
  data: SAGBaccaratData;
}

export interface SAGParsedBetData {
  // "betData": "{\"details\":[{\"type\":27,\"amount\":200000.0}]}",
  // "resultData": "{\"betlist\":[{\"betid\":35929576100,\"bettype\":27,\"betamount\":200000.0,\"resultamount\":200000.0,\"txnid\":\"26887733021\",\"betsource\":2640,\"rolling\":200000.0}]}",
  "betData": string,
  "resultData": string,
  "gameData": {
      "GameType": string;
      "TransType": string;
      "RoundNo": string;
      "GameName": string;
      "GameInfo": string;
      "transaction_id": string;
  }
}
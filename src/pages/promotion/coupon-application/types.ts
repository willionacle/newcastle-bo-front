export type BetDetailStatus = 
"Opened" | "Lost" | "Won" | "Canceled" | "Cashout" | "Half Lost" |
"대기" | "패" | "승" | "취소" | "캐시아웃" | "하프 패";

export interface BetDetailsData {
  id: number;
  tbxi_item_name: string;
  tbxi_league_name: string;
  tbxi_match_name: string;
  tbxi_home_name: string;
  tbxi_score: string;
  tbxi_betting_score: string;
  tbxi_away_name: string;
  tbxi_betting_name: string;
  tbxi_betval: string;
  tbxi_allocation: string;
  tbxi_bechmark: string;
  tbxi_match_type: BetDetailStatus;
  tbxi_status: string;
  tbxi_match_time: string;
  tbxi_reserve_id: string;
  tbxi_line_id: string;
  tbxi_event_name: string;
}

export interface BetTopDetailsData {
  id: number;
  expected_amount: number;
  amount: number;
  username: string;
  reserve_id: string;
  created_at: string;
  match_type: string;
  status: BetDetailStatus;
}


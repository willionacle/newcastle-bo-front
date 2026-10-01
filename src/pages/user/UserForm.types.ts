import { DepositAccountResponse } from "@/api/deposit-account/get";
import { ResUser } from "@/api/types";

export interface UserFormProps {
  mutate?: any;
  user?: ResUser["data"];
}

export interface UserFormValues {
  user_grade: number;
  local_grade_config: "automatic" | "manual";
  username: ResUser["data"]["username"];
  password: string;
  account_name: ResUser["data"]["account_name"];
  phone_number: string;
  agent_id: any;
  user_level: ResUser["data"]["user_level"];
  user_status: ResUser["data"]["user_status"];
  bank_name: ResUser["data"]["bank_name"];
  account_number: ResUser["data"]["account_number"];
  user_real_name: ResUser["data"]["user_real_name"];
  rolling_casino_percentage: ResUser["data"]["rolling_casino_percentage"];
  rolling_slot_percentage: ResUser["data"]["rolling_slot_percentage"];
  rolling_mini_game_percentage: ResUser["data"]["rolling_mini_game_percentage"];
  rolling_sports_percentage: ResUser["data"]["rolling_sports_percentage"];
  lossing_point_percentage: ResUser["data"]["lossing_point_percentage"];
  rolling_point_type: ResUser["data"]["rolling_point_type"];
  lossing_point_type: ResUser["data"]["lossing_point_type"];
  tree_depth?: ResUser["data"]["tree_depth"];
  depositMethod: string[];
  newPassword: string;
  level_type: "AUTO" | "MANUAL";
  deposit_total: number;
  initial_bet_total: number;
  withdrawal_total: number;
  wallet_address: string | null;
  network: string | null;
  referral_username?: string | null | undefined;
  isAllowedAccountWithdrawal: boolean;
  isAllowedOncashWithdrawal: boolean;
}

export interface DepositMethodOption {
  value: string;
  label: string;
  title: string;
  isInput: DepositAccountResponse["data"][number]["isInput"];
}

import { CompressedUserStatsTotalSummary } from "../dailystats-gamesumm/get"
import { UpdatePaymentBody } from "../deposit-logs/post"

export type APIEndpoints = 'userList' 
    | 'loginList'
    | 'eventList'
    | 'whiteIPList'
    | 'blockIPList'
    | 'smsLogList'
    | 'agentList'
    | 'agentDropdownList'
    | 'phoneLogList'
    | 'bannerList'
    | 'heroList'
    | 'noticeList'
    | 'gameList'
    | 'agentTreeList'

export type ItemAPIEndpoints = 'getUser'
    | 'getEvent'
    | 'getBanner'
    | 'getHero'
    | 'getNotice'
    | 'getLevel'
    | 'getLevelDeposit'
    | 'getDepositBonus'
    | 'getRegulation'
    | 'getMessageTemplate'

export type DeleteAPIEndpoints = 'deleteEvent'
    | 'deleteHero'
    | 'deleteBanner'
    | 'deleteNotice'
    | 'deleteLevelDep'
    | 'deleteDepBonus'
    | 'deleteScEvent'
    | 'deleteScForbidWord'

export interface SWRType<T> {
    totalitems: number;
    data: T;
    count?: number;
    totals?: any;
    userCount?: number;
    code?: number;
    message?: string;
    user_count_1?: number;
    user_count_2?: number;
    user_count_percentage?: number;
    recommended_user_count?: number;
    recommended_deposited_user_count?: number;
    totalSummary?: CompressedUserStatsTotalSummary;
}

export interface PostUserList {
    userid      : number,
    page        : number,
    limit       : number,
    orderby     : string,
    columnby    : string,
    status      : null | string,
    username    : null | string,
    referral_username     : null | string,
    agent_username        : null | string,
    user_real_name        : null | string,
    user_level            : null | string,
    start_date            : null | string,
    end_date              : null | string
}

export interface PostAgentTreeList {
    "userid"                : number,
    "page"                  : number,
    "limit"                 : number,
    "orderby"               : string,
    "user_status"           : null | string
    "username"              : null | string
    "user_real_name"        : null | string
    "user_level"            : null | string
    "start_date"            : null | string | Date,
    "end_date"              : null | string | Date
}

export interface PostAgentList {
    userid          : number,
    page            : number,
    limit           : number,
    orderby         : string,
    user_status     : null | string,
    username        : null | string,
    user_real_name  : null | string,
    user_level      : null | string,
    start_date      : null | string,
    end_date        : null | string
}

export interface PostLoginList {
    "userid"        : number,
    "page"          : number,
    "limit"         : number,
    "orderby"       : null | number,
    "status"        : null | string,
    "username"      : null | string,
    "is_admin"      : null | number
}

export interface PostEventList {
    "userid"        : number,
    "page"          : number,
    "limit"         : number,
    "orderby"       : string,
    "title"         : null | string,
    "in_use"        : null | number
}

export interface PostBannerList {
    "userid"        : number,
    "page"          : number,
    "limit"         : number,
    "orderby"       : string,
    "url"           : null | string,
    "in_use"        : null | number
}

export interface PostHeroList {
    "userid"        : number,
    "page"          : number,
    "limit"         : number,
    "orderby"       : string,
    "in_use"        : null | number
}

export interface PostNoticeList {
    "userid"        : number,
    "page"          : number,
    "limit"         : number,
    "orderby"       : string,
}

export interface PostWhiteIPList {
    "userid"        : number,
    "page"          : number,
    "limit"         : number,
    "orderby"       : string,
    "ip"            : null | string,
    "username"      : null | string
}

export interface PostBlockIPList {
    "userid"        : number,
    "page"          : number,
    "limit"         : number,
    "orderby"       : string,
    "ip"            : null | string,
    "start_date"    : null | string,
    "end_date"      : null | string
}

export interface PostSMSLogList {
    "userid"        : number,
    "page"          : number,
    "limit"         : number,
    "orderby"       : string
}

export interface PostPhoneLogList {
    "userid"        : number,
    "page"          : number,
    "limit"         : number,
    "orderby"       : string
}

export interface PostGameList {
    "userid"        : number,
    "page"          : number,
    "limit"         : number,
    "orderby"       : string,
    "vendor_name"   : string,
    "game_name_en"  : string
}

export interface PostDeleteBlockIP {
    "userid"    : number,
    "id"        : number,
}

export interface PostGetItem {
    "userid"    : number,
    "id"        : number,
}

export interface PostGetItemByUsername {
    "userid"    : number,
    "username"  : string | null,
}

export interface ResponseData {
    data: object
}

export interface PostDeleteBlockIPRes {
    code    : number,
    message : string,
}

export interface DefaultResponseInterface<T> {
    code: number;
    message: string;
    data: T;
}

export interface ResPostList {
    message: string,
    data: any,
    code: number,
    page: number,
    totalitems: number,
    totalpage: number
    totals: TotalsDepositWithdraw;
}

export interface ResUser {
  message: string,
  code: number,
  data: {
      "id": number,
      "username": string,
      "email": string,
      "provider": string,
      "confirmed": null | string,
      "blocked": null | string,
      "created_at": string,
      "updated_at": string,
      "created_by_id": null | number,
      "updated_by_id": null | number,
      "last_login": string,
      "account_name": string,
      "accountName": string,
      "account_number": string,
      "accountNumber": string,
      "bank_name": string,
      "bankName": string,
      "phoneNumber": string,
      "admin_level": null | string,
      "userLevel": number,
      "last_bet_datetime": null | string,
      "rollingPoint": number,
      "lossing_point": number,
      "lossingPoint": number,
      "treeDepth": null | number,
      "balance": number,
      "mileage": number,
      "userStatus": "ACTIVE" | "INACTIVE" | "DEACTIVATED" | "SUSPENDED" | "OBSERVATION",
      "system_note": null | string,
      "nickname": string,
      "tple_token": null | string,
      "last_active_at": string,
      "rolling_point_type": string,
      "rollingPointType": string,
      "lossing_point_type": string,
      "lossingPointType": string,
      "lossing_point_percentage": number,
      "lossingPointPercentage": number,
      "tple_id": null | number,
      "rolling_slot_percentage": number,
      "rollingSlotPercentage": number,
      "rolling_mini_game_percentage": number,
      "rollingMiniGamePercentage": number,
      "rolling_sports_percentage": number,
      "rollingSportsPercentage": number,
      "rolling_casino_percentage": number,
      "rollingCasinoPercentage": number,
      "userRealName": string,
      // Gradual migration: snake_case aliases for backward compatibility
      // These fields are being migrated from snake_case to camelCase
      "user_level": number,              // alias for userLevel
      "rolling_point": number,           // alias for rollingPoint
      "agent_username": string,          // alias for agentUsername
      "user_status": "ACTIVE" | "INACTIVE" | "DEACTIVATED" | "SUSPENDED" | "OBSERVATION",  // alias for userStatus
      "user_real_name": string,          // alias for userRealName
      "referral_point": number,
      "referralPoint": number,
      "birthday": string,
      "user_memo_1": string,
      "user_memo_2": string,
      "user_memo_3": string,
      "user_memo_4": string,
      "user_memo_5": string,
      "user_memo_6": string,
      "agent_lossing_point_percentage": number,
      "sunday_balance": null | number,
      "failed_login_attempts": number,
      "depositTotal": number,
      "withdrawalTotal": number | undefined,
      "agent_rolling_casino_percentage"?: null | number,
      "agent_rolling_mini_game_percentage"?: null | number,
      "agent_rolling_slot_percentage"?: null | number,
      "agent_rolling_sports_percentage"?: null | number,
      "agent_rolling_point": null | number,
      "agent_rolling_percentage": null | number,
      "agent_lossing_point": null | number,
      "agent_lossing_percentage": null| number,
      "settlement_cycle": null | string,
      "settlement_cycle_day": null | string,
      "bet_total": number,
      "betTotal": number,
      "level_type": "AUTO" | "MANUAL",
      "levelType": "AUTO" | "MANUAL",
      "dwSum": number,
      "bw_sum": number,
      "token_uid": string,
      "referral": string,
      "agent_id": number,
      "role": string,
      "referralUsername": string
      "agentUsername": string
      "role_name": string,
      "token": string,
      "token_expired": string,
      "path": null | string,
      "parentID": number,
      "coupon_total"?: number,
      "couponTotal"?: number,
      "referral_total"?: number,
      "referralTotal"?: number,
      "rolling_total"?: number,
      "initial_bet_total"?: number,
      "initialBetTotal"?: number,
      "sports_waiting"?: number,
      "sportsWaiting"?: number,
      "wallet_address": null | string,
      "walletAddress": null | string,
      "network": null | string,
      "local_grade_config"?: "automatic" | "manual",
      "localGradeConfig"?: "automatic" | "manual",
      "userGrade": number,
      "userGradeDay"?: number,
      "depositCountTotal"?: number,
      "lastDepositDate"?: string,
      "userRegdate"?: string,
      "lastLogin"?: string,
      "userbday"?: string,
      "subs_kakao"?: 0 | 1,
      "subsKakao"?: 0 | 1,
      "subs_tele"?: 0 | 1,
      "subsTele"?: 0 | 1,
      "rolling_payment_onoff"?: number,
      "rolling_payment_live"?: number,
      "rolling_payment_slot"?: number,
      "rolling_payment_sports"?: number,
      "rolling_payment_minigame"?: number,
      "rolling_payment_fishing"?: number,
      "rolling_payment_board"?: number,
      "rolling_payment_etc"?: number,
      "ref_id"?: number,
      "refId"?: number,
      "ref_username"?: string,
      "refUsername"?: string,
      "ref_user_real_name"?: number,
      "refUserRealName"?: number,
      "isAllowedAccountWithdrawal": 1 | 0;
      "isAllowedOncashWithdrawal": 1 | 0;
      [x: string]: any
  }
}

export interface User {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: null | string;
  blocked: null | string;
  created_at: string;
  updated_at: string;
  created_by_id: null | number;
  updated_by_id: null | number;
  last_login: string;
  account_name: string;
  account_number: string;
  bank_name: string;
  phone_number?: string;
  admin_level: null | string;
  user_level: number;
  last_bet_datetime: null | string;
  rolling_point: number;
  lossing_point: number;
  tree_depth?: number;
  balance: number;
  mileage: number;
  user_status:
    | "ACTIVE"
    | "INACTIVE"
    | "DEACTIVATED"
    | "SUSPENDED"
    | "OBSERVATION"
    | "ROYALBLACK";
  system_note: null | string;
  nickname: string;
  tple_token: null | string;
  last_active_at: string;
  rolling_point_type: string;
  lossing_point_type: string;
  lossing_point_percentage: number;
  tple_id: null | number;
  rolling_slot_percentage: number;
  rolling_mini_game_percentage: number;
  rolling_sports_percentage: number;
  rolling_casino_percentage: number;
  user_real_name: string;
  referral_point: number;
  birthday: string;
  user_memo_1: string;
  user_memo_2: string;
  user_memo_3: string;
  user_memo_4: string;
  user_memo_5: string;
  user_memo_6: string;
  agent_lossing_point_percentage: number;
  sunday_balance: null | number;
  failed_login_attempts: number;
  deposit_total?: number;
  withdrawal_total?: number | undefined;
  agent_rolling_point: null | number;
  agent_rolling_percentage: null | number;
  agent_lossing_point: null | number;
  agent_lossing_percentage: null | number;
  settlement_cycle: null | string;
  settlement_cycle_day: null | string;
  bet_total: number;
  level_type: "AUTO" | "MANUAL";
  dw_sum?: number;
  bw_sum: number;
  token_uid: string;
  referral: string;
  agent_id: number;
  role: string;
  referral_username?: string;
  agent_username?: string;
  role_name: string;
  token: string;
  token_expired: string;
  path: null | string;
  isAllowedAccountWithdrawal: 1 | 0;
  isAllowedOncashWithdrawal: 1 | 0;
}

export interface AgentType {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: null | string;
  blocked: null | string;
  created_at: string;
  updated_at: string;
  created_by_id: null | number;
  updated_by_id: null | number;
  last_login: string;
  account_name: string;
  account_number: string;
  bank_name: string;
  phone_number: string;
  admin_level: null | string;
  user_level: number;
  user_grade: number;
  last_bet_datetime: null | string;
  rolling_point: number;
  lossing_point: number;
  tree_depth: number;
  balance: number;
  mileage: number;
  user_status:
    | "ACTIVE"
    | "INACTIVE"
    | "DEACTIVATED"
    | "SUSPENDED"
    | "OBSERVATION";
  system_note: null | string;
  nickname: string;
  tple_token: null | string;
  last_active_at: string;
  rolling_point_type: string;
  lossing_point_type: string;
  lossing_point_percentage: number;
  tple_id: null | number;
  rolling_slot_percentage: number;
  rolling_mini_game_percentage: number;
  rolling_sports_percentage: number;
  rolling_casino_percentage: number;
  user_real_name: string;
  referral_point: number;
  birthday: string;
  user_memo_1: string;
  user_memo_2: string;
  user_memo_3: string;
  user_memo_4: string;
  user_memo_5: string;
  user_memo_6: string;
  agent_lossing_point_percentage: number;
  sunday_balance: null | number;
  failed_login_attempts: number;
  deposit_total: number;
  withdrawal_total: number | undefined;
  agent_rolling_point: null | number;
  agent_rolling_percentage: null | number;
  agent_lossing_point: null | number;
  agent_lossing_percentage: null | number;
  settlement_cycle: null | string;
  settlement_cycle_day: null | string;
  bet_total: number;
  initial_bet_total: number;
  level_type: "AUTO" | "MANUAL";
  dw_sum: number;
  bw_sum: number;
  token_uid: string;
  referral: string;
  agent_id: number;
  role: string;
  referral_username: string;
  agent_username: string;
  role_name: string;
  token: string;
  token_expired: string;
  path: null | string;
  wallet_address: null | string;
  network: null | string;
  parentID: number;
}

export interface PostUpdateUserBody {
    "id": number,
    "username": string,
    "email": string,
    "provider": string,
    "password": string | undefined,
    "confirmed": null | string,
    "blocked": null | string,
    "created_at": string,
    "updated_at": string,
    "created_by_id": null | number,
    "updated_by_id": null | number,
    "last_login": string,
    "account_name": string,
    "account_number": string,
    "bank_name": string,
    "phone_number": string,
    "admin_level": null | string,
    "user_level": number,
    "last_bet_datetime": null | string,
    "rolling_point": number,
    "lossing_point": number,
    "tree_depth": null | number,
    "balance": number,
    "mileage": number,
    "user_status": string,
    "system_note": null | string,
    "nickname": string,
    "tple_token": null | string,
    "last_active_at": string,
    "rolling_point_type": string,
    "lossing_point_type": string,
    "lossing_point_percentage": number,
    "tple_id": null | number,
    "rolling_slot_percentage": number,
    "rolling_mini_game_percentage": number,
    "rolling_sports_percentage": number,
    "rolling_casino_percentage": number,
    "user_real_name": string,
    "referral_point": number,
    "birthday": string,
    "user_memo_1": string,
    "user_memo_2": string,
    "user_memo_3": string,
    "user_memo_4": string,
    "user_memo_5": string,
    "user_memo_6": string,
    "agent_lossing_point_percentage": number,
    "sunday_balance": null | number,
    "failed_login_attempts": number,
    "deposit_total": number,
    "withdrawal_total": number | undefined,
    "agent_rolling_casino_percentage"?: null | number,
    "agent_rolling_mini_game_percentage"?: null | number,
    "agent_rolling_slot_percentage"?: null | number,
    "agent_rolling_sports_percentage"?: null | number,
    "agent_rolling_point": null | number,
    "agent_rolling_percentage": null | number,
    "agent_lossing_point": null | number,
    "agent_lossing_percentage": null| number,
    "settlement_cycle": null | string,
    "settlement_cycle_day": null | string,
    // "bet_total": number,
    "initial_bet_total"?: number,
    "level_type": "AUTO" | "MANUAL",
    "dw_sum": number,
    "bw_sum": number,
    "token_uid": string,
    "referral": string,
    "agent_id": number,
    "role": string,
    "referral_username": string
    "agent_username": string
    "role_name": string,
    "token": string,
    "token_expired": string,
    "path": null | string,
    "wallet_address": null | string,
    "network": null | string,
    "userid" : number,
    "parentID" : number,
    "local_grade_config"?: "automatic" | "manual",
    "user_grade": number,
    "isAllowedAccountWithdrawal": boolean;
    "isAllowedOncashWithdrawal": boolean;
    // "agent_rolling_casino_percentage": number,
    // "agent_rolling_mini_game_percentage": number,
    // "agent_rolling_slot_percentage":number,
    // "agent_rolling_sports_percentage":number,
}

export interface PostCreateUserBody {
    "agent_id"                      : string | null
    "userid"                        : number,
    "username"                      : string,
    "password"                      : string,
    "phone_number"                  : string,
    "user_status"                   : "ACTIVE" | "INACTIVE" | "DEACTIVATED" | "SUSPENDED" | "OBSERVATION",
    "user_level"                    : number,
    "account_name"                  : string,
    "account_number"                : string,
    "bank_name"                     : string,
    "rolling_point"                 : number,
    "user_real_name"                : string,
    "level_type"                    : "AUTO" | "MANUAL",
    "rolling_point_type"            : string,
    "lossing_point_type"            : string,
    "lossing_point_percentage"      : number,
    "rolling_slot_percentage"       : number,
    "rolling_mini_game_percentage"  : number,
    "rolling_sports_percentage"     : number,
    "rolling_casino_percentage"     : number,
    "deposit_total"                 : number,
    "withdrawal_total"              : number,
    "parentID"                      : number,
    "tree_depth"                    : number | undefined,
    // "bet_total"                    : number | undefined,
    "initial_bet_total"                    : number | undefined,
    "wallet_address"                : string | null,
    "network"                       : string | null,
    "local_grade_config"            ?: "automatic" | "manual",
    "user_grade"                    : number,
}

export interface PostCreateAgentBody {
    "agent_id"                      : string | null
    "userid"                        : number,
    "username"                      : string,
    "password"                      : string,
    "phone_number"                  : string,
    "user_status"                   : "ACTIVE" | "INACTIVE" | "DEACTIVATED" | "SUSPENDED" | "OBSERVATION",
    "user_level"                    : number,
    "account_name"                  : string,
    "account_number"                : string,
    "bank_name"                     : string,
    "rolling_point"                 : number,
    "user_real_name"                : string,
    "level_type"                    : "AUTO" | "MANUAL",
    "rolling_point_type"            : string,
    "lossing_point_type"            : string,
    "lossing_point_percentage"      : number,
    "rolling_slot_percentage"       : number,
    "rolling_mini_game_percentage"  : number,
    "rolling_sports_percentage"     : number,
    "rolling_casino_percentage"     : number,
    "deposit_total"                 : number,
    "withdrawal_total"              : number,
    "parentID"                      : number,
    "tree_depth"                    : number | undefined,
    // "bet_total"                    : number | undefined,
    "initial_bet_total"                    : number | undefined,
}

export interface PostAddLevel {
    deposit_required: number;
    level: number;
    level_up_mileage?: number;
    maximum_lossing_amount?: number;
    mileage_percentage?: number;
    rolling_casino_percentage?: number | null;
    rolling_mini_game_percentage?: number;
    rolling_required?: number;
    rolling_slot_percentage?: number;
    rolling_sports_percentage?: number;
    weekly_lossing_percentage?: number;
}

export interface PostAddRes {
    code        : number,
    message     : string
}

export interface PostAPERes {
    message: string,
    code: number,
    data: {
        "id"        : number,
        "start_date": string,
        "end_date"  : string,
        "title"     : string,
        "in_use"    : boolean,
        "created_at": string,
        "updated_at": string,
        "order"     : number,
        "image"     : string,
        "thumbnail" : string;
        "reference_id"?: string;
        "is_first_oncash_withdraw"?: boolean;
    }
}

export interface PostGetBannerRes {
    message: string,
    code: number,
    data: {
        "id"        : number,
        "start_date": string,
        "end_date"  : string,
        "url"       : string,
        "in_use"    : boolean,
        "created_at": string,
        "updated_at": string,
        "order"     : number,
        "x"         : number,
        "y"         : number,
        "image"     : string,
        "thumbnail" : string,
        "domain" : string,
    }
}

export interface PostGetNoticeRes {
    message: string,
    code: number,
    data: {
        "id"            : number,
        "title"         : string,
        "content"       : string,
        "order"         : number,
        "created_at"    : string,
        "updated_at"    : null | string,
        "created_by_id" : number | null,
        "updated_by_id" : number | null,
        "image"         : string,
    }
}
export interface PostGetRegulationRes {
    message: string,
    code: number,
    data: {
        "id"            : number,
        "title"         : string,
        "content"       : string,
        "created_at"    : string,
        "updated_at"    : null | string,
        "created_by"    : number | null,
        "updated_by"    : number | null,
        "content_type"  : string
        "status"        : number
    }
}

export interface PostGetMessageTemplate {
    message: string,
    code: number,
    data: {
        id: number
        title: string;
        message: string;
        created_at: null | string;
        created_by: null | string;
        updated_at: string;
    }
}

export interface PostGetHeroRes {
    message: string,
    code: number,
    data: {
        imageMobile: string
        imageDesktop: string
        "id"            : number,
        "category"      : null | string,
        "order"         : number,
        "in_use"        : boolean,
        "created_at"    : string,
        "updated_at"    : null | string,
        "published_at"  : string,
    }
}

export interface PostGetLevelRes {
    message: string,
    code: number,
    data: {
        "id": number,
        "level": number,
        "deposit_required": string,
        "rolling_required": string,
        "level_up_mileage": string,
        "mileage_percentage": number,
        "weekly_lossing_percentage": number,
        "created_at": string,
        "updated_at": string,
        "maximum_lossing_amount": string,
        "rolling_casino_percentage": number,
        "rolling_slot_percentage": number,
        "rolling_mini_game_percentage": number,
        "rolling_sports_percentage": number
    }
}
export interface PostGetLevelDepRes {
    message: string,
    code: number,
    data: {
        "id": number,
        "level": number,
        "bank_name": string,
        "account_name": string,
        "account_number": string,
        "created_at": string,
        "updated_at": string,
    }
}
export interface PostGetDepBonusRes {
    message: string,
    code: number,
    data: {
        "id": number,
        "bonus_name": string,
        "bonus_percentage": number,
        "min_deposit": number,
        "max_amount": number,
        "withdrawal_rolling": number,
        "available_level": number,
        "created_at": string,
        "updated_at": string,
        "in_use": boolean,
        "temp_order": number,
        "system_note": string,
        "daily_limit": number,
        "bonus_group": string,
    }
}

export interface PostAddEvent {
    "userid"        : number,
    "start_date"    : string | Date | null,
    "end_date"      : string | Date |null,
    "title"         : string,
    "image"         : string,
    "thumbnail"     : string,
    "in_use"        : number,
    "order"         : number,
}

export interface PostAddBanner {
    "userid"        : number,
    "x"             : number,
    "y"             : number,
    "order"         : number,
    "in_use"        : number,
    "start_date"    : string | Date | null,
    "end_date"      : string | Date | null,
    "url"           : string,
    "image"         : string,
    "thumbnail"     : string
}

export interface PostAddHero {
    "userid"        : number,
    "imageMobile"   : string,
    "imageDesktop"  : string
    "order"     : number,
    "category"  : null | string,
    "in_use"    : number,
}

export interface PostAddRegulation {
    "userid"     : number,
    "title"      : string,
    "content"    : string
    "type"       : string,
}

export interface PostAddNotice {
    "userid"    : number,
    "image"     : string,
    "title"     : string,
    "content"   : null | string,
}

export interface PostAddMessage {
    userid: number
    target: string | "online" | "level" | "user" | "status" | "grade";
    username: [] | null | any;
    agent_username?: [] | null | any;
    content: string;
    title: string;
    user_status?: string | null;
    level?: number | null;
    expires_at?: string;
    grade?: number | null | undefined | string[];
    usernames?: [] | null | any;
}
export interface PostAddLevelDeposit {
    userid: number
    id? :number
    level :number
    bank_name: string;
    account_number: string;
    account_name: string;
    type?: 'level' | 'grade';
}

export interface PostAddDepositBonus {
    "id"?                            : number,
    "userid"                        : number,
    "bonus_name"                    : string,
    "bonus_percentage"              : number,
    "min_deposit"                   : number,
    "max_amount"                    : number,
    "withdrawal_rolling"            : number,
    "available_level"               : number,
    "in_use"                        : any,
    "temp_order"                    : number,
    "system_note"                   : string,
    "daily_limit"                   : number
    "bonus_group"                   : string;
}
export interface PostUpdateTrans {
    id                  : string | string[];
    "userid"            : number,
    "admin_id"          : string,
    "system_note"       : string,
    "status"            : UpdatePaymentBody['status']
}

export interface UserArray {
    label: string,
    value: string,
}

export interface PostAddCoupon {
    "userid"                        : number,
    "username"                      : any,
    "coupon_name"                   : string,
    "system_note"                   : string,
    "amount"                        : number,
    "is_used"                       : number,
    "expired_date"                  : string | null
}
export interface PostAddBulkCoupon {
    "userid"                        : number,
    "arr_data"                      : any[],
}
export type BlockReasonCode = "MANUAL" | "AUTO_LOGIN_FAILURES" | "ABUSE" | "HACKING_ATTEMPT" | "OTHER";

export type LoginFailureReason =
    | "BAD_PASSWORD"
    | "NO_SUCH_USER"
    | "ACCOUNT_LOCKED"
    | "IP_BLOCKED"
    | "OTP_FAILED"
    | "PENDING_APPROVAL"
    | "OTHER";

export type IpAssessment = "NO_FAILURES" | "LIKELY_FORGOTTEN_PASSWORD" | "MANY_ACCOUNTS" | "HIGH_VOLUME";

export interface PostAddBlockIP {
    "userid"            : number,
    "ip"                : string,
    "system_note"       : string,
    "reason_code"?      : BlockReasonCode,
    "username"?         : string,
    "expires_minutes"?  : number,
}

export interface IpDetailBlock {
    id          : number;
    systemNote  : string;
    reasonCode  : BlockReasonCode;
    blockedBy   : string | null;
    username    : string | null;
    expiresAt   : string | null;
    createdAt   : string;
}

export interface IpDetailFailureByReason {
    reason  : LoginFailureReason;
    count   : number;
}

export interface IpDetailFailureByUsername {
    username    : string;
    count       : number;
    lastAt      : string;
}

export interface IpDetailFailureSummary {
    failures            : number;
    distinctUsernames   : number;
    firstAt             : string | null;
    lastAt              : string | null;
    byReason            : IpDetailFailureByReason[];
    byUsername          : IpDetailFailureByUsername[];
}

export interface IpDetailFailureRecord {
    id          : number;
    username    : string;
    ip          : string;
    reason      : LoginFailureReason;
    isAdmin     : 0 | 1;
    userAgent   : string | null;
    detail      : string | null;
    createdAt   : string;
}

// Shape beyond `username` isn't nailed down by the backend doc — render defensively.
export interface IpDetailKnownMember {
    username: string;
    [key: string]: unknown;
}

export interface IpDetailData {
    ip              : string;
    windowHours     : number;
    blocked         : boolean;
    block           : IpDetailBlock | null;
    failureSummary  : IpDetailFailureSummary;
    assessment      : IpAssessment;
    knownMembers    : IpDetailKnownMember[];
    recentFailures  : IpDetailFailureRecord[];
}

export interface PostAddWhiteIP {
    "userid"            : number,
    "ip"                : string,
    "username"       : string,
}
export interface PostDepositInUse {
    "userid"    : number;
    "type"      : "v-account1" | "v-account2";
    "in_use"    : number;
}

export interface PostUpdateEvent extends PostAddEvent {
    "id"            : number,
}

export interface PostUpdateBanner extends PostAddBanner {
    "id"            : number,
}

export interface PostUpdateHero extends PostAddHero {
    "id"            : number,
}

export interface PostUpdateNotice extends PostAddNotice {
    "id"            : number,
}

export interface PostUpdateRegulation extends PostAddRegulation {
    "id"            : number,
}

export interface PostUpdateLevel extends PostAddLevel {
    "id"            : number,
}

export interface PostDeleteItem {
    "id"            : number,
    "userid"        : number,
}
export interface PostDeleteMatchItem {
    "match_id"      : number,
}
export interface PostDeleteCouponApp {
    "coupon_id"     : number,
    "userid"        : number,
}

export interface PostToggleGame {
    "userid"        : number,
    "id"            : number,
    "is_maintenance": number,
}

export interface PostTogglVendor {
    "userid"        : number,
    "vendor_id"     : string,
    "game_category" : string,
    "is_maintenance": number,
}
export interface PostTogglPopular {
    "userid"        : number,
    "id"            : number,
    "is_popular": number,
}
export interface PostToggleScEvent {
    "match_id"        : number,
    "is_visible"      : number,
}
export interface PostToggleScForbidWord {
    "id"              : number,
    "is_allowed"      : number,
}
export interface PostToggleChatAllow {
    "user_id"           : number,
    "is_allowed"      : number,
}
export interface PostToggleChatAllowDelete {
    "user_id"           : number,
    "is_delete_allowed" : number,
}
export interface PostToggleChatIsAdmin {
    "user_id"           : number,
    "is_admin"          : number,
}
export interface PostToggleStream {
    "id"            : number,
    "is_on"         : number,
}
export interface PostToggleScCategory {
    "id"            : number,
    "is_visible"    : number,
}

export interface PostScAddEvent {
    "match_id"      : number,
    "title"         : string,
    "contents"      : string,
    "start_date"    : string | Date | null,
    "end_date"      : string | Date |null,
    "is_visible"    : number,
}

export interface PostScAddChatWord {
    "forbidden_word": string,
    "is_allowed"    : number,
}

export interface PostRes<T> {
    code    : number,
    message : string,
    data: T
}

export interface PostResponse<T> {
    code    : number,
    message : string,
    data?: T
}

export interface NXAPI {
    id          : number;
    created_at  : string;
    updated_at  : string;
}

export interface CommonDataItemInterface {
    id          : number;
    created_at  : string;
    updated_at  : string;
}

export interface ListCommon {
    id: number;
    created_at: string;
    updated_at: string;
}

export interface ListResponseData<T> {
    success: boolean;
    message: string;
    data: ListData<T>;
}

export interface ListData<T> {
    data: T;
    totalItems: number;
    totalPages: number;
}

interface TotalDepositWithdrawAmount {
  total: number;
  total_deposit: number;
  total_usdt_deposit: number;
  total_withdrawal: number;
  total_usdt_withdrawal: number;
  total_account_deposit: number;
  total_oncash_deposit: number;
}

interface TotalsDepositWithdraw {
  total_deposit_amount: TotalDepositWithdrawAmount;
  total_withdrawal_completed: TotalDepositWithdrawAmount;
  total_difference: number;
  total_withdrawal_request: number;
  total_withdrawal_pending: number;
  total_withdrawal_waiting: number;
  total_withdrawal_applied: number;
  total_deposit_completed: number;
  total_deposit_request: number;
  total_deposit_waiting: number;
  total_deposit_cancelled: number;
  total_deposit_applied: number;
  total_approval_rate: number;
}
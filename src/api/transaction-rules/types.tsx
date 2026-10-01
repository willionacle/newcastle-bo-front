// Flat shape mirroring the wire format exactly — deliberately not split into
// nested deposit/withdraw/bonus objects, since the meta-driven form indexes
// every field generically by its string key (see FormModal.tsx).
export type TargetType = "global" | "partner" | "user";

export interface TransactionRuleMetaTarget {
  key: TargetType;
  labelKo: string;
}

export interface TransactionRuleMetaData {
  targets: TransactionRuleMetaTarget[];
  fieldGroups: {
    deposit: string[];
    withdraw: string[];
    bonus: string[];
  };
  fieldLabels: Record<string, string>;
  // Fields rendered as "HH:MM" pickers rather than plain numbers.
  timeFields: string[];
}

export interface TransactionRuleMetaRes {
  code: number;
  message: string;
  data: TransactionRuleMetaData;
}

// Every limit field is nullable — null means "inherit from a broader rule",
// 0 means "explicitly unlimited". See §0 of the integration spec. The one
// exception is block_first_bonus, whose null/false/true are all meaningful
// (see FormModal.tsx's tri-state control).
export interface TransactionRule {
  id: number;
  name: string;
  targetType: TargetType;
  targetValue: string; // username · global_agent_id · "" for global
  isActive: boolean;
  memo: string | null;

  deposit_block_from: string | null; // "HH:MM"
  deposit_block_to: string | null;
  deposit_cooldown_min: number | null;
  deposit_min_amount: number | null;
  deposit_max_amount: number | null;

  withdraw_block_from: string | null;
  withdraw_block_to: string | null;
  withdraw_cooldown_min: number | null;
  withdraw_after_deposit_min: number | null;
  withdraw_min_amount: number | null;
  withdraw_max_amount: number | null;
  withdraw_daily_count: number | null;

  block_first_bonus: boolean | null;
  first_bonus_point_rate: number | null; // 0–1 fraction on the wire
  daily_max_first_bonus: number | null;
  daily_max_reload_bonus: number | null;
  daily_max_total_bonus: number | null;

  adminId: string | null;
  createdAt: string;
  updatedAt: string;
}

// Body for the upsert POST — same shape minus server-owned fields. POST
// replaces the whole row: build this by spreading every field explicitly,
// never by omitting keys the admin didn't touch (an omitted field is stored
// as null, same as an explicitly-cleared one).
export type TransactionRuleBody = Omit<
  TransactionRule,
  "id" | "adminId" | "createdAt" | "updatedAt"
>;

export interface TransactionRuleRes {
  code: number;
  message: string;
  data: TransactionRule;
}

export interface TransactionRuleListRes {
  code: number;
  message: string;
  data: TransactionRule[];
  page: number;
  totalitems: number;
  totalpage: number;
}

export interface TransactionRuleDeleteRes {
  code: number;
  message: string;
}

export interface TransactionRulePreviewSource {
  ruleId: number;
  name: string;
  targetType: TargetType;
}

export interface TransactionRulePreviewField {
  value: number | string | boolean | null;
  // null = nothing sets this field — unlimited. Otherwise names the rule
  // that set it, so the UI can show a "which rule to edit" badge.
  source: TransactionRulePreviewSource | null;
}

export type BlockKind = "BLACKOUT" | "COOLDOWN" | "AFTER_DEPOSIT" | "DAILY_COUNT";

export interface TransactionRulePreviewData {
  member: {
    username: string;
    nickname: string | null;
    partner: string | null;
    partnerId: string | null;
  };
  appliedRules: {
    id: number;
    name: string;
    targetType: TargetType;
    targetValue: string;
  }[];
  effective: Record<string, TransactionRulePreviewField>;
  context: {
    nowHm: string;
    lastWithdrawAt: string | null;
    minutesSinceWithdraw: number | null;
    lastDepositAt: string | null;
    minutesSinceDeposit: number | null;
    withdrawalsToday: number;
    bonusToday: { first: number; reload: number; all: number };
  };
  canWithdrawNow: boolean;
  blocks: { kind: BlockKind; message: string }[];
}

export interface TransactionRulePreviewRes {
  code: number;
  message: string;
  data: TransactionRulePreviewData;
}

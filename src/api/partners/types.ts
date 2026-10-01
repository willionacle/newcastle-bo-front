// Types for the Partner Management tab (client request #13).
// Mirrors ../../../PARTNER_MANAGEMENT_FRONTEND_INTEGRATION.md — read-only endpoints under /api/partners/*.

export type PartnerRole = "SUPER_ADMIN" | "DISTRIBUTOR" | "SALES_PERSONNEL" | string;
export type PartnerStatus = "ACTIVE" | "INACTIVE" | string;
export type PartnerScope = "all" | "downline" | "self";

export interface PartnerTreeNode {
  id: number;
  username: string;
  displayName: string;
  role: PartnerRole;
  roleKo: string;
  status: PartnerStatus;
  parentId: number | null;
  memberCount: number;
  subtreeMemberCount: number;
  lastLoginAt: string | null;
  children: PartnerTreeNode[];
}

export interface PartnerTreeData {
  totalAgents: number;
  totalMembers: number;
  roleLabels: Record<string, string>;
  scopeLabels: Record<string, string>;
  tree: PartnerTreeNode[];
}

export interface PartnerAgentRef {
  id: number;
  username: string;
  displayName: string;
  role: PartnerRole;
  roleKo: string;
  status: PartnerStatus;
}

export interface PartnerSubtreeNode {
  id: number;
  displayName: string;
  roleKo: string;
  depth: number;
}

export interface PartnerMemberSummary {
  totalSignups: number;
  directSignups: number;
  downlineSignups: number;
  downlineActiveBettors: number;
  logins: number;
  totalMembers: number;
  directMembers: number;
  downlineMembers: number;
}

export interface PartnerMoneyRow {
  amountKo: string;
  amount: number;
  count: number;
  // null (not 0) when the concept doesn't apply — e.g. a withdrawal row has no bonus.
  firstBonus: number | null;
  reloadBonus: number | null;
}

export interface PartnerMoneyBucket {
  total: PartnerMoneyRow;
  deposit: PartnerMoneyRow;
  withdrawal: PartnerMoneyRow;
}

export interface PartnerMoney {
  all: PartnerMoneyBucket;
  downline: PartnerMoneyBucket;
  self: PartnerMoneyBucket;
}

export interface PartnerSummaryData {
  agent: PartnerAgentRef;
  range: { from: string; to: string };
  subtree: PartnerSubtreeNode[];
  memberSummary: PartnerMemberSummary;
  money: PartnerMoney;
}

export interface PartnerMember {
  id: number;
  username: string;
  nickname: string | null;
  realName: string;
  agentId: string; // up_users.global_agent_id is VARCHAR — string even though it looks numeric
  agentName: string;
  level: number;
  grade: number;
  status: PartnerStatus;
  balance: string; // decimal column, comes through as a string — cast before arithmetic
  registeredAt: string;
  lastLoginAt: string | null;
  depositAmount: number;
  depositCount: number;
  withdrawalAmount: number;
  withdrawalCount: number;
  netAmount: number;
  betAmount: number;
  winAmount: number;
  winLoss: number;
}

export interface PartnerMembersResponse {
  code: number;
  message?: string;
  data: PartnerMember[];
  scope: PartnerScope;
  range: { from: string; to: string };
  page: number;
  totalitems: number;
  totalpage: number;
}

export interface PartnerEarningsPeriod {
  id: number;
  periodFrom: string;
  periodTo: string;
  sourceColumn: string;
  subtreeAmount: number;
  sharePct: number | null;
  entitlement: number;
  netPayout: number;
}

export interface PartnerEarningsDaily {
  statDate: string;
  sourceColumn: string;
  subtreeAmount: number;
  sharePct: number | null;
  entitlement: number;
  netPayout: number;
}

export interface PartnerEarningsData {
  agent: { id: number; displayName: string };
  range: { from: string; to: string };
  sharePct: number | null;
  totals: { subtreeAmount: number; entitlement: number; netPayout: number };
  periods: PartnerEarningsPeriod[];
  daily: PartnerEarningsDaily[];
}

export interface PartnerApiEnvelope<T> {
  code: number;
  message?: string;
  data: T;
}

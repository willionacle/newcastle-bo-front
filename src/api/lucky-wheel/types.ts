// Lucky Wheel API Types

// 가중치 관련 타입
export interface Weight {
  grade?: number;
  point_value: number;
  weight: number;
  segment_count: number;
  display_order: number;
}

export interface WeightData {
  grade: number;
  weights: Weight[];
  totalWeight: number;
  count: number;
}

export interface WeightSaveResponse {
  grade: number;
  count: number;
  totalWeight: number;
}

// 쿠폰 관련 타입
export interface Coupon {
  id: number;
  username: string;
  coupon_type: number;
  grade: number;
  amount: number;
  used_at: string | null;
  expired_date: string | null;
  created_at: string;
  issuer: string;
  system_note: string;
  user_real_name?: string;
  user_regdate?: string;
  user_status?: string;
}

export interface CouponFilters {
  username?: string;
  grade?: number;
  status?: 'available' | 'used' | 'expired';
  dateFrom?: string;
  dateTo?: string;
  issuedBy?: string;
  page?: number;
  limit?: number;
}

export interface CouponIssueBody {
  username: string;
  grade: number;
  couponType: number;
  amount: number;
  expiredDays: number;
  systemNote?: string;
}

export interface BulkCouponIssueBody {
  usernames: string[];
  grade: number;
  couponType: number;
  amount: number;
  expiredDays: number;
  systemNote?: string;
}

export interface BulkFilterCouponIssueBody {
  filterType: 'username' | 'user_grade' | 'user_level';
  usernames?: string[];
  userGrades?: number[];
  userLevels?: number[];
  couponType: number;
  grade: number;
  amount?: number;
  expiredDays?: number;
  systemNote?: string;
  stopOnError?: boolean;
}

export interface BulkFilterCouponIssueResponse {
  success: boolean;
  totalCount: number;
  successCount: number;
  failedCount: number;
  processedBatches: number;
  totalBatches: number;
}

export interface DummyCouponBody {
  username: string;
  grade: number;
  amount: number;
  datetime?: string;
}

export interface DummyCouponResponse {
  success: boolean;
  couponId: number;
}

// 공통 응답 타입
export interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

// Pagination 데이터 타입
export interface PaginationData {
  count: number;
  totalCount: number;
  page: number;
  totalPages: number;
}

export interface ListResponse<T> extends PaginationData {
  code: number;
  data: T[];
  message: string;
}
// Knowledge 엔티티
export interface Knowledge {
  Id: number;
  Title: string;
  Content: string;
  UpdatedAt: string;
}

// API 응답 타입
export interface KnowledgeListResponse {
  code: number;
  data: {
    list: Knowledge[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface KnowledgeApiResponse<T> {
  code: number;
  data: T;
}

// Create 응답 타입
export interface CreateKnowledgeResponse {
  message: string;
  title: string;
  length: number;
}

// Update 응답 타입
export interface UpdateKnowledgeResponse {
  message: string;
  id: number;
}

// Delete 응답 타입
export interface DeleteKnowledgeResponse {
  message: string;
  id: number;
}

// 요청 바디 타입
export interface CreateKnowledgeBody {
  title: string;
  content: string;
}

export interface UpdateKnowledgeBody {
  id: number;
  title: string;
  content: string;
}

export interface DeleteKnowledgeBody {
  id: number;
}

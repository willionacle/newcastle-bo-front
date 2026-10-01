// AgentPrompt 엔티티
export interface AgentPrompt {
  Id: number;
  AgentIndex: number;
  Name: string;
  Age: number;
  Personality: string;
  SystemPrompt: string;
  Active: boolean;
  profileImg: string;
  CreatedAt: string;
  UpdatedAt: string;
}

// API 응답 타입
export interface AgentPromptListResponse {
  code: number;
  data: AgentPrompt[];
}

export interface AgentPromptDetailResponse {
  code: number;
  data: AgentPrompt;
}

export interface AgentPromptApiResponse<T> {
  code: number;
  data: T;
}

// Update 응답 타입
export interface UpdateAgentPromptResponse {
  message: string;
  agentIndex: number;
}

// 요청 바디 타입
export interface UpdateAgentPromptBody {
  agentIndex: number;
  Name?: string;
  Age?: number;
  Personality?: string;
  SystemPrompt?: string;
  Active?: boolean;
  profileImg?: string;
}

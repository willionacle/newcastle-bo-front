

export interface BetBlockData {
  id?: number;
  vendor_id: string;
  table_id: string;
  virtual_table_id: string;
  name: string;
  game_image: string;
  game_type: string;
  is_blocked: boolean;
  created_at: string;
  updated_at: string;
}

export interface BetBlockPatchParams {
  vender_id: string;
  table_id: string;
}

export interface BetBlockPatchBody {
  is_blocked: boolean;
}

export type BetBlockBody = Omit<BetBlockData, "created_at" | "updated_at" | "is_blocked" | "name"> & {
  game_name: string;
};
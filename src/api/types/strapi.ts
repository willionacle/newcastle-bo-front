export interface StrapiRes<T> {
  data: T;
  meta: { pagination: StrapiPagination };
}

export interface StrapiPagination {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
}

export interface Strapi {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export type AdminAdjustmentType = "MANUAL_ADJUSTMENT" | "SYSTEM_ADJUSTMENT";

interface Image {
  url: string;
}

export type StrapiImg = {
  formats: {
    large: Image;
    medium: Image;
    small: Image;
    thumbnail: Image;
  };
  url: string;
};

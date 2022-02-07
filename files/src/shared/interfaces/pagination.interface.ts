export interface Pagination {
  startIndex?: number;
  endIndex?: number;
  page?: number;
  total?: number;
  perPage?: number;
}

export interface PaginationMetadata<T> {
  data: T;
  metadata: {
    currentPage: number;
    pageCount: number;
    totalCount?: number;
    nextPageToken?: string;
    pageSize: number;
  };
}

export interface PaginationParams {
  nextPageToken?: string;
  page?: number;
  perPage?: number;
}

export interface PaginationField {
  pagination?: PaginationParams;
}

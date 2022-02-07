export type PaginationTokenParams = {
  pageToken?: string;
  perPage?: number;
};

export type PaginationTokenResponse<T> = {
  data: T[];
  total: number;
  nextPageToken: string | null;
};

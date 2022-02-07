import {PaginationTokenParams, PaginationTokenResponse} from './tokenPagination.type';

export const fromTokenToPagePaginationParams = <T>(
  params: T & PaginationTokenParams,
): T & {page: number} => ({
  ...params,
  page: Number(params.pageToken),
});

export const fromHeaderToTokenPaginationResponse = <T>({
  headers,
  data,
}: {
  data: T[];
  headers: Record<string, string>;
}): PaginationTokenResponse<T> => ({
  data,
  total: Number(headers['x-total-count']),
  nextPageToken: headers['x-page'] === headers['x-pages-count'] ? null : headers['x-next-page'],
});

import {PaginationField} from 'src/shared/interfaces/pagination.interface';

export function transformPaginationQueriesGo<T extends PaginationField>(
  query: T,
): Omit<T, 'pagination'> {
  if (query.hasOwnProperty('pagination')) {
    query = {
      ...query,
      'pagination.page': query.pagination.page,
      'pagination.perPage': query.pagination.perPage,
      'pagination.nextPageToken': query.pagination.nextPageToken,
    };
    delete query.pagination;
  }
  return query;
}

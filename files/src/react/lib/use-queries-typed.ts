// WHY: Unable to type useQueries options or results without casting
// ripped from https://github.com/tannerlinsley/react-query/issues/1675#issuecomment-786795597
import {useQueries, UseQueryOptions, QueryObserverResult} from 'react-query';

export const useQueriesTyped = <TQueryFnData = unknown, TError = unknown, TData = TQueryFnData>(
  queries: UseQueryOptions<TQueryFnData, TError, TData>[],
) =>
  useQueries(queries as UseQueryOptions<unknown, unknown, unknown>[]) as QueryObserverResult<
    TQueryFnData,
    TError
  >[];

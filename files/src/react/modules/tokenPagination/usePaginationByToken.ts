import {useQuery, UseQueryOptions, QueryKey, QueryObserverResult} from 'react-query';

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

type SingleArityFn = (arg: any) => any;

export const DEFAULT_PER_PAGE = 15;

export interface UsePaginationByTokenInput<
  QueryFunction extends SingleArityFn,
  QueryResult extends ThenArg<ReturnType<QueryFunction>>,
  E = Error,
  Result = QueryResult,
> extends Omit<UseQueryOptions<QueryResult, E, Result>, 'queryFn' | 'queryKey'> {
  key: QueryKey;
  queryFn: QueryFunction;
  tokens: string[];
  onTokensChange: (tokens: string[]) => void;
  params?: Parameters<QueryFunction>[0];
}

export type UsePaginationByTokenResult<
  QueryFunction extends SingleArityFn,
  QueryResult extends ThenArg<ReturnType<QueryFunction>>,
  E = Error,
  Result = QueryResult,
> = QueryObserverResult<Result, E> & {
  queryKey: QueryKey;
  hasNext: boolean;
  hasPrev: boolean;
  tokens: string[];
  perPage: number;
  next: () => void;
  prev: () => void;
};

export const usePaginationByToken = <
  QueryFunction extends SingleArityFn,
  QueryResult extends ThenArg<ReturnType<QueryFunction>>,
  E = Error,
  Result = QueryResult,
>({
  key,
  params: {perPage = DEFAULT_PER_PAGE, ...params},
  queryFn,
  tokens,
  onTokensChange,
  ...opts
}: UsePaginationByTokenInput<QueryFunction, QueryResult, E, Result>): UsePaginationByTokenResult<
  QueryFunction,
  QueryResult,
  E,
  Result
> => {
  const fnParams = {
    ...params,
    perPage,
    pageToken: tokens[tokens.length - 1],
  };
  const queryKey = [...(Array.isArray(key) ? key : [key]), , fnParams];
  const query = useQuery<QueryResult, E, Result>(queryKey, () => queryFn(fnParams), opts);
  const hasNext = Boolean((query.data as any)?.nextPageToken);
  const hasPrev = Boolean(tokens.length);

  const next = () => {
    if (!hasNext || query.isFetching) {
      return;
    }

    onTokensChange([...tokens, (query.data as any)?.nextPageToken]);
  };

  const prev = () => {
    if (!hasPrev || query.isFetching) {
      return;
    }

    onTokensChange(tokens.slice(0, tokens.length - 1));
  };

  return {
    ...query,
    queryKey,
    hasNext,
    hasPrev,
    tokens,
    perPage,
    next,
    prev,
  };
};

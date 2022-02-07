/* eslint-disable @typescript-eslint/ban-types */
import {
  flattenArray,
  isDefined,
  isSimilarArray,
  isEmptyObject,
  isFunction,
  isNil,
  isString,
  noop,
  PaginationState,
  useFilter,
  UseFilterOptions,
  usePaginationState,
  UsePaginationStateOptions,
} from '@setel/portal-ui';
import {useQuery, UseQueryOptions} from 'react-query';
import {useQueryParams, useSetQueryParams} from 'src/react/routing/routing.context';

type StateValueType = string | number | string[] | boolean | undefined;
type AsJson<T> = T extends StateValueType
  ? T
  : T extends Function
  ? never
  : T extends object
  ? {[K in keyof T]: AsJson<T[K]>}
  : never;

type AsJsonObject<T> = T extends object ? AsJson<T> : never;

export interface UseFilterWithQueryParamsOptions<FilterValues>
  extends Pick<UseFilterOptions<FilterValues>, 'components' | 'propExcludedFromApplied'> {
  propExcludedFromParams?: Array<keyof FilterValues>;
  hideEmptyLabel?: boolean;
  onChange?: (newState: FilterValues) => unknown;
  baseValues?: FilterValues;
}

const initFilterValue = <T>(
  initValues: (T & AsJsonObject<T>) | (() => T & AsJsonObject<T>),
  queryParams: {[key: string]: string | string[] | undefined},
) => {
  const initV: T = isFunction(initValues) ? initValues() : {...(initValues as T)};
  Object.keys(initV).forEach((k) => {
    const key = k as keyof T;
    const queryValue = queryParams[k];
    if (isDefined(queryValue)) {
      const initialValue = initV[key];
      if (Array.isArray(initialValue)) {
        const isNumber = typeof (initialValue as any[])[0] === 'number';
        initV[key] = flattenArray([queryValue]).map((v) =>
          isNumber ? Number(v) : v,
        ) as unknown as T[typeof key];
      } else {
        const serializeValue = typeof initialValue === 'number' ? Number(queryValue) : queryValue;
        initV[key] = serializeValue as unknown as T[typeof key];
      }
    }
  });

  return initV;
};

const serializeFilterValues = <FilterValues extends object>(
  filterValues: FilterValues,
  baseValues: FilterValues,
  excludes?: Array<keyof FilterValues>,
) =>
  Object.keys(filterValues).reduce((result, k) => {
    const key = k as keyof FilterValues;
    const value = filterValues[key];

    return !isSimilar(value, baseValues[key]) && (!excludes || !excludes.includes(key))
      ? {
          ...result,
          [key]: isEmptyValue(value) ? undefined : value,
        }
      : result;
  }, {});

const serializePagination = (paginationState: PaginationState) => ({
  page: String(paginationState.page),
  perPage: String(paginationState.perPage),
});

export interface UseDataTableStateOptions<
  FilterValues,
  QueryResult,
  QueryError,
  SelectResult = QueryResult,
> extends Omit<UsePaginationStateOptions, 'onChange'>,
    Omit<UseFilterWithQueryParamsOptions<FilterValues>, 'onChange'>,
    Omit<UseQueryOptions<QueryResult, QueryError, SelectResult>, 'queryFn'> {
  onChange?: (newValue: FilterValues & PaginationState) => void;
  initialFilter:
    | (FilterValues & AsJsonObject<FilterValues>)
    | (() => FilterValues & AsJsonObject<FilterValues>);
  queryKey: string | [string, ...unknown[]];
  queryFn: (
    filter: FilterValues & {page: number; perPage: number},
  ) => QueryResult | Promise<QueryResult>;
}

export const useDataTableState = <FilterValues extends object, QueryResult, QueryError>({
  initialFilter: initValues,
  queryKey,
  onChange = noop,
  hideEmptyLabel,
  propExcludedFromParams,
  propExcludedFromApplied,
  components,
  initialPage = 1,
  initialPerPage = 20,
  baseValues: providedBaseValues,
  queryFn,
  keepPreviousData = true,
  ...queryOptions
}: UseDataTableStateOptions<FilterValues, QueryResult, QueryError>) => {
  const {
    params: {page: queryPage, perPage: queryPerPage, ...queryParams},
  } = useQueryParams();
  const setQueryParams = useSetQueryParams();

  const baseValues = providedBaseValues || (isFunction(initValues) ? initValues() : initValues);

  const pagination = usePaginationState({
    initialPage: queryPage ? parseInt(queryPage, 10) : initialPage,
    initialPerPage: queryPerPage ? parseInt(queryPerPage, 10) : initialPerPage,
    onChange: (newState) => {
      onChange({
        ...filter[0].values,
        ...newState,
      });
      setQueryParams(
        {
          ...serializeFilterValues(
            {...queryParams, ...filter[0].values},
            baseValues,
            propExcludedFromParams,
          ),
          ...serializePagination(newState),
        },
        {
          merge: false,
        },
      );
    },
  });

  const filter = useFilter<FilterValues>(() => initFilterValue(initValues as any, queryParams), {
    hideEmptyLabel,
    onChange: (newValues) => {
      if (pagination.page !== initialPage) {
        pagination.setPage(initialPage);
      }

      const newPagination = {
        perPage: pagination.perPage,
        page: 1,
        isLastPage: false,
      };

      onChange({
        ...newValues,
        ...newPagination,
      });
      setQueryParams(
        {
          ...serializeFilterValues(
            {...queryParams, ...newValues},
            baseValues,
            propExcludedFromParams,
          ),
          ...serializePagination(newPagination),
        },
        {merge: false},
      );
    },
    baseValues: baseValues || (isFunction(initValues) ? initValues() : initValues),
    components,
    propExcludedFromApplied,
    cacheKey: isString(queryKey) ? queryKey : queryKey[0],
  });

  const values = {
    ...filter[0].values,
    page: pagination.page,
    perPage: pagination.perPage,
    toLast: pagination.isLastPage || undefined,
  };

  const query = useQuery([queryKey, values], {
    keepPreviousData,
    ...queryOptions,
    queryFn: () => queryFn(values),
  });

  return {
    filter,
    pagination,
    query,
  };
};

type Empty = Array<never> | {} | '' | undefined | null;
// check if value is empty, i.e: [], {}, '', undefined, null
function isEmptyValue<T>(value: T | Empty): value is Empty {
  if (
    isNil(value) || // undefined | null
    ((isString(value) || Array.isArray(value)) && value.length === 0) || // '' | []
    isEmptyObject(value) // {}
  ) {
    return true;
  }

  return false;
}

function isSimilar<Value>(value1: Value, value2: Value): boolean {
  if (value1 === value2) {
    return true;
  }

  if (Array.isArray(value1)) {
    return Array.isArray(value2) && isSimilarArray(value1, value2);
  }

  return false;
}

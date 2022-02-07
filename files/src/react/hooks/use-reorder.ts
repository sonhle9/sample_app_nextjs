import {arrayMove} from '@setel/portal-ui';
import * as L from 'lodash';
import {useCallback, useRef, useState} from 'react';
import {useMutation, useQueryClient, InfiniteData} from 'react-query';
import {GeneralDomainError} from '../modules/dealCatalogue/dealCatalogue.type';
import {PaginationTokenResponse} from '../modules/tokenPagination';

export type UseReorderInput = {
  queryKey: any;
  sortProperty: string;
  idProperty: string;
  onSave: (updates: Record<string, number>) => Promise<any>;
};

export const useReorder = <T>({queryKey, sortProperty, idProperty, onSave}: UseReorderInput) => {
  const cache = useQueryClient();

  const [isSortMode, setIsSortMode] = useState(false);
  const queryKeyBeforeSort = [...queryKey, 'beforeSort'];

  const callbackDependency = [queryKey, sortProperty];

  const minIndex = useRef<number>(Number.MAX_SAFE_INTEGER);
  const saveOrderResult = useMutation<any, GeneralDomainError>(
    () => {
      if (minIndex.current === Number.MAX_SAFE_INTEGER) {
        return Promise.resolve();
      }
      const cached = cache.getQueryData<InfiniteData<PaginationTokenResponse<T>>>(queryKey);
      const toUpdate = cached.pages.flatMap(({data}) => data).slice(minIndex.current);
      const minSort = Math.max(Math.min(...toUpdate.map((d) => d[sortProperty] as number)), 0);
      return onSave(
        L.fromPairs(toUpdate.map((d, i) => [d[idProperty], minSort + (toUpdate.length - 1 - i)])),
      );
    },
    {
      onSuccess: () => {
        cache.refetchQueries(queryKey);
        disableSortMode({cancel: false});
      },
    },
  );

  const sort = useCallback(({oldIndex, newIndex}) => {
    cache.setQueryData<InfiniteData<PaginationTokenResponse<T>>>(queryKey, (cachedData) => {
      const perPage = cachedData.pages[0].data.length;
      minIndex.current = Math.min(minIndex.current, oldIndex, newIndex);

      const newData = L.chunk(
        arrayMove(
          cachedData.pages.flatMap(({data}) => data),
          oldIndex,
          newIndex,
        ),
        perPage,
      );
      return {
        pages: cachedData.pages.map((old, index) => ({...old, data: newData[index]})),
        pageParams: cachedData.pageParams,
      };
    });
  }, callbackDependency);

  const enableSortMode = useCallback(() => {
    cache.setQueryData(queryKeyBeforeSort, L.cloneDeep(cache.getQueryData(queryKey)));
    setIsSortMode(true);
  }, [queryKey]);

  const disableSortMode = useCallback(
    ({cancel}) => {
      if (cancel) {
        cache.setQueryData(queryKey, cache.getQueryData(queryKeyBeforeSort));
      }

      setIsSortMode(false);
    },
    [queryKey],
  );

  return {isSortMode, enableSortMode, disableSortMode, sort, ...saveOrderResult};
};

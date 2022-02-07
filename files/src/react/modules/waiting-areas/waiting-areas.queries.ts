import {
  createWaitingArea,
  getWaitingArea,
  getWaitingAreas,
  updateWaitingArea,
} from 'src/react/services/api-stores.service';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {useMutation, useQuery, useQueryClient, UseQueryOptions} from 'react-query';
import {useNotification} from 'src/react/hooks/use-notification';
import {IStoreError, WaitingArea, WaitingAreasFilter} from './waiting-areas.types';
import {IPaginationParam, IPaginationResult} from 'src/react/lib/ajax';
import {AxiosError} from 'axios';

export const WAITING_AREA_LIST_KEY = 'waiting-area-list';
const WAITING_AREA_DETAILS_KEY = 'waiting-area-details';

export const useWaitingAreaList = () =>
  useDataTableState({
    initialFilter: {query: ''},
    components: [
      {
        key: 'query',
        type: 'search',
        props: {
          label: 'Search',
          placeholder: 'Enter area & tag',
          wrapperClass: 'md:col-span-2',
        },
      },
    ],
    queryKey: WAITING_AREA_LIST_KEY,
    keepPreviousData: true,
    queryFn: ({page, perPage, query}) => getWaitingAreas({page, perPage}, {query}),
  });

export const useCreateWaitingArea = () => {
  const queryClient = useQueryClient();
  const setNotify = useNotification();

  return useMutation(createWaitingArea, {
    onError: (err) => setNotify({variant: 'error', title: err.toString()}),
    onSuccess: () =>
      queryClient
        .invalidateQueries(WAITING_AREA_LIST_KEY)
        .then(() => setNotify({variant: 'success', title: 'Successfully saved!'})),
  });
};

export function useWaitingAreas<Result = IPaginationResult<WaitingArea>>(
  pagination: IPaginationParam,
  filter?: WaitingAreasFilter,
  config?: UseQueryOptions<IPaginationResult<WaitingArea>, AxiosError<IStoreError>, Result>,
) {
  return useQuery(
    [WAITING_AREA_LIST_KEY, pagination, filter],
    () => getWaitingAreas(pagination, filter),
    config,
  );
}

export const useUpdateWaitingArea = () => {
  const queryClient = useQueryClient();
  const setNotify = useNotification();

  return useMutation(updateWaitingArea, {
    onError: (err) => setNotify({variant: 'error', title: err.toString()}),
    onSuccess: () =>
      queryClient
        .invalidateQueries(WAITING_AREA_DETAILS_KEY)
        .then(() => setNotify({variant: 'success', title: 'Successfully saved!'})),
  });
};

export const useWaitingArea = (id: string) =>
  useQuery([WAITING_AREA_DETAILS_KEY, id], () => getWaitingArea(id));

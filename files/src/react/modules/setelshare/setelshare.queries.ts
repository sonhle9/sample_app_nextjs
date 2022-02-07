import {useMutation, useQuery, useQueryClient, UseQueryOptions} from 'react-query';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {
  getCircleById,
  getCircleTransactionsById,
  adminUpdateCircleMemberInfo,
} from 'src/react/services/api-circles.service';
import {ICircle} from 'src/shared/interfaces/circles.interface';

export const cacheKeys: {[key: string]: string} = {
  setelshareDetails: 'setelshare_details',
  setelShareTransactions: 'setelshare_transactions',
};

export const useGetSetelShareDetails = (
  circleId: string,
  options?: UseQueryOptions<ICircle, unknown>,
) => useQuery([cacheKeys.setelshareDetails, circleId], () => getCircleById(circleId), options);

export const useRemoveSetelShareMember = (circleId: string) => {
  const queryClient = useQueryClient();
  return useMutation((memberId: string) => adminUpdateCircleMemberInfo(circleId, memberId), {
    onSuccess: (newParam) => {
      if (newParam) {
        queryClient.invalidateQueries([cacheKeys.setelshareDetails]);
        queryClient.invalidateQueries([cacheKeys.setelShareTransactions]);
      }
    },
  });
};

export const useListSetelShareTransactions = (circleId: string) =>
  useDataTableState({
    queryKey: cacheKeys.setelShareTransactions,
    queryFn: (pagination) => getCircleTransactionsById(circleId, pagination),
    initialFilter: {},
  });

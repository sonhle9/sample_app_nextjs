import {useQuery, useQueryClient, useMutation} from 'react-query';
import {getFailedStats, retriggerFailedActions} from 'src/react/services/api-rewards.service';
import {useNotification} from 'src/react/hooks/use-notification';

export const reliabilityQueryKeys: Record<string, [string, ...unknown[]]> = {
  all: ['reward-reliability'],
  list: ['reward-reliability', 'list'],
  stats: ['reward-reliability', 'stats'],
};

export const useFailedServiceStats = (params: {startDate: string; endDate: string}) =>
  useQuery([reliabilityQueryKeys.stats, params], () => getFailedStats(params));

export const useRetriggerFailedActions = () => {
  const queryClient = useQueryClient();
  const setNotify = useNotification();
  return useMutation(retriggerFailedActions, {
    onError: (err) => setNotify({variant: 'error', title: err.toString()}),
    onSuccess: () =>
      queryClient
        .invalidateQueries(reliabilityQueryKeys.all)
        .then(() => setNotify({variant: 'success', title: 'Successfully triggered!'})),
  });
};

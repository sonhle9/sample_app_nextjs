import {useNotification} from '@setel/portal-ui';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {
  createBnplPlan,
  getBnplPlanDetails,
  getPlanConfigOverLapping,
  updatePlanConfigStatus,
} from 'src/react/services/api-bnpl.service';
import {IGetPlanConfigOverLapping} from './bnpl.interface';

export const bnplPlanQueryKey = {
  planListing: 'bnplPlanListing',
  planDetails: 'bnplPlanDetails',
  planOverlaping: 'bnplPlanOverlaping',
};

export const usePlanDetails = (id: string) => {
  return useQuery([bnplPlanQueryKey.planDetails, id], () => getBnplPlanDetails(id));
};

export const useCreateBnplPlan = () => {
  const queryClient = useQueryClient();
  const setNotify = useNotification();
  return useMutation(createBnplPlan, {
    onError: (err) => {
      setNotify({variant: 'error', title: err.toString()});
    },
    onSuccess: () =>
      queryClient
        .invalidateQueries(bnplPlanQueryKey.planListing)
        .then(() => setNotify({variant: 'success', title: 'Successfully saved!'})),
  });
};

export const useUpdateStatusBnplPlan = () => {
  const queryClient = useQueryClient();
  const setNotify = useNotification();
  return useMutation(updatePlanConfigStatus, {
    onError: (err) => {
      setNotify({variant: 'error', title: err.toString()});
    },
    onSuccess: () => queryClient.invalidateQueries(bnplPlanQueryKey.planDetails),
  });
};

export const useGetPlanOverlaping = () => {
  return useMutation(getPlanConfigOverLapping);
};

export const useGetBnplPlanConfigOverlaping = (body: IGetPlanConfigOverLapping) => {
  return useQuery([bnplPlanQueryKey.planOverlaping], () => getPlanConfigOverLapping(body));
};

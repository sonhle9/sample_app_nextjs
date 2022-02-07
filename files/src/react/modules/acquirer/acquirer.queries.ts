import {useQueryClient, useMutation, useQuery} from 'react-query';
import {IPaginationResult} from 'src/react/lib/ajax';
import {
  Acquirer,
  createAcquirer,
  getAcquirerDetails,
  updateAcquirer,
} from 'src/react/services/api-switch.service';

export const acquirerQueryKey = {
  indexAcquirers: 'indexAcquirers',
  acquirerDetails: 'acquirerDetails',
  multipleAcquirerDetails: 'multipleAcquirerDetails',
};

export const useAcquirerDetails = (id: string) => {
  const queryClient = useQueryClient();
  return useQuery([acquirerQueryKey.acquirerDetails, id], () => getAcquirerDetails(id), {
    placeholderData: () =>
      queryClient
        .getQueryData<IPaginationResult<Acquirer>>([acquirerQueryKey.indexAcquirers], {
          exact: false,
        })
        ?.items.find((acquirer) => acquirer.id === id),
  });
};

export const useCreateAcquirerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(createAcquirer, {
    onSuccess: () => {
      queryClient.invalidateQueries(acquirerQueryKey.indexAcquirers);
    },
  });
};

export const useUpdateAcquirerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(updateAcquirer, {
    onSuccess: (acquirerData) => {
      queryClient.setQueryData([acquirerQueryKey.acquirerDetails, acquirerData.id], acquirerData);
      queryClient.invalidateQueries(acquirerQueryKey.indexAcquirers);
    },
  });
};

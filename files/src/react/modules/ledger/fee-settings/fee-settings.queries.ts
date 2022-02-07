import {useMutation, useQuery, useQueryClient} from 'react-query';
import {
  createOrUpdateFeeSetting,
  deleteFeeSetting,
  getProcessorFee,
  getProcessorFees,
} from 'src/react/services/api-ledger.service';
import {IFeeSettings} from 'src/react/services/api-ledger.type';

export const useProcessorFees = (pagination: Parameters<typeof getProcessorFees>[0]) => {
  const setProcessorFee = useSetProcessorFee();

  return useQuery([CACHE_KEYS.processorFees, pagination], () => getProcessorFees(pagination), {
    onSuccess: (data) => {
      if (data && data.items) {
        data.items.forEach(setProcessorFee);
      }
    },
    keepPreviousData: true,
  });
};

export const useCreateOrUpdateProcessorFee = () => {
  const queryClient = useQueryClient();
  const setProcessorFee = useSetProcessorFee();

  return useMutation(
    (data: Parameters<typeof createOrUpdateFeeSetting>[0]) => createOrUpdateFeeSetting(data),
    {
      onSuccess: (newParam) => {
        if (newParam) {
          queryClient.invalidateQueries([CACHE_KEYS.processorFees]);
          setProcessorFee(newParam);
        }
      },
    },
  );
};

export const useDeleteProcessorFee = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation(() => deleteFeeSetting(id), {
    onSuccess: () => {
      queryClient.invalidateQueries([CACHE_KEYS.processorFees]);
    },
  });
};

export const useProcessorFee = (id: string) =>
  useQuery([CACHE_KEYS.processorFee, id], () => getProcessorFee(id));

const useSetProcessorFee = () => {
  const queryClient = useQueryClient();
  return function setProcessorFee(data: IFeeSettings) {
    queryClient.setQueryData([CACHE_KEYS.processorFee, data.id], data);
  };
};

const CACHE_KEYS = {
  processorFees: 'PROCESSOR_FEES',
  processorFee: 'PROCESSOR_FEE',
};

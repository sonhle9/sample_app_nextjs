import {useMutation, useQuery, useQueryClient} from 'react-query';
import {getVoucherBatchDetails, voidVoucher} from './voucher.service';

export const useVoucherBatchDetails = (id: string) => {
  return useQuery([CACHE_KEYS.VoucherBatchesDetails, id], () => getVoucherBatchDetails(id));
};

export const useVoidVoucher = () => {
  const queryClient = useQueryClient();
  return useMutation((code: string) => voidVoucher(code), {
    onSuccess: () => {
      queryClient.invalidateQueries([CACHE_KEYS.VoidVoucher]);
    },
    onSettled: () => {
      queryClient.invalidateQueries([CACHE_KEYS.VoucherBatchesDetails]);
    },
  });
};

const CACHE_KEYS = {
  VoucherBatchesDetails: 'VOUCHER_BATCH_DETAILS',
  VoidVoucher: 'VOID_VOUCHER',
};

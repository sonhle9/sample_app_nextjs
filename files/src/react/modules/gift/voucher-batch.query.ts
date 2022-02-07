import {IVoucherParameters} from './shared/gift-voucher.constant';
import {
  addVoucher,
  editVoucher,
  getVoucherBatchDetails,
  validateVoucher,
  voidVoucher,
  voidVouchers,
} from './voucher-batch.service';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {useNotification} from 'src/react/hooks/use-notification';
import {useRouter} from 'src/react/routing/routing.context';

export const CACHE_KEYS = {
  VoucherBatchList: 'VOUCHER_BATCH_LIST',
  VoucherBatchesDetails: 'VOUCHER_BATCH_DETAILS',
  EditVoucher: 'EDIT_VOUCHER',
  AddVoucher: 'ADD_VOUCHER',
  CloneVoucher: 'CLONE_VOUCHER',
  ValidateVoucher: 'VALIDATE_VOUCHER',
  VoidVoucher: 'VOID_VOUCHER',
};

export const useEditVoucher = () => {
  const queryClient = useQueryClient();
  const notification = useNotification();
  return useMutation((voucherDetails: IVoucherParameters) => editVoucher(voucherDetails), {
    onSuccess: () => {
      queryClient.invalidateQueries([CACHE_KEYS.VoucherBatchesDetails]);
      notification({
        variant: 'success',
        title: 'Successful!',
        description: 'Edit voucher batch successful.',
      });
    },
    onError: (err: any) => {
      const response = err.response && err.response.data;
      notification({
        variant: 'error',
        title: 'Error!',
        description: response.message,
      });
    },
  });
};

export const useAddVoucher = () => {
  const queryClient = useQueryClient();
  return useMutation((voucherDetails: IVoucherParameters) => addVoucher(voucherDetails), {
    onSuccess: () => {
      queryClient.invalidateQueries([CACHE_KEYS.VoucherBatchList]);
    },
  });
};

export const useCloneVoucher = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const notification = useNotification();
  return useMutation(
    (voucherDetails: IVoucherParameters) => {
      if (voucherDetails._id) {
        voucherDetails._id = null;
      }
      return addVoucher({...voucherDetails, name: `${voucherDetails.name} CLONE`});
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries([CACHE_KEYS.VoucherBatchList]);
        router.navigateByUrl(`/gifts/voucher-batches/details/${data._id}`);
        notification({
          variant: 'success',
          title: 'Successful!',
          description: 'Clone voucher batch successful.',
        });
      },
      onError: (err: any) => {
        const response = err.response && err.response.data;
        console.log(err);
        notification({
          variant: 'error',
          title: 'Error!',
          description: response.message,
        });
      },
    },
  );
};

export const useValidateVoucher = () => {
  return useMutation((code: string) => validateVoucher(code));
};

export const useVoidVoucher = () => {
  return useMutation((code: string) => voidVoucher(code));
};

export const useVoidVouchers = () => {
  const queryClient = useQueryClient();
  return useMutation((codes: string[]) => voidVouchers(codes), {
    onSuccess: () => {
      queryClient.invalidateQueries([CACHE_KEYS.VoucherBatchesDetails]);
    },
  });
};

export const useVoucherBatchDetails = (id: string) => {
  return useQuery([CACHE_KEYS.VoucherBatchesDetails, id], () => getVoucherBatchDetails(id), {
    refetchOnWindowFocus: false,
  });
};

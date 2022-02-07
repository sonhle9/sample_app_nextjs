import {useMutation, useQuery, useQueryClient} from 'react-query';
import {
  createMerchantType,
  deleteMerchantType,
  getMerchantFields,
  getMerchantTypeDetails,
  getMerchantTypes,
  getMerchantTypesUsed,
  updateMerchantType,
} from './merchant-types.service';
import {IMerchantType} from './merchant-types.type';
import {merchantQueryKey} from '../merchants/merchants.queries';

const MERCHANT_TYPES = 'merchant_types';
const MERCHANT_TYPES_USED = 'merchant_types_used';
const MERCHANT_TYPE_DETAILS = 'merchant_type_details';
const MERCHANT_FIELDS = 'merchant_fields';

export const useMerchantTypes = () => {
  return useQuery([MERCHANT_TYPES], () => getMerchantTypes(), {
    keepPreviousData: true,
  });
};

export const useMerchantTypesUsed = () => {
  return useQuery([MERCHANT_TYPES_USED], () => getMerchantTypesUsed(), {
    keepPreviousData: true,
  });
};

export const useSetMerchantType = (currentMerchantType?: IMerchantType) => {
  const queryClient = useQueryClient();
  return useMutation(
    (merchantType: IMerchantType) =>
      currentMerchantType
        ? updateMerchantType({
            ...currentMerchantType,
            ...merchantType,
          })
        : createMerchantType(merchantType),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([merchantQueryKey.merchantType]);
        queryClient.invalidateQueries([MERCHANT_TYPES_USED]);
        queryClient.invalidateQueries([MERCHANT_TYPES]);
        if (currentMerchantType) {
          queryClient.invalidateQueries([
            MERCHANT_TYPE_DETAILS,
            currentMerchantType.id || currentMerchantType._id,
          ]);
        }
      },
    },
  );
};

export const useDeleteMerchantType = (currentMerchantType?: IMerchantType) => {
  const queryClient = useQueryClient();
  return useMutation(
    (merchantTypeId: string) =>
      deleteMerchantType(merchantTypeId || currentMerchantType.id || currentMerchantType._id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([merchantQueryKey.merchantType]);
        queryClient.invalidateQueries([MERCHANT_TYPES_USED]);
        queryClient.invalidateQueries([MERCHANT_TYPES]);
      },
    },
  );
};

export const useMerchantTypeDetails = (merchantTypeId?: string) => {
  return useQuery([MERCHANT_TYPE_DETAILS, merchantTypeId], () =>
    getMerchantTypeDetails(merchantTypeId),
  );
};

export const useMerchantFields = () => {
  return useQuery([MERCHANT_FIELDS], () => getMerchantFields(), {
    keepPreviousData: true,
  });
};

import {useMutation, useQuery, useQueryClient} from 'react-query';
import {MerchantLinkDto} from './merchant-links.type';
import {merchantQueryKey} from '../merchants/merchants.queries';
import {
  createMerchantLink,
  deleteMerchantLink,
  getMerchantLinkDetails,
  updateMerchantLink,
} from './merchant-links.service';

export const useCreateMerchantLink = () => {
  const queryClient = useQueryClient();
  return useMutation((link: MerchantLinkDto) => createMerchantLink(link), {
    onSuccess: () => queryClient.invalidateQueries([merchantQueryKey.merchantLinkListing]),
  });
};

export const useUpdateMerchantLink = (linkId: string) => {
  return useMutation((link: MerchantLinkDto) => updateMerchantLink(linkId, link));
};

export const useDeleteMerchantLink = (linkId: string) => {
  const queryClient = useQueryClient();
  return useMutation(() => deleteMerchantLink(linkId), {
    onSuccess: () => queryClient.invalidateQueries([merchantQueryKey.merchantLinkListing]),
  });
};

export const useMerchantLinkDetails = (linkId: string) => {
  return useQuery([merchantQueryKey.merchantLinkDetails, linkId], () =>
    getMerchantLinkDetails(linkId),
  );
};

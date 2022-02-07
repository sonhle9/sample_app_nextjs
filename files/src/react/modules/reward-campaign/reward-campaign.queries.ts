import {useQuery, useQueryClient, useMutation} from 'react-query';
import {useQueriesTyped} from 'src/react/lib/use-queries-typed';
import {ICampaign} from 'src/shared/interfaces/reward.interface';
import {
  getCampaignById,
  downloadCampaignCustomersCsv,
  getCampaignEnums,
  createCampaign,
  updateCampaign,
  grantCampaign,
} from 'src/react/services/api-rewards.service';
import {getVouchersBatch} from 'src/react/modules/voucher-report/voucher.service';
import {useNotification} from 'src/react/hooks/use-notification';
import {VoucherRedeemType, VouchersBatchStatus} from 'src/shared/interfaces/vouchers.interface';

export const campaignQueryKeys = {
  all: 'reward-campaign',
  list: 'reward-campaign-list',
  details: 'reward-campaign-details',
  customerList: 'reward-campaign-customer-list',
  enums: 'reward-campaign-enums',
  vouchersBatch: 'reward-campaign-vouchers-batch',
};

export const useRewardCampaignDetails = (id: string) => {
  const queryClient = useQueryClient();
  return useQuery([campaignQueryKeys.details, id], () => getCampaignById(id), {
    placeholderData: () =>
      queryClient
        .getQueryData<{
          data: Array<ICampaign>;
        }>(campaignQueryKeys.list, {exact: false})
        ?.data.find((item) => item.id === id),
  });
};

export const useDownloadCampaignCustomers = () => {
  const setNotify = useNotification();
  return useMutation(downloadCampaignCustomersCsv, {
    onError: (err) => setNotify({variant: 'error', title: err.toString()}),
  });
};

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();
  const setNotify = useNotification();
  return useMutation(createCampaign, {
    onError: (err) => setNotify({variant: 'error', title: err.toString()}),
    onSuccess: () =>
      queryClient
        .invalidateQueries(campaignQueryKeys.list)
        .then(() => setNotify({variant: 'success', title: 'Successfully saved!'})),
  });
};

export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();
  const setNotify = useNotification();
  return useMutation(updateCampaign, {
    onError: (err) => setNotify({variant: 'error', title: err.toString()}),
    onSuccess: () =>
      queryClient
        .invalidateQueries([campaignQueryKeys.details])
        .then(() => setNotify({variant: 'success', title: 'Successfully saved!'})),
  });
};

export const useGrantCampaign = () => {
  const queryClient = useQueryClient();
  const setNotify = useNotification();
  return useMutation(grantCampaign, {
    onError: (err) => setNotify({variant: 'error', title: err.toString()}),
    onSuccess: () =>
      queryClient
        .invalidateQueries([campaignQueryKeys.details])
        .then(() => setNotify({variant: 'success', title: 'Successfully triggered!'})),
  });
};

export const useCampaignEnums = () => {
  return useQuery(campaignQueryKeys.enums, getCampaignEnums);
};

// saved vouchers only have ids, user search by voucher name
// we need both in dropdown options, combine parallel queries
export const useVouchersBatchSearch = ({
  enabled,
  name,
  ids,
}: {
  enabled: boolean;
  name: string;
  ids: string[];
}) => {
  const [nameQuery, idsQuery] = useQueriesTyped([
    {
      queryKey: [campaignQueryKeys.vouchersBatch, name],
      queryFn: () =>
        getVouchersBatch({
          name,
          status: VouchersBatchStatus.ACTIVE,
          type: VoucherRedeemType.REGISTRATION,
        }),
      enabled: enabled && Boolean(name),
      refetchOnWindowFocus: false,
    },
    {
      queryKey: [campaignQueryKeys.vouchersBatch, ids],
      queryFn: () =>
        getVouchersBatch({
          ids,
          status: VouchersBatchStatus.ACTIVE,
          type: VoucherRedeemType.REGISTRATION,
        }),
      enabled: enabled && ids?.length > 0,
      refetchOnWindowFocus: false,
    },
  ]);

  return {
    isLoading: nameQuery.isLoading || idsQuery.isLoading,
    data: {
      items: (nameQuery.data?.items ?? []).concat(idsQuery.data?.items ?? []),
    },
  };
};

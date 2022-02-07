import {useMutation, useQuery, useQueryClient} from 'react-query';
import {editFeeSetting, getFeeSettingDetails, getFeeSettings} from './fee-settings.service';
import {IEditFeeSettingBody} from './fee-settings.type';

const FEE_SETTINGS_LISTING_KEY = 'feeSettingsListing';
const FEE_SETTINGS_DETAIL_KEY = 'feeSettingsDetail';

export const useFeeSettings = (filter: Parameters<typeof getFeeSettings>[0]) => {
  return useQuery([FEE_SETTINGS_LISTING_KEY, filter], () => getFeeSettings(filter), {
    keepPreviousData: true,
  });
};

export const useFeeSettingDetails = (feeSettingId: string) =>
  useQuery([FEE_SETTINGS_DETAIL_KEY, feeSettingId], () => getFeeSettingDetails(feeSettingId));

export const useEditFeeSetting = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data: {feeSettingId: string; body: IEditFeeSettingBody}) =>
      editFeeSetting(data.feeSettingId, data.body),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([FEE_SETTINGS_DETAIL_KEY]);
      },
    },
  );
};

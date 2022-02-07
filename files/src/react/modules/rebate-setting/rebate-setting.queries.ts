import {useMutation, useQuery, useQueryClient} from 'react-query';
import {
  createRebateSetting,
  getRebateSettings,
  searchAccountOrCompany,
} from '../../services/api-rebates.service';

const REBATE_SETTINGS_LISTING_KEY = 'rebateSettingsListing';
const SEARCH_ACCOUNT_OR_COMPANY_KEY = 'searchAccountOrCompany';

export const useRebateSettings = (filter: Parameters<typeof getRebateSettings>[0]) => {
  return useQuery([REBATE_SETTINGS_LISTING_KEY, filter], () => getRebateSettings(filter), {
    keepPreviousData: true,
  });
};

export const useCreateRebateSetting = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (body: Parameters<typeof createRebateSetting>[0]) => createRebateSetting(body),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([REBATE_SETTINGS_LISTING_KEY]);
        queryClient.invalidateQueries([SEARCH_ACCOUNT_OR_COMPANY_KEY]);
      },
    },
  );
};

export const useSearchAccountOrCompany = (filter: Parameters<typeof searchAccountOrCompany>[0]) => {
  return useQuery([SEARCH_ACCOUNT_OR_COMPANY_KEY, filter], () => searchAccountOrCompany(filter));
};

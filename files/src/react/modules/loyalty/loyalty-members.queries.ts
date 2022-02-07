import {useQuery, useMutation, useQueryClient, UseQueryOptions} from 'react-query';
import {
  getLoyaltyMemberUnlinkHistory,
  getLoyaltyMemberWhitelist,
  loyaltyMemberWhitelist,
  loyaltyMemberUnwhitelist,
} from './loyalty-members.service';
import {UnlinkHistoryParams, ILoyaltyMemberWhitelist} from './loyalty-members.type';

export const useGetUnlinkHistory = (
  params?: UnlinkHistoryParams,
  options?: Pick<UseQueryOptions, 'enabled'>,
) =>
  useQuery(
    ['getLoyaltyMemberUnlinkHistory', params],
    () => getLoyaltyMemberUnlinkHistory(params),
    options,
  );

export const useGetLoyaltyMemberWhitelist = (loyaltyMember: ILoyaltyMemberWhitelist) =>
  useQuery(
    [`getLoyaltyMemberWhitelist`, loyaltyMember],
    (_) => getLoyaltyMemberWhitelist(loyaltyMember),
    {retry: false},
  );

export const useWhitelistLoyaltyMember = () => {
  const queryClient = useQueryClient();
  return useMutation((whitelist: ILoyaltyMemberWhitelist) => loyaltyMemberWhitelist(whitelist), {
    onSuccess: () => {
      queryClient.invalidateQueries([`getLoyaltyMemberWhitelist`]);
    },
  });
};

export const useUnwhitelistLoyaltyMember = () => {
  const queryClient = useQueryClient();
  return useMutation((whitelist: ILoyaltyMemberWhitelist) => loyaltyMemberUnwhitelist(whitelist), {
    onSuccess: () => {
      queryClient.invalidateQueries(`getLoyaltyMemberWhitelist`);
    },
  });
};

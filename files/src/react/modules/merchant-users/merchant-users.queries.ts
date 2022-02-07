import {useMutation, useQuery, useQueryClient} from 'react-query';
import {
  updateMerchantUser,
  getListCompanies,
  getListMerchants,
  getMerchantUsers,
  getUserMerchantDetail,
  getCompanyDetails,
} from './merchant-users.service';
import {IUpdateMerchantUser} from './merchant-users.type';
const COMPANIES = 'companies';
const MERCHANTS = 'merchants';
const MERCHANT_USERS = 'merchant_users';
const MERCHANT_USER_DETAILS = 'merchant_user_details';
const COMPANY_DETAILS = 'company_details';

export const useMerchantUsers = (filter: Parameters<typeof getMerchantUsers>[0]) => {
  return useQuery([MERCHANT_USERS, filter], () => getMerchantUsers(filter), {
    keepPreviousData: true,
  });
};

export const useCompanyDetails = (companyId: string) =>
  useQuery([COMPANY_DETAILS, companyId], () => getCompanyDetails(companyId));

export const useSetMerchantUser = (update: IUpdateMerchantUser) => {
  const queryClient = useQueryClient();
  return useMutation(() => updateMerchantUser(update), {
    onSuccess: () => {
      queryClient.invalidateQueries([MERCHANT_USER_DETAILS]);
      queryClient.invalidateQueries([COMPANY_DETAILS]);
    },
  });
};

export const useMerchants = (filter: Parameters<typeof getListMerchants>[0]) => {
  return useQuery([MERCHANTS, filter], () => getListMerchants(filter), {
    keepPreviousData: true,
  });
};

export const useCompanies = (filter: Parameters<typeof getListCompanies>[0]) => {
  return useQuery([COMPANIES, filter], () => getListCompanies(filter), {
    keepPreviousData: true,
  });
};

export const useUserMerchantDetail = (filter: Parameters<typeof getUserMerchantDetail>[0]) =>
  useQuery([MERCHANT_USER_DETAILS, filter], () => getUserMerchantDetail(filter));

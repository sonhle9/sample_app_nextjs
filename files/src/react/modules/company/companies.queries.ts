import {useMutation, useQuery, useQueryClient} from 'react-query';
import {IPaginationParam} from '../../lib/ajax';
import {
  createCompany,
  createSmartpayCompanyAddress,
  createSmartpayCompanyContact,
  deleteCompany,
  deleteSmartpayCompanyAddress,
  deleteSmartpayCompanyContact,
  getCompanies,
  getCompanyDetails,
  getCompanyTypes,
  getEnabledProductMerchants,
  getListMerchant,
  getProductsEnterprise,
  getSmartpayCompanyAddressDetails,
  getSmartpayCompanyAddressList,
  getSmartpayCompanyContactDetails,
  getSmartpayCompanyContactList,
  updateCompany,
  updateCompanyIdMerchant,
  updateProductOfferingsCompany,
  updateSmartpayCompanyAddress,
  updateSmartpayCompanyContact,
  uploadCompanyLogo,
} from './companies.service';
import {ICompany, SmartpayCompanyAddress, SmartpayCompanyContact} from './companies.type';

const COMPANIES = 'companies';
const COMPANY_DETAILS = 'company_details';
const LIST_MERCHANTS = 'list_merchants';
const COMPANY_TYPE = 'company_type';
const COMPANY_ADDRESS_LIST = 'company_address_list';
const COMPANY_ADDRESS_DETAILS = 'company_address_details';
const COMPANY_CONTACT_LIST = 'company_contact_list';
const COMPANY_CONTACT_DETAILS = 'company_contact_details';

export const companyQueryKey = {
  COMPANY_MERCHANTS: 'company_merchants',
};

export const useCompanies = (filter: Parameters<typeof getCompanies>[0]) => {
  return useQuery([COMPANIES, filter], () => getCompanies(filter), {
    keepPreviousData: true,
  });
};

export const useSetCompany = (currentCompany?: ICompany) => {
  const queryClient = useQueryClient();
  return useMutation(
    ({logoData, ...company}: ICompany & {logoData?: File}) => {
      if (!currentCompany) {
        if (logoData) {
          return uploadCompanyLogo(logoData).then((res) =>
            createCompany({
              ...company,
              logo: res.logo,
            }),
          );
        }
        return createCompany(company);
      } else {
        if (logoData) {
          return uploadCompanyLogo(logoData).then((res) =>
            updateCompany({
              ...currentCompany,
              ...company,
              logo: res.logo,
            }),
          );
        }
        return updateCompany({
          ...currentCompany,
          ...company,
          logo: logoData === null ? null : undefined,
        });
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([COMPANIES]);
        if (currentCompany) {
          queryClient.invalidateQueries([COMPANY_DETAILS, currentCompany.id || currentCompany._id]);
        }
      },
    },
  );
};

export const useDeleteCompany = (currentCompany?: ICompany) => {
  const queryClient = useQueryClient();
  return useMutation(
    (companyId: string) => deleteCompany(companyId || currentCompany.id || currentCompany._id),
    {
      onSuccess: () => queryClient.invalidateQueries([COMPANIES]),
    },
  );
};

export const useCompanyDetails = (companyId: string) =>
  useQuery([COMPANY_DETAILS, companyId], () => getCompanyDetails(companyId));

export const useGetListMerchant = (name: string) =>
  useQuery([LIST_MERCHANTS, name], () => getListMerchant(name));

export const useGetProductsEnterprise = () => useMutation(getProductsEnterprise);

export const useUpdateProductOfferingsCompany = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({company, product, enable}: {company: string; product: string; enable: boolean}) =>
      updateProductOfferingsCompany(company, product, enable),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([COMPANY_DETAILS]);
      },
    },
  );
};

export const useGetEnabledProductMerchants = () =>
  useMutation(({company, product}: {company: string; product: string}) =>
    getEnabledProductMerchants(company, product),
  );

export const useUpdateCompanyIdMerchant = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({merchantId, companyId}: {merchantId: string; companyId: string}) =>
      updateCompanyIdMerchant(merchantId, companyId),
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries(`${companyQueryKey.COMPANY_MERCHANTS}_${res.companyId}`);
        queryClient.invalidateQueries([LIST_MERCHANTS]);
      },
    },
  );
};

export const useGetCompanyType = (filter: Parameters<typeof getCompanyTypes>[0]) => {
  return useQuery([COMPANY_TYPE, filter], () => getCompanyTypes(filter), {
    keepPreviousData: true,
  });
};

export const useSmartpayCompanyAddressList = (id: string, filter: IPaginationParam) => {
  return useQuery([COMPANY_ADDRESS_LIST, filter], () => getSmartpayCompanyAddressList(id, filter), {
    keepPreviousData: true,
  });
};

export const useCreateSmartpayCompanyAddress = (companyId: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    ({address}: {address: SmartpayCompanyAddress}) =>
      createSmartpayCompanyAddress(companyId, address),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([COMPANY_ADDRESS_LIST]);
      },
    },
  );
};

export const useSmartpayCompanyAddressDetails = (addressId: string) => {
  return useQuery([COMPANY_ADDRESS_DETAILS, addressId], () =>
    getSmartpayCompanyAddressDetails(addressId),
  );
};

export const useUpdateSmartpayCompanyAddress = (addressId: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    ({address}: {address: SmartpayCompanyAddress}) =>
      updateSmartpayCompanyAddress(addressId, address),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([COMPANY_ADDRESS_DETAILS, addressId]);
      },
    },
  );
};

export const useDeleteSmartpayCompanyAddress = (addressId: string) => {
  const queryClient = useQueryClient();
  return useMutation(() => deleteSmartpayCompanyAddress(addressId), {
    onSuccess: () => {
      queryClient.invalidateQueries([COMPANY_ADDRESS_LIST]);
    },
  });
};

export const useSmartpayCompanyContactList = (companyId: string, filter: IPaginationParam) => {
  return useQuery(
    [COMPANY_CONTACT_LIST, filter],
    () => getSmartpayCompanyContactList(companyId, filter),
    {
      keepPreviousData: true,
    },
  );
};

export const useCreateSmartpayCompanyContact = (companyId: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    ({contact}: {contact: SmartpayCompanyContact}) =>
      createSmartpayCompanyContact(companyId, contact),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([COMPANY_CONTACT_LIST]);
      },
    },
  );
};

export const useSmartpayCompanyContactDetails = (contact: string) => {
  return useQuery([COMPANY_CONTACT_DETAILS, contact], () =>
    getSmartpayCompanyContactDetails(contact),
  );
};

export const useUpdateSmartpayCompanyContact = (contactId: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    ({contact}: {contact: SmartpayCompanyContact}) =>
      updateSmartpayCompanyContact(contactId, contact),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([COMPANY_CONTACT_DETAILS, contactId]);
      },
    },
  );
};

export const useDeleteSmartpayCompanyContact = (contactId: string) => {
  const queryClient = useQueryClient();
  return useMutation(() => deleteSmartpayCompanyContact(contactId), {
    onSuccess: () => {
      queryClient.invalidateQueries([COMPANY_CONTACT_LIST]);
    },
  });
};

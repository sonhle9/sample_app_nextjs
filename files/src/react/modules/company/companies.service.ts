import {environment} from 'src/environments/environment';
import {apiClient, fetchPaginatedData, IPaginationParam} from 'src/react/lib/ajax';
import {extractErrorWithConstraints} from 'src/react/lib/utils';
import {
  PAGES_COUNT_HEADER_NAME,
  PAGE_HEADER_NAME,
  PER_PAGE_HEADER_NAME,
  TOTAL_COUNT_HEADER_NAME,
} from '../../services/service.type';
import {
  ICompaniesRequest,
  ICompany,
  ICompanyType,
  ICompanyTypesRequest,
  IProductsEnterprise,
  Merchant,
  MerchantInCompanyFilter,
  SmartpayCompanyAddress,
  SmartpayCompanyContact,
} from './companies.type';

export const getCompanies = (req: ICompaniesRequest = {}) => {
  return apiClient
    .get<ICompany[]>(`${environment.companiesApiBaseUrl}/api/companies/admin/companies`, {
      params: {
        perPage: (req && req.perPage) || 25,
        page: (req && req.page) || 1,
        keyWord: (req && req.keyWord) || '',
        companyType: req.companyType,
        sortDate: (req && req.sortDate) || 'desc',
      },
    })
    .then((res) => {
      if (res && res.data && res.headers) {
        const {
          [TOTAL_COUNT_HEADER_NAME]: totalDocs,
          [PAGES_COUNT_HEADER_NAME]: totalPages,
          [PER_PAGE_HEADER_NAME]: perPage,
          [PAGE_HEADER_NAME]: page,
        } = res.headers;
        return {
          companies: (res.data || []).map((c) => ({
            ...c,
            id: c._id,
            created_date: c.createdAt,
          })),
          totalDocs,
          totalPages,
          perPage,
          page,
        };
      }
      return null;
    });
};

export const uploadCompanyLogo = (logoData: File) => {
  const formData = new FormData();
  formData.append('logo', logoData);
  return apiClient
    .post<{logo: string}>(
      `${environment.companiesApiBaseUrl}/api/companies/admin/companies/uploadLogo`,
      formData,
    )
    .then((res) => res.data);
};

export const createCompany = (company: ICompany) => {
  return apiClient
    .post<ICompany>(`${environment.companiesApiBaseUrl}/api/companies/admin/companies`, {
      ...company,
    })
    .then((res) => res.data)
    .catch((err) =>
      Promise.reject({
        message: extractErrorWithConstraints(err),
      }),
    );
};

export const updateCompany = (company: ICompany) => {
  return apiClient
    .put<ICompany>(
      `${environment.companiesApiBaseUrl}/api/companies/admin/companies/${
        company.id || company._id
      }`,
      {
        name: company.name,
        manageCatalogue: company.manageCatalogue,
        logo: company.logo,
        logoBackgroundColor: company.logoBackgroundColor,
        isApplyLogoToChildMerchant: company.isApplyLogoToChildMerchant,

        typeId: company.typeId,
        code: company.code,
        creditLimitSharing: company.creditLimitSharing,
        creditLimit: company.creditLimit,

        authorisedSignatory: company.authorisedSignatory,
      },
    )
    .then((res) => res.data)
    .catch((err) =>
      Promise.reject({
        message: extractErrorWithConstraints(err),
      }),
    );
};

export const deleteCompany = (companyId: string) => {
  return apiClient.delete(
    `${environment.companiesApiBaseUrl}/api/companies/admin/companies/${companyId}`,
  );
};

export const getCompanyDetails = (companyId: string): Promise<ICompany> => {
  return apiClient
    .get<ICompany>(`${environment.companiesApiBaseUrl}/api/companies/admin/companies/${companyId}`)
    .then((res) => res.data);
};

export const getListMerchantCompany = (options: MerchantInCompanyFilter) => {
  return fetchPaginatedData<Merchant>(
    `${environment.companiesApiBaseUrl}/api/merchants/admin/merchants`,
    options,
  );
};

export const getListMerchant = (searchValue: string) => {
  const urlQuery = !!searchValue
    ? `api/merchants/admin/merchants?searchValue=${searchValue}`
    : `api/merchants/admin/merchants`;
  return apiClient.get<Merchant[]>(`${environment.companiesApiBaseUrl}/${urlQuery}`).then((res) => {
    return (res.data || []).filter((item) => {
      return item.companyId === '' || item.companyId === null;
    });
  });
};

export const updateMerchantCompany = (merchantId: string, companyId: string) => {
  return apiClient.put(
    `${environment.companiesApiBaseUrl}/api/merchants/admin/merchants/${merchantId}`,
    {
      companyId,
    },
  );
};

export const getProductsEnterprise = (): Promise<IProductsEnterprise> => {
  return apiClient
    .get(`${environment.companiesApiBaseUrl}/api/merchants/admin/enterprise/product-offerings`)
    .then((res) => res.data);
};

export const updateProductOfferingsCompany = (
  companyId: string,
  product: string,
  enable: boolean,
) => {
  return apiClient
    .put(
      `${environment.companiesApiBaseUrl}/api/companies/admin/companies/${companyId}/${product}/status`,
      {
        enable,
      },
    )
    .then((res) => res.data);
};

export const getEnabledProductMerchants = (companyId: string, product: string) => {
  return apiClient
    .get(
      `${environment.companiesApiBaseUrl}/api/merchants/admin/merchants/${companyId}/${product}/enabled`,
    )
    .then((res) => res.data);
};

export const updateCompanyIdMerchant = (merchantId: string, companyId: string) => {
  return apiClient
    .put(`${environment.companiesApiBaseUrl}/api/merchants/admin/merchants/${merchantId}/company`, {
      companyId,
    })
    .then((res) => res.data)
    .catch((err) => Promise.reject(extractErrorWithConstraints(err)));
};

export const getCompanyTypes = (req: ICompanyTypesRequest) => {
  return apiClient
    .get<ICompanyType[]>(`${environment.companiesApiBaseUrl}/api/companies/admin/companyTypes`, {
      params: {
        perPage: (req && req.perPage) || 25,
        page: (req && req.page) || 1,
        searchValue: req.searchValue,
        sortBy: req.sortBy,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((e) =>
      Promise.reject({
        message: extractErrorWithConstraints(e),
      }),
    );
};

export const getSmartpayCompanyAddressList = (id: string, options: IPaginationParam) => {
  return fetchPaginatedData<SmartpayCompanyAddress>(
    `${environment.companiesApiBaseUrl}/api/companies/admin/smartpayCompanyAddresses/index/${id}`,
    options,
  );
};

export const createSmartpayCompanyAddress = (companyId: string, data: SmartpayCompanyAddress) => {
  return apiClient.post<SmartpayCompanyAddress>(
    `${environment.companiesApiBaseUrl}/api/companies/admin/smartpayCompanyAddresses`,
    {
      ...data,
      smartpayCompanyId: companyId,
    },
  );
};

export const updateSmartpayCompanyAddress = (addressId: string, data: SmartpayCompanyAddress) => {
  return apiClient
    .put<SmartpayCompanyAddress>(
      `${environment.companiesApiBaseUrl}/api/companies/admin/smartpayCompanyAddresses/${addressId}`,
      data,
    )
    .then((res) => res.data)
    .catch((err) =>
      Promise.reject({
        message: extractErrorWithConstraints(err),
      }),
    );
};

export const deleteSmartpayCompanyAddress = (addressId: string) => {
  return apiClient
    .delete<SmartpayCompanyAddress>(
      `${environment.companiesApiBaseUrl}/api/companies/admin/smartpayCompanyAddresses/${addressId}`,
    )
    .then((res) => res.data)
    .catch((err) =>
      Promise.reject({
        message: extractErrorWithConstraints(err),
      }),
    );
};

export const getSmartpayCompanyAddressDetails = (
  addressId: string,
): Promise<SmartpayCompanyAddress> => {
  return apiClient
    .get<SmartpayCompanyAddress>(
      `${environment.companiesApiBaseUrl}/api/companies/admin/smartpayCompanyAddresses/${addressId}`,
    )
    .then((res) => res.data);
};

export const getSmartpayCompanyContactList = (companyId: string, options: IPaginationParam) => {
  return fetchPaginatedData<SmartpayCompanyContact>(
    `${environment.companiesApiBaseUrl}/api/companies/admin/smartpayCompanyContacts/index/${companyId}`,
    options,
  );
};

export const createSmartpayCompanyContact = (companyId: string, data: SmartpayCompanyContact) => {
  return apiClient.post<SmartpayCompanyContact>(
    `${environment.companiesApiBaseUrl}/api/companies/admin/smartpayCompanyContacts`,
    {
      ...data,
      smartpayCompanyId: companyId,
    },
  );
};

export const updateSmartpayCompanyContact = (contactId: string, data: SmartpayCompanyContact) => {
  return apiClient.put<SmartpayCompanyContact>(
    `${environment.companiesApiBaseUrl}/api/companies/admin/smartpayCompanyContacts/${contactId}`,
    data,
  );
};

export const deleteSmartpayCompanyContact = (contactId: string) => {
  return apiClient.delete<SmartpayCompanyContact>(
    `${environment.companiesApiBaseUrl}/api/companies/admin/smartpayCompanyContacts/${contactId}`,
  );
};

export const getSmartpayCompanyContactDetails = (
  contactId: string,
): Promise<SmartpayCompanyContact> => {
  return apiClient
    .get<SmartpayCompanyContact>(
      `${environment.companiesApiBaseUrl}/api/companies/admin/smartpayCompanyContacts/${contactId}`,
    )
    .then((res) => res.data);
};

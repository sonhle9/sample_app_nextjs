// import {RegexEnum} from './merchant-users.constant';
import {
  ICompany,
  ICompanyRequest,
  IMerchant,
  IMerchantRequest,
  IMerchantUserRequest,
  IUserMerchantDetail,
  IMerchantUserListItem,
  IUpdateMerchantUser,
} from './merchant-users.type';
import {apiClient, fetchPaginatedData} from '../../lib/ajax';
import {environment} from '../../../environments/environment';
import {
  PAGE_HEADER_NAME,
  PAGES_COUNT_HEADER_NAME,
  PER_PAGE_HEADER_NAME,
  TOTAL_COUNT_HEADER_NAME,
} from '../../services/service.type';

export const getMerchantUsers = async (filter: IMerchantUserRequest) => {
  return fetchPaginatedData<IMerchantUserListItem>(
    `${environment.merchantsApiBaseUrl}/api/merchants/admin/merchants/enterprise/users-merchant`,
    filter,
    {
      params: {
        sortBy: 'createdAt',
      },
    },
  );
};

export const filterMerchantName = (merchants: IMerchant[]) => {
  const nameRaw = [];
  merchants.forEach((element) => {
    nameRaw.push(element.name);
  });
  const name = nameRaw.join(', ');
  return nameRaw.length > 0 ? name.toString() : '-';
};

export const updateMerchantUser = (merchantUser: IUpdateMerchantUser) => {
  return apiClient
    .put<any>(
      `${environment.merchantsApiBaseUrl}/api/merchants/admin/merchants/enterprise/users-merchant/${merchantUser.userId}`,
      merchantUser,
    )
    .then((res) => res.data);
};

export const deleteMerchantUser = (merchantUserId: string) => {
  return apiClient.delete(
    `${environment.merchantsApiBaseUrl}/api/merchants/admin/users/${merchantUserId}`,
  );
};

export const getListMerchants = (req: IMerchantRequest = {}) => {
  let queryStr = `perPage=${req.perPage || 9999}&page=${req.page || 1}`;
  if (req?.name) {
    queryStr += `&name=${req?.name}`;
  }
  if (req?.companyId) {
    queryStr += `&companyId=${req?.companyId}`;
  }
  return apiClient
    .get<IMerchant[]>(
      `${environment.merchantsApiBaseUrl}/api/merchants/admin/merchants?${queryStr}`,
    )
    .then((res) => {
      if (res && res.data && res.headers) {
        const {
          [TOTAL_COUNT_HEADER_NAME]: totalDocs,
          [PAGES_COUNT_HEADER_NAME]: totalPages,
          [PER_PAGE_HEADER_NAME]: perPage,
          [PAGE_HEADER_NAME]: page,
        } = res.headers;
        return {
          merchants: res.data || [],
          totalDocs,
          totalPages,
          perPage,
          page,
        };
      }
      return null;
    });
};

export const getListCompanies = (req: ICompanyRequest = {}) => {
  return apiClient
    .get<ICompany[]>(
      `${environment.companiesApiBaseUrl}/api/companies/admin/companies?perPage=${
        req.perPage || 9999
      }&page=${req.page || 1}`,
    )
    .then((res) => {
      if (res && res.data && res.headers) {
        const {
          [TOTAL_COUNT_HEADER_NAME]: totalDocs,
          [PAGES_COUNT_HEADER_NAME]: totalPages,
          [PER_PAGE_HEADER_NAME]: perPage,
          [PAGE_HEADER_NAME]: page,
        } = res.headers;
        return {
          companies: res.data || [],
          totalDocs,
          totalPages,
          perPage,
          page,
        };
      }
      return null;
    });
};

export const getUserMerchantDetail = (userId: string) => {
  return apiClient
    .get<IUserMerchantDetail>(
      `${environment.merchantsApiBaseUrl}/api/merchants/admin/merchants/enterprise/users-merchant/${userId}`,
    )
    .then((res) => ({
      ...res.data,
    }));
};

export const getCompanyDetails = (companyId: string): Promise<ICompany> => {
  return apiClient
    .get<ICompany>(`${environment.companiesApiBaseUrl}/api/companies/admin/companies/${companyId}`)
    .then((res) => res.data);
};

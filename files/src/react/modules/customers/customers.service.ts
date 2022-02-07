// import {RegexEnum} from './customers.constant';
import {
  ICustomer,
  ICustomerLite,
  IMutationCustomer,
  ICustomerRequest,
  RegexEnum,
  ICustomerTransactions,
  IStoreOrdersFilter,
} from './customers.type';
import {apiClient, fetchPaginatedData, IPaginationResult} from '../../lib/ajax';
import {environment} from '../../../environments/environment';
import {
  PAGE_HEADER_NAME,
  PAGES_COUNT_HEADER_NAME,
  PER_PAGE_HEADER_NAME,
  TOTAL_COUNT_HEADER_NAME,
} from '../../services/service.type';
import {IStoreOrder} from 'src/shared/interfaces/storeOrder.interface';
import {PaymentTransaction} from 'src/react/services/api-payments.type';
import {extractErrorWithConstraints} from 'src/react/lib/utils';
import {PaginationParams} from '@setel/web-utils';
import {CircleHistory} from 'src/react/services/api-circles.type';

const baseUrl = `${environment.opsApiBaseUrl}/api/ops`;

export const getCustomer = async ({search, ...filter}: ICustomerRequest) => {
  const searchParams = (function getSearchParams() {
    if (!search) {
      return {};
    }

    const searchNum = Number(search);

    if (!isNaN(searchNum)) {
      return {
        phone: search.startsWith('0') ? `6${search}` : search,
      };
    } else if (search.includes('@')) {
      return {
        email: search,
      };
    } else {
      return {
        fullNameOrDeviceId: search,
      };
    }
  })();

  return fetchPaginatedData<ICustomer>(
    `${baseUrl}/users`,
    {...filter, ...searchParams},
    {
      params: {
        sortBy: 'createdAt',
      },
    },
  );
};

export const getCustomerDetail = (UserId: string): Promise<ICustomer> => {
  return apiClient.get<ICustomer>(`${baseUrl}/users/${UserId}`).then((res) => {
    return {
      ...res.data,
      name: res.data?.name || '',
    };
  });
};

export function getCustomerLatestStoreOrders(
  pagination?: PaginationParams,
  filter?: IStoreOrdersFilter,
): Promise<IPaginationResult<IStoreOrder>> {
  return fetchPaginatedData<IStoreOrder>(
    `${environment.storeApiBaseUrl}/api/store-orders/admin/store-orders`,
    pagination,
    {
      params: {...filter},
    },
  );
}

export const getPaymentTransactions = (filter: ICustomerTransactions) => {
  const reqUrl = `${environment.paymentsApiBaseUrl}/api/payments/admin/transactions`;
  return apiClient
    .get<PaymentTransaction[]>(reqUrl, {params: filter})
    .then((res) => [...res.data])
    .catch((err) => Promise.reject({message: extractErrorWithConstraints(err)}));
};

export const filterCustomerName = (customers: ICustomerLite[]) => {
  const nameRaw = [];
  customers.forEach((element) => {
    nameRaw.push(element.name);
  });
  const name = nameRaw.join(', ');
  return nameRaw.length > 0 ? name.toString() : '-';
};

export const updateCustomer = (customers: IMutationCustomer) => {
  return apiClient
    .put<any>(
      `${environment.accountsApiBaseUrl}/api/merchants/admin/merchants/enterprise/users-merchant/${customers.id}`,
      customers,
    )
    .then((res) => res.data);
};

export const deleteCustomer = (userId: string): Promise<ICustomer> => {
  return apiClient
    .delete<ICustomer>(`${environment.opsApiBaseUrl}/api/ops/admin/admin-users/${userId}`)
    .then((res) => res.data);
};

export const getListCustomer = (req: ICustomerRequest = {}) => {
  return apiClient
    .get<ICustomer[]>(
      `${environment.accountsApiBaseUrl}/api/merchants/admin/merchants?perPage=${
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
          customer: res.data || [],
          totalDocs,
          totalPages,
          perPage,
          page,
        };
      }
      return null;
    });
};

export const validatePassword = (password: string): boolean => {
  const regex = new RegExp(RegexEnum.password);
  return regex.test(password);
};

export const getSetelShareHistoryByUserId = (userId: string, params: PaginationParams) => {
  const reqUrl = `${environment.circlesApiBaseUrl}/api/circles/admin/circles/users/${userId}/history?page=${params.page}&perPage=${params.perPage}`;
  return apiClient
    .get<CircleHistory[]>(reqUrl)
    .then((res) => {
      if (res && res.data && res.headers) {
        const {
          [TOTAL_COUNT_HEADER_NAME]: totalDocs,
          [PAGES_COUNT_HEADER_NAME]: totalPages,
          [PER_PAGE_HEADER_NAME]: perPage,
          [PAGE_HEADER_NAME]: page,
        } = res.headers;
        return {
          items: res.data || [],
          totalDocs,
          totalPages,
          perPage,
          page,
        };
      }
    })
    .catch((err) => Promise.reject({message: extractErrorWithConstraints(err)}));
};

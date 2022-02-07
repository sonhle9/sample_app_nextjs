import {AxiosRequestConfig} from 'axios';
import {environment} from 'src/environments/environment';
import {
  filterEmptyString,
  IPaginationParam,
  getData,
  IPaginationResult,
  ajax,
} from 'src/react/lib/ajax';
import {
  GetBnplPlanOptions,
  ICreateBnplPlan,
  IGetPlanConfigOverLapping,
  IPlan,
  IUpdatePlanStatus,
} from 'src/react/modules/bnpl-plan-config/bnpl.interface';
import {
  GetBnplAccountOptions,
  IBnplAccount,
} from 'src/react/modules/bnpl-account/bnpl-account.type';

const baseUrl = `${environment.bnplBaseUrl}/api/bnpl`;

export const fetchPaginatedBnpl = <Result>(
  url: string,
  pagination: IPaginationParam,
  options: AxiosRequestConfig = {},
) =>
  ajax<IPaginationResult<Result>>({
    url,
    ...options,
    params: {
      ...pagination,
      ...options.params,
    },
    select: ({data}) => {
      const items = data.items || [];

      return {
        items,
        isEmpty: items.length === 0,
        page: data?.meta?.page || 0,
        perPage: data?.meta?.perPage || 0,
        pageCount: data?.meta?.pageCount || 0,
        total: data?.meta?.total || 0,
      };
    },
  });

export const getBnplPlans = (options: GetBnplPlanOptions) =>
  fetchPaginatedBnpl<IPlan>(`${baseUrl}/plan-config`, filterEmptyString(options));

export const getBnplPlanDetails = (id: string) => getData<IPlan>(`${baseUrl}/plan-config/${id}`);

export const createBnplPlan = ({plan, approvedOverlap}: ICreateBnplPlan) => {
  if (approvedOverlap) {
    return ajax.post<IPlan>(`${baseUrl}/plan-config?approvedOverlap=${approvedOverlap}`, plan);
  }
  return ajax.post<IPlan>(`${baseUrl}/plan-config`, plan);
};

export const getPlanConfigOverLapping = (body: IGetPlanConfigOverLapping) =>
  fetchPaginatedBnpl<IPlan>(
    `${baseUrl}/plan-config/overlapping`,
    {},
    {
      method: 'POST',
      data: body,
    },
  );

export const updatePlanConfigStatus = ({id, data}: IUpdatePlanStatus) =>
  ajax.patch<IPlan>(`${baseUrl}/plan-config/${id}/status`, {status: data});

// Bnpl Accounts apis
export const getBnplAccounts = (options: GetBnplAccountOptions) =>
  fetchPaginatedBnpl<IBnplAccount>(`${baseUrl}/account`, filterEmptyString(options));

export const getBnplAccountDetails = (id: string) =>
  getData<IBnplAccount>(`${baseUrl}/account/${id}`);

interface UpdateBnplAccountStatusAndCreditLimit {
  id: string;
  status: string;
  creditLimit: number;
}
export const updateBnplAccountStatusAndCreditLimit = ({
  id,
  status,
  creditLimit,
}: UpdateBnplAccountStatusAndCreditLimit) =>
  ajax.patch<IBnplAccount>(`${baseUrl}/account/credit-limit/${id}`, {status, creditLimit});

export const getBnplAccountBills = (id: string, options: GetBnplAccountOptions) =>
  fetchPaginatedBnpl<IBnplAccount>(`${baseUrl}/account/${id}/bills`, filterEmptyString(options));

export const getBnplAccountTransactions = (id: string, options: GetBnplAccountOptions) =>
  fetchPaginatedBnpl<IBnplAccount>(`${baseUrl}/account/${id}/transactions`, filterEmptyString(options));

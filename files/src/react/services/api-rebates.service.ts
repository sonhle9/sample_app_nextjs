import {apiClient, getData} from 'src/react/lib/ajax';
import {TOTAL_COUNT_HEADER_NAME} from 'src/react/services/service.type';
import {environment} from '../../environments/environment';
import {IRequest} from '../modules/merchant-users/merchant-users.type';
import {
  IAccountOrCompany,
  ILoyaltyCategoryCodes,
  IRebatePlan,
  IRebatePlansRequest,
  IRebateReport,
  IRebateSettingBase,
  ISearchAccountOrCompanyRequest,
} from './api-rebates.type';

const rebateUrl = `${environment.rebatesApiBaseUrl}/api/rebates`;

export const getRebatePlans = async (req: IRebatePlansRequest = {}) => {
  const {data: rebatePlans, headers} = await apiClient.get<IRebatePlan[]>(
    `${rebateUrl}/rebate-plans`,
    {
      params: {
        perPage: req.perPage,
        page: req.page,
        searchRebatePlan: req.searchRebatePlan,
      },
    },
  );

  return {
    rebatePlans,
    total: headers[TOTAL_COUNT_HEADER_NAME],
  };
};

export const getRebatePlan = (id: string): Promise<IRebatePlan> =>
  apiClient.get<IRebatePlan>(`${rebateUrl}/rebate-plans/${id}`).then((res) => res.data);

export const createRebatePlan = (body: IRebatePlan) => {
  const createRebatePlanBody = {
    ...body,
    loyaltyCategoryIds: body.loyaltyCategoryIds.map(
      (loyaltyCategoryId) => loyaltyCategoryId.split(' - ')[0],
    ),
    tiers: body.tiers.map((tier) => {
      return {
        maximumValue: +tier.maximumValue,
        minimumValue: +tier.minimumValue,
        basicValue: +tier.basicValue,
        billedValue: +tier.billedValue,
      };
    }),
  };
  return apiClient
    .post<IRebatePlan>(`${rebateUrl}/rebate-plans`, createRebatePlanBody)
    .then((res) => res.data);
};

export const editRebatePlanGeneral = (body: IRebatePlan, planId: number) => {
  const editRebatePlanBody = {
    ...body,
    loyaltyCategoryIds: body.loyaltyCategoryIds.map(
      (loyaltyCategoryId) => loyaltyCategoryId.split(' - ')[0],
    ),
    tiers: body.tiers.map((tier) => {
      return {
        maximumValue: +tier.maximumValue,
        minimumValue: +tier.minimumValue,
        basicValue: +tier.basicValue,
        billedValue: +tier.billedValue,
      };
    }),
  };
  return apiClient
    .put(`${rebateUrl}/rebate-plans/${planId}`, editRebatePlanBody)
    .then((res) => res.data);
};

export const editRebatePlanTier = (body: IRebatePlan, planId: number) => {
  const editRebatePlanBody = {
    ...body,
    loyaltyCategoryIds: body.loyaltyCategoryIds.map(
      (loyaltyCategoryId) => loyaltyCategoryId.split(' - ')[0],
    ),
    tiers: body.tiers.map((tier) => {
      return {
        maximumValue: +tier.maximumValue,
        minimumValue: +tier.minimumValue,
        basicValue: +tier.basicValue,
        billedValue: +tier.billedValue,
      };
    }),
  };
  return apiClient
    .put<IRebatePlan>(`${rebateUrl}/rebate-plans/${planId}`, editRebatePlanBody)
    .then((res) => res.data);
};

export const getLoyaltyCategoryCodes = (searchString: string) =>
  apiClient
    .get<{
      items: ILoyaltyCategoryCodes[];
    }>(`${rebateUrl}/rebate-plans/loyalty-category-codes`, {
      params: {searchLoyaltyCategoryCode: searchString},
    })
    .then((res) => res.data);

export const getRebateSettings = async (req: IRebatePlansRequest = {}) => {
  const {data: rebateSettings, headers} = await apiClient.get<IRebateSettingBase[]>(
    `${rebateUrl}/rebate-settings`,
    {
      params: {
        perPage: req.perPage,
        page: req.page,
        searchSPAccountsCompanies: req.searchSPAccountsCompanies,
        status: req.status,
        level: req.level,
        planId: req.planId,
      },
    },
  );

  return {
    rebateSettings,
    total: +headers[TOTAL_COUNT_HEADER_NAME],
  };
};

export const createRebateSetting = (body: IRebateSettingBase) => {
  return apiClient
    .post<IRebateSettingBase>(`${rebateUrl}/rebate-settings`, body)
    .then((res) => res.data);
};

export const searchAccountOrCompany = (params: ISearchAccountOrCompanyRequest) =>
  apiClient
    .get<IAccountOrCompany[]>(`${rebateUrl}/rebate-settings/sp-accounts-companies`, {
      params,
    })
    .then((res) => res.data);

export const getRebateReports = async (req: IRequest = {}) => {
  const {data: rebateReports, headers} = await apiClient.get<IRebateReport[]>(
    `${rebateUrl}/rebate-reports`,
    {
      params: {
        perPage: req.perPage,
        page: req.page,
      },
    },
  );

  return {
    rebateReports,
    total: headers[TOTAL_COUNT_HEADER_NAME],
  };
};

export const getRebateReportDetailsCSV = (processDate: string) =>
  getData<string>(`${rebateUrl}/rebate-reports/${processDate}`, {
    headers: {
      accept: 'text/csv',
    },
  });

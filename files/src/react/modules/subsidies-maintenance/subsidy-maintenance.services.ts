import {apiClient} from '../../lib/ajax';
import {TOTAL_COUNT_HEADER_NAME} from '../../services/service.type';
import {
  CURRENT_TIME_HEADER_NAME,
  ISubsidyCostRecoveryRateParams,
  ISubsidyPriceParams,
  SubsidyCostRecoveryRate,
  SubsidyMaintenanceOverview,
  SubsidyOverviewTitle,
  SubsidyPrice,
} from './subsidy-maintenance.types';
import {useMalaysiaTime} from '../billing-invoices/billing-invoices.helpers';
import {environment} from 'src/environments/environment';

export const subsidyMaintenanceUrl = `${environment.subsidyBaseUrl}/api/subsidies/subsidy-maintenances`;

export const getSubsidyPrices = async (params: ISubsidyPriceParams) => {
  const {data: prices, headers} = await apiClient.get<SubsidyPrice[]>(
    `${subsidyMaintenanceUrl}/prices`,
    {
      params,
    },
  );

  return {
    prices,
    isEmpty: prices.length === 0,
    currentTime: headers[CURRENT_TIME_HEADER_NAME],
    total: headers[TOTAL_COUNT_HEADER_NAME],
  };
};

export const getSubsidyCostRecoveryRates = async (params: ISubsidyCostRecoveryRateParams) => {
  const {data: costRecoveryRates, headers} = await apiClient.get<SubsidyCostRecoveryRate[]>(
    `${subsidyMaintenanceUrl}/cost-recovery-rates`,
    {
      params,
    },
  );

  return {
    costRecoveryRates,
    isEmpty: costRecoveryRates.length === 0,
    total: headers[TOTAL_COUNT_HEADER_NAME],
    currentTime: headers[CURRENT_TIME_HEADER_NAME],
  };
};

export const getSubsidyMaintenanceOverview = async () => {
  const {data: overview} = await apiClient.get<SubsidyMaintenanceOverview[]>(
    `${subsidyMaintenanceUrl}/overview`,
  );
  return SubsidyOverviewTitle.map((titleItem) => {
    const overviewItem = overview.find((item) => titleItem.id === item.id);
    return overviewItem
      ? {
          title: titleItem.title,
          amount: overviewItem.amount,
          startDate: useMalaysiaTime(overviewItem.startDate),
        }
      : {title: titleItem.title, amount: 0};
  });
};

export const createSubsidyPrice = (subsidyPrice: SubsidyPrice): Promise<SubsidyPrice> =>
  apiClient
    .post<SubsidyPrice>(`${subsidyMaintenanceUrl}/prices`, subsidyPrice)
    .then((res) => res.data);

export const createSubsidyCostRecoveryRate = (
  costRecoveryRate: SubsidyCostRecoveryRate,
): Promise<SubsidyCostRecoveryRate> =>
  apiClient
    .post<SubsidyCostRecoveryRate>(`${subsidyMaintenanceUrl}/cost-recovery-rates`, costRecoveryRate)
    .then((res) => res.data);

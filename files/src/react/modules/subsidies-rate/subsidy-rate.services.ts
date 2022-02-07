import {apiClient} from '../../lib/ajax';
import {TOTAL_COUNT_HEADER_NAME} from '../../services/service.type';
import {useMalaysiaTime} from '../billing-invoices/billing-invoices.helpers';
import {environment} from 'src/environments/environment';
import {ISubsidyRateParams, SubsidyRate, SubsidyRateOverview} from './subsidy-rate.types';
import {SubsidyOverviewTitle} from '../subsidies-maintenance/subsidy-maintenance.types';

export const subsidyRateUrl = `${environment.subsidyBaseUrl}/api/subsidies/subsidy-rates`;

export const getSubsidyRates = async (params: ISubsidyRateParams) => {
  const {data: rates, headers} = await apiClient.get<SubsidyRate[]>(`${subsidyRateUrl}`, {
    params,
  });

  return {
    rates,
    isEmpty: rates.length === 0,
    total: headers[TOTAL_COUNT_HEADER_NAME],
  };
};

export const getSubsidyRateOverview = async () => {
  const {data: overview} = await apiClient.get<SubsidyRateOverview[]>(`${subsidyRateUrl}/overview`);
  return SubsidyOverviewTitle.map((titleItem) => {
    const overviewItem = overview.find((item) => titleItem.id === item.id);
    return overviewItem
      ? {
          title: titleItem.title,
          amount: overviewItem.rate,
          startDate: useMalaysiaTime(overviewItem.startDate),
        }
      : {title: titleItem.title, amount: 0};
  });
};

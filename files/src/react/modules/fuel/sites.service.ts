import {environment} from '../../../environments/environment';
import {apiClient} from '../../../react/lib/ajax';
import {
  SitesFuelPriceSyncResponse,
  SitesFuelPriceSyncRequest,
  SitesFuelPriceSyncStatisticsResponse,
} from './types';

export const getSites = async (param: SitesFuelPriceSyncRequest) =>
  apiClient
    .get<{
      docs: SitesFuelPriceSyncResponse[];
      totalDocs: number;
      limit: number;
      page: number;
      totalPages: number;
      pagingCounter: number;
    }>(`${environment.sitesBaseUrl}/api/sites/fuel-price-sync`, {
      params: {
        fuelPriceId: param.fuelPriceId,
        keyWord: param.keyWord,
        page: param.page,
        perPage: param.perPage,
        status: param.status,
      },
    })
    .then((r) => r.data);

export const getFuelPriceSyncStatistics = async (fuelPriceId: string) =>
  apiClient
    .get<SitesFuelPriceSyncStatisticsResponse>(
      `${environment.sitesBaseUrl}/api/sites/fuel-price-sync/statistics`,
      {
        params: {
          fuelPriceId,
        },
      },
    )
    .then((r) => r.data);

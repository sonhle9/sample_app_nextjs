import {useQuery} from 'react-query';

import {SitesFuelPriceSyncStatisticsResponse} from './types';
import {getFuelPriceSyncStatistics} from './sites.service';

const FUEL_PRICE_SYNC_STATISTICS = 'fuel_price_sync_statistics';

export const useFuelPriceSyncStatistic = (fuelPriceId: string) => {
  return useQuery<SitesFuelPriceSyncStatisticsResponse>(
    [FUEL_PRICE_SYNC_STATISTICS, fuelPriceId],
    () => getFuelPriceSyncStatistics(fuelPriceId),
  );
};

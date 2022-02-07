import {useQuery} from 'react-query';

import {getSubsidyRates, getSubsidyRateOverview} from './subsidy-rate.services';

const SUBSIDY_RATE_OVERVIEW_KEY = 'SUBSIDY_RATE_OVERVIEW_KEY';
const SUBSIDY_RATE_KEY = 'SUBSIDY_PRICE_KEY';

export const useSubsidyRates = (filter: Parameters<typeof getSubsidyRates>[0]) => {
  return useQuery([SUBSIDY_RATE_KEY, filter], () => getSubsidyRates(filter), {
    keepPreviousData: true,
  });
};

export const useSubsidyRateOverview = () => {
  return useQuery([SUBSIDY_RATE_OVERVIEW_KEY], () => getSubsidyRateOverview(), {
    keepPreviousData: true,
  });
};

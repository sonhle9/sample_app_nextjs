import {useMutation, useQuery, useQueryClient} from 'react-query';

import {
  createSubsidyCostRecoveryRate,
  createSubsidyPrice,
  getSubsidyCostRecoveryRates,
  getSubsidyMaintenanceOverview,
  getSubsidyPrices,
} from './subsidy-maintenance.services';

const SUBSIDY_MAINTENANCE_OVERVIEW_KEY = 'SUBSIDY_MAINTENANCE_OVERVIEW_KEY';
const SUBSIDY_PRICE_KEY = 'SUBSIDY_PRICE_KEY';
const SUBSIDY_COST_RECOVERY_RATE_KEY = 'SUBSIDY_COST_RECOVERY_RATE_KEY';

export const useSubsidyPrices = (filter: Parameters<typeof getSubsidyPrices>[0]) => {
  return useQuery([SUBSIDY_PRICE_KEY, filter], () => getSubsidyPrices(filter), {
    keepPreviousData: true,
  });
};

export const useSubsidyCostRecoveryRate = (
  filter: Parameters<typeof getSubsidyCostRecoveryRates>[0],
) => {
  return useQuery(
    [SUBSIDY_COST_RECOVERY_RATE_KEY, filter],
    () => getSubsidyCostRecoveryRates(filter),
    {
      keepPreviousData: true,
    },
  );
};

export const useSubsidyMaintenanceOverview = () => {
  return useQuery([SUBSIDY_MAINTENANCE_OVERVIEW_KEY], () => getSubsidyMaintenanceOverview(), {
    keepPreviousData: true,
  });
};

export const useCreateSubsidyPrice = () => {
  const queryClient = useQueryClient();
  return useMutation((data: Parameters<typeof createSubsidyPrice>[0]) => createSubsidyPrice(data), {
    onSuccess: (newParam) => {
      if (newParam) {
        queryClient.invalidateQueries([SUBSIDY_PRICE_KEY]).then(() => {});
        queryClient.invalidateQueries([SUBSIDY_MAINTENANCE_OVERVIEW_KEY]).then(() => {});
      }
    },
  });
};

export const useCreateSubsidyCostRecoveryRate = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data: Parameters<typeof createSubsidyCostRecoveryRate>[0]) =>
      createSubsidyCostRecoveryRate(data),
    {
      onSuccess: (newParam) => {
        if (newParam) {
          queryClient.invalidateQueries([SUBSIDY_COST_RECOVERY_RATE_KEY]).then(() => {});
          queryClient.invalidateQueries([SUBSIDY_MAINTENANCE_OVERVIEW_KEY]).then(() => {});
        }
      },
    },
  );
};

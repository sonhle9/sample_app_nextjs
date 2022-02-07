import {useQuery, useQueryClient} from 'react-query';
import {
  getMT940Report,
  getMT940Reports,
  getMT940ReportTransactions,
} from 'src/react/services/api-processor.service';

export const useMT940ReportsListing = (pagination: Parameters<typeof getMT940Reports>[0]) => {
  const queryClient = useQueryClient();
  return useQuery([CACHE_KEYS.mt940Reports, pagination], () => getMT940Reports(pagination), {
    onSuccess: (data) => {
      if (data && data.items) {
        data.items.forEach((item) => {
          queryClient.setQueryData([CACHE_KEYS.mt940Reports, item.id], item);
        });
      }
    },
    keepPreviousData: true,
  });
};

export const useMT940Details = (id: string) => {
  return useQuery([CACHE_KEYS.mt940Reports, id], () => getMT940Report(id));
};

export const useMT940ReportTransactions = (
  id: string,
  filters: Parameters<typeof getMT940ReportTransactions>[1],
) => {
  return useQuery([CACHE_KEYS.mt940ReportTransactions, {id, filters}], () =>
    getMT940ReportTransactions(id, filters),
  );
};

const CACHE_KEYS = {
  mt940Reports: 'MT940_REPORTS',
  mt940ReportTransactions: 'MT940_REPORT_TRANSACTIONS',
};

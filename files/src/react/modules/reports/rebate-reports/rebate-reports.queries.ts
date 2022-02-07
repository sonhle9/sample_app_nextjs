import {useQuery} from 'react-query';
import {getRebateReports} from '../../../services/api-rebates.service';

const REBATE_REPORTS_LISTING_KEY = 'rebateReportsListing';

export const useRebateReports = (filter: Parameters<typeof getRebateReports>[0]) => {
  return useQuery([REBATE_REPORTS_LISTING_KEY, filter], () => getRebateReports(filter), {
    keepPreviousData: true,
  });
};

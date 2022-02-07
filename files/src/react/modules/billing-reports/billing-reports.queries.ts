import {useMutation, useQuery} from 'react-query';
import {getReportDataCustom, getReportsCSV} from './billing-reports.services';

const REPORT_BILLING_LIST = 'REPORT_BILLING_LIST';

export const useReportDataCustom = (options: Parameters<typeof getReportDataCustom>[0]) => {
  return useQuery([REPORT_BILLING_LIST, options], () => getReportDataCustom(options), {
    keepPreviousData: true,
  });
};

export const useDownloadReportCsv = () => {
  return useMutation((options: Parameters<typeof getReportsCSV>[0]) => {
    return getReportsCSV(options);
  });
};

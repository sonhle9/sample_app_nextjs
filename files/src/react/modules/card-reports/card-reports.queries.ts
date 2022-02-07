import {useQuery} from 'react-query';
import {
  getReportConfigByCategoryAndUrl,
  getReportDataCustom,
  getSnapshotReports,
} from './card-reports.service';

const REPORT_LIST = 'REPORT_LIST';
const CARD_REPORT_DETAILS = 'CARD_REPORT_DETAILS';
const SNAPSHOT_REPORT = 'SNAPSHOT_REPORT ';

export const useReportDataCustom = (options: Parameters<typeof getReportDataCustom>[0]) => {
  return useQuery([REPORT_LIST, options], () => getReportDataCustom(options), {
    keepPreviousData: true,
  });
};

export const useCardReportsDetails = (category: string, url: string) => {
  return useQuery([CARD_REPORT_DETAILS, {category, url}], () =>
    getReportConfigByCategoryAndUrl(category, url),
  );
};

export const useSnapshotReport = (options: Parameters<typeof getSnapshotReports>[0]) => {
  return useQuery([SNAPSHOT_REPORT, options], () => getSnapshotReports(options), {
    keepPreviousData: true,
  });
};

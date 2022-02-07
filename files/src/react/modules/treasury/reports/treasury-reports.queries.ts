import moment from 'moment';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {
  emailTrusteeReport,
  getReportsDetails,
  indexReports,
  SendMailData,
  updateReport,
} from 'src/react/services/api-ledger.service';
import {getPayoutMax, getPayoutProjection} from 'src/react/services/api-processor.service';
import {ILedgerReport} from '../../../../app/ledger/ledger.interface';
import {OnDemandReportCategory} from '../../../services/api-reports.enum';
import {
  getReportConfigByCategory,
  getReportConfigByCategoryAndUrl,
} from '../../../services/api-reports.service';

export const useTreasuryReportsListing = () => {
  return useQuery([CACHE_KEYS.treasuryReportsHollisticsData], () =>
    getReportConfigByCategory(OnDemandReportCategory.TREASURY),
  );
};

export const useTreasuryReportsDetails = (category: OnDemandReportCategory, url: string) => {
  return useQuery([CACHE_KEYS.treasuryReportsDetails, {category, url}], () =>
    getReportConfigByCategoryAndUrl(category, url),
  );
};

export const useReports = (pagination: Parameters<typeof indexReports>[0]) => {
  const queryClient = useQueryClient();
  return useQuery([CACHE_KEYS.Reports, pagination], () => indexReports(pagination), {
    onSuccess: (data) => {
      if (data && data.items) {
        data.items.forEach((report) => {
          queryClient.setQueryData([CACHE_KEYS.ReportDetails, report.id], report);
        });
      }
    },
    keepPreviousData: true,
  });
};

export const useReportsDetails = (id: string) => {
  return useQuery([CACHE_KEYS.ReportDetails, id], () => getReportsDetails(id));
};

export const useEmailTrusteeReport = () =>
  useMutation((data: SendMailData) => emailTrusteeReport(data));

export const useUpdateReport = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation((data: Partial<ILedgerReport>) => updateReport(id, data), {
    onSettled: () => {
      queryClient.invalidateQueries([CACHE_KEYS.Reports]);
      queryClient.invalidateQueries([CACHE_KEYS.ReportDetails, id]);
    },
  });
};

export const usePayoutProjection = () => {
  const referenceMoment = moment().utc().add(moment().utcOffset(), 'm').startOf('day');
  return useQuery(
    [CACHE_KEYS.payoutProjection],
    () => getPayoutProjection(referenceMoment.toISOString()),
    {
      keepPreviousData: true,
      refetchIntervalInBackground: false,
      refetchInterval: false,
    },
  );
};

export const usePayoutMax = () => {
  return useQuery([CACHE_KEYS.payoutMax], () => getPayoutMax(), {
    keepPreviousData: true,
    refetchIntervalInBackground: false,
    refetchInterval: false,
  });
};

const CACHE_KEYS = {
  treasuryReportsHollisticsData: 'TREASURY_REPORTS_HOLLISTICS_DATA',
  treasuryReportsDetails: 'TREASURY_REPORTS_DETAILS',
  Reports: 'REPORTS',
  ReportDetails: 'ReportDetails',
  payoutProjection: 'PayoutProjection',
  payoutMax: 'PayoutMax',
};

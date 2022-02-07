import {useMutation, useQuery, useQueryClient, UseMutationOptions} from 'react-query';
import {
  createOnDemandReportConfig,
  deleteOnDemandReportConfig,
  getOnDemandReportConfig,
  getOnDemandReportConfigs,
  getReportData,
  getReportDataPreview,
  getReportPresignedUrl,
  sendReport,
  updateOnDemandReportConfig,
} from 'src/react/services/api-reports.service';

export const useCreateOnDemandReportConfig = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data: Parameters<typeof createOnDemandReportConfig>[0]) => createOnDemandReportConfig(data),
    {
      onSuccess: (newParam) => {
        if (newParam) {
          queryClient.invalidateQueries([CACHE_KEYS.onDemandReportConfig]);
          queryClient.setQueryData([CACHE_KEYS.onDemandReportConfig, newParam.id], newParam);
        }
      },
    },
  );
};

export const useOnDemandReportConfigs = () => {
  return useQuery([CACHE_KEYS.onDemandReportConfig], () => getOnDemandReportConfigs());
};

export const useOnDemandReportConfig = (id: string) => {
  return useQuery([CACHE_KEYS.onDemandReportConfig, id], () => getOnDemandReportConfig(id));
};

export const useDeleteOnDemandReportConfig = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation(() => deleteOnDemandReportConfig(id), {
    onSuccess: (newParam) => {
      if (newParam) {
        queryClient.invalidateQueries([CACHE_KEYS.onDemandReportConfig]);
      }
    },
  });
};

export const useUpdateOnDemandReportConfig = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    (data: Parameters<typeof updateOnDemandReportConfig>[1]) =>
      updateOnDemandReportConfig(id, data),
    {
      onSuccess: (newParam) => {
        if (newParam) {
          queryClient.invalidateQueries([CACHE_KEYS.onDemandReportConfig]);
          queryClient.setQueryData([CACHE_KEYS.onDemandReportConfig, newParam.id], newParam);
        }
      },
    },
  );
};

type GetReportOptions = Parameters<typeof getReportData>[0] & {
  staleTime?: number;
};

export const useReportData = ({staleTime = A_DAY, ...options}: GetReportOptions) => {
  return useQuery([CACHE_KEYS.report, options], () => getReportData(options), {
    staleTime,
    keepPreviousData: true,
  });
};

export const useReportDownloadUrl = (generationId: string) => {
  return useQuery(
    [CACHE_KEYS.reportDownloadUrl, generationId],
    () => getReportPresignedUrl(generationId),
    {
      staleTime: Infinity,
    },
  );
};

type SendReportParams = Parameters<typeof sendReport>;

export const useSendReport = (
  reportName: string,
  config?: UseMutationOptions<unknown, unknown, Omit<SendReportParams[0], 'reportName'>>,
) => {
  return useMutation(
    (data) =>
      sendReport({
        ...data,
        reportName,
      }),
    config,
  );
};

type GetDataPreviewOptions = Parameters<typeof getReportDataPreview>[0];

export const useReportDataPreview = (options: GetDataPreviewOptions) =>
  useQuery([CACHE_KEYS.reportPreview, options], () => getReportDataPreview(options), {
    staleTime: 1000,
  });

const A_DAY = 24 * 60 * 60 * 1000;

const CACHE_KEYS = {
  report: 'ON_DEMAND_REPORT',
  reportPreview: 'ON_DEMAND_REPORT_PREVIEW',
  reportDownloadUrl: 'ON_DEMAND_REPORT_DOWNLOAD_URL',
  onDemandReportConfig: 'ON_DEMAND_REPORT_CONFIG',
};

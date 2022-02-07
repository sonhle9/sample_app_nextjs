import {useMutation, useQuery, useQueryClient} from 'react-query';
import {
  createSnapshotReportConfig,
  deleteSnapshotReportConfig,
  getSnapshotReportConfig,
  getSnapshotReportConfigByFolderName,
  getSnapshotReportConfigs,
  getSnapshotReports,
  updateSnapshotReportConfig,
} from 'src/react/services/api-reports.service';
import {SnapshotReportConfigData} from 'src/react/services/api-reports.type';

export const useSnapshotReportConfigs = () =>
  useQuery([CACHE_KEYS.config], getSnapshotReportConfigs);

export const useSnapshotReportConfig = (id: string) =>
  useQuery([CACHE_KEYS.config, id], () => getSnapshotReportConfig(id));

export const useSnapshotReportConfigByFolderName = (folderName: string) =>
  useQuery([CACHE_KEYS.configByFolder, folderName], () =>
    getSnapshotReportConfigByFolderName(folderName),
  );

export const useCreateReportConfig = () => {
  const queryClient = useQueryClient();
  return useMutation(createSnapshotReportConfig, {
    onSuccess: (newConfig) => {
      queryClient.invalidateQueries(CACHE_KEYS.config);
      queryClient.setQueryData([CACHE_KEYS.config, newConfig.id], newConfig);
    },
  });
};

export const useUpdateReportConfig = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation((data: SnapshotReportConfigData) => updateSnapshotReportConfig(id, data), {
    onSuccess: (newConfig) => {
      queryClient.invalidateQueries(CACHE_KEYS.config);
      queryClient.setQueryData([CACHE_KEYS.config, newConfig.id], newConfig);
    },
  });
};

export const useDeleteSnapshotReportConfig = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation(() => deleteSnapshotReportConfig(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(CACHE_KEYS.config);
    },
  });
};

export const useSnapshotReport = (folderName: string) =>
  useQuery([CACHE_KEYS.data, folderName], () => getSnapshotReports(folderName));

const CACHE_KEYS = {
  config: 'SNAPSHOT_REPORT_CONFIG',
  configByFolder: 'SNAPSHOT_REPORT_CONFIG_BY_FOLDER',
  data: 'SNAPSHOT_REPORT_DATA',
};

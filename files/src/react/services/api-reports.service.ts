import {environment} from 'src/environments/environment';
import {apiClient, getData, IPaginationParam} from '../lib/ajax';
import {OnDemandReportCategory} from './api-reports.enum';
import {
  IOnDemandReportConfig,
  ISnapshotReportConfig,
  OnDemandReportData,
  ReportData,
  ReportMapping,
  SnapshotReportConfigData,
  ISnapshotReportData,
  ISnapshotParams,
} from './api-reports.type';

const BASE_URL = `${environment.reportsBaseUrl}/api/reports`;

export const createOnDemandReportConfig = (data: OnDemandReportData) =>
  apiClient
    .post<IOnDemandReportConfig>(`${BASE_URL}/on-demand/report-config`, data)
    .then((res) => res.data);

export const getOnDemandReportConfigs = () =>
  getData<IOnDemandReportConfig[]>(`${BASE_URL}/on-demand/report-config`);

export const getReportConfigByCategory = (category: OnDemandReportCategory) =>
  getData<IOnDemandReportConfig[]>(`${BASE_URL}/on-demand/report-config/category/${category}`);

export const getReportConfigByCategoryAndUrl = (category: OnDemandReportCategory, url: string) =>
  getData<IOnDemandReportConfig>(`${BASE_URL}/on-demand/report-config/category/${category}/${url}`);

export const getOnDemandReportConfig = (id: string) =>
  getData<IOnDemandReportConfig>(`${BASE_URL}/on-demand/report-config/${id}`);

export const deleteOnDemandReportConfig = (id: string) =>
  apiClient
    .delete<IOnDemandReportConfig>(`${BASE_URL}/on-demand/report-config/${id}`)
    .then((res) => res.data);

export const updateOnDemandReportConfig = (id: string, data: OnDemandReportData) =>
  apiClient
    .put<IOnDemandReportConfig>(`${BASE_URL}/on-demand/report-config/${id}`, data)
    .then((res) => res.data);

export const getReportData = (
  options: {category: string; url: string} & IPaginationParam & {
      date_range_start: string;
      date_range_end: string;
    },
) =>
  getData<Array<ReportData & ReportMapping>>(
    `${BASE_URL}/on-demand/report-config/category/${options.category}/${options.url}/data`,
    {
      params: {
        perPage: options.perPage,
        page: options.page,
        date_range_start: options.date_range_start,
        date_range_end: options.date_range_end,
      },
    },
  );

export const sendReport = (data: {
  emails: string[];
  reportName: string;
  filter: Record<string, string>;
}) =>
  apiClient
    .post(
      `${BASE_URL}/on-demand/report-request/sendReport`,
      {
        emails: data.emails,
        reportName: data.reportName,
      },
      {
        params: data.filter,
      },
    )
    .then((res) => res.data);

export const getReportPresignedUrl = (generationId: string) =>
  getData<{url: string; fileName?: string}>(
    `${BASE_URL}/on-demand/report-generation/${generationId}/getUrl`,
  );

export const getReportDataPreview = ({
  reportId,
  params = {},
}: {
  reportId: string;
  params: Record<string, string | number>;
}) =>
  getData<ReportData>(`${BASE_URL}/on-demand/report-config/preview/${reportId}`, {
    params: {
      page: 1,
      perPage: 10,
      ...params,
    },
  });

export const createSnapshotReportConfig = (data: SnapshotReportConfigData) =>
  apiClient
    .post<ISnapshotReportConfig>(`${BASE_URL}/snapshot/report-config`, data)
    .then((res) => res.data);

export const updateSnapshotReportConfig = (id: string, data: SnapshotReportConfigData) =>
  apiClient
    .put<ISnapshotReportConfig>(`${BASE_URL}/snapshot/report-config/${id}`, data)
    .then((res) => res.data);

export const getSnapshotReportConfigs = () =>
  getData<ISnapshotReportConfig[]>(`${BASE_URL}/snapshot/report-config`);

export const getSnapshotReportConfig = (id: string) =>
  getData<ISnapshotReportConfig>(`${BASE_URL}/snapshot/report-config/${id}`);

export const getSnapshotReportConfigByFolderName = (folderName: string) =>
  getData<ISnapshotReportConfig>(`${BASE_URL}/snapshot/report-config/folderName/${folderName}`);

export const deleteSnapshotReportConfig = (id: string) =>
  apiClient
    .delete<ISnapshotReportConfig>(`${BASE_URL}/snapshot/report-config/${id}`)
    .then((res) => res.data);

export const getSnapshotReports = (folderName: string, params?: ISnapshotParams) =>
  getData<ISnapshotReportData[]>(`${BASE_URL}/snapshot/report/configFolder/${folderName}/list`, {
    params,
  });

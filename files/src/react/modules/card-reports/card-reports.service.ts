import {environment} from 'src/environments/environment';
import {getData, IPaginationParam} from 'src/react/lib/ajax';
import {
  IOnDemandReportConfig,
  ISnapshotReportData,
  ReportData,
  ReportMapping,
} from 'src/react/services/api-reports.type';
import {ISnapshotReportsRequest} from './card-reports.type';

const reportApiBaseUrl = `${environment.reportsBaseUrl}/api/reports`;

export const getReportDataCustom = (
  options: {category: string; url: string} & IPaginationParam & {
      expiryDate?: string;
      status?: string;
      cardgroupId?: string;
    },
) => {
  const {category, url, ...params} = options;
  return getData<Array<ReportData & ReportMapping>>(
    `${reportApiBaseUrl}/on-demand/report-config/category/${options.category}/${options.url}/data`,
    {
      params,
    },
  );
};

export const getReportConfigByCategoryAndUrl = (category: string, url: string) => {
  return getData<IOnDemandReportConfig>(
    `${reportApiBaseUrl}/on-demand/report-config/category/${category}/${url}`,
  );
};

export const getSnapshotReports = ({folderName, ...params}: ISnapshotReportsRequest) => {
  return getData<ISnapshotReportData[]>(
    `${reportApiBaseUrl}/snapshot/report/configFolder/${folderName}/list`,
    {
      params,
    },
  );
};

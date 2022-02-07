import {environment} from 'src/environments/environment';
import {getData, IPaginationParam} from 'src/react/lib/ajax';
import {ReportData, ReportMapping} from 'src/react/services/api-reports.type';
import {formatParameters} from 'src/shared/helpers/common';

const reportApiBaseUrl = `${environment.reportsBaseUrl}/api/reports`;

type Options = IPaginationParam & {
  category: string;
  url: string;
  merchantId?: string;
};

export const getReportDataCustom = (options: Options) => {
  const {category, url, ...params} = options;
  return getData<Array<ReportData & ReportMapping>>(
    `${reportApiBaseUrl}/on-demand/report-config/category/${category}/${url}/data`,
    {
      params: formatParameters(params),
    },
  );
};

export const getReportsCSV = (options: Options) => {
  const {category, url, ...params} = options;

  return getData<string>(`${reportApiBaseUrl}/on-demand/report-download/${url}/csv`, {
    headers: {
      accept: 'text/csv',
    },
    params: formatParameters(params),
  });
};

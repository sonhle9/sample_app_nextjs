import _ from 'lodash';
import {environment} from 'src/environments/environment';
import {apiClient, filterEmptyString, getData} from 'src/react/lib/ajax';
import {downloadFile, formatUrlWithQuery} from 'src/react/lib/utils';
import {TOTAL_COUNT_HEADER_NAME} from 'src/react/services/service.type';
import {
  IMonthlyCardSalesReportFilter,
  MonthlyCardSaleReportResponseDTO,
} from './terminal-switch-monthly-card-sales-report.type';

export const MONTHLY_CARD_SALES_REPORT_BASE_URL = `${environment.terminalSwitchApiBaseUrl}/api/terminal-switch/admin/monthly-card-sale-reports`;

export const terminalSwitchMonthlyCardSalesReport = async (
  filter: IMonthlyCardSalesReportFilter,
) => {
  try {
    const result = await apiClient.get<MonthlyCardSaleReportResponseDTO[]>(
      MONTHLY_CARD_SALES_REPORT_BASE_URL,
      {
        params: filterEmptyString(filter),
      },
    );
    const {data: monthlyCardSalesReport, headers} = result;
    return {
      monthlyCardSalesReport,
      total: headers[TOTAL_COUNT_HEADER_NAME],
    };
  } catch (e) {
    return {
      monthlyCardSalesReport: [],
      total: 0,
    };
  }
};

export const downloadTerminalSwitchMonthlyCardSalesReport = async (
  filter: Parameters<typeof terminalSwitchMonthlyCardSalesReport>[0],
) => {
  const genDownloadSession = `${MONTHLY_CARD_SALES_REPORT_BASE_URL}/downloads`;
  const queryParams = _.mapValues(_.pickBy(filter, _.identity));
  const {data} = await apiClient.post<{id: string}>(genDownloadSession);
  const downloadUrl = formatUrlWithQuery(
    `${MONTHLY_CARD_SALES_REPORT_BASE_URL}/downloads/${data.id}`,
    queryParams as Record<string, string | string[]>,
  );
  const csvData = await getData<string>(downloadUrl, {
    responseType: 'blob' as 'json',
    headers: {
      accept: 'text/csv',
    },
  });
  return downloadFile(csvData, 'terminal-switch-monthly-card-sales-report.csv');
};

export const sentTerminalSwitchMonthlyCardSalesReportViaEmail = async (
  emails: string[],
  filter: Parameters<typeof terminalSwitchMonthlyCardSalesReport>[0],
) => {
  const queryParams = _.mapValues(_.pickBy(filter, _.identity));
  const url = `${MONTHLY_CARD_SALES_REPORT_BASE_URL}/send-email`;
  return apiClient.post(
    url,
    {
      emails,
    },
    {
      params: queryParams,
    },
  );
};

import {environment} from 'src/environments/environment';
import {apiClient, getData, fetchPaginatedData} from 'src/react/lib/ajax';
import {formatUrlWithQuery} from 'src/react/lib/utils';
import {downloadFileFromLink} from 'src/react/lib/utils';
import {
  IExceptionFilterRequest,
  IExceptionTransactionsFilterRequest,
  IPosBatchUploadReport,
  IPosBatchUploadTransactionsReport,
  IReconciliation,
  IReconciliationFilterRequest,
} from './api-settlements.type';

const apiSettlement = `${environment.settlementsApiBaseUrl}/api/settlements`;

export const getExceptions = async (filter: IExceptionFilterRequest = {}) => {
  if (filter.createdAtFrom?.length === 0) {
    filter.createdAtFrom = undefined;
  }
  if (filter.createdAtTo?.length === 0) {
    filter.createdAtTo = undefined;
  }
  const data = await fetchPaginatedData<IPosBatchUploadReport>(
    `${apiSettlement}/admin/pos-batch-upload-reports`,
    {
      page: filter.page,
      perPage: filter.perPage,
    },
    {
      params: filter,
    },
  );
  return {
    exceptions: data.items,
    total: data.total,
  };
};

export const getExceptionDetails = async (reportId: string) =>
  getData<IPosBatchUploadReport>(`${apiSettlement}/admin/pos-batch-upload-reports/${reportId}`);

export const getExceptionTransactions = async (filter: IExceptionTransactionsFilterRequest) => {
  const data = await fetchPaginatedData<IPosBatchUploadTransactionsReport>(
    `${apiSettlement}/admin/pos-batch-upload-reports/${filter.id}/transactions`,
    {perPage: filter.perPage, page: filter.page},
    {params: filter},
  );
  return {transactions: data.items, total: data.total};
};

export const getReconciliations = async (filter: IReconciliationFilterRequest = {}) => {
  if (filter.createdAtFrom?.length === 0) {
    filter.createdAtFrom = undefined;
  }
  if (filter.createdAtTo?.length === 0) {
    filter.createdAtTo = undefined;
  }
  const data = await fetchPaginatedData<IReconciliation>(
    `${apiSettlement}/admin/pos-settlement-reports`,
    {
      page: filter.page,
      perPage: filter.perPage,
    },
    {
      params: filter,
    },
  );

  return {
    reconciliations: data.items,
    total: data.total,
  };
};

export const getReconciliationDetail = (reportId: string) =>
  getData<IReconciliation>(`${apiSettlement}/admin/pos-settlement-reports/${reportId}`);

export const sendReportViaEmail = async (
  reportType: 'Reconciliation' | 'Exception',
  emails: string[],
  filter?: IReconciliationFilterRequest | IExceptionFilterRequest,
) => {
  const endpoint =
    reportType === 'Reconciliation' ? 'pos-settlement-reports' : 'pos-batch-upload-reports';
  const url = `${apiSettlement}/admin/${endpoint}/send-email`;
  return apiClient.post(
    url,
    {
      emails,
    },
    {
      params: filter,
    },
  );
};

export const downloadReportCSV = async (
  reportType: 'Reconciliation' | 'Exception',
  filter?: IReconciliationFilterRequest | IExceptionFilterRequest,
) => {
  const endpoint =
    reportType === 'Reconciliation' ? 'pos-settlement-reports' : 'pos-batch-upload-reports';
  const genDownloadSessionUrl = `${apiSettlement}/admin/${endpoint}/download-request`;
  const {data} = await apiClient.put<{id: string}>(genDownloadSessionUrl);
  const downloadUrl = formatUrlWithQuery(
    `${apiSettlement}/admin/${endpoint}/download/${data.id}`,
    filter as Record<string, string | string[]>,
  );
  return downloadFileFromLink(downloadUrl, `${reportType}.csv`);
};

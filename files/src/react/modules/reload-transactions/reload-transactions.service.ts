import {environment} from 'src/environments/environment';
import {apiClient} from 'src/react/lib/ajax';
import {
  Transaction,
  IReloadTransactionRequest,
  IEmailTransactionInput,
  ISendEmailResponse,
} from './reload-transactions.type';
import {TOTAL_COUNT_HEADER_NAME} from 'src/react/services/service.type';

const baseUrl = `${environment.accountsApiBaseUrl}/api/reloads`;
const baseReportUrl = `${environment.reportsBaseUrl}/api/reports`;

const getParams = (req: IReloadTransactionRequest) => {
  return {
    search: req.search || undefined,
    perPage: req.perPage,
    page: req.page,
    status: req?.status || undefined,
    types: req.types || undefined,
    reloadName: req.reloadName || undefined,
    filterByTime: 'createdAt',
    timeFrom: req?.timeFrom || undefined,
    timeTo: req?.timeTo || new Date().toISOString(),
  };
};

const getParamsReport = (req: any) => {
  return {
    enterpriseId: environment.enterprise,
    search: req.search || 'ANY',
    status: req?.status || 'ANY',
    type: req.type || 'ANY',
    date_range_start: req?.timeFrom || '1970-01-01',
    date_range_end: req?.timeTo || new Date().toISOString(),
    dateSend: new Date().toISOString(),
  };
};

export const getTransactions = async (req: IReloadTransactionRequest = {}) => {
  const {data: transactions, headers} = await apiClient.get<Transaction[]>(
    `${baseUrl}/admin/transactions`,
    {
      params: getParams(req),
    },
  );

  return {
    transactions,
    total: headers[TOTAL_COUNT_HEADER_NAME],
  };
};

export const sendEmail = (data: IEmailTransactionInput) => {
  const {emails, ...params} = data;
  return apiClient
    .post<ISendEmailResponse>(
      `${baseReportUrl}/on-demand/report-request/sendReport`,
      {
        emails,
        reportName: 'Reload transactions',
        format: 'csv',
      },
      {
        params: getParamsReport(params),
      },
    )
    .then((res) => res.data);
};

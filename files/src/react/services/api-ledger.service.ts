import {ILedgerAdjustments, ILedgerReport} from 'src/app/ledger/ledger.interface';
import {ReportTypes} from 'src/app/ledger/pages/reports/reports.enum';
import {environment} from 'src/environments/environment';
import {apiClient, fetchPaginatedData, getData, IPaginationParam} from 'src/react/lib/ajax';
import {sanitizeObject} from 'src/shared/helpers/sanitizeObject';
import {
  LedgerTransactionStatus,
  TransactionSubTypes,
  TransactionTypes,
} from '../modules/ledger/ledger-transactions/ledger-transactions.enums';
import {
  GeneralLedgerParameterStatus,
  IGeneralLedgerParameter,
  IGeneralLedgerPostingException,
  GeneralLedgerProfileFilterBy,
  SearchBy,
  ILedgerTransaction,
  ISapPostingHistory,
  IFeeSettings,
  IGeneralLedgerPosting,
  IReceivable,
  IReceivableException,
  IReceivableReconciliation,
  IDailySummary,
} from './api-ledger.type';

const BASE_URL = `${environment.ledgerApiBaseUrl}/api/ledger`;

type GeneralLedgerRectifyData = {
  ids: string[];
  parameterId: string;
};

export const getGeneralLedgerParameters = (
  pagination: IPaginationParam & {
    searchBy: SearchBy;
    searchKey: string;
    status: GeneralLedgerParameterStatus;
  },
) => fetchPaginatedData<IGeneralLedgerParameter>(`${BASE_URL}/pdb/general-ledger`, pagination);

export const getGeneralLedgerParameter = (id: string) =>
  getData<IGeneralLedgerParameter>(`${BASE_URL}/pdb/general-ledger/${id}`);

type GeneralLedgerData = Omit<
  IGeneralLedgerParameter,
  'id' | 'createdAt' | 'updatedAt' | 'histories' | 'userName' | 'status'
>;

export const createGeneralLedgerParameter = (data: GeneralLedgerData) =>
  apiClient
    .post<IGeneralLedgerParameter>(`${BASE_URL}/pdb/general-ledger/create`, trimData(data))
    .then((res) => res.data);

export const updateGeneralLedgerParameter = (id: string, data: GeneralLedgerData) =>
  apiClient
    .put<IGeneralLedgerParameter>(`${BASE_URL}/pdb/general-ledger/update/${id}`, trimData(data))
    .then((res) => res.data);

export const disableGeneralLedgerParameter = (id: string) =>
  apiClient
    .put<IGeneralLedgerParameter>(`${BASE_URL}/pdb/general-ledger/disable/${id}`)
    .then((res) => res.data);

export const enableGeneralLedgerParameter = (id: string) =>
  apiClient
    .put<IGeneralLedgerParameter>(`${BASE_URL}/pdb/general-ledger/enable/${id}`)
    .then((res) => res.data);

export const getGeneralLedgerExceptions = (
  pagination: IPaginationParam & {
    searchBy: GeneralLedgerProfileFilterBy;
    from?: string;
    to?: string;
  },
) =>
  fetchPaginatedData<IGeneralLedgerPostingException>(
    `${BASE_URL}/pdb/general-ledger-exception`,
    pagination,
  );

export const getGeneralLedgerException = (id: string) =>
  getData<IGeneralLedgerPostingException>(`${BASE_URL}/pdb/general-ledger-exception/${id}`);

export const rectifyGeneralLedgerException = (data: GeneralLedgerRectifyData) =>
  apiClient.put(`${BASE_URL}/pdb/general-ledger-exception`, data).then((res) => res.data);

export const getGeneralLedgerExceptionFile = (searchBy: string, from: string, to: string) =>
  getData<string>(`${BASE_URL}/pdb/general-ledger-exception`, {
    headers: {
      accept: 'text/csv',
    },
    params: {
      from,
      to,
      searchBy,
    },
  });

export const indexReports = (
  pagination: IPaginationParam & {
    type?: ReportTypes;
    from?: string;
    to?: string;
  },
) => fetchPaginatedData<ILedgerReport>(`${BASE_URL}/reports/index`, pagination);

export const getLedgerAdjustments = (
  pagination: IPaginationParam & {
    from?: string;
    to?: string;
  },
) =>
  fetchPaginatedData<ILedgerAdjustments>(`${BASE_URL}/transactions/ledger/adjustments`, pagination);

export const getLedgerAdjustment = (id: string) =>
  getData<IGeneralLedgerParameter>(`${BASE_URL}/transactions/${id}`);

export const getAdjustmentsCSV = (account: string, from: string, to: string) =>
  getData<string>(`${BASE_URL}/transactions/ledger/adjustments`, {
    headers: {
      accept: 'text/csv',
    },
    params: {
      account,
      from,
      to,
    },
  });

export const getReportsDetails = (id: string) =>
  getData<ILedgerReport>(`${BASE_URL}/reports/${id}`);

export const getReportsCSV = (type: ReportTypes, from: string, to: string) =>
  getData<string>(`${BASE_URL}/reports/index`, {
    headers: {
      accept: 'text/csv',
    },
    params: {
      type,
      from,
      to,
    },
  });

export type SendMailData = {
  reportId: string;
  fromEmail: string;
  toEmails: string[];
  emailBody: string;
};

export const emailTrusteeReport = (data: SendMailData) =>
  apiClient.post(`${BASE_URL}/reports/trustee/email`, data).then((res) => res.data);

export const updateReport = (id, data) =>
  apiClient.post(`${BASE_URL}/reports/${id}/update`, data).then((res) => res.data);

export const getLedgerTransactions = (
  pagination: IPaginationParam & {
    status: LedgerTransactionStatus;
    type: TransactionTypes;
    from?: string;
    to?: string;
  },
) => fetchPaginatedData<ILedgerTransaction>(`${BASE_URL}/transactions`, pagination);

export const getLedgerTransaction = (id: string) =>
  getData<IGeneralLedgerParameter>(`${BASE_URL}/transactions/${id}`);

export const getLedgerTransactionsCSV = ({
  status,
  type,
  from,
  to,
  subType,
}: {
  status: LedgerTransactionStatus;
  type: TransactionTypes;
  from: string;
  to: string;
  subType: TransactionSubTypes;
}) =>
  getData<string>(`${BASE_URL}/transactions`, {
    headers: {
      accept: 'text/csv',
    },
    params: {
      status,
      type,
      from,
      to,
      subType,
    },
  });

export const getSapPostingHistory = (
  pagination: IPaginationParam & {
    glProfile: GeneralLedgerProfileFilterBy;
    from?: string;
    to?: string;
  },
) => fetchPaginatedData<ISapPostingHistory>(`${BASE_URL}/sap-posting`, pagination);

export const getSapPostingHistoryCSV = ({
  glProfile,
  from,
  to,
}: {
  glProfile: string;
  from: string;
  to: string;
}) =>
  getData<string>(`${BASE_URL}/sap-posting`, {
    headers: {
      accept: 'text/csv',
    },
    params: {
      status,
      from,
      to,
      glProfile,
    },
  });

export const getSapPostingHistoryDetailsTXT = (id: string) =>
  getData<string>(`${BASE_URL}/sap-posting/${id}/download`, {
    headers: {
      accept: 'text/txt',
    },
  });

export const regenerateSapPosting = ({
  id,
  transactionIds,
  transactionType,
}: {
  id: string;
  transactionIds: string[];
  transactionType: string;
}) =>
  apiClient
    .post(`${BASE_URL}/sap-posting/regenerate/${id}`, {transactionIds, transactionType})
    .then((res) => res.data);

export const getSapPostingHistoryDetails = (id: string) =>
  getData<ISapPostingHistory>(`${BASE_URL}/sap-posting/${id}`);

export const getSapPostingHistoryGlPostings = (id: string, pagination: IPaginationParam) =>
  fetchPaginatedData<IGeneralLedgerPosting>(
    `${BASE_URL}/sap-posting/${id}/gl-postings`,
    pagination,
  );

export const getProcessorFees = (
  pagination: IPaginationParam & {
    transactionType: string;
    paymentGatewayVendor: string;
    paymentOption: string;
  },
) => fetchPaginatedData<IFeeSettings>(`${BASE_URL}/fee-settings`, sanitizeObject(pagination));

export const indexReceivables = (
  pagination: IPaginationParam & {
    status: string;
    from: string;
    to: string;
  },
) => fetchPaginatedData<IReceivable>(`${BASE_URL}/receivables`, pagination);

export const indexReceivablesCSV = ({
  status,
  from,
  to,
}: {
  status: string;
  from: string;
  to: string;
}) =>
  getData<string>(`${BASE_URL}/receivables`, {
    headers: {
      accept: 'text/csv',
    },
    params: {
      status,
      from,
      to,
    },
  });

export const getReceivablesDetails = (id: string) =>
  getData<IReceivable>(`${BASE_URL}/receivables/${id}`);

export const indexReceivableExceptions = (id: string, pagination: IPaginationParam) =>
  fetchPaginatedData<IReceivableException>(`${BASE_URL}/receivables/${id}/exceptions`, pagination);

export const indexReceivableReconciliations = (id: string, pagination: IPaginationParam) =>
  fetchPaginatedData<IReceivableReconciliation>(
    `${BASE_URL}/receivables/${id}/transactions`,
    pagination,
  );

export type FeeSettingData = Omit<
  IFeeSettings,
  'id' | 'createdAt' | 'updatedAt' | 'validFrom' | 'validTo'
> & {
  validFrom: Date;
  validTo: Date;
};

export const createOrUpdateFeeSetting = (data: FeeSettingData) =>
  apiClient.put<IFeeSettings>(`${BASE_URL}/fee-settings/create`, data).then((res) => res.data);

export const deleteFeeSetting = (id: string) =>
  apiClient.delete<unknown>(`${BASE_URL}/fee-settings/${id}`).then((res) => res.data);

export const getProcessorFee = (id: string) =>
  getData<IFeeSettings>(`${BASE_URL}/fee-settings/${id}`);

export const getDailySummary = (filters: {paymentGatewayVendor: string; transactionDate: string}) =>
  getData<IDailySummary[]>(`${BASE_URL}/fee-daily-summary`, {
    params: filters,
  });

const trimData = (data: GeneralLedgerData): GeneralLedgerData => ({
  GLProfile: data.GLProfile,
  transactionType: data.transactionType.trim(),
  debit: {
    GLCode: data.debit.GLCode.trim(),
    GLAccountName: data.debit.GLAccountName.trim(),
    GLAccountNo: data.debit.GLAccountNo.trim(),
    GLTransactionDescription: data.debit.GLTransactionDescription.trim(),
    profitCenterCode: data.debit.profitCenterCode.trim(),
    costCenterCode: data.debit.costCenterCode.trim(),
    extractionIndicator: data.debit.extractionIndicator,
    documentType: data.debit.documentType,
  },
  credit: {
    GLCode: data.credit.GLCode.trim(),
    GLAccountName: data.credit.GLAccountName.trim(),
    GLAccountNo: data.credit.GLAccountNo.trim(),
    GLTransactionDescription: data.credit.GLTransactionDescription.trim(),
    profitCenterCode: data.credit.profitCenterCode.trim(),
    costCenterCode: data.credit.costCenterCode.trim(),
    extractionIndicator: data.credit.extractionIndicator,
    documentType: data.credit.documentType,
  },
});

import {environment} from '../../../environments/environment';
import {apiClient} from '../../../react/lib/ajax';
import {TOTAL_COUNT_HEADER_NAME} from '../../../react/services/service.type';
import {
  BillingStatementSummary,
  IBillingStatementAccountRequest,
  IBillingStatementSummaryRequest,
  IStatementSummaryTransactionFilter,
  IStatementTransaction,
  BillingStatementAccount,
} from './billing-statement-summary.types';

const billingStatementSummaryUrl = `${environment.billingPlansApiBaseUrl}/api/billings/statements`;
const billingStatementAccountUrl = `${environment.billingPlansApiBaseUrl}/api/billings/balance-status`;

export const getBillingStatementAccount = async (req: IBillingStatementAccountRequest = {}) => {
  const {data: billingStatementAccount, headers} = await apiClient.get<BillingStatementAccount[]>(
    billingStatementAccountUrl,
    {
      params: {
        perPage: req.perPage,
        page: req.page,
        merchantId: req.merchantId ? req.merchantId : undefined,
        balanceStatus: req.balanceStatus ? req.balanceStatus : undefined,
      },
    },
  );
  return {
    billingStatementAccount,
    total: headers[TOTAL_COUNT_HEADER_NAME],
  };
};

export const getBillingStatementSummary = async (req: IBillingStatementSummaryRequest = {}) => {
  const {data: billingStatementSummary, headers} = await apiClient.get<BillingStatementSummary[]>(
    billingStatementSummaryUrl,
    {
      params: {
        perPage: req.perPage,
        page: req.page,
        merchantId: req.merchantId ? req.merchantId : undefined,
      },
    },
  );

  return {
    billingStatementSummary,
    total: headers[TOTAL_COUNT_HEADER_NAME],
  };
};

export const getBillingStatementSummaryDetail = (id: string): Promise<BillingStatementSummary> =>
  apiClient
    .get<BillingStatementSummary>(`${billingStatementSummaryUrl}/${id}`)
    .then((res) => res.data);

export const getBillingStatementSummaryTransactions = async (
  req: IStatementSummaryTransactionFilter = {},
) => {
  const {data: billingStatementSummaryTransactions, headers} = await apiClient.get<
    IStatementTransaction[]
  >(`${billingStatementSummaryUrl}/${req.id}/transactions`, {
    params: {
      perPage: req.perPage,
      page: req.page,
      id: req.id ? req.id : undefined,
      type: req.type ? req.type : undefined,
      subType: req.subType ? req.subType : undefined,
      cardNo: req.cardNo ? req.cardNo : undefined,
      timeFrom: req.timeFrom ? req.timeFrom : undefined,
      timeTo: req.timeTo ? req.timeTo : undefined,
      isPrevCycle: req.isPrevCycle ?? undefined,
    },
  });

  return {
    billingStatementSummaryTransactions,
    total: headers[TOTAL_COUNT_HEADER_NAME],
  };
};

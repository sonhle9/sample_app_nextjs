import {useQuery} from 'react-query';
import {
  getBillingStatementAccount,
  getBillingStatementSummary,
  getBillingStatementSummaryDetail,
  getBillingStatementSummaryTransactions,
} from './billing-statement-summary.services';

const BillingStatementAccountListingKey = 'BILLING_STATEMENT_ACCOUNT_LISTING';
const BillingStatementSummaryListingKey = 'BILLING_STATEMENT_SUMMARY_LISTING';
const BillingStatementSummaryDetailKey = 'BILLING_STATEMENT_SUMMARY_DETAIL';
const BillingStatementSummaryTransactionKey = 'BILLING_STATEMENT_SUMMARY_TRANSACTION';

export const useBillingStatementAccount = (
  filter: Parameters<typeof getBillingStatementAccount>[0],
) => {
  return useQuery(
    [BillingStatementAccountListingKey, filter],
    () => getBillingStatementAccount(filter),
    {
      keepPreviousData: true,
    },
  );
};

export const useBillingStatementSummary = (
  filter: Parameters<typeof getBillingStatementSummary>[0],
) => {
  return useQuery(
    [BillingStatementSummaryListingKey, filter],
    () => getBillingStatementSummary(filter),
    {
      keepPreviousData: true,
    },
  );
};

export const useBillingStatementSummaryDetail = (billingStatementSummaryId: string) =>
  useQuery([BillingStatementSummaryDetailKey, billingStatementSummaryId], () =>
    getBillingStatementSummaryDetail(billingStatementSummaryId),
  );
export const useBillingStatementSummaryTransactions = (
  filter: Parameters<typeof getBillingStatementSummaryTransactions>[0],
) => {
  return useQuery(
    [BillingStatementSummaryTransactionKey, filter],
    () => getBillingStatementSummaryTransactions(filter),
    {
      keepPreviousData: true,
    },
  );
};

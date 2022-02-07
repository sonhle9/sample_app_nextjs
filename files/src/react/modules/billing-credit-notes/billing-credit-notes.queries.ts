import {useQuery} from 'react-query';
import {getBillingCreditNotes} from './billing-credit-notes.services';

const BILLING_CREDIT_NOTES = 'BILLING_CREDIT_NOTES';

export const useBillingCreditNotes = (filter: Parameters<typeof getBillingCreditNotes>[0]) => {
  return useQuery([BILLING_CREDIT_NOTES, filter], () => getBillingCreditNotes(filter), {
    keepPreviousData: true,
  });
};

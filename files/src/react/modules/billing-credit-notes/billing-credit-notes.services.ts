import {apiClient, filterEmptyString} from '../../lib/ajax';
import {TOTAL_COUNT_HEADER_NAME} from '../../services/service.type';
import {ICreditNote, ICreditNotesQueryParams} from './billing-credit-notes.types';
import {environment} from '../../../environments/environment';

export const billingCreditNotesUrl = `${environment.billingPlansApiBaseUrl}/api/billings/credit-notes`;

export const getBillingCreditNotes = async (params: ICreditNotesQueryParams) => {
  const {data: billingCreditNotes, headers} = await apiClient.get<ICreditNote[]>(
    billingCreditNotesUrl,
    {
      params: filterEmptyString(params),
    },
  );

  return {
    billingCreditNotes,
    total: headers[TOTAL_COUNT_HEADER_NAME],
    isEmpty: headers[TOTAL_COUNT_HEADER_NAME] === '0',
  };
};

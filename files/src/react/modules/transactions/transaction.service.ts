import _ from 'lodash';
import {environment} from 'src/environments/environment';
import {ajax, apiClient} from 'src/react/lib/ajax';
import {
  ITransactionsRequest,
  ICardTransaction,
  IEmailTransactionInput,
  ISendEmailResponse,
  IMerchant,
  IIMerchantRequest,
  IRelatedTransaction,
  LoyaltyCategory,
  IEmailTransactionByHolistic,
  ITransactionsRequestId,
  ICardFleetTransaction,
} from './transaction.type';
import {
  PAGE_HEADER_NAME,
  PAGES_COUNT_HEADER_NAME,
  PER_PAGE_HEADER_NAME,
  TOTAL_COUNT_HEADER_NAME,
} from '../../services/service.type';
import {ETransaction_Filter_By} from './emum';
import {ICard} from '../cards/card.type';

const merchantsApiBaseUrl = `${environment.merchantsApiBaseUrl}/api/merchants`;
const fleetCardsApiBaseUrl = `${environment.fleetCardsApiBaseUrl}/api/fleet-cards`;
const giftCardsApiBaseUrl = `${environment.giftCardsApiBaseUrl}/api/gift-cards`;
const pointsRulesApiBaseUrl = `${environment.pointsRulesApiBaseUrl}/api/points-rules`;
const reportsApiBaseUrl = `${environment.reportsBaseUrl}/api/reports`;
const adminCardUrl = `${environment.apiBaseUrl}/api/cards/admin`;
const reloadUrl = `${environment.reloadsApiBaseUrl}/api/reloads`;

export const releaseAuthTransaction = (transactionUid) => {
  return apiClient
    .post(`${giftCardsApiBaseUrl}/admin/transactions/${transactionUid}/release-auth`)
    .then((res) => res.data);
};

export const getTransactionWithRequestID = (req: ITransactionsRequestId) => {
  const queryParams = _.mapValues(_.pickBy(req, _.identity));

  return apiClient
    .get(`${giftCardsApiBaseUrl}/admin/transactions?requestId=${req.requestId}`, {
      params: queryParams,
    })
    .then((res) => {
      const {
        [TOTAL_COUNT_HEADER_NAME]: totalDocs,
        [PAGES_COUNT_HEADER_NAME]: totalPages,
        [PER_PAGE_HEADER_NAME]: perPage,
        [PAGE_HEADER_NAME]: page,
      } = res.headers;

      return {
        transactions: res.data || [],
        totalDocs: totalDocs || 0,
        totalPages,
        perPage,
        page,
      };
    });
};

export const getTransactions = (req: ITransactionsRequest = {}) => {
  const queryParams = _.mapValues(_.pickBy(req, _.identity));

  return apiClient
    .get<ICardTransaction[]>(`${giftCardsApiBaseUrl}/admin/transactions`, {
      params: queryParams,
    })
    .then((res) => {
      if (res && res.data && res.headers) {
        const {
          [TOTAL_COUNT_HEADER_NAME]: totalDocs,
          [PAGES_COUNT_HEADER_NAME]: totalPages,
          [PER_PAGE_HEADER_NAME]: perPage,
          [PAGE_HEADER_NAME]: page,
        } = res.headers;
        return {
          transactions: res.data || [],
          totalDocs: totalDocs || 0,
          totalPages,
          perPage,
          page,
        };
      }
      return null;
    });
};

export const getTransactionDetails = (id: string) => {
  return apiClient
    .get<ICardTransaction>(`${giftCardsApiBaseUrl}/admin/transactions/${id}`)
    .then((res) => res.data);
};

export const getRelatedTransactions = ({transactionId, ...params}: IRelatedTransaction) => {
  return apiClient
    .get<ICardTransaction[]>(
      `${giftCardsApiBaseUrl}/admin/transactions/related-transactions/${transactionId}`,
      {
        params,
      },
    )
    .then((res) => {
      if (res && res.data && res.headers) {
        const {
          [TOTAL_COUNT_HEADER_NAME]: totalDocs,
          [PAGES_COUNT_HEADER_NAME]: totalPages,
          [PER_PAGE_HEADER_NAME]: perPage,
          [PAGE_HEADER_NAME]: page,
        } = res.headers;
        return {
          transactions: res.data || [],
          totalDocs,
          totalPages,
          perPage,
          page,
        };
      }
      return null;
    });
};

export const getMerChants = (req: IIMerchantRequest) => {
  return apiClient
    .get<IMerchant[]>(`${merchantsApiBaseUrl}/admin/merchants`, {
      params: req,
    })
    .then((res) => res.data || []);
};

export const downloadTransaction = (req: ITransactionsRequest) => {
  const queryParams = _.mapValues(_.pickBy(req, _.identity));

  return apiClient
    .get<Blob>(`${giftCardsApiBaseUrl}/admin/transactions`, {
      params: queryParams,
      responseType: 'blob',
      headers: {
        accept: ' text/csv',
      },
    })
    .then((res) => {
      return window.URL.createObjectURL(res.data);
    });
};

export const sendEmail = (data: IEmailTransactionInput) => {
  const queryParams = _.mapValues(_.pickBy(data.filters, _.identity)) as any;
  const queries = Object.keys(queryParams)
    .map((k) => {
      if (k === 'values') {
        return `values[]=${encodeURIComponent(queryParams[k])}`;
      }
      return `${encodeURIComponent(k)}=${encodeURIComponent(queryParams[k])}`;
    })
    .join('&');

  return apiClient
    .post<ISendEmailResponse>(
      `${giftCardsApiBaseUrl}/admin/transactions/send-email?${queries}`,
      data,
    )
    .then((res) => res.data);
};

export const sendEmailByHolistic = (data: IEmailTransactionByHolistic) => {
  delete data.filters.page;
  delete data.filters.perPage;
  const queryParams = _.mapValues(_.pickBy(data.filters, _.identity)) as any;
  const transformData = {
    ...(data.filters.type && {transaction_type: queryParams.type}),
    ...(data.filters.dateFrom && {date_start: queryParams.dateFrom}),
    ...(data.filters.dateTo && {date_end: queryParams.dateTo}),
    ...(data.filters.status && {status: queryParams.status}),
    ...(data.filters.cardNumber && {card_number: queryParams.cardNumber}),
    ...(data.filters.merchantId && {merchant_id: queryParams.merchantId}),
    ...(data.filters.level === ETransaction_Filter_By.RRN && {rrn: queryParams.values[0]}),
    ...(data.filters.level === ETransaction_Filter_By.BATCHID && {
      settlement_batch_id: queryParams.values[0],
    }),
    ...(data.filters.level === ETransaction_Filter_By.TERMINALID && {
      terminal_id: queryParams.values[0],
    }),
  };
  const queries = Object.keys(transformData)
    .map((k) => {
      if (k === 'values') {
        return `values[]=${encodeURIComponent(transformData[k])}`;
      }
      return `${encodeURIComponent(k)}=${encodeURIComponent(transformData[k])}`;
    })
    .join('&');
  return apiClient
    .post<ISendEmailResponse>(
      `${reportsApiBaseUrl}/on-demand/report-request/sendReport?${queries}`,
      {emails: data.emails, reportName: data.reportName},
    )
    .then((res) => res.data);
};

export const getLoyaltyCategories = () => {
  return apiClient
    .get<LoyaltyCategory[]>(`${pointsRulesApiBaseUrl}/admin/loyalty-categories`)
    .then((res) => res.data);
};

// for fleet card transaction
export const getFleetTransactions = (req: ITransactionsRequest = {}) => {
  const queryParams = _.mapValues(_.pickBy(req, _.identity));

  return apiClient
    .get<ICardFleetTransaction[]>(`${fleetCardsApiBaseUrl}/admin/transactions`, {
      params: queryParams,
    })
    .then((res) => {
      if (res && res.data && res.headers) {
        const {
          [TOTAL_COUNT_HEADER_NAME]: totalDocs,
          [PAGES_COUNT_HEADER_NAME]: totalPages,
          [PER_PAGE_HEADER_NAME]: perPage,
          [PAGE_HEADER_NAME]: page,
        } = res.headers;
        return {
          transactions: res.data || [],
          totalDocs: totalDocs || 0,
          totalPages,
          perPage,
          page,
        };
      }
      return null;
    });
};

export const getFleetTransactionDetails = (id: string) => {
  return apiClient
    .get<ICardFleetTransaction>(`${fleetCardsApiBaseUrl}/admin/transactions/${id}`)
    .then((res) => res.data);
};

export const getReloadsFleetTransactionApiBaseUrl = (transactionUid?: string) => {
  const url = `${reloadUrl}/admin/transactions?receiptId=${transactionUid}`;
  return apiClient.get<any>(url).then((res) => res.data);
};

export const getRelatedFleetTransactions = ({transactionId, ...params}: IRelatedTransaction) => {
  return apiClient
    .get<ICardFleetTransaction[]>(
      `${fleetCardsApiBaseUrl}/admin/transactions/related-transactions/${transactionId}`,
      {
        params,
      },
    )
    .then((res) => {
      if (res && res.data && res.headers) {
        const {
          [TOTAL_COUNT_HEADER_NAME]: totalDocs,
          [PAGES_COUNT_HEADER_NAME]: totalPages,
          [PER_PAGE_HEADER_NAME]: perPage,
          [PAGE_HEADER_NAME]: page,
        } = res.headers;
        return {
          transactions: res.data || [],
          totalDocs,
          totalPages,
          perPage,
          page,
        };
      }
      return null;
    });
};

export const releaseAuthFleetTransaction = (transactionUid) => {
  return apiClient
    .post(`${fleetCardsApiBaseUrl}/admin/transactions/${transactionUid}/release-auth`)
    .then((res) => res.data);
};

export const updateSetSettlementBatch = (transactions) => {
  const url = `${fleetCardsApiBaseUrl}/admin/transactions/manual`;
  return apiClient.post<any>(`${url}`, transactions).then((res) => res.data);
};

export const getCardDetails = (cardNumber?: string) => {
  const url = `${adminCardUrl}/cards/get-by-card-number/${cardNumber}`;
  return ajax<ICard>({url});
};

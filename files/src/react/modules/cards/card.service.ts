import _ from 'lodash';
import {environment} from 'src/environments/environment';
import {apiClient, fetchPaginatedData, ajax, extractError} from 'src/react/lib/ajax';
import {
  AdjustmentDetails,
  ICard,
  ICardGroupsFilterByRequest,
  ICardGroupsRequest,
  ICardRangesRequest,
  ICardsRequest,
  IFileBulkCardDetails,
  IEmailCardInput,
  IMerchantsRequest,
  IndexCard,
  TransferDetails,
  IGetRequest,
  ICardRestriction,
  IRestriction,
  FilterBy,
  ICardRangesFilterByRequest,
  ICompaniesRequest,
  IBatchTransfer,
  VehiclesFilterType,
  IVehicle,
} from './card.type';
import {formatParameters} from 'src/shared/helpers/common';
import {IMerchant} from 'src/shared/interfaces/merchant.interface';
import {ISendEmailResponse} from '../transactions/transaction.type';
import {
  PAGES_COUNT_HEADER_NAME,
  PAGE_HEADER_NAME,
  PER_PAGE_HEADER_NAME,
  TOTAL_COUNT_HEADER_NAME,
} from 'src/react/services/service.type';
import {EStatus} from 'src/app/cards/shared/enums';

const apiCard = `${environment.cardsApiBaseUrl}/api/cards`;
const apiGiftCard = `${environment.giftCardsApiBaseUrl}/api/gift-cards`;
const apiCompanies = `${environment.companiesApiBaseUrl}/api/companies`;
const apiMerchant = `${environment.merchantsApiBaseUrl}/api/merchants`;
const apiWorkflows = `${environment.workflowsApiBaseUrl}/api/workflows`;
const apiCardSendMailHolistic = `${environment.cardsApiBaseUrl}/api/reports/on-demand/report-request/sendReport?`;
const VehicleApiUrl = `${environment.cardsApiBaseUrl}/api/vehicle`;

export const getCardRestriction = (type: string, cardID: string) => {
  const url = `${apiCard}/restrictions/get-restriction?type=${type}&belongTo=${cardID}`;
  return apiClient.get<ICardRestriction>(url).then((res) => res.data);
};

export const updateCardRestriction = (restriction: IRestriction) => {
  const url = `${apiCard}/restrictions/upsert-restriction`;
  return apiClient.post<IRestriction>(url, restriction).then((res) => res.data);
};

export const getCardDetails = (cardId: string): Promise<ICard> => {
  const url = `${apiCard}/admin/cards/${cardId}`;
  return apiClient.get<ICard>(url).then((res) => res.data);
};

export const updateTransfer = (transfer: TransferDetails) => {
  const url = `${apiGiftCard}/admin/transactions/transfer`;
  return apiClient.post<TransferDetails>(url, transfer).then((res) => res.data);
};

export const updateAdjustment = (adjustment: AdjustmentDetails) => {
  const url = `${apiGiftCard}/admin/transactions/adjust`;
  return apiClient.post<AdjustmentDetails>(url, adjustment).then((res) => res.data);
};

export const deleteRequest = (id: string) => {
  const url = `${apiWorkflows}/admin/approval-requests/${id}/cancel`;
  return apiClient.put<any>(url).then((res) => res.data);
};

export const uploadFile = (file: File): Promise<any> => {
  const url = `${apiGiftCard}/admin/transactions/upload-attachment`;
  const data = new FormData();
  data.append('file', file);

  return apiClient.post<FormData>(url, data).then((res) => res.data);
};

export const getCards = (req: ICardsRequest = {}) => {
  const url = `${apiCard}/admin/cards`;
  if (req.dateFrom && !req.dateTo) {
    req.dateTo = new Date().toISOString();
  }

  return fetchPaginatedData<ICard>(
    `${url}`,
    {
      perPage: req && req.perPage,
      page: req && req.page,
    },
    {
      params: formatParameters({...req}),
    },
  );
};

export const getMerchants = (req: IMerchantsRequest = {}) => {
  const url = `${apiMerchant}/admin/merchants`;
  return fetchPaginatedData<IMerchant>(
    `${url}`,
    {
      perPage: req && req.perPage,
      page: req && req.page,
    },
    {
      params: formatParameters({...req}),
    },
  );
};

export const getCardRanges = (req: ICardRangesRequest = {}) => {
  const url = `${apiCard}/admin/card-ranges`;

  return fetchPaginatedData<any>(
    `${url}`,
    {
      perPage: (req && req.perPage) || 100,
      page: (req && req.page) || 0,
    },
    {
      params: formatParameters({...req}),
    },
  );
};

export const getCardRangesFilterBy = (req: ICardRangesFilterByRequest = {}) => {
  const url = `${apiCard}/admin/card-ranges`;

  return fetchPaginatedData<any>(
    `${url}`,
    {
      perPage: (req && req.perPage) || 100,
      page: (req && req.page) || 0,
    },
    {
      params: formatParameters({...req}),
    },
  );
};

export const getCardGroups = (req: ICardGroupsRequest = {}) => {
  const url = `${apiCard}/admin/card-groups`;

  return fetchPaginatedData<any>(
    `${url}`,
    {
      perPage: (req && req.perPage) || 100,
      page: (req && req.page) || 0,
    },
    {
      params: formatParameters({...req}),
    },
  );
};

export const getCardGroupsFilterBy = (req: ICardGroupsFilterByRequest = {}) => {
  const url = `${apiCard}/admin/card-groups`;

  return fetchPaginatedData<any>(
    `${url}`,
    {
      perPage: (req && req.perPage) || 100,
      page: (req && req.page) || 0,
    },
    {
      params: formatParameters({...req}),
    },
  );
};

export const getCardholderFilterBy = (req: ICardGroupsFilterByRequest = {}) => {
  const url = `${apiCard}/admin/cardholders`;

  return fetchPaginatedData<any>(
    `${url}`,
    {
      perPage: (req && req.perPage) || 100,
      page: (req && req.page) || 0,
    },
    {
      params: formatParameters({...req}),
    },
  );
};

export const getCompaniesFilterBy = (req: ICompaniesRequest = {}) => {
  const url = `${apiCompanies}/admin/companies`;

  return fetchPaginatedData<any>(
    `${url}`,
    {
      perPage: (req && req.perPage) || 15,
      page: (req && req.page) || 0,
    },
    {
      params: formatParameters({...req}),
    },
  );
};

export const updateCard = (card: IndexCard, cardId: string) => {
  const url = `${apiCard}/admin/cards/${cardId}`;

  return apiClient.put<IndexCard>(`${url}`, card).then((res) => res.data);
};

export const updateStatusCards = (params: ICardsRequest, status: EStatus) => {
  const url = `${apiCard}/admin/cards/update-bulk-card-status`;
  return apiClient
    .post<IndexCard>(
      `${url}`,
      {status},
      {
        params: {
          ...(params.status && {status: params.status}),
          ...(params.dateFrom && {dateFrom: params.dateFrom}),
          ...(params.dateTo && {dateTo: params.dateTo}),
          ...(params.filterBy && {filterBy: params.filterBy}),
          ...(params.values && {values: params.values}),
          ...(params.cardNumberFrom && {cardNumberFrom: params.cardNumberFrom}),
          ...(params.cardNumberTo && {cardNumberTo: params.cardNumberTo}),
        },
      },
    )
    .then((res) => res.data);
};

export const createBulkCard = (card: IndexCard) => {
  const url = `${apiCard}/admin/cards/bulk`;

  return apiClient.post<IndexCard>(`${url}`, card).then((res) => res.data);
};

export const validateFileBulkCard = (file: File): Promise<IFileBulkCardDetails> => {
  const url = `${apiGiftCard}/admin/bulk-card-transfer/validate-upload`;
  const data = new FormData();
  data.append('file', file);

  return apiClient.post<IFileBulkCardDetails>(url, data).then((res) => res.data);
};

export const uploadFileBulkCard = (file: File, batchId: string): Promise<{status: string}> => {
  const url = `${apiGiftCard}/admin/bulk-card-transfer/upload-file?batchId=${batchId}`;
  const data = new FormData();
  data.append('file', file);

  return apiClient.post<{status: string}>(url, data).then((res) => res.data);
};

export const downloadCard = (req: ICardsRequest) => {
  const queryParams = _.mapValues(_.pickBy(req, _.identity));

  return apiClient
    .get<Blob>(`${apiCard}/admin/cards`, {
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

export const getTransferRequest = ({cardNumber, ...params}: IGetRequest) => {
  return apiClient
    .get<TransferDetails[]>(
      `${apiWorkflows}/admin/approval-requests/get-transfer-request-by-cardNumber/${cardNumber}`,
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
          transfer: res.data || [],
          totalDocs,
          totalPages,
          perPage,
          page,
        };
      }
      return null;
    });
};

export const getAdjustmentRequest = ({cardNumber, ...params}: IGetRequest) => {
  return apiClient
    .get<AdjustmentDetails[]>(
      `${apiWorkflows}/admin/approval-requests/get-adjustment-request-by-cardNumber/${cardNumber}`,
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
          adjustment: res.data || [],
          totalDocs,
          totalPages,
          perPage,
          page,
        };
      }
      return null;
    });
};

export const sendEmail = (data: IEmailCardInput) => {
  return apiClient
    .post<ISendEmailResponse>(`${apiCard}/admin/cards/send-email`, data)
    .then((res) => res.data);
};

export const sendMailHolistic = (data: IEmailCardInput) => {
  delete data.filters.page;
  delete data.filters.perPage;
  const queryParams = _.mapValues(_.pickBy(data.filters, _.identity)) as any;
  const convertData = {
    ...(data.filters.dateFrom && {date_start: queryParams.dateFrom}),
    ...(data.filters.dateTo && {date_end: queryParams.dateTo}),
    ...(data.filters.status && {status: queryParams.status}),
    ...(data.filters.type && {type: queryParams.type}),
    ...(data.filters.filterBy === FilterBy.company && {company_id: queryParams.values[0]}),
    ...(data.filters.filterBy === FilterBy.merchant && {merchantid: queryParams.values[0]}),
    ...(data.filters.filterBy === FilterBy.cardGroup && {card_group_id: queryParams.values[0]}),
    ...(data.filters.filterBy === FilterBy.cardNumber && {card_number: queryParams.values[0]}),
  };
  const queries = Object.keys(convertData)
    .map((k) => {
      if (k === 'values') {
        return `values[]=${encodeURIComponent(convertData[k])}`;
      }
      return `${encodeURIComponent(k)}=${encodeURIComponent(convertData[k])}`;
    })
    .join('&');
  return apiClient
    .post<ISendEmailResponse>(`${apiCardSendMailHolistic}${queries}`, {
      emails: data.emails,
      reportName: data.reportName,
    })
    .then((res) => res.data);
};

// Used by loyalty
export const updateCardGroup = (data: {status: string; cardGroup: string}, cardId: string) =>
  ajax({
    url: `${apiCard}/admin/cards/${cardId}`,
    method: 'PUT',
    data,
  })
    .then(() => Promise.resolve(true))
    .catch((e) =>
      Promise.reject({
        name: e.response.data.errorCode,
        message: extractError(e),
      }),
    );

export const getBatchTransfer = (batchId: string) => {
  const url = `${apiGiftCard}/batches/${batchId}`;
  return apiClient.get<IBatchTransfer>(url).then((res) => res.data);
};

export const getVehicles = (filter: VehiclesFilterType) => {
  const url = `${VehicleApiUrl}/admin/vehicle/list`;
  return fetchPaginatedData<IVehicle>(url, filter);
};

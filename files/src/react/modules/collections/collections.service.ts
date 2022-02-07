import {environment} from 'src/environments/environment';
import {apiClient} from 'src/react/lib/ajax';
import {Transaction, ICollectionsRequest} from './collections.type';
import {TOTAL_COUNT_HEADER_NAME} from 'src/react/services/service.type';

const baseUrl = `${environment.merchantsApiBaseUrl}/api/merchant-collections/admin/collections-transactions`;

const getParams = (req: ICollectionsRequest) => {
  return {
    perPage: req?.perPage,
    page: req?.page,
    status: req?.status || undefined,
    type: req?.types || undefined,
    filterByTime: 'createdAt',
    timeFrom: req?.timeFrom || undefined,
    timeTo: req?.timeTo || new Date().toISOString(),
    subTypes: req?.category || undefined,
  };
};

export const getTransactions = async (req: ICollectionsRequest = {}) => {
  const {data: transactions, headers} = await apiClient.get<Transaction[]>(`${baseUrl}`, {
    params: getParams(req),
  });

  return {
    transactions,
    total: headers[TOTAL_COUNT_HEADER_NAME],
  };
};

export const sendEmail = ({emails, filter}: {emails: string[]; filter: ICollectionsRequest}) => {
  return apiClient
    .post<any>(
      `${baseUrl}/send-reports`,
      {emails},
      {
        params: getParams(filter),
      },
    )
    .then((res) => res.data);
};

export const getReportPresignedUrl = async (generationId: string) => {
  return apiClient.get<any>(`${baseUrl}/download-url`, {
    params: {generationId},
  });
};

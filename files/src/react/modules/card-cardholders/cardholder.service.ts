import {environment} from 'src/environments/environment';
import {apiClient, fetchPaginatedData} from 'src/react/lib/ajax';
import {formatParameters} from 'src/shared/helpers/common';
import {ICardholder, ICardholderIndexRequest} from './cardholder.type';

const apiCardholder = `${environment.cardsApiBaseUrl}/api/cards`;

export const getCardholders = (request: ICardholderIndexRequest) => {
  const url = `${apiCardholder}/admin/cardholders`;
  if (request.dateFrom && !request.dateTo) {
    request.dateTo = new Date().toISOString();
  }
  return fetchPaginatedData<ICardholder>(
    `${url}`,
    {
      perPage: request && request.perPage,
      page: request && request.page,
    },
    {
      params: formatParameters({...request}),
    },
  );
};

export const getCardholderDetails = (id: string) => {
  const url = `${apiCardholder}/admin/cardholders/${id}`;
  return apiClient.get<ICardholder>(url).then((res) => res.data);
};

export const updateCardholder = (cardholderId: string, cardholderUpdate: ICardholder) => {
  const url = `${apiCardholder}/admin/cardholders/${cardholderId}`;
  return apiClient.put<ICardholder>(`${url}`, cardholderUpdate).then((res) => res.data);
};

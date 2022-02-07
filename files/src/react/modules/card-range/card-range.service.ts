import {environment} from 'src/environments/environment';
import {apiClient, fetchPaginatedData} from 'src/react/lib/ajax';
import {formatParameters} from 'src/shared/helpers/common';
import {ICardRange, ICardRangesRequest, ICardRangeInput} from './card-range.type';

const apiCard = `${environment.cardsApiBaseUrl}/api/cards`;

export const getCardRanges = (req: ICardRangesRequest = {}) => {
  const url = `${apiCard}/admin/card-ranges`;
  if (req.dateFrom && !req.dateTo) {
    req.dateTo = new Date().toISOString();
  }
  return fetchPaginatedData<ICardRange>(
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

export const getCardRangeDetails = (id: string) => {
  const url = `${apiCard}/admin/card-ranges/${id}`;
  return apiClient.get<ICardRange>(url).then((res) => res.data);
};

export const createCardRange = (cardRange: ICardRangeInput) => {
  const url = `${apiCard}/admin/card-ranges`;
  return apiClient.post<ICardRange>(url, cardRange).then((res) => res.data);
};

export const updateCardRange = (cardRange: ICardRangeInput, cardRangeId: string) => {
  const url = `${apiCard}/admin/card-ranges/${cardRangeId}`;
  return apiClient.put<ICardRange>(url, cardRange).then((res) => res.data);
};

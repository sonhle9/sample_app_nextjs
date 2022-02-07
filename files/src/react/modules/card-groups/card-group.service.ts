import {environment} from 'src/environments/environment';
import {apiClient, fetchPaginatedData} from 'src/react/lib/ajax';
import {formatParameters} from 'src/shared/helpers/common';
import {ICardGroup, ICardGroupsRequest, ICardGroupInput} from './card-group.type';

const apiCard = `${environment.cardsApiBaseUrl}/api/cards`;

export const getCardGroups = (req: ICardGroupsRequest = {}) => {
  const url = `${apiCard}/admin/card-groups`;
  if (req.dateFrom && !req.dateTo) {
    req.dateTo = new Date().toISOString();
  }

  return fetchPaginatedData<ICardGroup>(
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

export const getCardGroupDetails = (id: string) => {
  const url = `${apiCard}/admin/card-groups/${id}`;
  return apiClient.get<ICardGroup>(url).then((res) => res.data);
};

export const createCardGroup = (cardGroup: ICardGroupInput) => {
  const url = `${apiCard}/admin/card-groups`;
  return apiClient.post<ICardGroup>(url, cardGroup).then((res) => res.data);
};

export const updateCardGroup = (cardGroup: ICardGroupInput, cardGroupId: string) => {
  const url = `${apiCard}/admin/card-groups/${cardGroupId}`;
  return apiClient.put<ICardGroup>(url, cardGroup).then((res) => res.data);
};

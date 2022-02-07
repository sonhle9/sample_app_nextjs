import {createAjaxOperation} from '@setel/portal-ui';
import {environment} from 'src/environments/environment';
import {apiClient, fetchPaginatedData} from 'src/react/lib/ajax';
import {formatParameters} from 'src/shared/helpers/common';
import {ICardPinMailer, ICardPinMailersRequest} from './card-pin-mailer.type';

const apiCard = `${environment.cardsApiBaseUrl}/api/cards`;

export const getCardPinMailer = (req: ICardPinMailersRequest = {}) => {
  const url = `${apiCard}/admin/cards/fleet/pin-mailers`;

  return fetchPaginatedData<ICardPinMailer>(
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

export const downloadPinMailers = createAjaxOperation((req: ICardPinMailersRequest) => {
  const url = `${apiCard}/admin/cards/fleet/pin-mailers`;
  return apiClient
    .get<Blob>(url, {
      params: formatParameters({...req}),
      responseType: 'blob',
      headers: {
        accept: ' text/csv',
      },
    })
    .then((res) => {
      return res.data;
    });
});

export const printCardPinMailer = (value: string[]) => {
  const url = `${apiCard}/admin/cards/fleet/pin-mailers/print`;
  const data = {
    pinMailerIds: value,
  };
  return apiClient.post<any>(url, data).then((res) => res.data);
};

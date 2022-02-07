import {rest} from 'msw';
import {environment} from 'src/environments/environment';
import {createFixResponseHandler} from 'src/react/lib/mock-helper';

const baseUrl = `${environment.cardsApiBaseUrl}/api/cards`;

export const apiCardsHandlers = [
  rest.get(`${baseUrl}/admin/card-groups`, createFixResponseHandler([])),
];

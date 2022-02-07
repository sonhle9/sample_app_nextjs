import {rest} from 'msw';
import {environment} from 'src/environments/environment';

const BASE_URL = environment.apiBaseUrl + '/api/smartpay';

const MOCK_SMART_PAY_CARD = [
  {
    mesraPoints: false,
    id: '5dfae1ffde5f2600123bda28',
    cardNumber: '70838160000000045',
    userId: '5dfae1ffe5bbf20012da70cb',
    cardType: 'standalone',
    platNumber: null,
    expiryDate: '05/2024',
    status: 'active',
    createdAt: '2019-12-19T02:35:43.583Z',
    updatedAt: '2019-12-19T02:35:43.583Z',
    balance: 81555.01,
  },
];

export const handlers = [
  rest.get(`${BASE_URL}/cards/:userId/card`, (_, res, ctx) => {
    return res(ctx.json(MOCK_SMART_PAY_CARD));
  }),
];

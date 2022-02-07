import {rest} from 'msw';
import {environment} from 'src/environments/environment';

const mockAutoTopUp = [
  {
    cardSchema: 'visa',
    createdAt: '2021-05-31T02:25:42.594Z',
    creditCardId: '60b448e1bce887001073d4b2',
    id: '60b44926688e43ed5c90ae74',
    isActivated: true,
    lastFourDigits: '0206',
    minimumBalanceThreshold: 10,
    topupAmount: 20,
    updatedAt: '2021-05-31T03:34:04.846Z',
    userId: 'd812d91d-fd8b-48d9-b889-25150c93c38f',
  },
];

const baseUrl = `${environment.apiBaseUrl}/api/ops`;

export const handlers = [
  rest.get(`${baseUrl}/wallet/:userId/auto-topup`, (req, res, ctx) =>
    res(ctx.json({...mockAutoTopUp, userId: req.params.userId})),
  ),
];

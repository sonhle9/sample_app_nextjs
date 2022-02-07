import {rest} from 'msw';
import {environment} from 'src/environments/environment';

const pointsBalanceBaseURL = `${environment.variablesBaseUrl}/api/points-balance/balance`;

export const handlers = [
  rest.get(`${pointsBalanceBaseURL}/expiry/:id`, (_, res, ctx) => {
    return res(ctx.json(MOCK_EXPIRIES));
  }),
];

const MOCK_EXPIRIES = {
  cardNumber: 'string',
  balance: 200,
  floatingBalance: 0,
  expiryDetails: [
    {
      expiryDate: '2021-08-07T23:59:59.999Z',
      points: 10,
    },
  ],
};

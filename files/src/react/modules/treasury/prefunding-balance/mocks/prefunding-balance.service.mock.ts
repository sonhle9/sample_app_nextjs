import {rest} from 'msw';
import {SETEL_MERCHANT_ID} from 'src/app/merchants/shared/constants';
import {environment} from 'src/environments/environment';

const BASE_URL = `${environment.ledgerApiBaseUrl}/api/payments`;
const BASE_URL_LEDGER = `${environment.ledgerApiBaseUrl}/api/ledger`;
const BASE_URL_MERCHANT = `${environment.merchantsApiBaseUrl}/api/merchants/admin/merchants`;

export const handlers = [
  rest.get(`${BASE_URL_MERCHANT}/${SETEL_MERCHANT_ID}/balances`, (_, res, ctx) => {
    return res(ctx.json(MOCK_DATA_PREFUND_BALANCE));
  }),
  rest.get(`${BASE_URL}/admin/prefund-balance-daily-snapshots`, (_, res, ctx) => {
    return res(ctx.json(MOCK_DATA_PREFUND_DAILY));
  }),
  rest.get(`${BASE_URL}/prefunding-balance-alert`, (_, res, ctx) => {
    return res(ctx.json(MOCK_DATA_BALANCE_ALERT));
  }),
  rest.get(`${BASE_URL_LEDGER}/accounts/aggregates`, (_, res, ctx) => {
    return res(ctx.json(MOCK_DATA_AGGREGATES_ACCOUNT));
  }),
];

const MOCK_DATA_PREFUND_BALANCE = [
  {merchantId: '1', type: 'AVAILABLE', currency: 'MYR', balance: 10},
  {merchantId: '1', type: 'PREPAID', currency: 'MYR', balance: 11},
];

const MOCK_DATA_PREFUND_DAILY = [
  {balance: -104550.39, createdAt: '2021-02-24T00:01:11.137Z', id: '60359747b5e48ada4dc5d3fd'},
  {balance: -1039873331.71, createdAt: '2021-02-23T00:00:08.333Z', id: '6034458818c8d0babbf9d514'},
  {balance: -103237.83, createdAt: '2021-02-22T00:00:52.310Z', id: '6032f434f53a356d4e2101b9'},
];

const MOCK_DATA_BALANCE_ALERT = [
  {
    createdAt: '2021-04-05T09:02:54.099Z',
    id: '606ad23e8aff7100104cd043',
    limit: 11,
    text: 'e',
    type: 'slack',
    updatedAt: '2021-04-05T09:02:54.099Z',
  },
  {
    createdAt: '2020-04-03T04:29:51.617Z',
    id: '5e86bbbfa7cb080010bfd963',
    limit: 100,
    text: 'https://setelnow.atlassian.net/browse/PAY-1102',
    type: 'slack',
    updatedAt: '2020-04-03T04:29:51.617Z',
  },
  {
    createdAt: '2020-04-02T13:34:32.382Z',
    id: '5e85e9e824a2e800109cc99b',
    limit: 200000,
    text: 'Test alert 200000',
    type: 'slack',
    updatedAt: '2020-04-02T13:34:32.382Z',
  },
];

const MOCK_DATA_AGGREGATES_ACCOUNT = [
  {
    availableBalance: {
      amount: 10,
      creditCount: 0,
      creditTotal: 0,
      debitCount: 0,
      debitTotal: 0,
    },
    createdAt: '2020-03-25T08:34:25.770Z',
    currency: 'MYR',
    group: 'AGGREGATES',
    id: '5e7b17913c16350010936d83',
    pendingBalance: {
      amount: 0,
      creditCount: 0,
      creditTotal: 0,
      debitCount: 0,
      debitTotal: 0,
    },
    prepaidBalance: {
      amount: 0,
      creditCount: 0,
      creditTotal: 0,
      debitCount: 0,
      debitTotal: 0,
    },
    updatedAt: '2020-03-25T08:34:25.770Z',
    userId: 'buffer-aggregates',
  },
];

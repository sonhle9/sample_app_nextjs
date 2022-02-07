import {rest} from 'msw';
import {environment} from 'src/environments/environment';
import {AccountsGroup, PlatformAccounts} from '../shared/cashflows.enum';

const cashflowsPlatformUrl = `${environment.ledgerApiBaseUrl}/api/ledger/accounts/platform`;
const cashflowsAggregatesUrl = `${environment.ledgerApiBaseUrl}/api/ledger/accounts/aggregates`;
const cashflowsDailyMerchantPayoutUrl = `${environment.ledgerApiBaseUrl}/api/processor/admin/payouts-batch/today-summary`;

const cashflowsAdjustAccount = `${environment.ledgerApiBaseUrl}/api/ledger/accounts/platform/adjust`;
const cashflowsModalTransferToOperatingAccount = `${environment.ledgerApiBaseUrl}/api/ledger/accounts/transfer`;
const cashflowsAdjustBuffer = `${environment.ledgerApiBaseUrl}/api/ledger/accounts/buffer/adjust`;

export const handlers = [
  rest.get(`${cashflowsPlatformUrl}`, (_, res, ctx) => {
    return res(ctx.json(MOCK_DATA_PLATFORM));
  }),

  rest.get(`${cashflowsAggregatesUrl}`, (_, res, ctx) => {
    return res(ctx.json(MOCK_DATA_AGGREGATES_ACCOUNT));
  }),

  rest.get(`${cashflowsDailyMerchantPayoutUrl}`, (_, res, ctx) => {
    return res(ctx.json(MOCK_DATA_TODAY_SUMMARY));
  }),

  rest.post(`${cashflowsAdjustAccount}`, (req, res, ctx) => {
    Object.assign(MOCK_DATA_ADJUST_PLATFORM, req.body);
    return res(ctx.json(MOCK_DATA_AGGREGATES_ACCOUNT[1]));
  }),

  rest.post(`${cashflowsModalTransferToOperatingAccount}`, (req, res, ctx) => {
    Object.assign(MOCK_DATA_TRANSFER_TO_OPERATION, req.body);
    return res(ctx.json(MOCK_DATA_AGGREGATES_ACCOUNT[1]));
  }),

  rest.post(`${cashflowsAdjustBuffer}`, (req, res, ctx) => {
    Object.assign(MOCK_DATA_ADJUST_BUFFER, req.body);
    return res(ctx.json(MOCK_DATA_AGGREGATES_ACCOUNT[1]));
  }),
];

const MOCK_DATA_ADJUST_BUFFER = {
  amount: 3,
  reason: 'reason',
};

const MOCK_DATA_TRANSFER_TO_OPERATION = {
  from: {
    accountGroup: AccountsGroup.PLATFORM,
    userId: PlatformAccounts.trust,
  },
  to: {
    accountGroup: AccountsGroup.PLATFORM,
    userId: PlatformAccounts.operating,
  },
  amount: 1,
  reason: 'reason',
};

const MOCK_DATA_ADJUST_PLATFORM = {
  account: 'setel-collection',
  amount: -1,
  balanceType: 'PLATFORM_AVAILABLE',
  reason: 'reason',
};
const MOCK_DATA_AGGREGATES_ACCOUNT = [
  {
    availableBalance: {
      amount: -31.26,
      creditCount: 13,
      creditTotal: 85.16,
      debitCount: 18,
      debitTotal: 116.42,
    },
    createdAt: '2020-03-23T09:31:16.100Z',
    currency: 'MYR',
    group: 'AGGREGATES',
    id: '5e7881e411bcfe00117a124d',
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
    updatedAt: '2020-03-25T08:16:21.676Z',
    userId: 'customer-aggregates',
  },
  {
    availableBalance: {
      amount: 79.16,
      creditCount: 17,
      creditTotal: 106.42,
      debitCount: 3,
      debitTotal: 27.26,
    },
    createdAt: '2020-03-23T09:31:16.150Z',
    currency: 'MYR',
    group: 'AGGREGATES',
    id: '5e7881e411bcfe00117a1251',
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
    updatedAt: '2020-03-25T08:16:21.631Z',
    userId: 'merchant-aggregates',
  },
  {
    availableBalance: {
      amount: 15.3,
      creditCount: 9,
      creditTotal: 15.3,
      debitCount: 0,
      debitTotal: 0,
    },
    createdAt: '2020-03-23T09:31:16.238Z',
    currency: 'MYR',
    group: 'AGGREGATES',
    id: '5e7881e411bcfe00117a1256',
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
    updatedAt: '2020-03-25T07:17:25.839Z',
    userId: 'mdr-aggregates',
  },
  {
    availableBalance: {
      amount: 0,
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
  {
    availableBalance: {
      amount: 1481353.42,
      creditCount: 43,
      creditTotal: 1482385.62,
      debitCount: 1982,
      debitTotal: 1032.2,
    },
    createdAt: '2020-08-13T08:29:37.535Z',
    currency: 'MYR',
    group: 'AGGREGATES',
    id: '5f34f9f1a9042900101a6cf5',
    pendingBalance: {
      amount: -211,
      creditCount: 40395,
      creditTotal: 1538851.25,
      debitCount: 5827,
      debitTotal: 1539062.25,
    },
    prepaidBalance: {
      amount: 0,
      creditCount: 0,
      creditTotal: 0,
      debitCount: 0,
      debitTotal: 0,
    },
    updatedAt: '2021-03-18T07:45:37.089Z',
    userId: 'merchant-operating-aggregate',
  },
  {
    availableBalance: {
      amount: 1086.49,
      creditCount: 1965,
      creditTotal: 1086.49,
      debitCount: 0,
      debitTotal: 0,
    },
    createdAt: '2020-08-13T08:29:37.535Z',
    currency: 'MYR',
    group: 'AGGREGATES',
    id: '5f34f9f1a9042900101a6cf6',
    pendingBalance: {
      amount: -140.57,
      creditCount: 227,
      creditTotal: 11.29,
      debitCount: 4,
      debitTotal: 151.86,
    },
    prepaidBalance: {
      amount: 0,
      creditCount: 0,
      creditTotal: 0,
      debitCount: 0,
      debitTotal: 0,
    },
    updatedAt: '2021-03-18T07:45:37.107Z',
    userId: 'mdr-operating-aggregate',
  },
];

const MOCK_DATA_TODAY_SUMMARY = {
  totalAmount: 271.86,
  totalCount: 0,
  totalFeeAmount: 0,
  transactionDate: '2021-03-18',
  amountBreakdown: {
    BOOST: {
      amount: 2.95,
      fee: 0.05,
    },
    PASSTHROUGH_CHECKOUT: {
      amount: 0,
      fee: 0,
    },
    PASSTHROUGH_FUEL: {
      amount: 0,
      fee: 0,
    },
    PASSTHROUGH_STORE: {
      amount: 0,
      fee: 0,
    },
    WALLET_SETEL: {
      amount: 268.91,
      fee: 4.7,
    },
  },
};

const MOCK_DATA_PLATFORM = [
  {
    availableBalance: {
      amount: 341.22,
      creditCount: 285,
      creditTotal: 4891.19,
      debitCount: 123,
      debitTotal: 4549.97,
    },
    createdAt: '2019-12-24T03:02:24.712Z',
    currency: 'MYR',
    group: 'PLATFORM',
    id: '5e017fc09db92493dfdbdb0c',
    pendingBalance: {
      amount: 62835.81,
      creditCount: 7439,
      creditTotal: 67373.51,
      debitCount: 305,
      debitTotal: 4577.7,
    },
    prepaidBalance: {
      amount: 0,
      creditCount: 0,
      creditTotal: 0,
      debitCount: 0,
      debitTotal: 0,
    },
    updatedAt: '2021-03-18T07:44:10.744Z',
    userId: 'setel-collection',
  },
  {
    availableBalance: {
      amount: 341.22,
      creditCount: 285,
      creditTotal: 4891.19,
      debitCount: 123,
      debitTotal: 4549.97,
    },
    createdAt: '2019-12-24T03:02:24.712Z',
    currency: 'MYR',
    group: 'PLATFORM',
    id: '5e017fc09db92493dfdbdb0c',
    pendingBalance: {
      amount: 62835.81,
      creditCount: 7439,
      creditTotal: 67373.51,
      debitCount: 305,
      debitTotal: 4577.7,
    },
    prepaidBalance: {
      amount: 0,
      creditCount: 0,
      creditTotal: 0,
      debitCount: 0,
      debitTotal: 0,
    },
    updatedAt: '2021-03-18T07:44:10.744Z',
    userId: 'setel-collection',
  },
  {
    availableBalance: {
      amount: 130044498.08,
      creditCount: 244,
      creditTotal: 130057978.4,
      debitCount: 101,
      debitTotal: 13480.32,
    },
    createdAt: '2020-02-26T16:17:16.227Z',
    currency: 'MYR',
    group: 'PLATFORM',
    id: '5e569a0c3e869e0010cf262f',
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
    updatedAt: '2021-03-18T02:43:15.170Z',
    userId: 'setel-mbb-trust1',
  },
  {
    availableBalance: {
      amount: -209.44,
      creditCount: 40400,
      creditTotal: 1528105.17,
      debitCount: 5605,
      debitTotal: 1528314.61,
    },
    createdAt: '2020-08-13T08:29:37.535Z',
    currency: 'MYR',
    group: 'PLATFORM',
    id: '5f34f9f1a9042900101a6ced',
    pendingBalance: {
      amount: 10837.05,
      creditCount: 1584,
      creditTotal: 11397.54,
      debitCount: 185,
      debitTotal: 560.49,
    },
    prepaidBalance: {
      amount: 0,
      creditCount: 0,
      creditTotal: 0,
      debitCount: 0,
      debitTotal: 0,
    },
    updatedAt: '2021-03-18T07:45:23.956Z',
    userId: 'operating-collection',
  },
];

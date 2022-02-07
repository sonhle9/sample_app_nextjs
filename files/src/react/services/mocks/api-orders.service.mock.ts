import {rest} from 'msw';
import {environment} from 'src/environments/environment';
import {
  createFixResponseHandler,
  createMockData,
  createPaginationHandler,
} from 'src/react/lib/mock-helper';

export const MOCK_FUEL_ORDERS = createMockData(
  [
    {
      orderId: 'ed5d9e6d01af4ea495aaa28cbc660b66',
      orderType: 'fuel',
      orderStatus: 'FUEL_ORDER_LOYALTY_POINTS_PETRONAS_SUCCESS',
      status: 'confirmed',
      amount: 3,
      stationId: 'RYW0013',
      stationName: 'PETRONAS Sri Sentosa',
      pumpId: '1',
      userId: 'b0af21db-a14a-4dfe-ac12-219f851af7df',
      userFullName: 'Dev',
      createdAt: '2021-02-15T13:20:45.699Z',
      paymentProvider: 'boost',
      walletBalance: 345,
      adminTags: ['charge_recovery_entered'],
      statusLabel: 'Confirmed',
    },
    {
      orderId: '52f8f541ed7e4ddbab434016a215b18b',
      orderType: 'fuel',
      orderStatus: 'FUEL_ORDER_LOYALTY_POINTS_PETRONAS_SUCCESS',
      status: 'confirmed',
      amount: 3,
      stationId: 'RYW0013',
      stationName: 'PETRONAS Sri Sentosa',
      pumpId: '1',
      userId: 'b0af21db-a14a-4dfe-ac12-219f851af7df',
      userFullName: 'Dev',
      createdAt: '2021-02-15T13:19:22.601Z',
      statusLabel: 'Confirmed',
      adminTags: ['double-charged'],
    },
    {
      orderId: 'b8598cc90852456685d54825761c2596',
      orderType: 'fuel',
      orderStatus: 'FUEL_ORDER_LOYALTY_POINTS_PETRONAS_SUCCESS',
      status: 'confirmed',
      amount: 3,
      stationId: 'RYW0013',
      stationName: 'PETRONAS Sri Sentosa',
      pumpId: '2',
      userId: 'b0af21db-a14a-4dfe-ac12-219f851af7df',
      userFullName: 'Dev',
      createdAt: '2021-02-15T13:17:26.189Z',
      statusLabel: 'Confirmed',
    },
    {
      orderId: '59256b67de304b9991a3f24e8dc26b1a',
      orderType: 'fuel',
      orderStatus: 'ORDER_CANCELED',
      status: 'canceled',
      stationId: 'RYW0013',
      stationName: 'PETRONAS Sri Sentosa',
      pumpId: '1',
      userId: 'a712f4ca-e286-4bd4-b136-077b6f764739',
      userFullName: 'Sasha',
      createdAt: '2021-02-15T13:14:53.576Z',
      statusLabel: 'Confirmed',
    },
    {
      orderId: '4bce2109935a46a38f4c8d56dcdc5810',
      orderType: 'fuel',
      orderStatus: 'ORDER_CANCELED',
      status: 'canceled',
      stationId: 'RYW0013',
      stationName: 'PETRONAS Sri Sentosa',
      pumpId: '2',
      userId: 'a712f4ca-e286-4bd4-b136-077b6f764739',
      userFullName: 'Sasha',
      createdAt: '2021-02-15T13:14:39.484Z',
      statusLabel: 'Confirmed',
    },
    {
      orderId: '9b9ba8a535ff442fb5702805980bc970',
      orderType: 'fuel',
      orderStatus: 'ORDER_CANCELED',
      status: 'canceled',
      stationId: 'RYW0013',
      stationName: 'PETRONAS Sri Sentosa',
      pumpId: '1',
      userId: 'a712f4ca-e286-4bd4-b136-077b6f764739',
      userFullName: 'Sasha',
      createdAt: '2021-02-15T13:14:21.332Z',
      statusLabel: 'Confirmed',
    },
  ],
  60,
  (seed, index) => ({
    ...seed,
    orderId: `${seed.orderId}${index}`,
  }),
);

const MOCK_ORDER = {
  orderId: 'ed5d9e6d01af4ea495aaa28cbc660b66',
  orderType: 'fuel',
  orderStatus: 'FUEL_ORDER_LOYALTY_POINTS_PETRONAS_SUCCESS',
  status: 'confirmed',
  amount: 3,
  stationId: 'RYW0013',
  stationName: 'PETRONAS Sri Sentosa',
  pumpId: '1',
  userId: 'b0af21db-a14a-4dfe-ac12-219f851af7df',
  userFullName: 'Dev',
  createdAt: '2021-02-15T13:20:45.699Z',
  paymentProvider: 'boost',
  walletBalance: 345,
  statusLabel: 'Confirmed',
};

export const MOCK_FUEL_ORDER_DETAILS = {
  invoice: {invoice: {id: '123', grandTotal: 100}},
  fuelOrderState: {
    completed: false,
    name: 'FUEL_ORDER_FULFILL_CONFIRMATION_ERROR',
    success: false,
    error: 'true',
    message: 'Fulfill Confirmation order error. Reason: Manual release by OPS',
  },
  fuelOrderStates: {
    init: {
      completed: {status: true, datetime: '2021-08-23T07:36:05.648Z'},
      skipped: {status: false},
      started: {status: true, datetime: '2021-08-23T07:36:04.980Z'},
    },
    externalInit: {completed: {status: false}, skipped: {status: false}, started: {status: false}},
    externalPayment: {
      completed: {status: false},
      skipped: {status: false},
      started: {status: false},
    },
    transactionInit: {
      completed: {status: true, datetime: '2021-08-23T07:36:06.436Z'},
      skipped: {status: false},
      started: {status: true, datetime: '2021-08-23T07:36:06.041Z'},
    },
    preAuth: {
      completed: {status: true, datetime: '2021-08-23T07:36:08.124Z'},
      skipped: {status: false},
      started: {status: true, datetime: '2021-08-23T07:36:06.638Z'},
    },
    fulfill: {
      completed: {status: true, datetime: '2021-08-23T07:36:08.536Z'},
      skipped: {status: false},
      started: {status: true, datetime: '2021-08-23T07:36:08.226Z'},
    },
    fulfillConfirmation: {
      completed: {status: false},
      skipped: {status: false},
      started: {status: false},
      error: {status: false},
    },
    charge: {completed: {status: false}, skipped: {status: false}, started: {status: false}},
    chargeRecovery: {
      completed: {status: false},
      skipped: {status: false},
      started: {status: false},
    },
    confirm: {completed: {status: false}, skipped: {status: false}, started: {status: false}},
    rewards: {completed: {status: false}, skipped: {status: false}, started: {status: false}},
    issueLoyaltyPointsSetel: {
      completed: {status: false},
      skipped: {status: false},
      started: {status: false},
    },
    issueLoyaltyPointsPetronas: {
      completed: {status: false},
      skipped: {status: false},
      started: {status: false},
    },
    cancel: {
      completed: {status: false},
      skipped: {status: false},
      started: {status: true, datetime: '2021-08-23T07:42:51.539Z'},
      holdAmountCancel: {
        completed: {status: true, datetime: '2021-08-23T07:42:52.427Z'},
        skipped: {status: false},
        started: {status: true, datetime: '2021-08-23T07:42:51.638Z'},
      },
      posOrderCancel: {
        completed: {status: false},
        skipped: {status: false},
        started: {status: true, datetime: '2021-08-23T07:42:51.539Z'},
        error: {
          message: 'Order cannot be cancelled becasuse its already in progress',
          stack: {
            statusCode: 400,
            name: 'BadRequestError',
            message: 'Order cannot be cancelled becasuse its already in progress',
          },
          statusCode: 500,
          datetime: '2021-08-23T07:42:51.575Z',
        },
      },
      reason: 'Canceled by Setel',
    },
  },
  orderId: '5dddb636019c48bcb0d43e26a24da0c0',
  orderType: 'Petrol',
  orderStatus: 'FUEL_ORDER_FULFILL_CONFIRMATION_ERROR',
  status: 'fuelFulfillmentError',
  statusLabel: 'Fuel Fulfillment Error',
  stationId: 'RYB9999',
  stationName: 'PETRONAS PUTRA BESTARI DEV',
  pumpId: '6',
  userId: '8e5d266e-a059-48b5-ad7b-cbb5e940b599',
  userFullName: 'nadhhthree',
  adminTags: [
    'recovery-fulfill-confirmation-lost-failed',
    'recovery-fulfill-confirmation-lost-entered',
  ],
  createdAt: '2021-08-23T07:36:05.635Z',
  paymentProvider: 'Setel Wallet',
  paymentAuthorizedAmount: 3.75,
};

const MOCK_ADMIN_TAGS = [{name: 'double-charged'}, {name: 'double-charge-entered'}];

export const apiFuelOrdersTestBaseUrl = `${environment.orderApiBaseUrl}/api/orders`;

export const handlers = [
  rest.get(
    `${apiFuelOrdersTestBaseUrl}/orders/admin/orders`,
    createPaginationHandler((req) => {
      const type = req.url.searchParams.get('type');
      if (type) {
        return MOCK_FUEL_ORDERS.filter((o) => o.orderType === type);
      }

      return MOCK_FUEL_ORDERS;
    }),
  ),
  rest.get(
    `${apiFuelOrdersTestBaseUrl}/admin/manual-release/orders/:id`,
    createFixResponseHandler({status: true}),
  ),
  rest.post(
    `${apiFuelOrdersTestBaseUrl}/admin/manual-release/orders/:id`,
    createFixResponseHandler({status: true}),
  ),
  rest.post(`${apiFuelOrdersTestBaseUrl}/orders/admin/orders/:id/payment/invoice`, (_, res, ctx) =>
    res(ctx.status(200)),
  ),
  rest.post(`${apiFuelOrdersTestBaseUrl}/orders/admin/orders/:id/payment/cancel`, (_, res, ctx) =>
    res(ctx.status(200)),
  ),
  rest.post(`${apiFuelOrdersTestBaseUrl}/orders/admin/orders/:id/payment/retry`, (_, res, ctx) =>
    res(ctx.status(200)),
  ),
  rest.get(`${apiFuelOrdersTestBaseUrl}/orders/admin/orders/:id`, (_, res, ctx) =>
    res(ctx.json(MOCK_FUEL_ORDER_DETAILS)),
  ),
  rest.get(`${apiFuelOrdersTestBaseUrl}/admin/tags`, (_, res, ctx) =>
    res(ctx.json(MOCK_ADMIN_TAGS)),
  ),
  rest.post(`${apiFuelOrdersTestBaseUrl}/admin/tags/:id`, (_, res, ctx) =>
    res(ctx.json(MOCK_ADMIN_TAGS)),
  ),
  rest.get(`${apiFuelOrdersTestBaseUrl}/orders/:id`, (req, res, ctx) =>
    res(ctx.json({...MOCK_ORDER, userId: req.params.id})),
  ),
];

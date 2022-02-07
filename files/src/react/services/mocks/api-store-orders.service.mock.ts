import {rest} from 'msw';
import {environment} from 'src/environments/environment';
import {
  createPaginationHandler,
  createMockData,
  createDetailHandler,
} from 'src/react/lib/mock-helper';

export const MOCK_STORE_ORDERS = [
  {
    id: 'order-1',
    orderId: 'order-1',
    storeName: 'Store 1',
    stationName: 'Station 1',
    userFullName: 'User 1',
    state: 'ORDER_ACKNOWLEDGED',
    status: 'acknowledged',
    totalAmount: 4.6,
    createdAt: '2020-12-14T20:34:44.929Z',
  },
  {
    id: 'order-2',
    orderId: 'order-2',
    storeName: 'Store 2',
    stationName: 'Station 2',
    userFullName: 'User 2',
    state: 'ORDER_POINTS_ISSUANCE_SUCCESS',
    status: 'pointIssuanceSuccess',
    totalAmount: 1.92,
    createdAt: '2020-12-15T03:16:44.257Z',
  },
  {
    id: 'order-3',
    orderId: 'order-3',
    storeName: 'Store 3',
    stationName: 'Station 3',
    userFullName: 'User 3',
    state: 'ORDER_CHARGE_ERROR',
    status: 'chargeError',
    totalAmount: 16,
    createdAt: '2020-12-15T10:03:26.766Z',
  },
];

export const MOCK_STORE_ORDERS_CSV = `id,orderId,storeName,stationName,userFullName,status,totalAmount,createdAt
order-1,order-1,Store 1,Station 1,User 1,acknowledged,1.7,Thu Dec 03 2020 08:13:30 GMT+0000 (Coordinated Universal Time)
order-2,order-2,Store 2,Station 2,User 2,acknowledged,1.7,Thu Dec 03 2020 08:13:30 GMT+0000 (Coordinated Universal Time)
order-3,order-3,Store 3,Station 3,User 3,acknowledged,1.7,Thu Dec 03 2020 08:13:30 GMT+0000 (Coordinated Universal Time)`;

const storeOrders = createMockData(
  [
    {
      id: '40d2ffa089814acc82feb9558980b115',
      stationName: 'PETRONAS PUTRA BESTARI DEV',
      userId: '913b8e72-848f-4ba1-b0c5-b894be58cdde',
      fullName: 'VESIXTEEN',
      merchantId: 'RYB9999S',
      vendorType: 'sapura',
      storeOrderStatus: 'errorPointIssuance',
      storeOrderState: 'CSTORE_ORDER_ISSUE_LOYALTY_POINTS_ERROR',
      retailerId: 'RYB9999',
      totalAmount: 10,
      createdAt: '2021-02-09T08:58:59.499Z',
      updatedAt: '2021-02-09T08:59:01.397Z',
    },
    {
      id: 'da037504c5ff47fd8a0e63aa99f01aee',
      stationName: 'PETRONAS PUTRA BESTARI DEV',
      userId: '255161e6-f33b-47a5-8f4e-4372ee9bae91',
      fullName: 'Vefifteen',
      merchantId: 'RYB9999S',
      vendorType: 'sapura',
      storeOrderStatus: 'errorPointIssuance',
      storeOrderState: 'CSTORE_ORDER_ISSUE_LOYALTY_POINTS_ERROR',
      retailerId: 'RYB9999',
      totalAmount: 10,
      createdAt: '2021-02-09T08:46:16.696Z',
      updatedAt: '2021-02-09T08:46:18.009Z',
    },
    {
      id: '5ec258be2a644b8fa4659824aac17281',
      stationName: 'PETRONAS SKVE',
      userId: 'c9359179-72d5-4a12-9e10-e05cf0e763e9',
      fullName: 'ALIFF IMRAN BIN ALADDIN',
      merchantId: 'RYB1100S',
      vendorType: 'sentinel',
      storeOrderStatus: 'confirmed',
      storeOrderState: 'CSTORE_ORDER_CONFIRM_SUCCESS',
      retailerId: 'RYB1100',
      totalAmount: 8.6,
      createdAt: '2021-02-16T00:37:16.855Z',
      updatedAt: '2021-02-16T00:37:18.511Z',
      paymentProvider: 'card',
      chargeTransactionId: '606a963ec006cc0010c392cf',
    },
    {
      id: '8d49a0f41d90418f8582bde629f05bf0',
      stationName: 'PETRONAS Bandar Universiti',
      userId: 'f04b8011-e481-4f26-8cc2-2453abf9feff',
      fullName: 'Marwan Yaacob',
      merchantId: 'RYA0658S',
      vendorType: 'sentinel',
      storeOrderStatus: 'successfulVoid',
      storeOrderState: 'CSTORE_ORDER_VOID_SUCCESS',
      retailerId: 'RYA0658',
      totalAmount: 11.3,
      createdAt: '2021-02-12T10:58:42.876Z',
      updatedAt: '2021-02-12T10:59:30.642Z',
    },
  ],
  75,
);

const storeOrdersBaseURL = `${environment.storeApiBaseUrl}/api/store-orders`;

export const handlers = [
  rest.get(
    `${storeOrdersBaseURL}/admin/store-orders`,
    createPaginationHandler((req) => {
      const status = req.url.searchParams.get('status');
      const vendorType = req.url.searchParams.get('vendorType');

      if (status || vendorType) {
        return storeOrders.filter((order) => {
          const matchStatus = !status || order.storeOrderStatus === status;
          const matchVendorType = !vendorType || order.vendorType === vendorType;
          return matchStatus && matchVendorType;
        });
      }

      return storeOrders;
    }),
  ),
  rest.get(`${storeOrdersBaseURL}/admin/store-orders/:id`, createDetailHandler(storeOrders, 'id')),
  rest.get(`${storeOrdersBaseURL}/admin/in-car`, createPaginationHandler(MOCK_STORE_ORDERS)),
  rest.get(`${storeOrdersBaseURL}/admin/in-car/csv`, (_req, res, ctx) => {
    return res(ctx.delay(0), ctx.text(MOCK_STORE_ORDERS_CSV));
  }),
  rest.get(`${storeOrdersBaseURL}/admin/in-car/:id`, createDetailHandler(MOCK_STORE_ORDERS, 'id')),
];

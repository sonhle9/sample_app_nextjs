import {rest} from 'msw';
import {environment} from 'src/environments/environment';
import {createPaginationHandler, createEmptyHandler} from 'src/react/lib/mock-helper';

export const MOCK_CHECKOUT_TRANSACTION = {
  error: null,
  currency: 'MYR',
  paymentMethod: {family: 'wallet', type: 'setel', brand: 'setel'},
  id: '612f43b707c15d0012c5e218',
  merchantId: 'setelecommerchant',
  referenceId: 'DEV-PRY-00003125',
  amount: 7.2,
  referenceType: 'api-ecom-orders',
  customer: {
    id: '6045cc1921bdd50011c63bd4',
    email: 'thomas@vmodev.com',
    name: 'Thomas dealer for tester Dao',
  },
  description:
    'User Thomas dealer for tester thomas@vmodev.com - order DEV-PRY-00003125 - amount 7.2 MYR',
  status: 'succeeded',
  paymentIntentStatus: 'succeeded',
  createdAt: new Date('2021-09-01T09:11:19.675Z'),
  updatedAt: new Date('2021-09-01T09:11:36.768Z'),
  merchantName: 'HugoABC',
  creditCardTransaction: undefined,
  webhookResponse: [],
};
const baseUrl = `${environment.checkoutsApiBaseUrl}/api/checkout`;
const payload = [
  MOCK_CHECKOUT_TRANSACTION,
  {
    ...MOCK_CHECKOUT_TRANSACTION,
    id: MOCK_CHECKOUT_TRANSACTION.id.replace('218', '219'),
    status: 'failed',
    paymentIntentStatus: 'failed',
    error: {code: 403, message: 'Internal server error'},
    merchantName: 'Diana Prince',
  },
  {
    ...MOCK_CHECKOUT_TRANSACTION,
    id: MOCK_CHECKOUT_TRANSACTION.id.replace('218', '220'),
    status: 'cancelled',
    paymentIntentStatus: 'cancelled',
    paymentMethod: {family: '', type: '', brand: ''},
    merchantName: 'Joker',
  },
  {
    ...MOCK_CHECKOUT_TRANSACTION,
    id: MOCK_CHECKOUT_TRANSACTION.id.replace('218', '221'),
    status: 'expired',
    paymentIntentStatus: 'expired',
    merchantName: 'Barry Allen',
  },
];

export const handlers = [
  rest.get(
    `${baseUrl}/admin/sessions`,
    createPaginationHandler((req) => {
      const paymentStatus = req.url.searchParams.get('paymentStatus');
      const paymentMethod = PAYMENT_METHOD_OPTIONS.find(
        (options) => options.value === req.url.searchParams.get('paymentMethod'),
      );
      const keyword = req.url.searchParams.get('keyword');

      if (paymentStatus) {
        return payload.filter((transaction) => transaction.paymentIntentStatus === paymentStatus);
      }
      if (paymentMethod) {
        return payload.filter(
          (transaction) =>
            transaction.paymentMethod.family === paymentMethod.paymentMethodFamily &&
            transaction.paymentMethod.type === paymentMethod.paymentMethodType &&
            transaction.paymentMethod.brand === paymentMethod.paymentMethodBrand,
        );
      }
      if (keyword) {
        return payload.filter(
          (transaction) =>
            transaction.id.toLowerCase().includes(keyword) ||
            transaction.merchantName.toLowerCase().includes(keyword),
        );
      }

      return payload;
    }),
  ),
];

export const emptyResponseHandler = rest.get(`${baseUrl}/admin/sessions`, createEmptyHandler());
export const serverErrorHandler = rest.get(`${baseUrl}/admin/sessions`, (_, res, ctx) =>
  res(ctx.status(500)),
);
export const singleDataResponseHandler = rest.get(
  `${baseUrl}/admin/sessions`,
  createPaginationHandler([MOCK_CHECKOUT_TRANSACTION]),
);

export const PAYMENT_METHOD_OPTIONS = [
  {
    label: 'All',
    value: '',
  },
  {
    label: 'Setel Wallet',
    value: 'wallet.setel',
    paymentMethodFamily: 'wallet',
    paymentMethodType: 'setel',
    paymentMethodBrand: 'setel',
  },
  {
    label: 'VISA',
    value: 'wallet.setel.visa',
    paymentMethodFamily: 'wallet',
    paymentMethodType: 'setel',
    paymentMethodBrand: 'visa',
  },
  {
    label: 'MasterCard',
    value: 'wallet.setel.mastercard',
    paymentMethodFamily: 'wallet',
    paymentMethodType: 'setel',
    paymentMethodBrand: 'mastercard',
  },
];

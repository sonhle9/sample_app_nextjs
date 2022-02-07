import {rest} from 'msw';
import {environment} from 'src/environments/environment';
import {
  createFixResponseHandler,
  createMockData,
  createPaginationHandler,
  createDetailHandler,
} from 'src/react/lib/mock-helper';
import {getId} from '@setel/portal-ui';

export const paymentTrxs = createMockData(
  [
    {
      id: '602868425ecd7500171458bd',
      error: {},
      subtype: 'REWARDS',
      status: 'expired',
      userId: '07698130-a257-427e-adac-bdffa84e771a',
      amount: 1,
      message: 'Multiple consequences',
      rawError: null,
      type: 'TOPUP',
      createdAt: '2021-02-14T00:01:06.417Z',
      updatedAt: '2021-02-14T00:01:06.417Z',
      fullName: 'Malcolm Kee',
      paymentMethod: 'wallet',
      paymentSubmethod: 'wallet_setel',
      walletBalance: 325,
    },
    {
      id: '60266f8147e0a900106bb4fb',
      error: {
        description: null,
      },
      userId: '07698130-a257-427e-adac-bdffa84e771a',
      orderId: '6f10fd58087247b0a14e7704e6b77ea3',
      amount: 500,
      type: 'AUTHORIZE',
      status: 'success',
      rawError: null,
      paymentMethod: 'card',
      paymentSubmethod: 'card_mastercard',
      paymentMethodData: {
        creditCardId: '60266cd447e0a900106bb4f8',
        cardBrand: 'MASTERCARD',
        cardCategory: '',
        paymentType: 'L_DC',
        issuingBank: 'Yuu Bank',
        firstSixDigits: 559998,
        lastFourDigits: 3996,
        transId: '60266f81d65acc0017ccedf9',
        chargeId: '60266f81d65acc0017ccedf8',
      },
      createdAt: '2021-02-12T12:07:29.334Z',
      updatedAt: '2021-02-12T12:07:29.334Z',
      fullName: 'Chloe',
      referenceType: 'fuel_order',
      stationName: 'PETRONAS Batu 5 Gombak',
    },
    {
      id: '60266d0547e0a900106bb4fa',
      error: {
        description: null,
      },
      userId: '07698130-a257-427e-adac-bdffa84e771a',
      orderId: 'e72ad153a5fb4bf2ab90279c3170a175',
      amount: 3,
      type: 'CAPTURE',
      status: 'success',
      rawError: null,
      paymentMethod: 'card',
      paymentSubmethod: 'card_mastercard',
      paymentMethodData: {
        cardBrand: 'MASTERCARD',
        cardCategory: '',
        paymentType: 'L_DC',
        issuingBank: 'Yuu Bank',
        firstSixDigits: 559998,
        lastFourDigits: 3996,
        transId: '60266d05d65acc0017ccedf7',
        chargeId: '60266cf3d6958d001780ccac',
        creditCardId: '60266cd447e0a900106bb4f8',
      },
      createdAt: '2021-02-12T11:56:53.601Z',
      updatedAt: '2021-02-12T11:56:53.601Z',
      fullName: 'Chloe',
    },
    {
      id: '60266cf347e0a900106bb4f9',
      error: {
        description: null,
      },
      userId: '07698130-a257-427e-adac-bdffa84e771a',
      orderId: 'e72ad153a5fb4bf2ab90279c3170a175',
      amount: 3,
      type: 'AUTHORIZE',
      status: 'success',
      rawError: null,
      paymentMethod: 'card',
      paymentSubmethod: 'card_mastercard',
      paymentMethodData: {
        creditCardId: '60266cd447e0a900106bb4f8',
        cardBrand: 'MASTERCARD',
        cardCategory: '',
        paymentType: 'L_DC',
        issuingBank: 'Yuu Bank',
        firstSixDigits: 559998,
        lastFourDigits: 3996,
        transId: '60266cf3d6958d001780ccad',
        chargeId: '60266cf3d6958d001780ccac',
      },
      createdAt: '2021-02-12T11:56:35.656Z',
      updatedAt: '2021-02-12T11:56:35.656Z',
      fullName: 'Chloe',
    },
    {
      id: '60266c7c47e0a900106bb4f7',
      error: {},
      userId: '07698130-a257-427e-adac-bdffa84e771a',
      orderId: '1b32317143634068aa0291be9d632e51',
      amount: 3,
      type: 'CAPTURE',
      status: 'success',
      rawError: null,
      createdAt: '2021-02-12T11:54:36.691Z',
      updatedAt: '2021-02-12T11:54:36.691Z',
      fullName: 'Chloe',
      paymentMethod: 'wallet',
      paymentSubmethod: 'wallet_setel',
    },
    {
      id: '60246e2bf9335b0017f12a0b',
      error: {},
      createdAt: '2021-02-10T23:37:15.363Z',
      updatedAt: '2021-02-10T23:37:15.985Z',
      amount: 20,
      message: null,
      rawError: null,
      status: 'success',
      subtype: 'TOPUP_CREDIT_CARD',
      type: 'TOPUP',
      userId: '7ef317dc-3633-46f3-9b7b-6d12134eeffd',
      fullName: 'sfsofi',
      paymentMethod: 'wallet',
      paymentSubmethod: 'wallet_setel',
    },
    {
      id: '60266c4347e0a900106bb4f3',
      error: {},
      createdAt: '2021-02-12T11:53:39.185Z',
      updatedAt: '2021-02-12T11:53:47.654Z',
      amount: 200,
      message: null,
      rawError: null,
      status: 'success',
      subtype: 'TOPUP_BANK_ACCOUNT',
      type: 'TOPUP',
      userId: '07698130-a257-427e-adac-bdffa84e771a',
      fullName: 'Chloe',
      paymentMethod: 'wallet',
      paymentSubmethod: 'wallet_setel',
    },
    {
      id: '602102e3c6fec9001701fdfa',
      error: {},
      type: 'TOPUP',
      status: 'success',
      createdAt: '2021-02-08T09:22:43.687Z',
      updatedAt: '2021-02-08T09:22:56.338Z',
      amount: 10,
      paymentMethod: 'wallet',
      paymentMethodData: {
        transId: '602102e3699a450010de00d6',
        chargeId: '602102e3699a450010de00d5',
      },
      paymentSubmethod: 'wallet_boost',
      subtype: 'TOPUP_DIGITAL_WALLET',
      userId: '75b46491-a765-4939-8b92-79213bcba6ad',
      fullName: 'Kimakkkk',
    },
    {
      error: {
        code: null,
      },
      tags: [],
      id: '606a963ec006cc0010c392cf',
      userId: '663358bf-5148-4782-967f-84797c74b2b2',
      orderId: '887cba7dafc14819857a43208c42bdcc',
      referenceId: '887cba7dafc14819857a43208c42bdcc',
      amount: 10,
      stationName: 'PETRONAS Jln Plumbum Sek 7',
      posTransactionId: '123456',
      type: 'PURCHASE',
      status: 'success',
      rawError: null,
      userFriendlyErrorMessage: null,
      referenceType: 'store_order',
      paymentMethod: 'card',
      paymentSubmethod: 'card_visa',
      expiryDate: '2021-04-05T05:16:54.248Z',
      webhookResponse: [],
      relatedTransactions: [],
      createdAt: '2021-04-05T04:46:54.503Z',
      updatedAt: '2021-04-05T04:46:54.503Z',
    },
  ],
  75,
  (seed, index) => ({
    ...seed,
    id: `${seed.id}-${index}`,
  }),
);

const BASE_URL = `${environment.paymentsApiBaseUrl}/api/payments`;

export const handlers = [
  rest.get(`${BASE_URL}/users/:userId/credit-cards`, createFixResponseHandler([])),
  rest.get(
    `${BASE_URL}/users/:userId/credit-cards/:cardId`,
    createFixResponseHandler([
      {
        isDefault: true,
        _deleted: false,
        _id: '609c95c0c312d200104cd538',
        cardCategory: '',
        cardSchema: 'visa',
        expiryDate: '11/25',
        firstEightDigits: '47231201',
        firstSixDigits: '472312',
        issuingBank: 'Yuu Bank',
        issuingCountry: 'Malaysia',
        lastFourDigits: '0206',
        paymentToken: 'mockTokenId1620874684276',
        paymentType: 'L_DC',
        tokenizationRequestId: '048afc1c-0f2c-4ec3-bef8-de69c3759c97|0206|1620874683',
        userId: '048afc1c-0f2c-4ec3-bef8-de69c3759c97',
        createdAt: '2021-05-13T02:58:08.507Z',
        updatedAt: '2021-05-13T02:58:08.507Z',
        __v: 0,
      },
    ]),
  ),
  rest.get(
    `${BASE_URL}/admin/transactions`,
    createPaginationHandler((req) => {
      const type = req.url.searchParams.get('type');
      const subtype = req.url.searchParams.get('subtype');

      if (type || subtype) {
        return paymentTrxs.filter((trx) => {
          const matchType = !type || trx.type === type;
          const matchSubtype = !subtype || trx.subtype === subtype;

          return matchType && matchSubtype;
        });
      }

      return paymentTrxs;
    }),
  ),
  rest.get(`${BASE_URL}/admin/transactions/:id`, createDetailHandler(paymentTrxs, 'id')),
  rest.get(`${BASE_URL}/admin/users/:id/wallet/incoming-balance`, (_, res, ctx) =>
    res(ctx.text('0')),
  ),
  rest.get(`${BASE_URL}/admin/users/:id/wallet/refresh-balance`, (req, res, ctx) =>
    res(ctx.json({id: req.params.id, balance: 200})),
  ),
  rest.get(
    `${BASE_URL}/admin/users/:userId/wallet/incoming-balance/transactions`,
    createFixResponseHandler([]),
  ),
  ...(function createBatchGrantBalanceHandlers() {
    const countMap = new Map<string, number>();

    return [
      rest.post(`${BASE_URL}/admin/batch-grant-balance`, (req, res, ctx) => {
        const body = req.body as any;
        const id = getId();

        countMap.set(id, body.items.length);

        return res(ctx.json({data: body.items, id}));
      }),
      rest.get(`${BASE_URL}/admin/batch-grant-balance-processed/:batchId`, (req, res, ctx) => {
        const total = countMap.get(req.params.batchId);
        return res(
          ctx.json({
            processed: total,
          }),
        );
      }),
    ];
  })(),
];

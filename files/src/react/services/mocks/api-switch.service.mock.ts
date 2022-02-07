import {formatDateUtc, getId} from '@setel/portal-ui';
import {rest} from 'msw';
import {environment} from 'src/environments/environment';
import {createDetailHandler, createPaginationHandler} from 'src/react/lib/mock-helper';

const MOCK_ROUTINGS = [
  {
    merchantId: '3333',
    priority: 1,
    name: 'Auto test TTQXS',
    type: 'MERCHANT',
    paymentMethod: 'wallet',
    criteria: [
      {type: 'TRANSACTION_TYPE', value: 'AUTHORIZE'},
      {type: 'DIGITAL_WALLET_TYPE', value: 'BOOST'},
      {type: 'MERCHANT_CATEGORY_CODE', value: '5541'},
    ],
    acquirerId: '600515083557a20010032816',
    status: 'DORMANT',
    acquirerName: 'Auto test GXKKG',
    createdAt: '2021-02-10T04:52:15.046Z',
    updatedAt: '2021-03-08T02:19:32.879Z',
    id: '6023667fcc1c05001055986c',
  },
  {
    merchantId: 'ddd',
    priority: 1,
    name: 'Auto test GVUMQ',
    type: 'MERCHANT',
    paymentMethod: 'card',
    criteria: [{type: 'TRANSACTION_TYPE', value: 'CAPTURE'}],
    acquirerId: '600515183557a20010032827',
    status: 'DORMANT',
    acquirerName: 'Auto test ETFFG',
    createdAt: '2021-02-10T04:52:11.964Z',
    updatedAt: '2021-02-10T04:52:11.964Z',
    id: '6023667b9a5754001175e4bb',
  },
  {
    merchantId: '4444',
    priority: 2,
    name: 'Auto test JUDGB',
    type: 'MERCHANT',
    paymentMethod: 'wallet',
    criteria: [
      {type: 'TRANSACTION_TYPE', value: 'AUTHORIZE'},
      {type: 'DIGITAL_WALLET_TYPE', value: 'BOOST'},
    ],
    acquirerId: '60050f903557a200100327f9',
    status: 'DORMANT',
    acquirerName: 'Auto test HVFOL',
    createdAt: '2021-01-18T04:56:45.824Z',
    updatedAt: '2021-02-10T04:52:17.825Z',
    id: '6005150d3557a20010032821',
  },
  {
    merchantId: null,
    name: 'E',
    type: 'PLATFORM',
    status: 'DORMANT',
    acquirerId: '5fbe09226c693a00170d96fc',
    acquirerName: 'Auto test HUYOX',
    criteria: [{type: 'TRANSACTION_TYPE', value: 'AUTHORIZE'}],
    paymentMethod: 'card',
    priority: 1,
    createdAt: '2020-11-25T07:35:35.640Z',
    updatedAt: '2021-02-10T04:52:18.643Z',
    id: '5fbe09477f7d070017dc88ce',
  },
];

const MOCK_ACQUIRERS = [
  {
    merchantIds: ['60540a447a301500104be6f9'],
    paymentProcessor: 'IPAY88',
    type: 'MERCHANT',
    name: 'CrystalMerchant4',
    credentials: {
      ipay88: {merchantCode: 'ABCDE211111', merchantKey: 'ABCDE211111', aesKey: 'ABCDE211111'},
    },
    status: 'ACTIVE',
    combinedName: 'CrystalMerchant4',
    createdAt: '2021-03-19T02:21:27.975Z',
    updatedAt: '2021-03-19T02:21:27.975Z',
    id: '60540aa7e716e800110d3e91',
  },
  {
    merchantIds: ['6041112e79013e001050b0df'],
    paymentProcessor: 'IPAY88',
    type: 'MERCHANT',
    name: 'CrystalMerchant3',
    credentials: {
      ipay88: {merchantCode: 'ABCDE111111', merchantKey: 'ABCDE111111', aesKey: 'ABCDE111111'},
    },
    status: 'ACTIVE',
    combinedName: 'CrystalMerchant3',
    createdAt: '2021-03-18T11:29:22.834Z',
    updatedAt: '2021-03-18T11:29:22.834Z',
    id: '60533992e716e800110d3e83',
  },
  {
    merchantIds: ['6041112e79013e001050b0df'],
    paymentProcessor: 'IPAY88',
    type: 'MERCHANT',
    name: 'Hello',
    combinedName: 'Hello',
    status: 'ACTIVE',
    credentials: {ipay88: {merchantCode: 'abc222', merchantKey: 'abc222', aesKey: 'abc222'}},
    createdAt: '2021-03-18T11:26:01.208Z',
    updatedAt: '2021-03-18T11:26:01.208Z',
    id: '605338c9e716e800110d3e82',
  },
  {
    merchantIds: [],
    paymentProcessor: 'BOOST',
    type: 'PLATFORM',
    name: 'CrystalMerchant1',
    credentials: {
      boost: {apiKey: 'apiKey', apiSecretKey: 'apiSecretKey', merchantId: 'ABCD111111'},
    },
    status: 'ACTIVE',
    combinedName: 'CrystalMerchant1',
    createdAt: '2021-03-18T11:06:41.036Z',
    updatedAt: '2021-03-18T11:06:41.036Z',
    id: '60533441e716e800110d3e81',
  },
  {
    merchantIds: [],
    paymentProcessor: 'BOOST',
    type: 'PLATFORM',
    name: 'Name',
    credentials: {boost: {apiKey: 'apiKey', apiSecretKey: 'apiSecretKey', merchantId: 'ABC111111'}},
    status: 'PENDING',
    combinedName: 'Name',
    createdAt: '2021-03-18T10:57:29.186Z',
    updatedAt: '2021-03-18T10:57:29.186Z',
    id: '60533219e716e800110d3e80',
  },
  {
    merchantIds: ['3333'],
    paymentProcessor: 'IPAY88',
    type: 'MERCHANT',
    name: 'Auto test FSGVO',
    credentials: {ipay88: {merchantCode: 'OKKGX', merchantKey: '123SATRW', aesKey: '1234LRWLJ'}},
    status: 'DORMANT',
    combinedName: 'Auto test FSGVO',
    createdAt: '2021-02-10T04:52:18.179Z',
    updatedAt: '2021-02-10T04:52:18.329Z',
    id: '602366829a5754001175e4c1',
  },
  {
    merchantIds: ['1122'],
    paymentProcessor: 'IPAY88',
    type: 'MERCHANT',
    name: 'Auto test NSOSO',
    credentials: {ipay88: {merchantCode: 'QGCJK', merchantKey: '123KYADH', aesKey: '1234VHMNA'}},
    status: 'DORMANT',
    combinedName: 'Auto test NSOSO',
    createdAt: '2021-02-10T04:52:15.032Z',
    updatedAt: '2021-02-10T04:52:15.032Z',
    id: '6023667fcc1c05001055986b',
  },
  {
    merchantIds: ['4444'],
    paymentProcessor: 'BOOST',
    type: 'MERCHANT',
    name: 'Auto test ISCZD',
    credentials: {boost: {merchantId: 'FACCW', apiKey: '123GRTYA', apiSecretKey: '1234QCGUC'}},
    status: 'PENDING',
    combinedName: 'Auto test ISCZD',
    createdAt: '2021-02-10T04:52:13.149Z',
    updatedAt: '2021-02-10T04:52:13.149Z',
    id: '6023667dcc1c05001055986a',
  },
  {
    merchantIds: ['test-gateway-20210125'],
    paymentProcessor: 'BOOST',
    type: 'MERCHANT',
    name: 'TEST05022021',
    combinedName: 'TEST05022021',
    status: 'ACTIVE',
    credentials: {
      boost: {apiKey: 'APIkey', apiSecretKey: 'secretkey', merchantId: 'test-gateway-20210125'},
    },
    createdAt: '2021-02-05T10:42:52.404Z',
    updatedAt: '2021-02-05T10:42:52.404Z',
    id: '601d212cfe2e4c0010cecc16',
  },
  {
    merchantIds: ['test-gateway-20210120'],
    paymentProcessor: 'BOOST',
    type: 'MERCHANT',
    name: 'ACQ-ENTEST',
    combinedName: 'ACQ-ENTEST',
    status: 'ACTIVE',
    credentials: {boost: {apiKey: '0209', apiSecretKey: '0209', merchantId: 'EN FINAL'}},
    createdAt: '2021-02-05T04:33:46.808Z',
    updatedAt: '2021-02-05T04:33:46.808Z',
    id: '601ccaaab260010010559f35',
  },
];

const baseUrl = `${environment.switchApiBaseUrl}/api/switch`;

export const handlers = [
  rest.get(
    `${baseUrl}/admin/routings`,
    createPaginationHandler((req) => {
      const acquirerName = req.url.searchParams.get('acquirerName');
      return MOCK_ROUTINGS.filter(
        (routing) =>
          !acquirerName || routing.acquirerName.toUpperCase().includes(acquirerName.toUpperCase()),
      );
    }),
  ),
  rest.get(`${baseUrl}/admin/routings/:id`, createDetailHandler(MOCK_ROUTINGS, 'id')),
  rest.post(`${baseUrl}/admin/routings`, (req, res, ctx) => {
    const now = formatDateUtc(new Date());
    const providedData = req.body as any;
    const matchedAcquirer =
      providedData.acquirerId && MOCK_ACQUIRERS.find((ac) => ac.id === providedData.acquirerId);

    const result = Object.assign(
      {},
      providedData,
      {
        createdAt: now,
        updatedAt: now,
        id: getId(),
      },
      matchedAcquirer
        ? {
            acquirerName: matchedAcquirer.name,
          }
        : {},
    );

    MOCK_ROUTINGS.unshift(result);

    return res(ctx.json(result), ctx.status(201));
  }),
  rest.get(
    `${baseUrl}/admin/acquirers`,
    createPaginationHandler((req) => {
      const combinedName = req.url.searchParams.get('combinedName');
      return MOCK_ACQUIRERS.filter(
        (acq) =>
          !combinedName || acq.combinedName.toUpperCase().includes(combinedName.toUpperCase()),
      );
    }),
  ),
  rest.get(`${baseUrl}/admin/acquirers/:id`, createDetailHandler(MOCK_ACQUIRERS, 'id')),
  rest.post(`${baseUrl}/admin/acquirers`, (req, res, ctx) => {
    const now = formatDateUtc(new Date());
    const providedData = req.body as any;

    const result = {
      ...providedData,
      createdAt: now,
      updatedAt: now,
      id: getId(),
    };

    MOCK_ACQUIRERS.unshift(result);

    return res(ctx.json(result), ctx.status(201));
  }),
];

import {rest} from 'msw';
import {environment} from 'src/environments/environment';
import {OperationType} from '../point-rules.type';

const pointBaseURL = `${environment.variablesBaseUrl}/api/points-rules/admin`;

export const handlers = [
  rest.get(`${pointBaseURL}/enterpriseRules`, (req, res, ctx) => {
    const operationType = req.url.searchParams.get('operationType');

    if (operationType === OperationType.EARN) {
      return res(ctx.json(MOCK_EARNING_RULES));
    } else {
      return res(ctx.json(MOCK_REDEMPTION_RULES));
    }
  }),
  rest.get(`${pointBaseURL}/loyalty-categories`, (_, res, ctx) =>
    res(ctx.json(MOCK_LOYALTY_CATEGORIES)),
  ),
  rest.get(`${pointBaseURL}/loyalty-categories/:code`, (req, res, ctx) => {
    const {code} = req.params;

    return res(ctx.json(MOCK_LOYALTY_CATEGORIES.find((c) => c.categoryCode === code)));
  }),
  rest.get(`${pointBaseURL}/rules/:id`, (req, res, ctx) => {
    const {id} = req.params;

    return res(ctx.json(MOCK_RULE_DETAILS.find((rule) => rule.id === id)));
  }),
  rest.put(`${pointBaseURL}/rules/:id`, (req, res, ctx) => res(ctx.json(req.body))),
  rest.get(`${pointBaseURL}/expiry`, (_, res, ctx) => res(ctx.json(MOCK_POINT_EXPIRIES))),
];

const MOCK_POINT_EXPIRIES = [
  {
    cardCategory: ['60224fb15402b100102e0b78'],
    id: '602b27a3cf7fd40017caea69',
    status: 'enabled',
    expiryType: 'rolling',
    operationType: 'earn',
    source: 'litre',
    target: 'myr',
    sourceType: 'fuel_volume',
    expireAfter: {days: 1235, id: null},
    createdAt: '2021-02-16T02:02:11.500Z',
    updatedAt: '2021-02-16T02:02:19.608Z',
  },
  {
    cardCategory: ['60224fb15402b100102e0b78'],
    id: '602dcd2c033d0c5592beb8f3',
    status: 'enabled',
    expiryType: 'hard',
    operationType: 'earn',
    sourceType: 'fuel_volume',
    expireAfter: {days: 123, id: null},
    createdAt: '2021-02-17T09:48:54.084Z',
    updatedAt: '2021-02-17T09:48:54.084Z',
  },
  {
    cardCategory: ['5f588bc3e292c000114630a8'],
    id: '602dd2d2349a9e0011fb0559',
    status: 'enabled',
    expiryType: 'rolling',
    operationType: 'earn',
    sourceType: 'loyalty_point',
    expireAfter: {days: 100, id: null},
    createdAt: '2021-02-18T02:37:06.987Z',
    updatedAt: '2021-02-18T02:40:15.334Z',
  },
];

const MOCK_REDEMPTION_RULES = [
  {
    isEnterprise: true,
    itemCategory: [],
    cardCategory: [],
    id: '5f586149ba45610010704ce7',
    targetType: 'currency',
    target: 'myr',
    sourceType: 'loyalty_point',
    operationType: 'redemption',
    unit: 'money',
    status: 'enabled',
    priority: 2,
    ratio: 0.01,
    source: 'mesra',
    enterpriseName: 'setel-admins',
    createdAt: '2020-09-09T04:59:53.065Z',
    updatedAt: '2020-09-09T04:59:53.065Z',
  },
  {
    isEnterprise: true,
    itemCategory: [],
    cardCategory: [],
    id: '5f586150ba45610010704ce8',
    targetType: 'currency',
    target: 'myr',
    sourceType: 'loyalty_point',
    operationType: 'redemption',
    unit: 'money',
    status: 'enabled',
    priority: 3,
    source: 'litre',
    ratio: 0.0025,
    enterpriseName: 'setel-admins',
    createdAt: '2020-09-09T05:00:00.919Z',
    updatedAt: '2020-09-09T05:00:00.919Z',
  },
  {
    isEnterprise: true,
    itemCategory: [],
    cardCategory: [],
    id: '5f586163ba45610010704ce9',
    targetType: 'currency',
    target: 'myr',
    sourceType: 'loyalty_point',
    operationType: 'redemption',
    unit: 'money',
    status: 'enabled',
    priority: 4,
    source: 'myr',
    ratio: 0.008,
    enterpriseName: 'setel-admins',
    createdAt: '2020-09-09T05:00:19.714Z',
    updatedAt: '2020-09-09T05:00:19.714Z',
  },
];

const MOCK_EARNING_RULES = [
  {
    isEnterprise: true,
    itemCategory: [],
    cardCategory: [],
    id: '5f586149ba45610010704ce7',
    targetType: 'currency',
    target: 'myr',
    sourceType: 'loyalty_point',
    operationType: 'earn',
    unit: 'money',
    status: 'enabled',
    priority: 2,
    ratio: 0.01,
    source: 'mesra',
    enterpriseName: 'setel-admins',
    createdAt: '2020-09-09T04:59:53.065Z',
    updatedAt: '2020-09-09T04:59:53.065Z',
  },
  {
    isEnterprise: true,
    itemCategory: [],
    cardCategory: [],
    id: '5f586150ba45610010704ce8',
    targetType: 'currency',
    target: 'myr',
    sourceType: 'loyalty_point',
    operationType: 'earn',
    unit: 'money',
    status: 'enabled',
    priority: 3,
    source: 'litre',
    ratio: 0.0025,
    enterpriseName: 'setel-admins',
    createdAt: '2020-09-09T05:00:00.919Z',
    updatedAt: '2020-09-09T05:00:00.919Z',
  },
  {
    isEnterprise: true,
    itemCategory: [],
    cardCategory: [],
    id: '5f586163ba45610010704ce9',
    targetType: 'currency',
    target: 'myr',
    sourceType: 'loyalty_point',
    operationType: 'earn',
    unit: 'money',
    status: 'enabled',
    priority: 4,
    source: 'myr',
    ratio: 0.008,
    enterpriseName: 'setel-admins',
    createdAt: '2020-09-09T05:00:19.714Z',
    updatedAt: '2020-09-09T05:00:19.714Z',
  },
];

export const MOCK_CARD_CATEGORIES = ['30 - AirAsia', '31 - BigPay'];

export const MOCK_ITEM_CATEGORIES = [
  '0101 - Primax 3',
  '0102 - Prima 2',
  '0103 - Diesel',
  '0104 - NGV',
  '0105 - Kerosene',
  '0108 - EURO 5 (Diesel)',
  '0200 - Lubricants',
  '0201 - Automotive',
  '0202 - Motor',
  '0203 - Car care',
  '0299 - Others',
  '0300 - Alt service',
];

const MOCK_RULE_DETAILS = [
  {
    isEnterprise: true,
    itemCategory: [
      '0101 - Primax 3',
      '0102 - Prima 2',
      '0103 - Diesel',
      '0104 - NGV',
      '0105 - Kerosene',
      '0108 - EURO 5 (Diesel)',
      '0200 - Lubricants',
      '0201 - Automotive',
      '0202 - Motor',
      '0203 - Car care',
      '0299 - Others',
      '0300 - Alt service',
    ],
    cardCategory: ['30 - AirAsia', '31 - BigPay'],
    id: '5f7303688b92fd00171051c8',
    operationType: 'earn',
    unit: 'money',
    status: 'enabled',
    priority: 1,
    title: 'Test',
    sourceType: 'currency',
    source: 'litre',
    targetType: 'loyalty_point',
    target: 'mesra',
    ratio: 0.01,
    startAt: '2020-10-27T16:00:00.000Z',
    expireAt: '2020-10-30T16:00:00.000Z',
    enterpriseName: 'setel-admins',
    createdAt: '2020-09-29T09:50:32.027Z',
    updatedAt: '2020-09-29T09:50:32.027Z',
  },
  {
    isEnterprise: true,
    itemCategory: [],
    cardCategory: [],
    id: '5f73f1f68b92fd00171051c9',
    sourceType: 'loyalty_point',
    operationType: 'redemption',
    unit: 'money',
    status: 'enabled',
    priority: 1,
    source: 'mesra',
    targetType: 'currency',
    target: 'mesra',
    ratio: 0.01,
    enterpriseName: 'setel-admins',
    createdAt: '2020-09-30T02:48:22.945Z',
    updatedAt: '2020-09-30T02:48:22.945Z',
  },
];

const MOCK_LOYALTY_CATEGORIES = [
  {
    id: '5f86bf23d184a4001099b6c7',
    categoryCode: 'A201',
    categoryName: 'Automotive',
    categoryDescription: '',
    createdAt: '2020-10-14T09:04:36.157Z',
    updatedAt: '2020-10-15T00:50:29.661Z',
  },
  {
    id: '5f86c06fd184a4001099b6c8',
    categoryCode: 'ABCD',
    categoryName: 'xsxa',
    categoryDescription: 'string',
    createdAt: '2020-10-14T09:10:07.073Z',
    updatedAt: '2020-10-14T09:10:07.073Z',
  },
  {
    id: '5f86c08dd184a4001099b6c9',
    categoryCode: 'ABCE',
    categoryName: 'xs',
    categoryDescription: 'string',
    createdAt: '2020-10-14T09:10:37.004Z',
    updatedAt: '2020-10-14T09:10:37.004Z',
  },
  {
    id: '5f8ea8d3e1acfa0010e36dc8',
    categoryName: '0001',
    categoryCode: '0106',
    categoryDescription: 'Vehicle unleaded oil',
    createdAt: '2020-10-20T09:07:31.438Z',
    updatedAt: '2020-10-20T12:32:20.943Z',
  },
];

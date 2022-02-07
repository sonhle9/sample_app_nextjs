import {formatDateUtc, getId} from '@setel/web-utils';
import {rest} from 'msw';
import {environment} from 'src/environments/environment';
import {
  createPaginationHandler,
  createMockData,
  createFixResponseHandler,
  createDetailHandler,
} from 'src/react/lib/mock-helper';

const mobileVersions = createMockData(
  [
    {
      platform: 'ios',
      version: '2.2.2',
      createdAt: '2019-06-27T14:13:49.552Z',
      releaseDate: '2222-02-22T12:22:00.000Z',
      status: 'inactive',
      updatedAt: '2020-06-10T16:59:16.866Z',
      id: '5d14cf1d7c2a77623c9b2220',
    },
    {
      platform: 'android',
      version: '1.45.0',
      createdAt: '2020-06-10T16:53:31.193Z',
      releaseDate: '2020-06-01T16:53:00.000Z',
      status: 'inactive',
      updatedAt: '2020-11-02T04:31:17.521Z',
      id: '5ee1100b18fcfc0c962c3c01',
    },
    {
      platform: 'ios',
      version: '1.1.121',
      createdAt: '2019-06-27T14:02:43.837Z',
      releaseDate: '2020-01-06T05:00:00.000Z',
      status: 'inactive',
      updatedAt: '2019-06-27T14:09:18.456Z',
      id: '5d14cc837c2a77623c9b12b4',
    },
  ],
  30,
  (seed, index) => ({
    ...seed,
    id: `${seed.id}${index}`,
  }),
);

const SYSTEM_STATE = {
  createdAt: '2019-11-15T07:33:10.304Z',
  id: '5dce54b6d7e7f40064934a18',
  malaysia: {
    android: false,
    ios: false,
    changeReason: 'app-maintenance:ios:end',
    currentAnnouncementColour: null,
    currentAnnouncementText: null,
    currentAnnouncementTextLocale: null,
    entireSystem: false,
    features: {
      redeemLoyaltyPoints: false,
      topUpWithBank: false,
      topUpWithCard: false,
    },
    futureMaintenancePeriods: [
      {
        country: 'malaysia',
        endDate: null,
        id: '60c0498a688e43ed5c7d8fbb',
        scope: 'Android',
        startDate: '2021-06-09T04:54:34.923Z',
      },
    ],
    services: {
      accounts: false,
      emails: false,
      loyalty: false,
      orders: false,
      payments: false,
      rewards: false,
      stations: false,
      storeOrders: true,
    },
    vendors: {
      cardtrendLms: false,
      kiple: false,
      pos: false,
      posSapura: false,
      posSentinel: false,
      silverstreet: false,
    },
  },
  updatedAt: '2021-06-09T05:29:30.455Z',
};

const IPAY88_BANKS = [
  {
    createdAt: '2020-09-10T09:50:21.737Z',
    id: '5f59f6dd6f60330025d2cd55',
    imageUrl: '/images/banks/maybank.png',
    isMaintenance: true,
    name: 'Maybank',
    paymentId: 6,
    popular: true,
    updatedAt: '2021-06-09T02:08:47.768Z',
  },
  {
    createdAt: '2020-09-10T09:50:21.749Z',
    id: '5f59f6dd6f60330025d2cd56',
    imageUrl: '/images/banks/cimb.png',
    isMaintenance: true,
    name: 'CIMB Bank',
    paymentId: 20,
    popular: true,
    updatedAt: '2021-06-09T02:19:48.462Z',
  },
  {
    createdAt: '2020-09-10T09:50:21.763Z',
    id: '5f59f6dd6f60330025d2cd57',
    imageUrl: '/images/banks/ambank.png',
    isMaintenance: true,
    name: 'Ambank',
    paymentId: 10,
    popular: true,
    updatedAt: '2021-06-09T02:19:06.794Z',
  },
  {
    createdAt: '2020-09-10T09:50:21.774Z',
    id: '5f59f6dd6f60330025d2cd58',
    imageUrl: '/images/banks/rhb.png',
    isMaintenance: true,
    name: 'RHB Bank',
    paymentId: 14,
    popular: true,
    updatedAt: '2021-06-09T02:19:48.840Z',
  },
  {
    createdAt: '2020-09-10T09:50:21.781Z',
    id: '5f59f6dd6f60330025d2cd59',
    imageUrl: '/images/banks/hong_leong.png',
    isMaintenance: false,
    name: 'Hong Leong Bank',
    paymentId: 15,
    popular: true,
    updatedAt: '2021-01-05T02:30:25.477Z',
  },
];

const BASE_URL = `${environment.maintenanceApiBaseUrl}/api/maintenance`;

export const handlers = [
  rest.get(
    `${BASE_URL}/maintenance/system-state`,
    createFixResponseHandler({
      malaysia: {
        features: {topUpWithBank: false, topUpWithCard: false, redeemLoyaltyPoints: false},
        services: {
          accounts: false,
          orders: false,
          emails: false,
          loyalty: false,
          payments: false,
          rewards: false,
          stations: false,
          storeOrders: false,
        },
        vendors: {
          cardtrendLms: false,
          kiple: false,
          pos: false,
          silverstreet: false,
          posSapura: false,
          posSentinel: false,
        },
        changeReason: 'vendors-maintenance:toggle',
        currentAnnouncementText: null,
        futureMaintenancePeriods: [],
        entireSystem: false,
        android: false,
        ios: false,
        currentAnnouncementColour: null,
        currentAnnouncementTextLocale: null,
      },
      createdAt: '2019-11-15T07:33:10.304Z',
      updatedAt: '2021-01-29T09:01:49.695Z',
      id: '5dce54b6d7e7f40064934a18',
    }),
  ),
  rest.get(
    `${BASE_URL}/mobile-versions`,
    createPaginationHandler(mobileVersions, {
      bodyMapper: (info) => ({
        data: info.data,
        pagination: {
          total: info.total,
        },
      }),
    }),
  ),
  rest.get(`${BASE_URL}/mobile-versions/:id`, createDetailHandler(mobileVersions, 'id')),
  rest.post(`${BASE_URL}/mobile-versions`, (req, res, ctx) => {
    const id = getId();
    const now = formatDateUtc(new Date());
    const result = {
      ...(req.body as any),
      createdAt: now,
      updatedAt: now,
      id,
    };

    mobileVersions.unshift(result);

    return res(ctx.status(201), ctx.json(result));
  }),
  rest.put(`${BASE_URL}/mobile-versions/:id`, (req, res, ctx) => {
    const id = req.params.id;
    const matched = mobileVersions.find((v) => v.id === id);

    Object.assign(matched, req.body, {
      updatedAt: formatDateUtc(new Date()),
    });

    return res(ctx.status(201), ctx.json(matched));
  }),
  rest.delete(`${BASE_URL}/mobile-versions/:id`, (req, res, ctx) => {
    const matchedVersion = mobileVersions.splice(
      mobileVersions.findIndex((v) => v.id === req.params.id),
      1,
    );

    return res(ctx.json(matchedVersion));
  }),
  rest.get(`${BASE_URL}/system-state`, (_, res, ctx) => {
    return res(ctx.json(SYSTEM_STATE));
  }),
  rest.get(`${environment.maintenanceApiBaseUrl}/api/wallets/admin/ipay88_banks`, (_, res, ctx) => {
    return res(ctx.json(IPAY88_BANKS));
  }),
];

import {rest} from 'msw';
import {environment} from 'src/environments/environment';
import {WaitingArea, WaitingAreaStatus} from 'src/react/modules/waiting-areas/waiting-areas.types';
import {
  ActivityTypeEnum,
  UserTypeEnum,
  FulfilmentStatusEnum,
  FulfilmentTypeEnum,
  IStore,
  IStoreHistory,
  StoresStatusesEnum,
  StoreTriggerEnum,
  InterfaceEnum,
  IStoreHistoryUser,
} from '../api-stores.type';

const SAMPLE_STORES: IStore[] = [
  {
    createdAt: '2020-11-06T08:00:00.000Z',
    id: 'abc123',
    storeId: 'abc123',
    name: 'Mesra 1',
    stationId: 'abc123',
    status: StoresStatusesEnum.ACTIVE,
    stationName: 'PETRONAS abc123',
  },
  {
    createdAt: '2020-11-06T08:00:00.000Z',
    id: 'def456',
    storeId: 'def456',
    name: 'Mesra 2',
    stationId: 'def456',
    status: StoresStatusesEnum.ACTIVE,
    stationName: 'PETRONAS def456',
  },
  {
    createdAt: '2020-11-06T08:00:00.000Z',
    id: 'ghi789',
    storeId: 'ghi789',
    name: 'Mesra 3',
    stationId: 'ghi789',
    status: StoresStatusesEnum.COMING_SOON,
    stationName: 'PETRONAS ghi789',
  },
  {
    createdAt: '2020-11-06T08:00:00.000Z',
    id: 'jkl012',
    storeId: 'jkl012',
    name: 'Mesra 4',
    stationId: 'jkl012',
    status: StoresStatusesEnum.INACTIVE,
    stationName: 'PETRONAS jkl012',
  },
];

const SAMPLE_STORE: IStore = {
  createdAt: '2020-11-06T08:00:00.000Z',
  id: 'store-abc123',
  isMesra: false,
  storeId: 'store-abc123',
  merchantId: 'merchant-abc123',
  name: 'Mesra 1',
  stationId: 'station-abc123',
  status: StoresStatusesEnum.ACTIVE,
  stationName: 'PETRONAS abc123',
  fulfilments: [{type: FulfilmentTypeEnum.DELIVER_TO_VEHICLE, status: FulfilmentStatusEnum.ACTIVE}],
};

const SAMPLE_WAITING_AREAS: WaitingArea[] = [
  {
    tags: ['Petronas Stesyen Bestari'],
    name: 'waiting area 2',
    longitude: 12312,
    latitude: 12412,
    status: WaitingAreaStatus.OFF,
    createdAt: '2021-08-27T07:35:56.783Z',
    updatedAt: '2021-08-27T07:35:56.783Z',
    id: '612895dce26a986e7a8f56cb',
  },
  {
    tags: ['mutiara damansara', 'RYW001'],
    name: 'waiting area 1',
    longitude: 0,
    latitude: 0,
    status: WaitingAreaStatus.ON,
    createdAt: '2021-08-26T09:20:59.995Z',
    updatedAt: '2021-08-26T09:20:59.995Z',
    id: '61275cfb74490c42ea633f7d',
  },
];

const SAMPLE_WAITING_AREA: WaitingArea = {
  tags: ['Petronas Stesyen Bestari'],
  name: 'name 123',
  longitude: 12312,
  latitude: 12412,
  status: WaitingAreaStatus.OFF,
  createdAt: '2021-08-27T07:35:56.783Z',
  updatedAt: '2021-08-27T07:35:56.783Z',
  id: 'abc123',
  nameLocale: {
    en: 'name 123',
    ms: 'Malay',
    'zh-Hans': 'Simplified',
    'zh-Hant': 'Traditional',
    ta: 'Tamil',
  },
};

const SAMPLE_ACTIVITY_LOGS: IStoreHistory[] = [
  {
    dateTime: '2021-12-13T02:23:57.540Z',
    activityType: ActivityTypeEnum.UPDATE,
    prevStatus: StoresStatusesEnum.INACTIVE,
    newStatus: StoresStatusesEnum.INACTIVE,
    oldValues: {
      isDeleted: false,
      createdAt: '2021-11-23T07:48:34.582Z',
      hasCookingGas: false,
      operatingHours: [
        {
          timeSlots: [
            {
              from: 470,
              to: 1200,
            },
            {
              from: 1400,
              to: 1440,
            },
          ],
          day: 3,
        },
      ],
      items: [],
      triggers: [
        {
          catalogueSetId: '',
          event: StoreTriggerEnum.APP_ORDERING_SHOP_ONLY,
          status: 'active',
        },
        {
          catalogueSetId: '',
          event: StoreTriggerEnum.APP_ORDERING_SHOP_WHILE_FUELLING,
          status: 'inactive',
        },
      ],
      fulfilments: [
        {
          type: FulfilmentTypeEnum.DELIVER_TO_VEHICLE,
          status: FulfilmentStatusEnum.INACTIVE,
        },
      ],
      name: 'Store 1',
      stationId: 'RYB0003',
      status: StoresStatusesEnum.INACTIVE,
      merchantId: '',
      pdbMerchantId: 'merchant_RYB0003',
      location: {
        latitude: 3.073868,
        longitude: 101.584236,
      },
      isMesra: true,
      stationName: 'PETRONAS SS 17/2 Subang Jaya',
      storeId: 'e6a1d0a5779845e89e21f70df71c8c32',
    },
    newValues: {
      isDeleted: false,
      createdAt: '2021-11-23T07:48:34.582Z',
      hasCookingGas: false,
      operatingHours: [
        {
          timeSlots: [
            {
              from: 470,
              to: 1200,
            },
            {
              from: 1400,
              to: 1440,
            },
          ],
          day: 5,
        },
      ],
      items: [],
      triggers: [
        {
          catalogueSetId: '',
          event: StoreTriggerEnum.APP_ORDERING_SHOP_ONLY,
          status: 'active',
        },
        {
          catalogueSetId: '',
          event: StoreTriggerEnum.APP_ORDERING_SHOP_WHILE_FUELLING,
          status: 'inactive',
        },
      ],
      fulfilments: [
        {
          type: FulfilmentTypeEnum.DELIVER_TO_VEHICLE,
          status: FulfilmentStatusEnum.INACTIVE,
        },
      ],
      name: 'Store 1',
      stationId: 'RYB0003',
      status: StoresStatusesEnum.INACTIVE,
      merchantId: '',
      pdbMerchantId: 'merchant_RYB0003',
      location: {
        latitude: 3.073868,
        longitude: 101.584236,
      },
      isMesra: true,
      stationName: 'PETRONAS SS 17/2 Subang Jaya',
      storeId: 'e6a1d0a5779845e89e21f70df71c8c32',
    },
    changes: [
      {
        fieldName: 'Wednesday',
        key: 'operatingHours',
        oldValue: [
          {
            from: 470,
            to: 1200,
          },
          {
            from: 1400,
            to: 1440,
          },
        ],
        newValue: '-',
      },
      {
        fieldName: 'Friday',
        key: 'operatingHours',
        oldValue: '-',
        newValue: [
          {
            from: 470,
            to: 1200,
          },
          {
            from: 1400,
            to: 1440,
          },
        ],
      },
    ],
    updatedBy: {
      userName: 'Test User 1',
      userId: 'test-user-id-1',
      userType: UserTypeEnum.ADMIN,
    },
    storeId: 'store-id-1',
    interface: InterfaceEnum.ADMIN,
    id: '61b6aebda0b76c136cc447f6',
  },
  {
    dateTime: '2021-12-13T02:21:03.076Z',
    activityType: ActivityTypeEnum.UPDATE,
    prevStatus: StoresStatusesEnum.INACTIVE,
    newStatus: StoresStatusesEnum.INACTIVE,
    oldValues: {
      isDeleted: false,
      createdAt: '2021-11-23T07:48:34.582Z',
      hasCookingGas: false,
      operatingHours: [
        {
          timeSlots: [
            {
              from: 470,
              to: 1200,
            },
            {
              from: 1400,
              to: 1440,
            },
          ],
          day: 4,
        },
      ],
      items: [],
      triggers: [
        {
          catalogueSetId: '',
          event: StoreTriggerEnum.APP_ORDERING_SHOP_ONLY,
          status: 'active',
        },
        {
          catalogueSetId: '',
          event: StoreTriggerEnum.APP_ORDERING_SHOP_WHILE_FUELLING,
          status: 'inactive',
        },
      ],
      fulfilments: [
        {
          type: FulfilmentTypeEnum.DELIVER_TO_VEHICLE,
          status: FulfilmentStatusEnum.INACTIVE,
        },
      ],
      name: 'Store 1',
      stationId: 'RYB0003',
      status: StoresStatusesEnum.INACTIVE,
      merchantId: '',
      pdbMerchantId: 'merchant_RYB0003',
      location: {
        latitude: 3.073868,
        longitude: 101.584236,
      },
      isMesra: true,
      stationName: 'PETRONAS SS 17/2 Subang Jaya',
      storeId: 'e6a1d0a5779845e89e21f70df71c8c32',
    },
    newValues: {
      isDeleted: false,
      createdAt: '2021-11-23T07:48:34.582Z',
      hasCookingGas: false,
      operatingHours: [
        {
          timeSlots: [
            {
              from: 470,
              to: 1200,
            },
            {
              from: 1400,
              to: 1440,
            },
          ],
          day: 3,
        },
      ],
      items: [],
      triggers: [
        {
          catalogueSetId: '',
          event: StoreTriggerEnum.APP_ORDERING_SHOP_ONLY,
          status: 'active',
        },
        {
          catalogueSetId: '',
          event: StoreTriggerEnum.APP_ORDERING_SHOP_WHILE_FUELLING,
          status: 'inactive',
        },
      ],
      fulfilments: [
        {
          type: FulfilmentTypeEnum.DELIVER_TO_VEHICLE,
          status: FulfilmentStatusEnum.INACTIVE,
        },
      ],
      name: 'Store 2',
      stationId: 'RYB0003',
      status: StoresStatusesEnum.INACTIVE,
      merchantId: '',
      pdbMerchantId: 'merchant_RYB0003',
      location: {
        latitude: 3.073868,
        longitude: 101.584236,
      },
      isMesra: true,
      stationName: 'PETRONAS SS 17/2 Subang Jaya',
      storeId: 'e6a1d0a5779845e89e21f70df71c8c32',
    },
    changes: [
      {
        fieldName: 'Store Name',
        key: 'name',
        oldValue: 'Store 1',
        newValue: 'Store 2',
      },
    ],
    updatedBy: {
      userName: 'Test User 2',
      userId: 'test-user-id-2',
      userType: UserTypeEnum.ADMIN,
    },
    storeId: 'store-id-1',
    interface: InterfaceEnum.ADMIN,
    id: '61b6ae0f9d4af40f54d2e768',
  },
];

const SAMPLE_ACTIVITY_LOGS_USERS: IStoreHistoryUser[] = [
  {
    userId: 'test-user-id-1',
    userName: 'Test User 1',
  },
];

const MOCK_STORE_HISTORY_CSV = `dateTime,activityType,prevStatus,newStatus,newValues.storeId,oldValues.storeId,changes,updatedBy.userName
Fri Dec 17 2021 10:37:22 GMT+0800 (Malaysia Time),updated,active,active,store-id-1,store-id-1,[{"fieldName":"Friday","key":"operatingHours","oldValue":"-","newValue":[{"from":470,"to":1200},{"from":1400,"to":1440}]}]],username-1
Fri Dec 17 2021 10:37:22 GMT+0800 (Malaysia Time),updated,inactive,active,store-id-1,store-id-1,[{"key":"status","oldValue":"inactive","newValue":"active"}],username-2
Fri Dec 17 2021 10:37:22 GMT+0800 (Malaysia Time),created,inactive,active,store-id-1,store-id-1,[{"key":"name","oldValue":"name1","newValue":"name2"}],username-3`;

export const handlers = [
  rest.get(`${environment.storeApiBaseUrl}/api/stores/admin/stores`, (_, res, ctx) => {
    return res(ctx.json(SAMPLE_STORES));
  }),
  rest.get(`${environment.storeApiBaseUrl}/api/stores/admin/stores/:id`, (_, res, ctx) => {
    return res(ctx.json(SAMPLE_STORE));
  }),
  rest.get(`${environment.storeApiBaseUrl}/api/stores/admin/waiting-areas`, (_, res, ctx) => {
    return res(ctx.json(SAMPLE_WAITING_AREAS));
  }),
  rest.get(`${environment.storeApiBaseUrl}/api/stores/admin/waiting-areas/:id`, (_, res, ctx) => {
    return res(ctx.json(SAMPLE_WAITING_AREA));
  }),
  rest.get(`${environment.storeApiBaseUrl}/api/stores/activity-logs`, (_, res, ctx) => {
    return res(ctx.json(SAMPLE_ACTIVITY_LOGS));
  }),
  rest.get(`${environment.storeApiBaseUrl}/api/stores/activity-logs/users`, (_, res, ctx) => {
    return res(ctx.json(SAMPLE_ACTIVITY_LOGS_USERS));
  }),
  rest.get(`${environment.storeApiBaseUrl}/api/stores/activity-logs/csv`, (_, res, ctx) => {
    return res(ctx.delay(0), ctx.text(MOCK_STORE_HISTORY_CSV));
  }),
];

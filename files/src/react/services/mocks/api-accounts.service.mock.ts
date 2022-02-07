import {rest} from 'msw';
import {environment} from 'src/environments/environment';
import {createMockData, createPaginationHandler} from 'src/react/lib/mock-helper';
import {MOCK_USERS} from './api-ops.service.mock';

const devices = createMockData(
  [
    {
      id: '602a4cc1033d0c5592067be4',
      deviceId: '01e8d380379979f5',
      userId: 'efeaf1ce-6b29-465d-922a-4c1e5309c1db',
      createdAt: '2021-02-15T10:28:17.038Z',
      updatedAt: '2021-02-15T10:28:17.038Z',
      verified: false,
    },
    {
      id: '602a414f033d0c5592040552',
      deviceId: '5197EDBA-41DB-44B0-A66D-8FB455916636',
      userId: 'dfb4e57c-6940-487b-ade0-4d263738be35',
      createdAt: '2021-02-15T09:39:27.354Z',
      updatedAt: '2021-02-15T09:39:27.354Z',
      verified: false,
    },
    {
      id: '5e65fe2251543408583396f7',
      deviceId: 'e085e81a854eff53',
      userId: '8379df93-feaa-4d08-8c89-053876bb0303',
      createdAt: '2020-03-09T08:28:18.296Z',
      updatedAt: '2020-03-24T02:02:47.701Z',
      verified: false,
      isBlocked: true,
      remark: 'dasd',
    },
  ],
  75,
  (seed, index) => ({
    ...seed,
    id: `${seed.id}${index}`,
    deviceId: `${seed.deviceId}${index}`,
  }),
);

const MOCK_USER_DEVICES = {
  data: [
    {
      id: '5e30ea2addcd08a3389703b7',
      deviceId: 'A68F556A-AF60-406C-96FD-0FDA0BFE03F0',
      userId: '336540ee-dbf9-4f26-8b34-3c2450437f44',
      createdAt: '2020-01-29T02:12:58.165Z',
      updatedAt: '2020-01-29T02:12:58.165Z',
      verified: false,
    },
    {
      id: '5e29733addcd08a3388bb343',
      deviceId: '219E150F-44AB-4257-B433-7B4A533DC376',
      userId: '336540ee-dbf9-4f26-8b34-3c2450437f44',
      createdAt: '2020-01-23T10:19:38.400Z',
      updatedAt: '2020-01-29T17:34:42.962Z',
      verified: false,
      isBlocked: true,
    },
    {
      id: '5e1ff662ddcd08a338ba9068',
      deviceId: '39892D82-E7EC-451C-995A-4B3B8BB37733',
      userId: '336540ee-dbf9-4f26-8b34-3c2450437f44',
      createdAt: '2020-01-16T05:36:34.843Z',
      updatedAt: '2020-01-16T05:36:34.843Z',
      verified: false,
    },
  ],
  pagination: {
    total: 3,
  },
};

const baseUrl = `${environment.accountsApiBaseUrl}/api/idp`;

export const handlers = [
  rest.get(
    `${baseUrl}/devices`,
    createPaginationHandler(devices, {
      bodyMapper: (info) => ({
        data: info.data,
        pagination: {
          total: info.total,
        },
      }),
    }),
  ),
  rest.get(`${baseUrl}/devices/:id`, (req, res, ctx) => {
    const deviceIndex = devices.findIndex((dev) => dev.id === req.params.id);

    if (deviceIndex < 0) {
      return res(ctx.status(404));
    }

    return res(
      ctx.json({
        device: devices[deviceIndex],
        users: [MOCK_USERS[deviceIndex], MOCK_USERS[deviceIndex * 2 + 1]]
          .filter(Boolean)
          .map((user) => ({
            ...user,
            fullName: user.name,
            deviceCreatedAt: user.createdAt,
            username: user.phone,
          })),
      }),
    );
  }),
  rest.get(`${baseUrl}/profiles/:id`, (req, res, ctx) => {
    const currentProfile = {
      internal: false,
      emailVerified: false,
      tags: [],
      userId: req.params.id,
      createdAt: '2021-02-12T13:47:41.630Z',
      email: 'megatest943@setel.my',
      fullName: 'Megatest',
      phone: '601666999943',
      updatedAt: '2021-02-12T13:47:42.681Z',
      referrerCode: '',
      registrationCompleted: true,
      id: '602686fda31e4d00172df8c0',
    };
    return res(ctx.json(currentProfile));
  }),
  rest.get(`${baseUrl}/accounts/:id/devices`, (_, res, ctx) => res(ctx.json(MOCK_USER_DEVICES))),
];

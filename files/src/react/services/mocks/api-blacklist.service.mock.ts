import {formatDateUtc} from '@setel/portal-ui';
import {rest} from 'msw';
import {ICustomerLimitationType, IPeriodCustomerAccumulation} from 'src/app/api-blacklist-service';
import {environment} from 'src/environments/environment';
import {
  createFixResponseHandler,
  createPaginationHandler,
  createMockData,
  createDetailHandler,
} from 'src/react/lib/mock-helper';

export const fraudProfiles = createMockData(
  [
    {
      remarks: 'High risk for number of devices linked',
      targetId: '0d7c3353-ed38-4f72-9e67-81f0efc0d9ec',
      targetName: 'Smartpay Dev One',
      targetType: 'USER',
      status: 'CLEARED',
      restrictions: [],
      createdAt: '2021-02-11T05:46:03.225Z',
      updatedAt: '2021-02-11T09:41:13.276Z',
      id: '6024c49b3a9e960017b20075',
    },
    {
      remarks: 'Medium risk for number of devices linked',
      targetId: '4f94a7e2-b9bc-49b7-9547-43e118f92c0d',
      targetName: 'GAPhysicalCard',
      targetType: 'USER',
      status: 'CLEARED',
      restrictions: [],
      createdAt: '2021-02-10T16:20:26.520Z',
      updatedAt: '2021-02-10T16:38:32.459Z',
      id: '602407ca2b718c0018577b15',
    },
    {
      remarks: 'Medium risk for number of devices linked',
      targetId: '3d0bc295-87fe-4676-bca0-d130e1feb958',
      targetName: 'Some One',
      targetType: 'USER',
      status: 'WATCHLISTED',
      restrictions: [
        {type: 'USER_LOGIN', value: 'BLOCK'},
        {type: 'USER_TOPUP', value: 'BLOCK'},
        {type: 'USER_CHARGE', value: 'BLOCK'},
      ],
      createdAt: '2021-02-10T14:16:21.738Z',
      updatedAt: '2021-02-10T14:16:21.738Z',
      id: '6023eab52b718c0018577b14',
    },
    {
      remarks: 'Medium risk for number of devices linked',
      targetId: 'b96d6547-615d-4a07-a723-7a15a61bd0d1',
      targetName: 'Azri Test Four',
      targetType: 'USER',
      status: 'WATCHLISTED',
      restrictions: [],
      createdAt: '2021-02-10T07:55:09.979Z',
      updatedAt: '2021-02-10T07:55:09.979Z',
      id: '6023915d5fa66c001738a811',
    },
  ],
  75,
  (seed, index) => ({
    ...seed,
    id: `${seed.id}${index}`,
  }),
);

export const customerAccumulations: IPeriodCustomerAccumulation[] = [
  {
    userId: 'adaae01a-8421-49f5-9c24-b91d815cddfa',
    chargeLimit: 2000,
    numberTransactionLimit: 10,
    maxTransactionAmount: 500,
    type: ICustomerLimitationType.DAILY,
    chargeAccumulation: 1,
    numberTransactionAccumulation: 111,
    metadata: {
      interfaceType: 'app',
      osVersion: '11',
      osType: 'Android',
      isDeviceSupported: true,
    },
  },
  {
    userId: 'adaae01a-8421-49f5-9c24-b91d815cddfb',
    chargeLimit: 2000,
    numberTransactionLimit: 10,
    maxTransactionAmount: 500,
    type: ICustomerLimitationType.DAILY,
    chargeAccumulation: 1,
    numberTransactionAccumulation: 111,
    metadata: {
      interfaceType: 'app',
      osVersion: '4',
      osType: 'Android',
      isDeviceSupported: false,
    },
  },
  {
    userId: 'adaae01a-8421-49f5-9c24-b91d815cddfa',
    chargeLimit: 3000,
    type: ICustomerLimitationType.MONTHLY,
    chargeAccumulation: 2,
    numberTransactionAccumulation: 222,
  },
  {
    userId: 'adaae01a-8421-49f5-9c24-b91d815cddfa',
    chargeLimit: 36000,
    type: ICustomerLimitationType.ANNUALLY,
    chargeAccumulation: 3,
    numberTransactionAccumulation: 333,
  },
];
const BASE_URL = `${environment.blacklistApiBaseUrl}/api/blacklist`;

export const handlers = [
  rest.get(
    `${BASE_URL}/admin/fraudProfiles`,
    createPaginationHandler((req) => {
      const targetName = req.url.searchParams.get('targetName');

      if (targetName) {
        return fraudProfiles.filter((profile) =>
          profile.targetName.toUpperCase().includes(targetName.toUpperCase()),
        );
      }
      const targetId = req.url.searchParams.get('targetId');
      if (targetId) {
        return fraudProfiles.filter((profile) =>
          profile.targetId.toUpperCase().includes(targetId.toUpperCase()),
        );
      }
      return fraudProfiles;
    }),
  ),
  rest.get(`${BASE_URL}/admin/fraudProfiles/:id`, createDetailHandler(fraudProfiles, 'id')),
  rest.put(`${BASE_URL}/admin/fraudProfiles/:id`, (req, res, ctx) => {
    const matchedProfile = fraudProfiles.find((p) => p.id === req.params.id);

    if (!matchedProfile) {
      return res(ctx.status(404));
    }

    Object.assign(matchedProfile, {
      ...(req.body as any),
      updatedAt: formatDateUtc(new Date()),
    });

    return res(ctx.json(matchedProfile));
  }),
  rest.get(
    `${BASE_URL}/users/:userId/daily-customer-accumulation`,
    createFixResponseHandler({
      userId: 'd812d91d-fd8b-48d9-b889-25150c93c38f',
      chargeAccumulation: 0,
      numberTransactionAccumulation: 0,
      chargeLimit: 2000,
      numberTransactionLimit: 10,
      maxTransactionAmount: 500,
    }),
  ),

  rest.get(
    `${BASE_URL}/users/:userId/customer-accumulation`,
    createFixResponseHandler(customerAccumulations),
  ),
  rest.put(
    `${BASE_URL}/users/:userId/customer-limitations`,
    createFixResponseHandler(customerAccumulations),
  ),
];

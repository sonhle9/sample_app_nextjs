import {rest} from 'msw';
import {environment} from 'src/environments/environment';
import {createPaginationHandler} from 'src/react/lib/mock-helper';

const MOCKED_HISTORY = [
  {
    circleId: '6135816cf1c9160012ec6f73',
    status: 'blocked',
    isDeleted: false,
    createdAt: '2021-09-06T02:48:12.110Z',
    paymentMethod: {
      id: 'a2d043614c9fefcae1cfcc81a481f24c824a371c3bd2e0162aa03e24708f11bf',
      type: 'wallet_setel',
    },
    role: 'owner',
    memberStatus: '',
  },
];

const baseUrl = `${environment.circlesApiBaseUrl}/api/circles`;

export const handlers = [
  rest.get(
    `${baseUrl}/admin/circles/users/:userId/history`,
    createPaginationHandler(() => {
      return MOCKED_HISTORY;
    }),
  ),
];

import {rest} from 'msw';
import {environment} from 'src/environments/environment';
import {createFixResponseHandler} from 'src/react/lib/mock-helper';

const BASE_URL = `${environment.balanceExpiryApiBaseUrl}/api/balance-expiry`;

export const handlers = [
  rest.get(
    `${BASE_URL}/admin/user/:userId/expiry-balance`,
    createFixResponseHandler({expiryBalance: 0}),
  ),
];

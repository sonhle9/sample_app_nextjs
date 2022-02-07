import {flattenArray} from '@setel/portal-ui';
import {rest} from 'msw';
import {environment} from 'src/environments/environment';
import * as roles from 'src/shared/helpers/roles.type';

const allPermissions = flattenArray(
  Object.values(roles).map((roleObjects) => Object.values(roleObjects)),
);

const BASE_URL = `${environment.iamApiBaseUrl}/api/iam`;

export const handlers = [
  rest.get(`${BASE_URL}/:namespace/users/:userId/permissions`, (_, res, ctx) =>
    res(ctx.json(allPermissions)),
  ),
];

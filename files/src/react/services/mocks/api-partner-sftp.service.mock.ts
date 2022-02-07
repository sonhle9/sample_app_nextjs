import {rest} from 'msw';
import {environment} from 'src/environments/environment';

const sftpConnections = [
  {
    id: 'connectionId01',
    targetType: 'merchant',
    targetId: 'merchantId',
    host: 'sftp-public-s3.setel.com',
    port: 22,
    username: 'api-settlements',
  },
];

const BASE_URL = `${environment.walletApiBaseUrl}/api/partner-sftp`;

export const handlers = [
  rest.get(`${BASE_URL}/admin/connections?targetType=merchant&targetId=merchantId`, (_, res, ctx) =>
    res(ctx.json({data: sftpConnections})),
  ),
  rest.post(`${BASE_URL}/admin/connections`, (_, res, ctx) =>
    res(ctx.json({data: sftpConnections[0]})),
  ),
  rest.put(`${BASE_URL}/admin/connections/connectionId`, (_, res, ctx) =>
    res(ctx.json({data: sftpConnections[0]})),
  ),
];

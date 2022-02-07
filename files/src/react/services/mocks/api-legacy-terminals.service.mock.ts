import {getId} from '@setel/web-utils';
import {rest} from 'msw';
import {environment} from 'src/environments/environment';
import {createMockData, createPaginationHandler} from 'src/react/lib/mock-helper';

export const terminals = createMockData(
  [
    {
      id: '1293812093810928312',
      terminalId: '00000001',
      status: 'ACTIVE',
      type: 'EDC',
      serialNumber: 'serial-123',
      deploymentDate: new Date('2020-10-01'),
      modelTerminal: '1234',
      merchant: {
        id: '60236698fdc64c00179b20a0',
        name: 'Merchant_Search_By_ID',
      },
      createdAt: new Date('2020-09-30').toLocaleDateString(),
      updatedAt: new Date('2020-09-30').toLocaleDateString(),
      remarks: 'For testing only',
    },
    {
      id: '129381209381092832',
      terminalId: '00000002',
      status: 'SUSPENDED',
      type: 'IPT',
      serialNumber: 'serial-123',
      deploymentDate: new Date('2020-10-01'),
      modelTerminal: '1234',
      merchant: {
        id: '602366961b8e4a001740d59f',
        name: 'Merchant_Search_By_Name',
      },
      createdAt: new Date('2020-09-30').toLocaleDateString(),
      updatedAt: new Date('2020-09-30').toLocaleDateString(),
      remarks: 'For testing only',
    },
    {
      id: '129380209381092832',
      terminalId: '00000003',
      status: 'NEW',
      type: 'OPT',
      serialNumber: 'serial-123',
      deploymentDate: new Date('2020-10-01'),
      modelTerminal: '1234',
      merchant: {
        id: 'merchant_id',
        name: 'Merchant Name',
      },
      createdAt: new Date('2020-09-30').toLocaleDateString(),
      updatedAt: new Date('2020-09-30').toLocaleDateString(),
      remarks: 'For testing only',
    },
  ],
  200,
);

export const acquirers = createMockData(
  [
    {
      id: '1293812093810928312',
      status: 'ACTIVE',
      mid: 'mid1',
      tid: 'tid1',
      acqurierType: 'gift',
      cardBrands: ['petronasGift'],
      terminalObjectId: '1293812093810928312',
      createdAt: new Date('2020-09-30').toLocaleDateString(),
      updatedAt: new Date('2020-09-30').toLocaleDateString(),
    },
    {
      id: '1293812093810928312',
      status: 'ACTIVE',
      mid: 'mid2',
      tid: 'tid2',
      acqurierType: 'loyalty',
      cardBrands: ['petronasMesra'],
      terminalObjectId: '1293812093810928312',
      createdAt: new Date('2020-09-30').toLocaleDateString(),
      updatedAt: new Date('2020-09-30').toLocaleDateString(),
    },
  ],
  2,
);

export const MOCK_FULL_MID_TID_REPORT = [
  {
    scheduleDate: '2021-11-30T16:00:00.000Z',
    createdAt: '2021-12-28T09:51:39.751Z',
    isGenerated: true,
    s3ObjectKey: 'dev/full-tid-mid-mapping-report/2021-12-01.csv',
    updatedAt: '2021-12-28T09:51:49.068Z',
    generatedAt: '2021-12-28T09:51:42.365Z',
    fileName: '20211201_full_mapping',
    id: '61cade2b2613c077c4b3aaf3',
  },
  {
    scheduleDate: '2021-10-31T16:00:00.000Z',
    createdAt: '2021-12-28T09:51:39.625Z',
    isGenerated: true,
    s3ObjectKey: 'dev/full-tid-mid-mapping-report/2021-11-01.csv',
    updatedAt: '2021-12-28T09:51:49.455Z',
    generatedAt: '2021-12-28T09:51:49.452Z',
    fileName: '20211101_full_mapping',
    id: '61cade2b2613c077c4b3aaf2',
  },
  {
    scheduleDate: '2021-09-30T16:00:00.000Z',
    createdAt: '2021-12-28T09:51:39.544Z',
    isGenerated: false,
    s3ObjectKey: 'dev/full-tid-mid-mapping-report/2021-10-01.csv',
    updatedAt: '2021-12-28T09:51:39.544Z',
    fileName: '20211001_full_mapping',
    id: '61cade2b2613c077c4b3aaf1',
  },
  {
    scheduleDate: '2021-08-31T16:00:00.000Z',
    createdAt: '2021-12-28T09:51:39.462Z',
    isGenerated: false,
    s3ObjectKey: 'dev/full-tid-mid-mapping-report/2021-09-01.csv',
    updatedAt: '2021-12-28T09:51:39.462Z',
    fileName: '20210901_full_mapping',
    id: '61cade2b2613c077c4b3aaf0',
  },
  {
    scheduleDate: '2021-07-31T16:00:00.000Z',
    createdAt: '2021-12-28T09:51:33.708Z',
    isGenerated: true,
    s3ObjectKey: 'dev/full-tid-mid-mapping-report/2021-08-01.csv',
    updatedAt: '2021-12-28T09:51:39.913Z',
    generatedAt: '2021-12-28T09:51:39.911Z',
    fileName: '20210801_full_mapping',
    id: '61cade252613c077c4b3aaee',
  },
  {
    scheduleDate: '2021-06-30T16:00:00.000Z',
    createdAt: '2021-12-28T09:51:30.424Z',
    isGenerated: false,
    s3ObjectKey: 'dev/full-tid-mid-mapping-report/2021-07-01.csv',
    updatedAt: '2021-12-28T09:51:33.632Z',
    fileName: '20210701_full_mapping',
    id: '61cade222613c077c4b3aae9',
  },
  {
    scheduleDate: '2021-05-31T16:00:00.000Z',
    createdAt: '2021-12-28T09:51:26.879Z',
    isGenerated: false,
    s3ObjectKey: 'dev/full-tid-mid-mapping-report/2021-06-01.csv',
    updatedAt: '2021-12-28T09:51:33.584Z',
    fileName: '20210601_full_mapping',
    id: '61cade1e2613c077c4b3aae4',
  },
  {
    scheduleDate: '2021-04-30T16:00:00.000Z',
    createdAt: '2021-12-28T08:50:18.921Z',
    isGenerated: false,
    s3ObjectKey: 'dev/full-tid-mid-mapping-report/2021-05-01.csv',
    updatedAt: '2021-12-28T09:51:33.460Z',
    fileName: '20210501_full_mapping',
    id: '61cacfca71feae3abe26fd8b',
  },
  {
    scheduleDate: '2021-03-31T16:00:00.000Z',
    createdAt: '2021-12-28T08:50:18.838Z',
    isGenerated: true,
    s3ObjectKey: 'dev/full-tid-mid-mapping-report/2021-04-01.csv',
    updatedAt: '2021-12-28T09:51:33.915Z',
    generatedAt: '2021-12-28T09:51:33.912Z',
    fileName: '20210401_full_mapping',
    id: '61cacfca71feae3abe26fd8a',
  },
];

const fullMidTidReportMock = createMockData(
  MOCK_FULL_MID_TID_REPORT,
  MOCK_FULL_MID_TID_REPORT.length,
);

const BASE_URL = `${environment.terminalAPIBaseUrl}/api/legacy-terminals`;

export const handlers = [
  rest.get(
    `${BASE_URL}/admin/full-mid-tid-mapping-reports`,
    createPaginationHandler(() => {
      return fullMidTidReportMock;
    }),
  ),
  rest.get(
    `${BASE_URL}/terminals`,
    createPaginationHandler((req) => {
      const merchantId = req.url.searchParams.get('merchantId');
      const status = req.url.searchParams.get('status');
      const type = req.url.searchParams.get('type');
      if (merchantId) {
        return terminals.filter((t) => t.merchant.id === merchantId);
      }
      if (status) {
        return terminals.filter((t) => t.status === status);
      }
      if (type) {
        return terminals.filter((t) => t.type === type);
      }
      return terminals;
    }),
  ),
  rest.post(`${BASE_URL}/terminals`, (req, res, ctx) => {
    const body = req.body as Record<string, string>;
    const data = {
      ...body,
      id: getId(),
      merchant: {
        id: body.merchantId,
        name: 'Merchant_For_New_Terminal',
      },
    };
    terminals.push(data as any);
    return res(ctx.json(data));
  }),
  rest.get(`${BASE_URL}/terminals/:tId/merchant/:mId`, (req, res, ctx) => {
    const mId = req.params['mId'];
    const tId = req.params['tId'];
    const terminal = terminals.find((t) => t.terminalId === tId && t.merchant.id === mId);
    return res(ctx.json({terminal, replacement: null}));
  }),
  rest.put(`${BASE_URL}/terminals/:tId/merchant/:mId`, (req, res, ctx) => {
    const mId = req.params['mId'];
    const tId = req.params['tId'];
    const index = terminals.findIndex((t) => t.terminalId === tId && t.merchant.id === mId);
    if (index === -1) {
      return res(
        ctx.status(403),
        ctx.json({
          message: 'Terminal not found',
        }),
      );
    }
    terminals[index] = {
      ...terminals[index],
      ...(req.body as Record<string, string>),
    };
    return res(ctx.json(terminals[index]));
  }),
  rest.get(
    `${BASE_URL}/admin/terminals/:tId/merchant/:mId/acquirers`,
    createPaginationHandler((req) => {
      const merchantId = req.url.searchParams.get('merchantId');
      const terminalId = req.url.searchParams.get('terminalId');
      const terminal = terminals.find(
        (el) => el.merchant.id === merchantId && el.terminalId === terminalId,
      );
      return acquirers.filter((t) => t.terminalObjectId === terminal.id);
    }),
  ),
  rest.post(`${BASE_URL}/admin/terminals/:tId/merchant/:mId/acquirers`, (req, res, ctx) => {
    const body = req.body as Record<string, string>;
    const data = {
      ...body,
      id: getId(),
    };
    acquirers.push(data as any);
    return res(ctx.json(data));
  }),
  rest.get(`${BASE_URL}/admin/terminals/:tId/merchant/:mId/acquirers/:aId`, (req, res, ctx) => {
    const aId = req.params['aId'];
    const acquirer = acquirers.find((el) => el.id === aId);

    return res(ctx.json(acquirer));
  }),
  rest.put(`${BASE_URL}/admin/terminals/:tId/merchant/:mId/acquirers/:aId`, (req, res, ctx) => {
    const aId = req.params['aId'];

    const index = acquirers.findIndex((t) => t.id === aId);
    if (index === -1) {
      return res(
        ctx.status(403),
        ctx.json({
          message: 'Acquirer not found',
        }),
      );
    }
    acquirers[index] = {
      ...acquirers[index],
      ...(req.body as Record<string, string>),
    };
    return res(ctx.json(acquirers[index]));
  }),
];

import {rest} from 'msw';
import {environment} from 'src/environments/environment';
import {
  createDetailHandler,
  createMockData,
  createPaginationHandler,
} from 'src/react/lib/mock-helper';
import {OnDemandReportMappingType} from '../api-reports.enum';
import {IOnDemandReportConfig, ReportDestination} from '../api-reports.type';

const BASE_URL = `${environment.reportsBaseUrl}/api/reports`;

export const MOCK_ON_DEMAND_REPORT_CONFIG: IOnDemandReportConfig[] = [
  {
    permissions: ['test-test'],
    category: 'TREASURY',
    reportName: 'repottttt',
    reportMappings: [
      {
        mappingType: OnDemandReportMappingType.DEFAULT,
        reportId: '1231323',
        prefilter: {asdasd: 'asdasd'},
        exportOnly: false,
      },
      {
        mappingType: OnDemandReportMappingType.DEFAULT,
        reportId: 'fer3e41ed1',
        prefilter: {GLProfile: 'gift_card'},
        exportOnly: false,
      },
    ],
    url: 'abc.com',
    createdAt: '2020-10-02T09:02:59.085Z',
    updatedAt: '2020-10-08T05:46:46.698Z',
    reportDescription: 'report testing should not allow',
    id: '5f76ecc3bf4a4400115c6067',
    destination: ReportDestination.WEB_ADMIN,
  },
  {
    permissions: ['admin_ledger_general_ledger_view'],
    category: 'TREASURY',
    reportName: 'Gift Card GL Test report',
    reportMappings: [
      {
        mappingType: OnDemandReportMappingType.DEFAULT,
        reportId: '178658',
        prefilter: {sofi: 'test'},
        exportOnly: true,
      },
      {
        mappingType: OnDemandReportMappingType.DEFAULT,
        reportId: '159381-payouts',
        prefilter: {status: 'SUCCESS'},
        exportOnly: false,
      },
    ],
    url: 'gift-card-gl-test',
    createdAt: '2020-10-02T09:42:43.246Z',
    updatedAt: '2020-10-16T08:35:25.042Z',
    reportDescription: 'This is a description for gift card gl test',
    id: '5f76f613bf4a4400115c6068',
    destination: ReportDestination.WEB_ADMIN,
  },
  {
    permissions: ['admin_reports_treasury_reports_view'],
    category: 'TREASURY',
    reportName: 'Gift Card GL Report',
    reportDescription: 'Details about gift card test',
    reportMappings: [
      {
        mappingType: OnDemandReportMappingType.SUMMARY,
        reportId: '181409-dev-gl-postings-summary',
        prefilter: {glProfile: 'GIFT_CARD'},
        exportOnly: true,
      },
      {
        mappingType: OnDemandReportMappingType.DEFAULT,
        reportId: '181230-dev-gl-postings',
        prefilter: {glProfile: 'GIFT_CARD'},
        exportOnly: false,
      },
    ],
    url: 'gift-card-gl-reports',
    createdAt: '2020-10-12T02:20:21.251Z',
    updatedAt: '2020-10-16T10:01:55.465Z',
    id: '5f83bd65c3e1fa001147e0f1',
    destination: ReportDestination.WEB_ADMIN,
  },
  {
    permissions: ['admin_reports_treasury_reports_access'],
    category: 'TREASURY',
    reportName: 'GL gift cart test bank',
    reportDescription: 'testQA',
    reportMappings: [
      {
        mappingType: OnDemandReportMappingType.DEFAULT,
        reportId: '181409',
        prefilter: {status: 'SUCCESS'},
        exportOnly: false,
      },
      {
        mappingType: OnDemandReportMappingType.SUMMARY,
        reportId: '181230',
        prefilter: {status: 'SUCCESS'},
        exportOnly: false,
      },
    ],
    url: 'glcardtest',
    createdAt: '2020-10-14T06:41:36.036Z',
    updatedAt: '2020-10-16T10:18:38.984Z',
    id: '5f869da057a1e1001154f4ab',
    destination: ReportDestination.WEB_ADMIN,
  },
  {
    permissions: ['admin_reports_treasury_reports_access'],
    category: 'NONE',
    reportName: 'GL Test',
    reportDescription: 'Gift Card',
    reportMappings: [
      {
        mappingType: OnDemandReportMappingType.DEFAULT,
        reportId: 'G01',
        prefilter: {},
        exportOnly: false,
      },
    ],
    url: 'report/gcardtest',
    createdAt: '2020-10-14T15:00:06.656Z',
    updatedAt: '2020-10-15T06:09:39.124Z',
    id: '5f8712766f503e0011182a32',
    destination: ReportDestination.WEB_ADMIN,
  },
  {
    permissions: ['string'],
    category: 'TREASURY',
    reportName: 'string',
    reportDescription: 'string',
    reportMappings: [
      {
        mappingType: OnDemandReportMappingType.DEFAULT,
        prefilter: {
          additionalProp1: 'string',
          additionalProp2: 'string',
          additionalProp3: 'string',
        },
        reportId: 'string',
        exportOnly: false,
      },
    ],
    url: 'string',
    createdAt: '2020-10-15T07:27:34.930Z',
    updatedAt: '2020-10-15T07:27:34.930Z',
    id: '5f87f9e683640d00114dc49e',
    destination: ReportDestination.WEB_ADMIN,
  },
  {
    permissions: ['asdfasdf'],
    category: 'TREASURY',
    reportName: 'Malcolm Test',
    reportDescription: 'zzz',
    reportMappings: [
      {
        mappingType: OnDemandReportMappingType.DEFAULT,
        reportId: '181230-dev-gl-postings',
        prefilter: {},
        exportOnly: false,
      },
    ],
    url: 'asdf923-12313',
    createdAt: '2020-10-27T01:00:32.343Z',
    updatedAt: '2020-10-27T01:00:32.343Z',
    id: '5f977130e1a7e30011d9c2a8',
    destination: ReportDestination.WEB_ADMIN,
  },
  {
    permissions: ['no'],
    category: 'NONE',
    reportName: 'ahii',
    reportDescription: 'hiaa',
    reportMappings: [
      {
        mappingType: OnDemandReportMappingType.DEFAULT,
        reportId: '182315',
        prefilter: {},
        exportOnly: false,
      },
    ],
    url: 'url',
    createdAt: '2020-10-27T06:44:11.131Z',
    updatedAt: '2020-10-27T06:44:11.131Z',
    id: '5f97c1bbdc7d2d0011f95fcb',
    destination: ReportDestination.WEB_ADMIN,
  },
  {
    permissions: [],
    category: 'NONE',
    reportName: 'transaction',
    reportDescription: 'transaction report ',
    reportMappings: [
      {
        mappingType: OnDemandReportMappingType.DEFAULT,
        prefilter: {},
        reportId: '184320',
        exportOnly: true,
      },
    ],
    url: 'transactionlisting',
    createdAt: '2020-10-27T07:32:13.671Z',
    updatedAt: '2020-10-27T07:32:13.671Z',
    id: '5f97ccfddc7d2d0011f95fd5',
    destination: ReportDestination.WEB_ADMIN,
  },
  {
    permissions: [],
    category: 'NONE',
    reportName: 'transaction-v2',
    reportDescription: 'transaction report ',
    reportMappings: [
      {
        mappingType: OnDemandReportMappingType.DEFAULT,
        prefilter: {},
        reportId: '184320',
        exportOnly: true,
      },
    ],
    url: 'transaction-listing',
    createdAt: '2020-10-27T07:42:09.804Z',
    updatedAt: '2020-10-27T07:42:09.804Z',
    id: '5f97cf51dc7d2d0011f95fde',
    destination: ReportDestination.WEB_DASHBOARD,
  },
  {
    permissions: [],
    category: 'TREASURY',
    reportName: 'Dev GL Postings Summary',
    reportDescription: 'Dev GL Postings Summary ',
    reportMappings: [
      {
        mappingType: OnDemandReportMappingType.DEFAULT,
        prefilter: {},
        reportId: '181230',
        exportOnly: true,
      },
    ],
    url: 'transaction-listing',
    createdAt: '2020-10-27T07:49:25.891Z',
    updatedAt: '2020-10-27T07:49:25.891Z',
    id: '5f97d105dc7d2d0011f95fe1',
    destination: ReportDestination.WEB_ADMIN,
  },
  {
    permissions: [],
    category: 'TREASURY',
    reportName: 'TransactionListing',
    reportDescription: '',
    reportMappings: [
      {
        mappingType: OnDemandReportMappingType.DEFAULT,
        prefilter: {},
        reportId: '184320',
        exportOnly: true,
      },
    ],
    url: 'transaction-listing',
    createdAt: '2020-10-27T07:50:53.971Z',
    updatedAt: '2020-10-27T07:50:53.971Z',
    id: '5f97d15ddc7d2d0011f95fe3',
    destination: ReportDestination.WEB_ADMIN,
  },
  {
    permissions: ['admin_reports_treasury_reports_view'],
    category: 'TREASURY',
    reportName: 'Gift Card 1.57',
    reportDescription: 'Ssbb testing',
    reportMappings: [
      {
        mappingType: OnDemandReportMappingType.DEFAULT,
        reportId: '181230-dev-gl-postings',
        prefilter: {glProfile: 'GIFT_CARD'},
        exportOnly: false,
      },
      {
        mappingType: OnDemandReportMappingType.DEFAULT,
        reportId: '185475-dev-gl-postings-grouped-summary',
        prefilter: {},
        exportOnly: false,
      },
    ],
    url: 'gft-crd',
    createdAt: '2020-10-28T01:18:05.385Z',
    updatedAt: '2020-10-28T01:36:31.375Z',
    id: '5f98c6cddc7d2d0011f95fed',
    destination: ReportDestination.WEB_ADMIN,
  },
  {
    permissions: [],
    category: 'NONE',
    reportName: 'Transaction by payment',
    reportDescription: 'Get transaction by payment',
    reportMappings: [
      {
        mappingType: OnDemandReportMappingType.DEFAULT,
        prefilter: {},
        reportId: 'string',
        exportOnly: true,
      },
    ],
    url: 'get-transaction-by-payment',
    createdAt: '2020-10-28T09:02:19.174Z',
    updatedAt: '2020-10-28T09:02:19.174Z',
    id: '5f99339b30ede60011369842',
    destination: ReportDestination.WEB_ADMIN,
  },
  {
    permissions: [],
    category: 'NONE',
    reportName: 'Transaction by payment_',
    reportDescription: 'Get transaction by payment',
    reportMappings: [
      {
        mappingType: OnDemandReportMappingType.DEFAULT,
        prefilter: {},
        reportId: '185531',
        exportOnly: true,
      },
    ],
    url: 'get-transaction-by-payment',
    createdAt: '2020-10-28T09:02:58.509Z',
    updatedAt: '2020-10-28T09:02:58.509Z',
    id: '5f9933c230ede60011369843',
    destination: ReportDestination.WEB_ADMIN,
  },
  {
    destination: ReportDestination.WEB_ADMIN,
    permissions: [],
    category: 'NONE',
    reportName: 'Transaction report by payment ',
    reportDescription: 'Get transaction by payment',
    reportMappings: [
      {
        mappingType: OnDemandReportMappingType.DEFAULT,
        prefilter: {},
        reportId: '185531',
        exportOnly: true,
      },
    ],
    url: 'transactionlisting',
    createdAt: '2020-10-28T09:33:31.567Z',
    updatedAt: '2020-10-28T09:33:31.567Z',
    id: '5f993aeb30ede60011369846',
  },
  {
    destination: ReportDestination.WEB_ADMIN,
    permissions: [],
    category: 'MERCHANT',
    reportName: 'Transaction by payment POS',
    reportDescription: 'Transaction by payment',
    reportMappings: [
      {
        mappingType: OnDemandReportMappingType.DEFAULT,
        reportId: '184320',
        prefilter: {},
        exportOnly: false,
      },
    ],
    url: 'transaction-listing',
    createdAt: '2020-10-28T10:28:29.382Z',
    updatedAt: '2020-10-28T10:28:29.382Z',
    id: '5f9947cdb0ae17001181ad82',
  },
  {
    destination: ReportDestination.WEB_DASHBOARD,
    permissions: [],
    category: 'MERCHANT',
    reportName: 'get transaction bill andre load POS',
    reportDescription: 'get transaction bill andre load',
    reportMappings: [
      {
        mappingType: OnDemandReportMappingType.DEFAULT,
        reportId: '185667',
        prefilter: {},
        exportOnly: false,
      },
    ],
    url: 'get-transaction-bill-and-reload',
    createdAt: '2020-10-28T10:31:41.277Z',
    updatedAt: '2020-10-28T10:31:41.277Z',
    id: '5f99488db0ae17001181ad85',
  },
  {
    destination: ReportDestination.WEB_DASHBOARD,
    permissions: [],
    category: 'MERCHANT',
    reportName: 'get transaction by card type POS',
    reportDescription: 'get transaction by card type ',
    reportMappings: [
      {
        mappingType: OnDemandReportMappingType.DEFAULT,
        reportId: '185709',
        prefilter: {},
        exportOnly: false,
      },
    ],
    url: 'get-transaction-by-card-type',
    createdAt: '2020-10-28T10:33:34.168Z',
    updatedAt: '2020-10-28T10:33:34.168Z',
    id: '5f9948feb0ae17001181ad87',
  },
  {
    destination: ReportDestination.WEB_DASHBOARD,
    permissions: [],
    category: 'MERCHANT',
    reportName: 'get transaction by payment POS',
    reportDescription: 'get transactionby payment type ',
    reportMappings: [
      {
        mappingType: OnDemandReportMappingType.DEFAULT,
        reportId: '185531',
        prefilter: {},
        exportOnly: false,
      },
    ],
    url: 'get-transaction-by-payment',
    createdAt: '2020-10-28T10:35:00.249Z',
    updatedAt: '2020-10-28T10:35:00.249Z',
    id: '5f994954b0ae17001181ad89',
  },
  {
    destination: ReportDestination.WEB_DASHBOARD,
    permissions: [],
    category: 'MERCHANT',
    reportName: 'get report card type by EDC or IDP',
    reportDescription: 'get report card type by EDC or IDP',
    reportMappings: [
      {
        mappingType: OnDemandReportMappingType.DEFAULT,
        reportId: '186053',
        prefilter: {},
        exportOnly: false,
      },
    ],
    url: 'get-report-card-type-by-edc-idp',
    createdAt: '2020-10-29T08:13:14.892Z',
    updatedAt: '2020-10-29T08:13:14.892Z',
    id: '5f9a799a96e5490011a890db',
  },
  {
    destination: ReportDestination.WEB_DASHBOARD,
    permissions: [],
    category: 'MERCHANT',
    reportName: 'get report salse',
    reportDescription: 'get report salse',
    reportMappings: [
      {
        mappingType: OnDemandReportMappingType.DEFAULT,
        reportId: '184320',
        prefilter: {},
        exportOnly: false,
      },
    ],
    url: 'sale-by-item',
    createdAt: '2020-10-29T11:49:20.154Z',
    updatedAt: '2020-10-29T11:49:20.154Z',
    id: '5f9aac4096e5490011a89146',
  },
  {
    destination: ReportDestination.WEB_DASHBOARD,
    permissions: [],
    category: 'MERCHANT',
    reportName: 'get report sale',
    reportDescription: 'get report sale',
    reportMappings: [
      {
        mappingType: OnDemandReportMappingType.DEFAULT,
        reportId: '184320',
        prefilter: {},
        exportOnly: false,
      },
    ],
    url: 'sale-by-item',
    createdAt: '2020-10-30T10:19:06.650Z',
    updatedAt: '2020-10-30T10:19:06.650Z',
    id: '5f9be89a96e5490011a892e1',
  },
  {
    destination: ReportDestination.WEB_DASHBOARD,
    permissions: [],
    category: 'MERCHANT',
    reportName: 'card type report',
    reportDescription: 'card type report',
    reportMappings: [
      {
        mappingType: OnDemandReportMappingType.DEFAULT,
        reportId: '187008',
        prefilter: {},
        exportOnly: false,
      },
    ],
    url: 'card-type-report',
    createdAt: '2020-11-03T07:58:57.893Z',
    updatedAt: '2020-11-03T07:58:57.893Z',
    id: '5fa10dc158cdd4001185be10',
  },
  {
    destination: ReportDestination.WEB_DASHBOARD,
    permissions: [],
    category: 'MERCHANT',
    reportName: 'EPS card type report',
    reportDescription: 'EPS card type report',
    reportMappings: [
      {
        mappingType: OnDemandReportMappingType.DEFAULT,
        reportId: '187017',
        prefilter: {},
        exportOnly: false,
      },
    ],
    url: 'eps-card-type-report',
    createdAt: '2020-11-03T08:22:10.282Z',
    updatedAt: '2020-11-03T08:22:10.282Z',
    id: '5fa1133258cdd4001185be1b',
  },
  {
    destination: ReportDestination.WEB_DASHBOARD,
    permissions: ['admin_reports_treasury_reports_view'],
    category: 'TREASURY',
    reportName: 'Gift Card Summary',
    reportDescription: 'The summary by transaction type',
    reportMappings: [
      {
        mappingType: OnDemandReportMappingType.SUMMARY,
        reportId: '187023-dev-gl-postings-grouped-summary',
        prefilter: {glProfile: 'GIFT_CARD'},
        exportOnly: false,
      },
      {
        mappingType: OnDemandReportMappingType.DEFAULT,
        reportId: '185475-dev-gl-postings-grouped',
        prefilter: {glProfile: 'GIFT_CARD'},
        exportOnly: false,
      },
    ],
    url: 'gift-card-summary-report',
    createdAt: '2020-11-04T14:51:28.245Z',
    updatedAt: '2020-11-08T17:36:16.735Z',
    id: '5fa2bff058cdd4001185bf1c',
  },
  {
    destination: ReportDestination.WEB_ADMIN,
    permissions: ['admin_reports_treasury_reports_view'],
    category: 'TREASURY',
    reportName: 'Gift Card Summary Report',
    reportDescription: 'Sofia test',
    reportMappings: [
      {
        mappingType: OnDemandReportMappingType.DEFAULT,
        reportId: '185475-dev-gl-postings-grouped',
        prefilter: {glProfile: 'GIFT_CARD'},
        exportOnly: false,
      },
      {
        mappingType: OnDemandReportMappingType.SUMMARY,
        reportId: '187023-dev-gl-postings-grouped-summary',
        prefilter: {glProfile: 'GIFT_CARD'},
        exportOnly: false,
      },
    ],
    url: 'gift_card',
    createdAt: '2020-11-08T18:03:52.829Z',
    updatedAt: '2020-11-09T06:52:05.549Z',
    id: '5fa8330858cdd4001185bfc5',
  },
  {
    destination: ReportDestination.WEB_DASHBOARD,
    permissions: ['admin_reports_treasury_reports_access'],
    category: 'CARD',
    reportName: 'Expired card balance details',
    reportDescription: 'Expired card balance details',
    reportMappings: [
      {
        mappingType: OnDemandReportMappingType.DEFAULT,
        reportId: '188602',
        prefilter: {},
        exportOnly: false,
      },
    ],
    url: 'expired-card-balance-details',
    createdAt: '2020-11-11T03:03:10.731Z',
    updatedAt: '2020-11-11T03:05:33.621Z',
    id: '5fab546e6d70230011515be8',
  },
  {
    destination: ReportDestination.WEB_DASHBOARD,
    permissions: ['admin_reports_treasury_reports_access'],
    category: 'CARD',
    reportName: 'Expired card balance summary',
    reportDescription: 'Expired card balance summary',
    reportMappings: [
      {
        mappingType: OnDemandReportMappingType.DEFAULT,
        reportId: '188624',
        prefilter: {},
        exportOnly: false,
      },
    ],
    url: 'expired-card-balance-summary',
    createdAt: '2020-11-11T03:05:12.027Z',
    updatedAt: '2020-11-11T03:05:12.027Z',
    id: '5fab54e86d70230011515be9',
  },
];

export const handlers = [
  rest.post(`${BASE_URL}/on-demand/report-config`, (req, res, ctx) => {
    const now = new Date();
    const result = {
      id: now.getTime().toString(),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      ...(req.body as Record<string, any>),
    };

    MOCK_ON_DEMAND_REPORT_CONFIG.push(result as any);

    return res(ctx.json(result));
  }),
  rest.get(
    `${BASE_URL}/on-demand/report-config`,
    createPaginationHandler(MOCK_ON_DEMAND_REPORT_CONFIG),
  ),
  rest.get(
    `${BASE_URL}/on-demand/report-config/category/:category`,
    createPaginationHandler((req) =>
      MOCK_ON_DEMAND_REPORT_CONFIG.filter((config) => config.category === req.params.category),
    ),
  ),
  rest.get(
    `${BASE_URL}/on-demand/report-config/:id`,
    createDetailHandler(MOCK_ON_DEMAND_REPORT_CONFIG, 'id'),
  ),
  rest.delete(
    `${BASE_URL}/on-demand/report-config/:id`,
    createDetailHandler(MOCK_ON_DEMAND_REPORT_CONFIG, 'id'),
  ),
  rest.put(`${BASE_URL}/on-demand/report-config/:id`, (req, res, ctx) => {
    const currentConfig = MOCK_ON_DEMAND_REPORT_CONFIG.find((c) => c.id === req.params.id);

    if (!currentConfig) {
      return res(ctx.status(404));
    }

    Object.keys(req.body).forEach((key) => {
      currentConfig[key] = req.body[key];
    });

    return res(ctx.json(currentConfig));
  }),
  rest.get(`${BASE_URL}/snapshot/report/configFolder/:folderName/list`, (_, res, ctx) => {
    return res(
      ctx.json(
        createMockData(
          [
            {
              id: 'string',
              configId: 'string',
              s3Key: 'string',
              fileName: 'string',
              downloadUrl: 'string',
              enterprise: 'string',
              createdAt: '2020-11-10T08:18:47.545Z',
              updatedAt: 'string',
            },
            {
              id: '923348asdfwe',
              configId: 'string',
              s3Key: 'string',
              fileName: 'string',
              downloadUrl: 'string',
              enterprise: 'string',
              createdAt: '2020-11-10T08:18:47.545Z',
              updatedAt: 'string',
            },
          ],
          4,
        ),
      ),
    );
  }),
];

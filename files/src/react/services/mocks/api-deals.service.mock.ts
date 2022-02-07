import {formatDateUtc} from '@setel/portal-ui';
import {rest} from 'msw';
import {environment} from 'src/environments/environment';
import {
  createFixResponseHandler,
  createInfiniteHandler,
  createMockData,
} from 'src/react/lib/mock-helper';

const dealCatalogues = createMockData(
  [
    {
      icon: {
        url: 'https://setel-deal-assets-dev.s3.ap-southeast-1.amazonaws.com/images/5e136091-ca1f-40c2-bab0-acdfd783dba0.jpeg',
      },
      title: 'Test 001',
      status: 'PUBLISHED',
      variant: 'REGULAR',
      score: -1,
      _id: '601a61b5e592740017ba0d3b',
      createdAt: '2021-02-03T08:41:25.190Z',
      updatedAt: '2021-02-03T08:41:52.285Z',
      __v: 0,
      activeDealsCount: 18,
    },
    {
      icon: {
        url: 'https://setel-deal-assets-dev.s3.amazonaws.com/images/c481cc27-0eba-4202-b8b8-e05b37b06a56.png',
      },
      title: 'Ihsan test staging',
      status: 'DRAFT',
      variant: 'REGULAR',
      score: -1,
      _id: '6006386d7173d00011f83d5f',
      createdAt: '2021-01-19T01:39:57.020Z',
      updatedAt: '2021-01-19T01:39:57.020Z',
      __v: 0,
      activeDealsCount: 0,
    },
    {
      icon: {
        url: 'https://setel-deal-assets-dev.s3.amazonaws.com/images/e5260810-d1d1-4d10-b5a7-fe79ebe3ca54.jpeg',
      },
      title: 'Health & Fitness',
      status: 'DRAFT',
      variant: 'REGULAR',
      score: -1,
      _id: '5ffd5f0e8a7513001851f14c',
      createdAt: '2021-01-12T08:34:22.141Z',
      updatedAt: '2021-01-12T08:34:22.141Z',
      __v: 0,
      activeDealsCount: 0,
    },
    {
      icon: {
        url: 'https://setel-deal-assets-dev.s3.amazonaws.com/images/958e2040-b195-4616-ab81-ede47504273c.jpeg',
      },
      title: 'ihsan test',
      status: 'DRAFT',
      variant: 'REGULAR',
      score: -1,
      _id: '5ffd4e468a7513001851f14a',
      createdAt: '2021-01-12T07:22:46.870Z',
      updatedAt: '2021-01-12T07:23:17.506Z',
      __v: 0,
      activeDealsCount: 1,
    },
    {
      icon: {
        url: 'https://setel-deal-assets-dev.s3.ap-southeast-1.amazonaws.com/images/407ed9a8-69e4-4012-979f-0ec296d2441e.png',
      },
      title: 'Pravin test',
      status: 'DRAFT',
      variant: 'REGULAR',
      score: -1,
      _id: '5ff529fd33a9d20017664a7c',
      createdAt: '2021-01-06T03:09:49.925Z',
      updatedAt: '2021-01-06T03:09:49.925Z',
      __v: 0,
      activeDealsCount: 1,
    },
  ],
  30,
);

const baseUrl = environment.dealsBaseUrl;

export const handlers = [
  rest.get(`${baseUrl}/catalogues`, createInfiniteHandler(dealCatalogues, 25)),
  rest.get(`${baseUrl}/catalogues/:id`, (req, res, ctx) => {
    const record = dealCatalogues.find((c) => c._id === req.params.id);

    if (!record) {
      return res(ctx.status(404));
    }

    const raw = req.url.searchParams.get('raw');

    return res(
      ctx.json(
        raw === 'true'
          ? {
              ...record,
              title: {
                en: record.title,
                ms: '',
                ta: '',
                'zh-Hans': '',
                'zh-Hant': '',
              },
            }
          : record,
      ),
    );
  }),
  rest.put(`${baseUrl}/catalogues/:id`, (req, res, ctx) => {
    const record = dealCatalogues.find((c) => c._id === req.params.id);

    if (!record) {
      return res(ctx.status(404));
    }

    Object.assign(record, {
      ...(req.body as any),
      updatedAt: formatDateUtc(new Date()),
    });

    return res(ctx.json(record));
  }),
  rest.get(
    `${baseUrl}/catalogues/:id/admin/deals`,
    createFixResponseHandler({
      nextPageToken: null,
      data: [
        {
          _id: '5fc7b33ed574f30011390742',
          endDate: null,
          status: 'LAUNCHED',
          leftCount: null,
          name: 'Expirable One',
          startDate: '2020-12-02T15:32:00.000Z',
          price: {unit: 'POINTS', discounted: null, amount: 1},
          content: {
            images: [
              {
                url: 'https://setel-deal-assets-dev.s3.amazonaws.com/images/9489cdfc-330c-425e-935e-de583ab4daf7.jpeg',
              },
            ],
          },
          voucherBatchId: '5fc7b32ac9ca3d00100d05ad',
          score: 1,
        },
        {
          _id: '5fcf9824022def001115b67f',
          endDate: null,
          status: 'LAUNCHED',
          leftCount: 10996,
          name: 'tamil லோரெம் and l18n',
          startDate: '2020-12-08T15:35:00.000Z',
          price: {unit: 'POINTS', discounted: null, amount: 10},
          content: {
            images: [
              {
                url: 'https://setel-deal-assets-dev.s3.amazonaws.com/images/c4dbd47d-3c42-4c86-b9d0-e21ee54aea91.png',
              },
            ],
          },
          voucherBatchId: '5fcf9997f4cb3f0010519296',
          score: 0,
        },
      ],
    }),
  ),
  rest.put(`${baseUrl}/catalogues/scores`, (req, res, ctx) => {
    const body = req.body as {
      changes: Array<{
        catalogueId: string;
        score: number;
      }>;
    };

    dealCatalogues.sort((a, b) => {
      const aRecord = body.changes.find((cat) => cat.catalogueId === a._id);
      const bRecord = body.changes.find((cat) => cat.catalogueId === b._id);

      if (!aRecord && !bRecord) {
        return 0;
      }

      if (aRecord && !bRecord) {
        return -1;
      }

      if (!aRecord && bRecord) {
        return 1;
      }

      return bRecord.score - aRecord.score;
    });

    return res(ctx.status(200));
  }),
];

import {rest} from 'msw';
import {environment} from 'src/environments/environment';
import {
  createDetailHandler,
  createFixResponseHandler,
  createMockData,
  createPaginationHandler,
} from 'src/react/lib/mock-helper';
import {
  AttributionRuleMetadata,
  AttributionRuleReferenceSource,
  AttributionRuleType,
} from 'src/react/modules/attribution/types';

const baseUrl = `${environment.attributesApiBaseUrl}/api/attributes`;

export const ATTRIBUTE_RULES = createMockData(
  [
    {
      id: 'abcdef123456',
      type: AttributionRuleType.ACCOUNT_REGISTRATION,
      referenceSource: AttributionRuleReferenceSource.REWARD_CAMPAIGN,
      referenceId: 'refIdAbc123',
      metadata: [
        {key: AttributionRuleMetadata.NETWORK, value: 'test network 123'},
        {key: AttributionRuleMetadata.CHANNEL, value: 'test channel 123'},
        {key: AttributionRuleMetadata.CAMPAIGN, value: 'test campaign 123'},
      ],
      createdAt: '2020-09-28T05:50:42.094Z',
      updatedAt: '2020-09-28T05:50:42.094Z',
    },
    {
      id: 'abcdef123456',
      type: AttributionRuleType.ACCOUNT_REGISTRATION,
      referenceSource: AttributionRuleReferenceSource.VOUCHER_BATCH,
      referenceId: 'refIdAbc456',
      metadata: [
        {key: AttributionRuleMetadata.NETWORK, value: 'test network 456'},
        {key: AttributionRuleMetadata.CHANNEL, value: 'test channel 456'},
        {key: AttributionRuleMetadata.CAMPAIGN, value: 'test campaign 456'},
      ],
      createdAt: '2020-09-28T05:50:42.094Z',
      updatedAt: '2020-09-28T05:50:42.094Z',
    },
  ],
  10,
  (seed, index) => ({
    ...seed,
    referenceId: `${seed.referenceId}${index}`,
  }),
);

export const handlers = [
  rest.get(`${baseUrl}/admin/rules`, createPaginationHandler(ATTRIBUTE_RULES)),
  rest.get(`${baseUrl}/admin/rules/:id`, createDetailHandler(ATTRIBUTE_RULES, 'id')),
  rest.get(
    `${baseUrl}/admin/entity`,
    createFixResponseHandler({
      attributes: {
        email: {
          key: 'email',
          value: 'teytestingemail@gmail.com',
          updatedAt: 1621561466,
        },
      },
    }),
  ),
];

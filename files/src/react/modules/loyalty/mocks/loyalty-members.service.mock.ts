import {rest} from 'msw';
import {environment} from 'src/environments/environment';

const loyaltyMemberBaseURL = `${environment.variablesBaseUrl}/api/loyalty-members/admin`;
const loyaltyBaseURL = `${environment.variablesBaseUrl}/api/loyalty/admin`;

export const handlers = [
  rest.get(`${loyaltyMemberBaseURL}/card/unlink`, (_, res, ctx) => {
    return res(ctx.json(MOCK_UNLINK_HISTORY));
  }),
  rest.get(`${loyaltyBaseURL}/fraud-rules/whitelist/:memberId`, (req, res, ctx) =>
    res(
      ctx.json({
        ruleId: req.url.searchParams.get('ruleId'),
        loyaltyMemberId: req.params.memberId,
      }),
    ),
  ),
];

export const MOCK_UNLINK_HISTORY = {
  data: [
    {
      remarks: null,
      pointsBalance: 107,
      cardStatusBeforeUnlink: 'closed',
      cardNumber: '70831577777779115',
      createdAt: '2020-12-10T01:39:01.510Z',
    },
    {
      remarks: null,
      pointsBalance: null,
      cardStatusBeforeUnlink: 'active',
      cardNumber: '70831577777779115',
      createdAt: '2020-12-04T03:50:27.851Z',
    },
  ],
  metadata: {pageSize: 10, currentPage: 1, pageCount: 1, totalCount: 2, nextPageToken: null},
};

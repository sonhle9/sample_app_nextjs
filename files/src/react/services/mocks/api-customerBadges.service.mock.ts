import {rest} from 'msw';
import {environment} from 'src/environments/environment';
import {createPaginationHandler} from 'src/react/lib/mock-helper';

const MOCK_CUSTOMER_BADGES = [
  {
    items: [
      {
        group: {
          score: -1,
          _id: '5fe181dcf5057e2813fd3bad',
        },
        status: 'LOCKED',
        periodIndex: 1,
        recurringIndex: 1,
        endDate: '2021-06-30T15:59:59.999Z',
        grantsCampaigns: [],
        id: '60d124bcd7c3090012c8d2bb',
        startDate: '2021-05-31T16:00:00.000Z',
        period: {
          type: 'month',
        },
        category: 'ACHIEVEMENT',
        dependsOnCampaign: '5fcee8f6a022d50010d4e18f',
        content: {
          iconUrls: {
            LOCKED:
              'https://mobile-app-assets-setel.s3-ap-southeast-1.amazonaws.com/badges/fuel-master-badge.png',
            UNLOCKED:
              'https://mobile-app-assets-setel.s3-ap-southeast-1.amazonaws.com/badges/fuel-master-badge-unlocked.png',
          },
          title: '1st Fuel Up - June',
          summary:
            'Fuel up a minimum of RM40 of PETRONAS Primax 97 with Pro-Race, 3 times in the same month to earn a badge. Each badge counts as a contest entry',
          action: null,
          iconUrl:
            'https://mobile-app-assets-setel.s3-ap-southeast-1.amazonaws.com/badges/fuel-master-badge.png',
        },
        createNewOnUnlock: true,
        member: '60d124bad7c3090012c8d229',
        campaignIterationId: '60d124bbd7c3090012c8d279',
        badge: '5fe97b3fd4f8c52f79d6b071',
        createdAt: '2021-06-21T23:46:04.073Z',
        updatedAt: '2021-06-21T23:46:04.073Z',
        goals: [
          {
            _id: '60d124bbd7c3090012c8d276',
            description: '1X Bonus entry',
            title: 'First Fuel up',
          },
          {
            _id: '60d124bbd7c3090012c8d277',
            description: null,
            title: '2nd Fuel up',
          },
          {
            _id: '60d124bbd7c3090012c8d278',
            description: null,
            title: '3rd fuel up',
          },
        ],
        campaign: {
          _id: '5fcee8f6a022d50010d4e18f',
          name: 'PETRONAS Primax 97 Contest',
        },
        progressionType: 'Periodic Badge',
      },
    ],
  },
];

export const handlers = [
  rest.get(
    `${environment.apiBaseUrl}/api/rewards/admin/user-badges/:userId`,
    createPaginationHandler((req) =>
      MOCK_CUSTOMER_BADGES.map((badges) => ({...badges, userId: req.params.userId})),
    ),
  ),
];

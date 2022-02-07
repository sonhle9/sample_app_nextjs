import {rest} from 'msw';
import {environment} from 'src/environments/environment';

const BASE_URL = `${environment.membershipApiBaseUrl}/api/membership`;

const MOCK_TIERS = [
  {
    gradient: ['#00b0ff', '#00b0ff'],
    _id: '605473174920df9a22c6f307',
    level: 1,
    title: 'Junior',
    icons: {
      primary:
        'https://mobile-app-assets-setel.s3-ap-southeast-1.amazonaws.com/membership/tier-junior.png',
      details:
        'https://mobile-app-assets-setel.s3-ap-southeast-1.amazonaws.com/membership/tier-junior.png',
    },
    requirements: [
      {
        type: 'points',
        min: 0,
        max: 99,
        unitLabel: 'points',
        titleLabel: 'Mesra points earned in May',
      },
    ],
    privileges: [
      {
        probabilities: [],
        type: 'setel_base_info',
        value: 1,
        randomReward: 0,
        label: 'Earn 1 Base Mesra point for every litre of fuel purchased.',
      },
      {
        probabilities: [],
        type: 'setel_kedai_info',
        value: 1,
        randomReward: 0,
        label: 'Earn 1 Base Mesra point for every RM1 spent at Kedai Mesra.',
      },
      {
        probabilities: [
          {
            chance: 100,
            multiplier: 0.5,
          },
        ],
        type: 'setel_fuel_points',
        expiryForLabel: '2021-06-30T15:59:59.999Z',
        randomRewardMultiplier: 0.5,
        randomReward: {
          chance: 100,
          multiplier: 0.5,
        },
        expiryLabel: '(Promo ends June 2021)',
        label: 'Promo Bonus: Earn 0.5 Bonus Mesra points for every litre of fuel purchased.',
      },
    ],
    validity: null,
  },
  {
    gradient: ['#2f48fa', '#2f48fa'],
    _id: '605473414920df9a22c6f316',
    level: 2,
    title: 'Explorer',
    icons: {
      primary:
        'https://mobile-app-assets-setel.s3-ap-southeast-1.amazonaws.com/membership/tier-explorer.png',
      details:
        'https://mobile-app-assets-setel.s3-ap-southeast-1.amazonaws.com/membership/tier-explorer.png',
    },
    requirements: [
      {
        type: 'points',
        min: 100,
        max: 279,
        unitLabel: 'points',
        titleLabel: 'Mesra points earned in May',
      },
    ],
    privileges: [
      {
        probabilities: [],
        type: 'setel_base_info',
        value: 1,
        randomReward: 0,
        label: 'Earn 1 Base Mesra point for every litre of fuel purchased.',
      },
      {
        probabilities: [],
        type: 'setel_kedai_info',
        value: 1,
        randomReward: 0,
        label: 'Earn 1 Base Mesra point for every RM1 spent at Kedai Mesra.',
      },
      {
        probabilities: [
          {
            chance: 100,
            multiplier: 1,
          },
        ],
        type: 'setel_fuel_points',
        expiryForLabel: '2021-06-30T15:59:59.999Z',
        randomRewardMultiplier: 1,
        randomReward: {
          chance: 100,
          multiplier: 1,
        },
        expiryLabel: '(Promo ends June 2021)',
        label: 'Promo Bonus: Earn 1 Bonus Mesra point for every litre of fuel purchased.',
      },
    ],
    validity: 'month',
  },
  {
    gradient: ['#6e2feb', '#6e2feb'],
    _id: '6054736a4920df9a22c6f324',
    level: 3,
    title: 'Hero',
    icons: {
      primary:
        'https://mobile-app-assets-setel.s3-ap-southeast-1.amazonaws.com/membership/tier-hero.png',
      details:
        'https://mobile-app-assets-setel.s3-ap-southeast-1.amazonaws.com/membership/tier-hero.png',
    },
    requirements: [
      {
        type: 'points',
        min: 280,
        unitLabel: 'points',
        titleLabel: 'Mesra points earned in May',
      },
    ],
    privileges: [
      {
        probabilities: [],
        type: 'setel_base_info',
        value: 1,
        randomReward: 0,
        label: 'Earn 1 Base Mesra point for every litre of fuel purchased.',
      },
      {
        probabilities: [],
        type: 'setel_kedai_info',
        value: 1,
        randomReward: 0,
        label: 'Earn 1 Base Mesra point for every RM1 spent at Kedai Mesra.',
      },
      {
        probabilities: [
          {
            chance: 100,
            multiplier: 2,
          },
        ],
        type: 'setel_fuel_points',
        expiryForLabel: '2021-06-30T15:59:59.999Z',
        randomRewardMultiplier: 2,
        randomReward: {
          chance: 100,
          multiplier: 2,
        },
        expiryLabel: '(Promo ends June 2021)',
        label: 'Promo Bonus: Earn 2 Bonus Mesra points for every litre of fuel purchased.',
      },
    ],
    validity: 'month',
  },
];

const MOCK_TIER_PROGRESS = {
  _id: '6093bdfc2c102cd95b88e6a2',
  userId: '48824b7a-3fd2-4a31-8d4a-2ef9a5fe8ff7',
  __v: 0,
  appliedAt: '2021-05-07T10:01:31.737Z',
  currentTier: {
    gradient: ['#2f48fa', '#2f48fa'],
    _id: '605473414920df9a22c6f316',
    level: 2,
    title: 'Explorer',
    icons: {
      primary:
        'https://mobile-app-assets-setel.s3-ap-southeast-1.amazonaws.com/membership/tier-explorer.png',
      details:
        'https://mobile-app-assets-setel.s3-ap-southeast-1.amazonaws.com/membership/tier-explorer.png',
    },
    requirements: [
      {
        type: 'points',
        min: 100,
        max: 279,
        unitLabel: 'points',
        titleLabel: 'Mesra points earned in May',
      },
    ],
    privileges: [
      {
        probabilities: [],
        type: 'setel_base_info',
        value: 1,
        randomReward: 0,
        label: 'Earn 1 Base Mesra point for every litre of fuel purchased.',
      },
      {
        probabilities: [],
        type: 'setel_kedai_info',
        value: 1,
        randomReward: 0,
        label: 'Earn 1 Base Mesra point for every RM1 spent at Kedai Mesra.',
      },
      {
        probabilities: [
          {
            chance: 100,
            multiplier: 1,
          },
        ],
        type: 'setel_fuel_points',
        expiryForLabel: '2021-06-30T15:59:59.999Z',
        randomRewardMultiplier: 1,
        randomReward: {
          chance: 100,
          multiplier: 1,
        },
        expiryLabel: '(Promo ends June 2021)',
        label: 'Promo Bonus: Earn 1 Bonus Mesra point for every litre of fuel purchased.',
      },
    ],
    validity: 'month',
  },
  expiredAt: '2021-06-30T15:59:59.999Z',
  requirementsProgress: [
    {
      _id: '60950ffbe5e39800177d856f',
      type: 'points',
      value: 279,
      unitLabel: 'points',
      titleLabel: 'Mesra points earned in May',
    },
  ],
  requirementsProgressByPeriod: [
    {
      progress: [
        {
          _id: '60950ffbe5e39800177d856f',
          type: 'points',
          value: 279,
        },
      ],
      _id: '6093ca5e53b70500170c3b7b',
      period: '2021/05/01-2021/05/31',
    },
  ],
  currentTierHeader: 'Your current level',
  instructions: [
    {
      title: 'Upgrade to the next level',
      tierTitle: 'Hero',
      tierLevel: 3,
      type: 'Levelup',
      items: [
        {
          percent: 100,
          diff: 1,
          type: 'points',
          isCompleted: false,
          unit: 'points',
          unitLabel: 'points',
          description: '1 points to go',
        },
      ],
    },
  ],
};

const MOCK_MEMBER_ACTIONS = {
  data: [
    {
      _id: '6093cb522c102cd95b97c02d',
      relatedDocumentId: '6093cb514215030010259956',
      type: 'earn_setel_points',
      __v: 0,
      amount: 101,
      createdAt: '2021-05-06T10:56:18.062Z',
      userId: '48824b7a-3fd2-4a31-8d4a-2ef9a5fe8ff7',
    },
    {
      _id: '6093cb512c102cd95b97be28',
      relatedDocumentId: '6093cb514215030010259956',
      type: 'earn_vendor_points',
      __v: 0,
      amount: 101,
      createdAt: '2021-05-06T10:56:17.125Z',
      userId: '48824b7a-3fd2-4a31-8d4a-2ef9a5fe8ff7',
    },
    {
      _id: '6093ca5e2c102cd95b96ad40',
      relatedDocumentId: '6093ca5e4215030010259953',
      type: 'earn_setel_points',
      __v: 0,
      amount: 5,
      createdAt: '2021-05-06T10:52:14.866Z',
      userId: '48824b7a-3fd2-4a31-8d4a-2ef9a5fe8ff7',
    },
    {
      _id: '6093ca5e2c102cd95b96aa36',
      relatedDocumentId: '6093ca5e4215030010259953',
      type: 'earn_vendor_points',
      __v: 0,
      amount: 10,
      createdAt: '2021-05-06T10:52:14.478Z',
      userId: '48824b7a-3fd2-4a31-8d4a-2ef9a5fe8ff7',
    },
  ],
  total: 4,
};

export const handlers = [
  rest.get(`${BASE_URL}/tiers`, (_, res, ctx) => res(ctx.json(MOCK_TIERS))),
  rest.get(`${BASE_URL}/admin/user/:id/tier/progress`, (req, res, ctx) =>
    res(ctx.json({...MOCK_TIER_PROGRESS, userId: req.params.id})),
  ),
  rest.get(`${BASE_URL}/admin/actions`, (req, res, ctx) =>
    res(ctx.json({...MOCK_MEMBER_ACTIONS, userId: req.url.searchParams.get('userId')})),
  ),
];

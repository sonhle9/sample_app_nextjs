import {rest} from 'msw';
import {environment} from 'src/environments/environment';
import {createMockData, createPaginationHandler} from 'src/react/lib/mock-helper';

const riskProfileExample1 = {
  natureOfBusiness: 'retail',
  customerType: 'individual',
  id: '60d6d137c2458757d4676390',
  accountId: 'eb7f163b-b826-4b2b-b02a-9f2aa355c9fc',
  idType: 'MYKAD',
  idNumber: 'c8bed133-a406-42a3-83c2-a73e996933d4',
  countryOfResident: 'malaysian',
  nationality: '869d9698-8221-40dc-ad93-75eeb5d124b6',
  walletSize: 'less_equal_500',
  kyc: 'ekyc',
  annualTransaction: 'less_60000',
  checkFor: 'SANCTIONED_SCREENING',
  remark: 'ZTU1NTFlMjYtZGNhMi00ZTUyLWE4NjEtZjQzZDZjZTE5Mzdm',
  totalScore: 60,
  riskRating: 'Low',
  __v: 0,
  createdAt: '2021-06-26T07:03:19.807Z',
  updatedAt: '2021-06-26T07:03:19.807Z',
  watchList: 'domestic_pep',
};

const riskProfileDetails = {
  id: '60ecf031a61581001248d594',
  accountId: 'ff2adca6-6248-4eae-8d5e-c957130881bf',
  idType: 'MYKAD',
  idNumber: '123123123',
  customerType: {
    value: 'individual',
    description: 'Individual',
  },
  countryOfResident: {
    value: 'malaysian',
    description: 'Malaysia',
  },
  nationality: {
    value: 'others',
    description: 'Others',
  },
  watchList: {
    value: 'sanctioned_individual',
    description: 'Sanctioned Individual',
  },
  natureOfBusiness: {
    value: 'others',
    description: 'Others',
  },
  walletSize: {},
  walletLimit: 1000,
  annualTransactionAmount: 1000,
  kyc: {},
  annualTransaction: {},
  checkFor: 'SANCTIONED_SCREENING',
  totalScore: 1090,
  riskRating: 'Blocked',
  createdAt: '2021-07-13T01:45:21.676Z',
  updatedAt: '2021-07-13T01:45:21.676Z',
  scoredAt: '2021-07-14T07:08:34.060Z',
};

const riskProfileExample2 = {
  natureOfBusiness: 'professional_services',
  customerType: 'individual',
  id: '60d6d137c2458757d4676391',
  accountId: '059bf1a8-a494-4147-9adf-4b5871b679d6',
  idType: 'MYPR',
  idNumber: 'ebc32536-8545-4fcb-b4cc-3d85968285ed',
  countryOfResident: 'malaysian',
  nationality: '4d13553b-8b45-4367-8965-d9189d280988',
  watchList: 'domestic_pep',
  walletSize: 'greater_500',
  kyc: 'non_ekyc',
  annualTransaction: 'greater_equal_60000',
  checkFor: 'eKYC_VERIFICATION',
  remark: 'MjNkZGVlMWItMjQxNS00ODYwLWJkZGQtNzM0ZjBmODUwMWIx',
  totalScore: 500,
  riskRating: 'High',
  __v: 0,
  createdAt: '2021-06-26T07:03:19.807Z',
  updatedAt: '2021-06-26T07:03:19.807Z',
};

const riskProfiles = createMockData(
  [riskProfileExample1, riskProfileExample2],
  75,
  (seed, index) => ({
    ...seed,
    id: `${seed.id}${index}`,
  }),
);

const riskScorings = [
  {
    type: 'CUSTOMER_TYPE',
    name: 'Customer type',
    riskScorings: [
      {
        value: 'individual',
        score: 10,
        description: 'Individual',
      },
      {
        value: 'legal_entity',
        score: 30,
        description: 'Legal Entity',
      },
      {
        value: 'legal_arrangement',
        score: 60,
        description: 'Legal Arrangement',
      },
    ],
  },
  {
    type: 'COUNTRY_OF_RESIDENCE',
    name: 'Country of residence',
    riskScorings: [
      {
        value: 'non_malaysian',
        score: 30,
        description: 'Non Malaysia',
      },
      {
        value: 'malaysian',
        score: 0,
        description: 'Malaysia',
      },
    ],
  },
  {
    type: 'NATIONALITY',
    name: 'Nationality',
    riskScorings: [
      {
        value: 'PRK',
        score: 1000,
        description: 'Democratic People’s Republic of Korea',
      },
      {
        value: 'IRN',
        score: 1000,
        description: 'Iran',
      },
      {
        value: 'BHS',
        score: 1000,
        description: 'The Bahamas',
      },
      {
        value: 'BWA',
        score: 1000,
        description: 'Botswana',
      },
      {
        value: 'KHM',
        score: 1000,
        description: 'Cambodia',
      },
      {
        value: 'GHA',
        score: 1000,
        description: 'Ghana',
      },
      {
        value: 'ISL',
        score: 1000,
        description: 'Iceland',
      },
      {
        value: 'MNG',
        score: 1000,
        description: 'Mongolia',
      },
      {
        value: 'PAK',
        score: 1000,
        description: 'Pakistan',
      },
      {
        value: 'PAN',
        score: 1000,
        description: 'Panama',
      },
      {
        value: 'SYR',
        score: 1000,
        description: 'Syria',
      },
      {
        value: 'TTO',
        score: 1000,
        description: 'Trinidad and Tobago,',
      },
      {
        value: 'YEM',
        score: 1000,
        description: 'Yemen',
      },
      {
        value: 'ZWE',
        score: 1000,
        description: 'Zimbabwe',
      },
      {
        value: 'ZWE',
        score: 1000,
        description: 'Cuba',
      },
      {
        value: 'others',
        score: 0,
        description: 'Others',
      },
    ],
  },
  {
    type: 'CUSTOMER_WATCHLIST',
    name: 'Customer watchlist',
    riskScorings: [
      {
        value: 'non_watchlist',
        score: 0,
        description: 'Non Watchlist',
      },
      {
        value: 'domestic_pep',
        score: 200,
        description: 'Domestic Pep',
      },
      {
        value: 'foreign_pep',
        score: 200,
        description: 'Foreign Pep',
      },
      {
        value: 'sanctioned_individual',
        score: 1000,
        description: 'Sanctioned Individual',
      },
    ],
  },
  {
    type: 'NATURE_OF_BUSINESS',
    name: 'Nature of business',
    riskScorings: [
      {
        value: 'professional_services',
        score: 200,
        description: 'Professional Services',
      },
      {
        value: 'banking',
        score: 200,
        description: 'Banking',
      },
      {
        value: 'casino_gaming',
        score: 200,
        description: 'Casinos & Gaming Industry',
      },
      {
        value: 'money_services',
        score: 200,
        description: 'Money services business',
      },
      {
        value: 'remittance',
        score: 200,
        description: 'Remittance services',
      },
      {
        value: 'insurance',
        score: 200,
        description: 'Insurance',
      },
      {
        value: 'investment',
        score: 200,
        description: 'Investment',
      },
      {
        value: 'jewellery_art',
        score: 200,
        description: 'Jewellery, art, antique & Precious Metals',
      },
      {
        value: 'charities_cultural',
        score: 200,
        description: 'Charities/Cultural Associations & Foundation',
      },
      {
        value: 'import_export',
        score: 200,
        description: 'Import/Export',
      },
      {
        value: 'real_estate_auction',
        score: 200,
        description: 'Real estate and auction services',
      },
      {
        value: 'retail',
        score: 10,
        description: 'Retail',
      },
      {
        value: 'others',
        score: 10,
        description: 'Others',
      },
    ],
  },
  {
    type: 'WALLET_SIZE',
    name: 'Wallet size',
    riskScorings: [
      {
        value: 'less_equal_500',
        score: 10,
        description: '<= RM500',
      },
      {
        value: 'greater_500',
        score: 30,
        description: '> RM500',
      },
    ],
  },
];

const BASE_URL = `${environment.blacklistApiBaseUrl}/api/risk-profiles`;

export const handlers = [
  rest.get(
    `${BASE_URL}/risk-profiles`,
    createPaginationHandler((req) => {
      const identifier = req.url.searchParams.get('identifier');
      return riskProfiles.filter(
        ({accountId, id}) =>
          !identifier || accountId.includes(identifier) || id.includes(identifier),
      );
    }),
  ),

  rest.get(
    `${BASE_URL}/risk-profiles/:id/histories`,
    createPaginationHandler(() => {
      return riskProfiles;
    }),
  ),
  rest.post(`${BASE_URL}/risk-profiles`, (_, res, ctx) => {
    return res(ctx.json(riskProfileExample1));
  }),
  rest.get(`${BASE_URL}/risk-profiles/:id`, (_, res, ctx) => {
    return res(ctx.json(riskProfileDetails));
  }),
  rest.get(`${BASE_URL}/risk-scorings`, (_, res, ctx) => {
    return res(ctx.json(riskScorings));
  }),
];

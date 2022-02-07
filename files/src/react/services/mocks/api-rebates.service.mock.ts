import {rest} from 'msw';
import {
  createEmptyHandler,
  createFixResponseHandler,
  createPaginationHandler,
} from '../../lib/mock-helper';
import {environment} from '../../../environments/environment';

const ID = 'id';
const MOCK_LOYALTY_CODES = {
  items: [
    {
      categoryName: '0502 - ACCESSORIES',
      categoryCode: '0502',
      description: 'CAR PARTS VARIOUS - ACCESSORIES',
    },
    {
      categoryName: '0417 - ACCESSORIES',
      categoryCode: '0417',
      description: 'KEDAI MESRA - ACCESSORIES',
    },
    {
      categoryName: '0501 - AIR FILTERS',
      categoryCode: '0501',
      description: 'CAR PARTS VARIOUS - AIR FILTERS',
    },
    {
      categoryName: '7401 - AIRASIA BIG',
      categoryCode: '7401',
      description: 'AIRASIA BIG',
    },
    {
      categoryName: '0300 - ALT SERVICE',
      categoryCode: '0300',
      description: 'LUBRICANTS - ALT SERVICE',
    },
    {
      categoryName: '0415 - AUDIO VISUAL',
      categoryCode: '0415',
      description: 'KEDAI MESRA - AUDIO VISUAL',
    },
    {
      categoryName: '0201 - AUTOMOTIVE',
      categoryCode: '0201',
      description: 'LUBRICANTS - AUTOMOTIVE',
    },
    {
      categoryName: '8887 - AXXESS',
      categoryCode: '8887',
      description: 'AXXESS',
    },
    {
      categoryName: '0504 - BEARING',
      categoryCode: '0504',
      description: 'CAR PARTS VARIOUS - BEARING',
    },
    {
      categoryName: '7002 - BEAUTY & WELLNESS',
      categoryCode: '7002',
      description: 'BEAUTY & WELLNESS',
    },
    {
      categoryName: '0503 - BELTING',
      categoryCode: '0503',
      description: 'CAR PARTS VARIOUS - BELTING',
    },
    {
      categoryName: '0408 - BISCUITS',
      categoryCode: '0408',
      description: 'KEDAI MESRA - BISCUITS',
    },
    {
      categoryName: '0505 - BRAKE',
      categoryCode: '0505',
      description: 'CAR PARTS VARIOUS - BRAKE',
    },
    {
      categoryName: '0506 - CAR BATTERY',
      categoryCode: '0506',
      description: 'CAR PARTS VARIOUS - CAR BATTERY',
    },
    {
      categoryName: '0203 - CAR CARE',
      categoryCode: '0203',
      description: 'LUBRICANTS - CAR CARE',
    },
    {
      categoryName: '0299 - CAR CARE',
      categoryCode: '0299',
      description: 'LUBRICANTS - OTHERS',
    },
    {
      categoryName: '0500 - CAR PARTS VARIOUS',
      categoryCode: '0500',
      description: 'CAR PARTS VARIOUS',
    },
    {
      categoryName: '0412 - CAR PRODUCTS',
      categoryCode: '0412',
      description: 'KEDAI MESRA - CAR PRODUCTS',
    },
    {
      categoryName: '0301 - CARWASH',
      categoryCode: '0301',
      description: 'LUBRICANTS - CARWASH',
    },
    {
      categoryName: '0403 - CIGARETTE',
      categoryCode: '0403',
      description: 'KEDAI MESRA - CIGARETTE',
    },
  ],
};

export const MOCK_REBATE_PLANS = [
  {
    planName: '11111',
    planId: 4,
    type: 'Amount',
    createdAt: '2021-11-29T09:48:44.563Z',
    id: ID,
  },
  {
    planName: '0(0-10K)0.01(10k-20K)0.03(20k-30K)0.035(30k-50K)0.04(50k-100K)0.045(100k-100000K)',
    planId: 3,
    type: 'Amount',
    createdAt: '2021-11-29T04:31:52.404Z',
    id: ID,
  },
  {
    planName: '1(0-10)2(10-20)',
    planId: 2,
    type: 'Volume',
    createdAt: '2021-11-25T08:14:39.596Z',
    id: ID,
  },
  {
    planName: '0(0-10K)0.01(10k-20K)0.03(20k-30K)0.035(30k-50K)0.04(50k-100K)0.045(100k-100000K)',
    planId: 1,
    type: 'Amount',
    createdAt: '2021-11-18T07:51:17.576Z',
    id: ID,
  },
];

const MOCK_ACCOUNT_COMPANY = [
  {id: '1', name: 'A', code: 'A'},
  {id: '2', name: 'B', code: 'B'},
  {id: '3', name: 'C', code: 'C'},
  {id: '4', name: 'D', code: 'D'},
  {id: '5', name: 'E', code: 'E'},
  {id: '6', name: 'F', code: 'F'},
  {id: '7', name: 'G', code: 'G'},
  {id: '8', name: 'H', code: 'H'},
  {id: '9', name: 'M', code: 'M'},
];

const MOCK_REBATE_REPORTS = [
  {
    id: ID,
    processDate: '2021-11-30T15:59:59.000Z',
    createdAt: '2021-11-26T09:50:56.716Z',
    updatedAt: '2021-11-26T09:50:56.716Z',
  },
];

const BASE_URL = `${environment.rebatesApiBaseUrl}/api/rebates`;

export const handlers = [
  rest.post(`${BASE_URL}/rebate-plans`, createEmptyHandler()),
  rest.get(`${BASE_URL}/rebate-plans`, createPaginationHandler(MOCK_REBATE_PLANS)),
  rest.get(
    `${BASE_URL}/rebate-plans/loyalty-category-codes`,
    createFixResponseHandler(MOCK_LOYALTY_CODES),
  ),
  rest.get(`${BASE_URL}/rebate-plans/:id`, createFixResponseHandler(MOCK_REBATE_PLANS[0])),
  rest.put(`${BASE_URL}/rebate-plans/:id`, createEmptyHandler()),
  rest.post(`${BASE_URL}/rebate-settings`, createEmptyHandler()),
  rest.get(
    `${BASE_URL}/rebate-settings/sp-accounts-companies`,
    createFixResponseHandler(MOCK_ACCOUNT_COMPANY),
  ),
  rest.get(`${BASE_URL}/rebate-reports`, createPaginationHandler(MOCK_REBATE_REPORTS)),
  rest.get(`${BASE_URL}/rebate-reports/:processDate`, createEmptyHandler()),
];

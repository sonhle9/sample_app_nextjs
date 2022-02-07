import {rest} from 'msw';
import {environment} from 'src/environments/environment';
import {createPaginationHandler} from 'src/react/lib/mock-helper';

const MOCK_BUDGETS = [
  //1st data
  {
    //change end with start with a
    _id: '5e83d9e313d84b76d392e3da',
    month: 1,
    year: 2020,
    userId: 'd812d91d-fd8b-48d9-b889-25150c93c38f',
    fuelOrders: {
      //change end with start with a
      _id: '5e83d9e313d84b4a6992e3da',
      summaries: [
        {
          _id: '5e83d9e313d84b46f592e3db',
          fuelType: 'PRIMAX 95',
          purchaseCount: 51,
          amountFuelled: 190,
          litresFuelled: 150.8,
        },
        {
          _id: '5e83d9e313d84b46f592e4db',
          fuelType: 'DIESEL',
          purchaseCount: 22,
          amountFuelled: 180,
          litresFuelled: 31.00000000000015,
        },
      ],
      totals: {
        //change end with start with 0
        id: '5e83d9e313d84bc71592e3e0',
        purchaseCount: 73,
        amountFuelled: 360,
        litresFuelled: 181.80000000000015,
      },
    },
    createdAt: '2020-01-01T00:01:39.750Z',
    updatedAt: '2020-01-01T00:01:39.750Z',
    __v: 0,
  },
  //2nd data
  {
    _id: '5e83d9e313d84b76d392e3db',
    month: 2,
    year: 2020,
    userId: 'd812d91d-fd8b-48d9-b889-25150c93c38f',
    fuelOrders: {
      _id: '5e83d9e313d84b4a6992e3db',
      summaries: [
        {
          _id: '5e83d9e313d84b46f592e3db',
          fuelType: 'PRIMAX 97',
          purchaseCount: 10,
          amountFuelled: 100,
          litresFuelled: 150.1,
        },
      ],
      totals: {
        id: '5e83d9e313d84bc71592e3e1',
        purchaseCount: 10,
        amountFuelled: 200,
        litresFuelled: 150.1,
      },
    },
    createdAt: '2020-02-01T00:01:39.750Z',
    updatedAt: '2020-02-01T00:01:39.750Z',
    __v: 0,
  },
  //3rd data
  {
    _id: '5e83d9e313d84b76d392e3dc',
    month: 3,
    year: 2020,
    userId: 'd812d91d-fd8b-48d9-b889-25150c93c38f',
    fuelOrders: {
      _id: '5e83d9e313d84b4a6992e3dc',
      summaries: [
        {
          _id: '5e83d9e313d84b46f592e3dc',
          fuelType: 'PRIMAX 95',
          purchaseCount: 20,
          amountFuelled: 200,
          litresFuelled: 200.1,
        },
      ],
      totals: {
        id: '5e83d9e313d84bc71592e3e2',
        purchaseCount: 20,
        amountFuelled: 200,
        litresFuelled: 200.1,
      },
    },
    createdAt: '2020-03-01T00:01:39.750Z',
    updatedAt: '2020-03-01T00:01:39.750Z',
    __v: 0,
  },
  //4th data
  {
    _id: '5e83d9e313d84b76d392e3dd',
    month: 4,
    year: 2020,
    userId: 'd812d91d-fd8b-48d9-b889-25150c93c38f',
    fuelOrders: {
      _id: '5e83d9e313d84b4a6992e3dd',
      summaries: [
        {
          _id: '5e83d9e313d84b46f592e3dd',
          fuelType: 'PRIMAX 95',
          purchaseCount: 30,
          amountFuelled: 300,
          litresFuelled: 250.1,
        },
      ],
      totals: {
        id: '5e83d9e313d84bc71592e3e3',
        purchaseCount: 30,
        amountFuelled: 300,
        litresFuelled: 250.1,
      },
    },
    createdAt: '2020-04-01T00:01:39.750Z',
    updatedAt: '2020-04-01T00:01:39.750Z',
    __v: 0,
  },
  //5th data
  {
    _id: '5e84d9e313d84b76d392e3de',
    month: 5,
    year: 2020,
    userId: 'd812d91d-fd8b-48d9-b889-25150c93c38f',
    fuelOrders: {
      _id: '5e83d9e313d84b4a6992e3de',
      summaries: [
        {
          _id: '5e83d9e313d84b46f592e3de',
          fuelType: 'PRIMAX 97',
          purchaseCount: 40,
          amountFuelled: 300,
          litresFuelled: 300.1,
        },
      ],
      totals: {
        id: '5e83d9e313d84bc71592e3e4',
        purchaseCount: 40,
        amountFuelled: 400,
        litresFuelled: 300.1,
      },
    },
    createdAt: '2020-05-01T00:01:39.750Z',
    updatedAt: '2020-05-01T00:01:39.750Z',
    __v: 0,
  },
  //6th data
  {
    _id: '5e83d9e313d84b76d392e3df',
    month: 6,
    year: 2020,
    userId: 'd812d91d-fd8b-48d9-b889-25150c93c38f',
    fuelOrders: {
      _id: '5e83d9e313d84b4a6992e3df',
      summaries: [
        {
          _id: '5e83d9e313d84b46f592e3df',
          fuelType: 'PRIMAX 95',
          purchaseCount: 50,
          amountFuelled: 500,
          litresFuelled: 350.1,
        },
      ],
      totals: {
        id: '5e83d9e313d84bc71592e3e5',
        purchaseCount: 50,
        amountFuelled: 500,
        litresFuelled: 400.1,
      },
    },
    createdAt: '2020-06-01T00:01:39.750Z',
    updatedAt: '2020-06-01T00:01:39.750Z',
    __v: 0,
  },
  //7th data
  {
    _id: '5e83d9e313d84b76d392e3dg',
    month: 7,
    year: 2020,
    userId: 'd812d91d-fd8b-48d9-b889-25150c93c38f',
    fuelOrders: {
      _id: '5e83d9e313d84b4a6992e3dg',
      summaries: [
        {
          _id: '5e83d9e313d84b46f592e3dg',
          fuelType: 'PRIMAX 95',
          purchaseCount: 60,
          amountFuelled: 600,
          litresFuelled: 450.1,
        },
      ],
      totals: {
        id: '5e83d9e313d84bc71592e3e6',
        purchaseCount: 60,
        amountFuelled: 600,
        litresFuelled: 450.1,
      },
    },
    createdAt: '2020-07-01T00:01:39.750Z',
    updatedAt: '2020-07-01T00:01:39.750Z',
    __v: 0,
  },
  //8th data
  {
    _id: '5e83d9e313d84b76d392e3dh',
    month: 8,
    year: 2020,
    userId: 'd812d91d-fd8b-48d9-b889-25150c93c38f',
    fuelOrders: {
      _id: '5e83d9e313d84b4a6992e3dh',
      summaries: [
        {
          _id: '5e83d9e313d84b46f592e3dh',
          fuelType: 'PRIMAX 97',
          purchaseCount: 70,
          amountFuelled: 700,
          litresFuelled: 500.1,
        },
      ],
      totals: {
        id: '5e83d9e313d84bc71592e3e7',
        purchaseCount: 70,
        amountFuelled: 700,
        litresFuelled: 550.1,
      },
    },
    createdAt: '2020-08-01T00:01:39.750Z',
    updatedAt: '2020-08-01T00:01:39.750Z',
    __v: 0,
  },
  //9th data
  {
    _id: '5e83d9e313d84b76d392e3di',
    month: 9,
    year: 2020,
    userId: 'd812d91d-fd8b-48d9-b889-25150c93c38f',
    fuelOrders: {
      _id: '5e83d9e313d84b4a6992e3di',
      summaries: [
        {
          _id: '5e83d9e313d84b46f592e3di',
          fuelType: 'PRIMAX 95',
          purchaseCount: 80,
          amountFuelled: 800,
          litresFuelled: 600.1,
        },
      ],
      totals: {
        id: '5e83d9e313d84bc71592e3e8',
        purchaseCount: 80,
        amountFuelled: 800,
        litresFuelled: 600.1,
      },
    },
    createdAt: '2020-09-01T00:01:39.750Z',
    updatedAt: '2020-09-01T00:01:39.750Z',
    __v: 0,
  },
  //10th data
  {
    _id: '5e83d9e313d84b76d392e3dj',
    month: 10,
    year: 2020,
    userId: 'd812d91d-fd8b-48d9-b889-25150c93c38f',
    fuelOrders: {
      _id: '5e83d9e313d84b4a6992e3dj',
      summaries: [
        {
          _id: '5e83d9e313d84b46f592e3dj',
          fuelType: 'PRIMAX 95',
          purchaseCount: 80,
          amountFuelled: 800,
          litresFuelled: 650.1,
        },
      ],
      totals: {
        id: '5e83d9e313d84bc71592e3e9',
        purchaseCount: 80,
        amountFuelled: 800,
        litresFuelled: 650.1,
      },
    },
    createdAt: '2020-10-01T00:01:39.750Z',
    updatedAt: '2020-10-01T00:01:39.750Z',
    __v: 0,
  },

  //11st data
  {
    //change end with start with a
    _id: '5e93d9e313d84b76d392e3de',
    month: 1,
    year: 2019,
    userId: 'd812d91d-fd8b-48d9-b889-25150c93c38f',
    fuelOrders: {
      //change end with start with a
      _id: '5e83d9e313d84b4a6992e3da',
      summaries: [
        {
          _id: '5e83d9e313d84b46f592e3da',
          fuelType: 'PRIMAX 97',
          purchaseCount: 1,
          amountFuelled: 10,
          litresFuelled: 1.1,
        },
      ],
      totals: {
        //change end with start with 0
        id: '5e83d9e313d84bc71592e3e0',
        purchaseCount: 1,
        amountFuelled: 10,
        litresFuelled: 1.1,
      },
    },
    createdAt: '2019-01-01T00:01:39.750Z',
    updatedAt: '2019-01-01T00:01:39.750Z',
    __v: 0,
  },
  //12nd data
  {
    _id: '5e83d6e313d84b76d392e3db',
    month: 2,
    year: 2019,
    userId: 'd812d91d-fd8b-48d9-b889-25150c93c38f',
    fuelOrders: {
      _id: '5e83d9e313d84b4a6992e3db',
      summaries: [
        {
          _id: '5e83d9e313d84b46f592e3db',
          fuelType: 'PRIMAX 95',
          purchaseCount: 2,
          amountFuelled: 20,
          litresFuelled: 2.2,
        },
      ],
      totals: {
        id: '5e83d9e313d84bc71592e3e1',
        purchaseCount: 2,
        amountFuelled: 20,
        litresFuelled: 2.2,
      },
    },
    createdAt: '2019-02-01T00:01:39.750Z',
    updatedAt: '2019-02-01T00:01:39.750Z',
    __v: 0,
  },
  //13rd data
  {
    _id: '5e83d9e313d84b76d392e5dc',
    month: 3,
    year: 2019,
    userId: 'd812d91d-fd8b-48d9-b889-25150c93c38f',
    fuelOrders: {
      _id: '5e83d9e313d84b4a6992e3dc',
      summaries: [
        {
          _id: '5e83d9e313d84b46f592e3dc',
          fuelType: 'DIESEL',
          purchaseCount: 3,
          amountFuelled: 30,
          litresFuelled: 3.3,
        },
      ],
      totals: {
        id: '5e83d9e313d84bc71592e3e2',
        purchaseCount: 3,
        amountFuelled: 30,
        litresFuelled: 3.3,
      },
    },
    createdAt: '2019-03-01T00:01:39.750Z',
    updatedAt: '2019-03-01T00:01:39.750Z',
    __v: 0,
  },
  //14th data
  {
    _id: '5e83d9e313d84b76d392e3ed',
    month: 4,
    year: 2019,
    userId: 'd812d91d-fd8b-48d9-b889-25150c93c38f',
    fuelOrders: {
      _id: '5e83d9e313d84b4a6992e3dd',
      summaries: [
        {
          _id: '5e83d9e313d84b46f592e3dd',
          fuelType: 'PRIMAX 97',
          purchaseCount: 4,
          amountFuelled: 40,
          litresFuelled: 4.4,
        },
      ],
      totals: {
        id: '5e83d9e313d84bc71592e3e3',
        purchaseCount: 4,
        amountFuelled: 40,
        litresFuelled: 4.4,
      },
    },
    createdAt: '2019-04-01T00:01:39.750Z',
    updatedAt: '2019-04-01T00:01:39.750Z',
    __v: 0,
  },
  //15th data
  {
    _id: '5e83d9e313d84b76d392e3de',
    month: 5,
    year: 2019,
    userId: 'd812d91d-fd8b-48d9-b889-25150c93c38f',
    fuelOrders: {
      _id: '5e83d9e313d84b4a6992e3de',
      summaries: [
        {
          _id: '5e83d9e313d84b46f592e3de',
          fuelType: 'PRIMAX 95',
          purchaseCount: 5,
          amountFuelled: 50,
          litresFuelled: 5.5,
        },
      ],
      totals: {
        id: '5e83d9e313d84bc71592e3e4',
        purchaseCount: 5,
        amountFuelled: 50,
        litresFuelled: 5.5,
      },
    },
    createdAt: '2019-05-01T00:01:39.750Z',
    updatedAt: '2019-05-01T00:01:39.750Z',
    __v: 0,
  },
  //16th data
  {
    _id: '5e83d9e313d84b76d392c3df',
    month: 6,
    year: 2019,
    userId: 'd812d91d-fd8b-48d9-b889-25150c93c38f',
    fuelOrders: {
      _id: '5e83d9e313d84b4a6992e3df',
      summaries: [
        {
          _id: '5e83d9e313d84b46f592e3df',
          fuelType: 'PRIMAX 95',
          purchaseCount: 6,
          amountFuelled: 60,
          litresFuelled: 6.6,
        },
      ],
      totals: {
        id: '5e83d9e313d84bc71592e3e5',
        purchaseCount: 6,
        amountFuelled: 60,
        litresFuelled: 6.6,
      },
    },
    createdAt: '2019-06-01T00:01:39.750Z',
    updatedAt: '2019-06-01T00:01:39.750Z',
    __v: 0,
  },
  //17th data
  {
    _id: '5e83d9e313d84b76d392e3d4',
    month: 7,
    year: 2019,
    userId: 'd812d91d-fd8b-48d9-b889-25150c93c38f',
    fuelOrders: {
      _id: '5e83d9e313d84b4a6992e3dg',
      summaries: [
        {
          _id: '5e83d9e313d84b46f592e3dg',
          fuelType: 'PRIMAX 97',
          purchaseCount: 7,
          amountFuelled: 70,
          litresFuelled: 7.7,
        },
      ],
      totals: {
        id: '5e83d9e313d84bc71592e3e6',
        purchaseCount: 7,
        amountFuelled: 70,
        litresFuelled: 7.7,
      },
    },
    createdAt: '2019-07-01T00:01:39.750Z',
    updatedAt: '2019-07-01T00:01:39.750Z',
    __v: 0,
  },
  //18th data
  {
    _id: '5e83d9e313d84b76d392e3d0',
    month: 8,
    year: 2019,
    userId: 'd812d91d-fd8b-48d9-b889-25150c93c38f',
    fuelOrders: {
      _id: '5e83d9e313d84b4a6992e3dh',
      summaries: [
        {
          _id: '5e83d9e313d84b46f592e3dh',
          fuelType: 'PRIMAX 95',
          purchaseCount: 8,
          amountFuelled: 80,
          litresFuelled: 8.8,
        },
      ],
      totals: {
        id: '5e83d9e313d84bc71592e3e7',
        purchaseCount: 8,
        amountFuelled: 80,
        litresFuelled: 8.8,
      },
    },
    createdAt: '2019-08-01T00:01:39.750Z',
    updatedAt: '2019-08-01T00:01:39.750Z',
    __v: 0,
  },
  //19th data
  {
    _id: '5e83d9e313d84b76d392e3d9',
    month: 9,
    year: 2019,
    userId: 'd812d91d-fd8b-48d9-b889-25150c93c38f',
    fuelOrders: {
      _id: '5e83d9e313d84b4a6992e3di',
      summaries: [
        {
          _id: '5e83d9e313d84b46f592e3di',
          fuelType: 'PRIMAX 95',
          purchaseCount: 9,
          amountFuelled: 90,
          litresFuelled: 9.9,
        },
      ],
      totals: {
        id: '5e83d9e313d84bc71592e3e8',
        purchaseCount: 9,
        amountFuelled: 90,
        litresFuelled: 9.9,
      },
    },
    createdAt: '2019-09-01T00:01:39.750Z',
    updatedAt: '2019-09-01T00:01:39.750Z',
    __v: 0,
  },
  //20th data
  {
    _id: '5e83d9e313d84b76d392e3dk',
    month: 10,
    year: 2019,
    userId: 'd812d91d-fd8b-48d9-b889-25150c93c38f',
    fuelOrders: {
      _id: '5e83d9e313d84b4a6992e3dj',
      summaries: [
        {
          _id: '5e83d9e313d84b46f592e3dj',
          fuelType: 'PRIMAX 97',
          purchaseCount: 10,
          amountFuelled: 100,
          litresFuelled: 10.1,
        },
      ],
      totals: {
        id: '5e83d9e313d84bc71592e3e9',
        purchaseCount: 10,
        amountFuelled: 100,
        litresFuelled: 10.1,
      },
    },
    createdAt: '2019-10-01T00:01:39.750Z',
    updatedAt: '2019-10-01T00:01:39.750Z',
    __v: 0,
  },
];

const baseUrl = `${environment.budgetApiBaseUrl}/api/budgets`;

export const handlers = [
  rest.get(
    `${baseUrl}/admin/statements/users/:userId/statements/summary`,
    createPaginationHandler((req) =>
      MOCK_BUDGETS.map((budget) => ({...budget, userId: req.params.userId})),
    ),
  ),
];

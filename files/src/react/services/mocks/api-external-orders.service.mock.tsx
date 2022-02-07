import {rest} from 'msw';
import {environment} from 'src/environments/environment';
import {
  createEmptyHandler,
  createFixResponseHandler,
  createPaginationHandler,
} from 'src/react/lib/mock-helper';

const MOCK_DATA = [
  //1st data
  {
    //change end with start with a
    createdAt: '2021-05-31T03:25:44.449Z',
    id: '60b45b53008cf800110f5d8e',
    //isGrantedBasePoints: true,
    items: [
      {
        _id: '60b9f2270f10ca001a017e32',
        isValidForLoyaltyPoints: true,
        name: 'PETRONAS PRIMAX PRO-95',
        pricePerUnit: 2.08,
        quantity: 3.5,
        totalPrice: 7.28,
        type: 'FUEL',
      },
    ],
    orderType: 'FUEL',
    //receiptImageUrl: "https://api-external-orders-dev.s3.amazonaws.com/external-order-60b45738f669170011203dac.jpg?AWSAccessKeyId=AKIAUKIHD263TBOO277J&Expires=1624242972&Signature=OXT5QCI7UpPrd5ydAr7Ta6yRFq0%3D"
    stationName: 'TAMAN PUTRA',
    status: 'RESOLVED',
    //transactionDate: "2021-05-31T00:00:00.000Z",
    updatedAt: '2021-06-04T09:28:10.188Z',
    userId: '48431c4b-9c6f-480e-930e-5dc9e1ceb471',
  },

  //2nd data //
  {
    //change end with start with a
    createdAt: '2021-05-31T03:25:44.449Z',
    id: '60b45508f669170011203daa',
    //isGrantedBasePoints: true,
    items: [
      {
        _id: '60b459e76546870011862b94',
        isValidForLoyaltyPoints: true,
        name: 'PETRONAS PRIMAX PRO-95',
        pricePerUnit: 2.08,
        quantity: 6.5,
        totalPrice: 13.52,
        type: 'STORE',
      },
    ],
    orderType: 'STORE',
    //receiptImageUrl: "https://api-external-orders-dev.s3.amazonaws.com/external-order-60b45738f669170011203dac.jpg?AWSAccessKeyId=AKIAUKIHD263TBOO277J&Expires=1624242972&Signature=OXT5QCI7UpPrd5ydAr7Ta6yRFq0%3D"
    stationName: 'TAMAN PUTRA',
    status: 'PENDING',
    //transactionDate: "2021-06-12T00:00:00.000Z",
    updatedAt: '2021-06-23T10:28:10.188Z',
    userId: '48431c4b-9c6f-480e-930e-5dc9e1ceb471',
  },
];

const grantPreviewResponse = [
  {
    id: '879969',
    status: 'Pending',
    externalOrderId: '6124ba3ec7ade6001a2058bf',
    receiptNumber: 'oh03',
    transactionDate: '2021-08-24',
    stationName: 'RYB0260-TAMAN PUTRA',
    purchaseType: 'FUEL',
    items: 'PETRONAS PRIMAX PRO-95|2.08|3.5|7.28|TRUE|FUEL',
    isValidExternalOrder: true,
    isGrantedBasePoint: false,
    grantedBasePoints: 0,
    pointsToBeGranted: 9,
  },
  {
    id: '879972',
    status: 'Pending',
    externalOrderId: '6124ba57c7ade6001a2058c0',
    receiptNumber: 'oh04',
    transactionDate: '2021-08-24',
    stationName: 'RYB0260-TAMAN PUTRA',
    purchaseType: 'FUEL',
    items: 'PETRONAS PRIMAX PRO-95|2.08|3.5|7.28|TRUE|FUEL',
    isValidExternalOrder: true,
    isGrantedBasePoint: false,
    grantedBasePoints: 0,
    pointsToBeGranted: 9,
  },
];

const baseUrl = `${environment.externalOrdersApiBaseUrl}/api/external-orders`;

export const handlers = [
  rest.get(
    `${baseUrl}/admin/customers/:userId/orders`,
    createPaginationHandler((req) =>
      MOCK_DATA.map((data) => ({...data, userId: req.params.userId})),
    ),
  ),
  rest.post(
    `${baseUrl}/admin/loyalty/bulk-grant/preview`,
    createFixResponseHandler(grantPreviewResponse),
  ),
  rest.post(`${baseUrl}/admin/loyalty/bulk-grant`, createEmptyHandler()),
];

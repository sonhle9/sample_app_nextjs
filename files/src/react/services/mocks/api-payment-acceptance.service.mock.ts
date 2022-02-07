import {rest} from 'msw';
import {environment} from 'src/environments/environment';
import {createFixResponseHandler} from 'src/react/lib/mock-helper';

const BASE_URL = `${environment.paymentAcceptanceApiBaseUrl}/api/payment-acceptance/admin`;

export const MOCK_MERCHANT_PAYMENT_ACCEPTANCE = [
  {
    merchantId: '606d3590891026001167771e',
    group: 'card',
    family: 'card',
    type: 'cardPresent',
    brand: 'americanExpress',
    isEnabled: true,
    isChangeable: true,
  },
  {
    merchantId: '606d3590891026001167771e',
    group: 'card',
    family: 'card',
    type: 'cardPresent',
    brand: 'myDebit',
    isEnabled: true,
    isChangeable: true,
  },
  {
    merchantId: '606d3590891026001167771e',
    group: 'card',
    family: 'card',
    type: 'cardPresent',
    brand: 'visa',
    isEnabled: true,
    isChangeable: true,
  },
  {
    merchantId: '606d3590891026001167771e',
    group: 'closeLoopCard',
    family: 'closedLoopCard',
    type: 'fleet',
    brand: 'petronasSmartpay',
    isEnabled: true,
    isChangeable: true,
  },
  {
    merchantId: '606d3590891026001167771e',
    group: 'card',
    family: 'card',
    type: 'cardPresent',
    brand: 'mastercard',
    isEnabled: true,
    isChangeable: true,
  },
];

export const handlers = [
  rest.get(
    `${BASE_URL}/merchant-methods`,
    createFixResponseHandler(MOCK_MERCHANT_PAYMENT_ACCEPTANCE),
  ),
];

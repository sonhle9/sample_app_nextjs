import {checkoutTransactionPaymentMethodPipe} from './checkout-transaction-payment-method.pipe';

describe('checkoutTransactionPaymentMethodPipe', () => {
  it('create an instance', () => {
    const pipe = new checkoutTransactionPaymentMethodPipe();
    expect(pipe).toBeTruthy();
  });
});

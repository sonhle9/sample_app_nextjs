import {checkoutTransactionStatusPipe} from './checkout-transaction-status.pipe';

describe('checkoutTransactionStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new checkoutTransactionStatusPipe();
    expect(pipe).toBeTruthy();
  });
});

import {OrderStatusPipe} from './order-status.pipe';

describe('OrderStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new OrderStatusPipe();
    expect(pipe).toBeTruthy();
  });
});

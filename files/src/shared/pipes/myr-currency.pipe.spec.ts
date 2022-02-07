import {MyrCurrencyPipe} from './myr-currency.pipe';

describe('MyrCurrencyPipe', () => {
  it('create an instance', () => {
    const pipe = new MyrCurrencyPipe(`en-US`);
    expect(pipe).toBeTruthy();
  });
});

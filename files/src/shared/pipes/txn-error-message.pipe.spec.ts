import {TxnErrorMessagePipe} from './txn-error-message.pipe';

describe('TxnErrorMessagePipe', () => {
  it('create an instance', () => {
    const pipe = new TxnErrorMessagePipe();
    expect(pipe).toBeTruthy();
  });
});

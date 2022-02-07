import {ActiveStatusPipe} from './active-status.pipe';

describe('ActiveStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new ActiveStatusPipe();
    expect(pipe).toBeTruthy();
  });
});

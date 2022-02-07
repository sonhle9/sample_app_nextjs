import {EmptyObjectPipe} from './empty-object.pipe';

describe('EmptyObjectPipe', () => {
  it('create an instance', () => {
    const pipe = new EmptyObjectPipe();
    expect(pipe).toBeTruthy();
  });
});

import { ServerNamePipe } from './server-name.pipe';

describe('ServerNamePipe', () => {
  it('create an instance', () => {
    const pipe = new ServerNamePipe();
    expect(pipe).toBeTruthy();
  });
});

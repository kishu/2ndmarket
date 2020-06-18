import { FromBytesPipe } from './from-bytes.pipe';

describe('FromBytesPipe', () => {
  it('create an instance', () => {
    const pipe = new FromBytesPipe();
    expect(pipe).toBeTruthy();
  });
});

import { FsDocumentPipe } from './fs-document.pipe';

describe('FsDocumentPipe', () => {
  it('create an instance', () => {
    const pipe = new FsDocumentPipe();
    expect(pipe).toBeTruthy();
  });
});

import { File } from '../../src/lib/File';

describe('File', () => {
  describe('read()', () => {
    it('Success', () => {
      const file = new File('./test/lib/file/read.txt');
      expect(file.read()).toBe('hogehoge');
    });
  });

  describe('write()', () => {
    it('Success - create file only', () => {
      const file = new File('./test/lib/file/write.txt');

      const message = 'fugafuga';
      file.write(message);

      expect(file.read()).toBe(message);
    });

    it('Success - create file and directory', () => {
      const file = new File('./test/lib/file/write/config.txt');

      const message = 'fugafuga';
      file.write(message);

      expect(file.read()).toBe(message);
    });
  });
});

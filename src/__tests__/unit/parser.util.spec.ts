import * as util from '../../parser/util';

describe('Parser Util', () => {
  it('should get no args when there are no args', () => {
    expect(util.getArgs('abc', 'abc')).toEqual([]);
  });

  it('should get args when there are args', () => {
    expect(util.getArgs('abc 1', 'abc')).toEqual([1]);
    expect(util.getArgs('abc 1 hello', 'abc')).toEqual([1, 'hello']);
  });

  it('should get quoted args when there are quoted args', () => {
    expect(util.getArgs('abc "hello world"', 'abc')).toEqual(['hello world']);
    expect(util.getArgs('abc "hi there" "second arg"', 'abc')).toEqual(['hi there', 'second arg']);
  });
});

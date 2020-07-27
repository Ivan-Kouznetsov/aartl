import * as matchers from '../../rules/matchers';

describe('Matchers', () => {
  it('should match via AnyOf correctly', () => {
    expect(matchers.validateAnyOf(['hello', 'hi'])(['hello', 'hello'])).toBeUndefined();
    expect(matchers.validateAnyOf(['hello', 'hi'])(['hello', 'goodbye'])).toEqual('goodbye');
  });

  it('should match via validateCountEquals correctly', () => {
    expect(matchers.validateCountEquals(2)(['hello', 'hello'])).toBeUndefined();
    expect(matchers.validateCountEquals(3)(['hello', 'goodbye'])).toEqual(2);
  });

  it('should match via validateCountGreaterThan correctly', () => {
    expect(matchers.validateCountGreaterThan(1)(['hello', 'hello'])).toBeUndefined();
    expect(matchers.validateCountGreaterThan(2)(['hello', 'hello'])).toEqual(2);
  });

  it('should match via validateCountGreaterThanOrEqual correctly', () => {
    expect(matchers.validateCountGreaterThanOrEqual(2)(['hello', 'hello'])).toBeUndefined();
    expect(matchers.validateCountGreaterThanOrEqual(3)(['hello', 'hello'])).toEqual(2);
  });

  it('should match via validateCountLessThan correctly', () => {
    expect(matchers.validateCountLessThan(3)(['hello', 'hello'])).toBeUndefined();
    expect(matchers.validateCountLessThan(2)(['hello', 'hello'])).toEqual(2);
  });

  it('should match via validateCountLessThanOrEqual correctly', () => {
    expect(matchers.validateCountLessThanOrEqual(2)(['hello', 'hello'])).toBeUndefined();
    expect(matchers.validateCountLessThanOrEqual(1)(['hello', 'hello'])).toEqual(2);
  });

  it('should match via validateGreaterThan correctly', () => {
    expect(matchers.validateGreaterThan(1)([2])).toBeUndefined();
    expect(matchers.validateGreaterThan(2)(['hello', 'hello'])).toEqual('hello');
  });

  it('should match via validateGreaterThanOrEqual correctly', () => {
    expect(matchers.validateGreaterThanOrEqual(1)([1])).toBeUndefined();
    expect(matchers.validateGreaterThanOrEqual(1)([0, 'hello'])).toEqual(0);
  });

  it('should match via validateLessThan correctly', () => {
    expect(matchers.validateLessThan(10)([9])).toBeUndefined();
    expect(matchers.validateLessThan(10)([0, 12])).toEqual(12);
  });

  it('should match via validateLessThanOrEqual correctly', () => {
    expect(matchers.validateLessThanOrEqual(10)([9, 10])).toBeUndefined();
    expect(matchers.validateLessThanOrEqual(10)([0, 12])).toEqual(12);
  });

  it('should match via validateNonEmptyString correctly', () => {
    expect(matchers.validateNonEmptyString()(['hello'])).toBeUndefined();
    expect(matchers.validateNonEmptyString()([47])).toEqual(47);
    expect(matchers.validateNonEmptyString()(['hello', ''])).toEqual('');
  });

  it('should match via validateNot correctly', () => {
    expect(matchers.validateNot('hello')(['goodbye'])).toBeUndefined();
    expect(matchers.validateNot('hello')(['hello', ''])).toEqual('hello');
  });

  it('should match via validateNumber correctly', () => {
    expect(matchers.validateNumber()([12])).toBeUndefined();
    expect(matchers.validateNumber()(['hello', ''])).toEqual('hello');
  });

  it('should match via validateRegex correctly', () => {
    expect(matchers.validateRegex(/\d+/)([12])).toBeUndefined();
    expect(matchers.validateRegex(/\d+/)(['hello', ''])).toEqual('hello');
  });

  it('should match via validateStringContaining correctly', () => {
    expect(matchers.validateStringContaining('hello')(['hello my friend'])).toBeUndefined();
    expect(matchers.validateStringContaining('hello')(['hello', 'hi'])).toEqual('hi');
  });

  it('should match via validateStringNotContaining correctly', () => {
    expect(matchers.validateStringNotContaining('hello')(['hi my friend'])).toBeUndefined();
    expect(matchers.validateStringNotContaining('hello')(['hello', 'hi'])).toEqual('hello');
  });

  it('should match via validateArrayHasProp correctly', () => {
    expect(matchers.validateArrayHasProp('hello')([{ hello: 123 }])).toBeUndefined();
    expect(matchers.validateArrayHasProp('hello')([{}])).toEqual({});
  });
});

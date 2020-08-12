import * as matchers from '../../rules/matchers';
import { NotFound } from '../../rules/matchers';

describe('Matchers', () => {
  it('should match via AnyOf correctly', () => {
    expect(matchers.validateAnyOf(['hello', 'hi'])(['hello', 'hello'])).toEqual(NotFound);
    expect(matchers.validateAnyOf(['hello', 'hi'])(['hello', 'goodbye'])).toEqual('goodbye');
  });

  it('should match via validateCountEquals correctly', () => {
    expect(matchers.validateCountEquals(2)(['hello', 'hello'])).toEqual(NotFound);
    expect(matchers.validateCountEquals(3)(['hello', 'goodbye'])).toEqual(2);
  });

  it('should match via validateCountGreaterThan correctly', () => {
    expect(matchers.validateCountGreaterThan(1)(['hello', 'hello'])).toEqual(NotFound);
    expect(matchers.validateCountGreaterThan(2)(['hello', 'hello'])).toEqual(2);
  });

  it('should match via validateCountGreaterThanOrEqual correctly', () => {
    expect(matchers.validateCountGreaterThanOrEqual(2)(['hello', 'hello'])).toEqual(NotFound);
    expect(matchers.validateCountGreaterThanOrEqual(3)(['hello', 'hello'])).toEqual(2);
  });

  it('should match via validateCountLessThan correctly', () => {
    expect(matchers.validateCountLessThan(3)(['hello', 'hello'])).toEqual(NotFound);
    expect(matchers.validateCountLessThan(2)(['hello', 'hello'])).toEqual(2);
  });

  it('should match via validateCountLessThanOrEqual correctly', () => {
    expect(matchers.validateCountLessThanOrEqual(2)(['hello', 'hello'])).toEqual(NotFound);
    expect(matchers.validateCountLessThanOrEqual(1)(['hello', 'hello'])).toEqual(2);
  });

  it('should match via validateGreaterThan correctly', () => {
    expect(matchers.validateGreaterThan(1)([2])).toEqual(NotFound);
    expect(matchers.validateGreaterThan(2)(['hello', 'hello'])).toEqual('hello');
  });

  it('should match via validateGreaterThanOrEqual correctly', () => {
    expect(matchers.validateGreaterThanOrEqual(1)([1])).toEqual(NotFound);
    expect(matchers.validateGreaterThanOrEqual(1)([0, 'hello'])).toEqual(0);
  });

  it('should match via validateLessThan correctly', () => {
    expect(matchers.validateLessThan(10)([9])).toEqual(NotFound);
    expect(matchers.validateLessThan(10)([0, 12])).toEqual(12);
  });

  it('should match via validateLessThanOrEqual correctly', () => {
    expect(matchers.validateLessThanOrEqual(10)([9, 10])).toEqual(NotFound);
    expect(matchers.validateLessThanOrEqual(10)([0, 12])).toEqual(12);
  });

  it('should match via validateNonEmptyString correctly', () => {
    expect(matchers.validateNonEmptyString()(['hello'])).toEqual(NotFound);
    expect(matchers.validateNonEmptyString()([47])).toEqual(47);
    expect(matchers.validateNonEmptyString()(['hello', ''])).toEqual('');
  });

  it('should match via validateNot correctly', () => {
    expect(matchers.validateNot('hello')(['goodbye'])).toEqual(NotFound);
    expect(matchers.validateNot('hello')(['hello', ''])).toEqual('hello');
  });

  it('should match via validateNumber correctly', () => {
    expect(matchers.validateNumber()([12])).toEqual(NotFound);
    expect(matchers.validateNumber()(['hello', ''])).toEqual('hello');
  });

  it('should match via validateRegex correctly', () => {
    expect(matchers.validateRegex('\\d+')([12])).toEqual(NotFound);
    expect(matchers.validateRegex('\\d+')(['hello', ''])).toEqual('hello');
  });

  it('should match via validateStringContaining correctly', () => {
    expect(matchers.validateStringContaining('hello')(['hello my friend'])).toEqual(NotFound);
    expect(matchers.validateStringContaining('hello')(['hello', 'hi'])).toEqual('hi');
  });

  it('should match via validateStringNotContaining correctly', () => {
    expect(matchers.validateStringNotContaining('hello')(['hi my friend'])).toEqual(NotFound);
    expect(matchers.validateStringNotContaining('hello')(['hello', 'hi'])).toEqual('hello');
  });

  it('should match via validateEachHasProp correctly', () => {
    expect(matchers.validateEachHasProp('hello')([{ hello: 123 }])).toEqual(NotFound);
    expect(matchers.validateEachHasProp('hello')([{}])).toEqual({});
  });

  it('should match via validateEachHasPropsLimitedTo correctly', () => {
    expect(matchers.validateEachHasPropsLimitedTo(['name', 'age'])([{ name: 'Ivan' }])).toEqual(NotFound);
    expect(
      matchers.validateEachHasPropsLimitedTo(['name', 'age'])([{ name: 'Ann', age: 99, phone: '1234567890' }])
    ).toEqual({ name: 'Ann', age: 99, phone: '1234567890' });
  });
});

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

  it('should match via validateEarlierThan correctly', () => {
    expect(matchers.validateEarlierThan('Jan 10 2000')(['Jan 9 2000'])).toEqual(NotFound);
    expect(matchers.validateEarlierThan('Jan 10 2000')(['Jan 10 2000'])).toEqual('Jan 10 2000');
    expect(matchers.validateEarlierThan('Jan 10 2000')(['Jan 11 2000'])).toEqual('Jan 11 2000');
  });

  it('should match via validateAfter correctly', () => {
    expect(matchers.validateAfter('Jan 10 2000')(['Jan 9 2000'])).toEqual('Jan 9 2000');
    expect(matchers.validateAfter('Jan 10 2000')(['Jan 10 2000'])).toEqual('Jan 10 2000');
    expect(matchers.validateAfter('Jan 10 2000')(['Jan 11 2000'])).toEqual(NotFound);
  });

  it('should match via validateSameDateAs correctly', () => {
    expect(matchers.validateSameDateAs('Jan 10 2000')(['Jan 9 2000'])).toEqual('Jan 9 2000');
    expect(matchers.validateSameDateAs('Jan 10 2000')(['Jan 10 2000'])).toEqual(NotFound);
    expect(matchers.validateSameDateAs('Jan 10 2000')(['Jan 10 2000 10:30 AM'])).toEqual(NotFound);
    expect(matchers.validateSameDateAs('Jan 10 2000')(['Jan 11 2000'])).toEqual('Jan 11 2000');
  });

  it('should match via validateAsEarlyAs correctly', () => {
    expect(matchers.validateAsEarlyAs('Jan 10 2000')(['Jan 9 2000'])).toEqual('Jan 9 2000');
    expect(matchers.validateAsEarlyAs('Jan 10 2000')(['Jan 10 2000'])).toEqual(NotFound);
    expect(matchers.validateAsEarlyAs('Jan 10 2000')(['Jan 11 2000'])).toEqual(NotFound);
  });

  it('should match via validateAsLateAs correctly', () => {
    expect(matchers.validateAsLateAs('Jan 10 2000')(['Jan 9 2000'])).toEqual(NotFound);
    expect(matchers.validateAsLateAs('Jan 10 2000')(['Jan 10 2000'])).toEqual(NotFound);
    expect(matchers.validateAsLateAs('Jan 10 2000')(['Jan 11 2000'])).toEqual('Jan 11 2000');
  });

  it('should validate date strings', () => {
    expect(matchers.validateDate()(['Jan 9 2000'])).toEqual(NotFound);
    expect(matchers.validateDate()(['((((('])).toEqual('(((((');
  });

  it('should return NotFound when ordered number array is passed', () => {
    expect(matchers.validateSorted('ASC')([1, 2, 3])).toEqual(NotFound);
    expect(matchers.validateSorted('DESC')([3, 2, 1])).toEqual(NotFound);
  });

  it('should return array when unordered number array is passed', () => {
    expect(matchers.validateSorted('ASC')([1, 7, 3])).toEqual('[1,7,3]');
    expect(matchers.validateSorted('DESC')([3, 7, 1])).toEqual('[3,7,1]');
  });

  it('should return array when an array when a number array ordered the wrong way is passed', () => {
    expect(matchers.validateSorted('DESC')([1, 2, 3])).toEqual('[1,2,3]');
    expect(matchers.validateSorted('ASC')([3, 2, 1])).toEqual('[3,2,1]');
  });

  it('should return NotFound when ordered date array is passed', () => {
    expect(matchers.validateSorted('ASC')(['Jan 1 2000', 'Jan 2 2000', 'Jan 3 2000'])).toEqual(NotFound);
    expect(matchers.validateSorted('DESC')(['Jan 1 2000', 'Jan 2 2000', 'Jan 3 2000'].reverse())).toEqual(NotFound);
  });

  it('should return array when unordered date array is passed', () => {
    expect(matchers.validateSorted('ASC')(['Jan 1 2000', 'Jan 7 2000', 'Jan 3 2000'])).toEqual(
      '["Jan 1 2000","Jan 7 2000","Jan 3 2000"]'
    );
    expect(matchers.validateSorted('DESC')(['Jan 1 2000', 'Jan 7 2000', 'Jan 3 2000'])).toEqual(
      '["Jan 1 2000","Jan 7 2000","Jan 3 2000"]'
    );
  });

  it('should return NotFound when ordered string array is passed', () => {
    expect(matchers.validateSorted('ASC')(['A', 'B', 'C'])).toEqual(NotFound);
    expect(matchers.validateSorted('DESC')(['A', 'B', 'C'].reverse())).toEqual(NotFound);
  });

  it('should return array when unordered string array is passed', () => {
    expect(matchers.validateSorted('ASC')(['A', 'Z', 'C'])).toEqual('["A","Z","C"]');
    expect(matchers.validateSorted('DESC')(['A', 'Z', 'C'])).toEqual('["A","Z","C"]');
  });
});

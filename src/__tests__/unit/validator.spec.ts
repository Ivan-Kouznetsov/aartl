import { getFirstValidationError } from '../../validator/validator';
import * as fixtures from './fixtures/testObjects.fixtures';
describe('Validator', () => {
  it('should return appropriate error message when test has no conditions', () => {
    expect(getFirstValidationError(fixtures.noConditions)).toEqual('Must have conditions in last request');
  });

  it('should return appropriate error message when test has no requests', () => {
    expect(getFirstValidationError(fixtures.noRequest)).toEqual('Must have at least one request');
  });
  it('should return appropriate error message when a non-unique value name is used', () => {
    expect(getFirstValidationError(fixtures.nonUniqueValues)).toEqual('In request 1: @id is a non-unique value name');
  });
  it('should return appropriate error message when no url is provided', () => {
    expect(getFirstValidationError(fixtures.nullUrl)).toEqual('In request 1: url is required');
  });
  it('should return appropriate error message when value passed on in last request', () => {
    expect(getFirstValidationError(fixtures.passOn)).toEqual('Cannot have passed on values in last request');
  });
  it('should return appropriate error message when wait is in last request', () => {
    expect(getFirstValidationError(fixtures.waitInLast)).toEqual('Cannot have a wait in last request');
  });
  it('should return appropriate error message when too many args are provided to a rule', () => {
    expect(getFirstValidationError(fixtures.tooManyArgs)).toEqual(
      'Rule: {"$..id":">= 1 2"} requires 1 argument, got 2'
    );

    expect(getFirstValidationError(fixtures.tooManyArgs1)).toEqual(
      'Rule: {"$..id":"is a number 1 2"} has too many arguments'
    );
  });
  it('should return appropriate error message when too few args are provided to a rule', () => {
    expect(getFirstValidationError(fixtures.tooFewArgs)).toEqual(
      'Rule: {"$..id":"is any of"} requires 1 or more arguments, got 0'
    );
  });
  it('should return appropriate error message when non-unique Pass on JSON path is provided', () => {
    expect(getFirstValidationError(fixtures.nonUniquepassOnJsonPath)).toEqual(
      '$..id is a non-unique Pass on JSON path'
    );
  });
  it('should return appropriate error message when a non-unique Pass on value name is provided', () => {
    expect(getFirstValidationError(fixtures.nonUniquepassOnNameValues)).toEqual(
      '_id is a non-unique Pass on value name'
    );
  });

  it('should return appropriate error message when a string is passed to a matching function expecting a number', () => {
    expect(getFirstValidationError(fixtures.stringPassedToCount)).toEqual(
      'Rule: {"$..num":"count > hello"} has the wrong type of argument, did not expect hello'
    );
  });

  it('should return appropriate error message when a non-regex is passed to a matching function expecting a regex', () => {
    expect(getFirstValidationError(fixtures.stringPassedToMatch)).toEqual(
      'Rule: {"$..num":"matches (((("} has the wrong type of argument, did not expect (((('
    );
  });

  it('should return no error message when a 0 is passed to a matching function expecting a number', () => {
    expect(getFirstValidationError(fixtures.numberPassedToCount)).toBeUndefined();
  });

  it('should return no error message when a regex is passed to a matching function expecting a regex', () => {
    expect(getFirstValidationError(fixtures.regexPassedToMatch)).toBeUndefined();
  });

  it('should validate valid tests', () => {
    expect(getFirstValidationError(fixtures.valid)).toBeUndefined();
    expect(getFirstValidationError(fixtures.notTooManyArgs)).toBeUndefined();
    expect(getFirstValidationError(fixtures.isANumber)).toBeUndefined();
  });

  it('should return appropriate error message when invalid date is used with a date rule', () => {
    expect(getFirstValidationError(fixtures.invalidDate)).toEqual(
      'Rule: {"$..date":"is as early as (((("} has the wrong type of argument, did not expect (((('
    );
  });

  it('should return appropriate error message when invalid sort directiion is used with a sorting rule', () => {
    expect(getFirstValidationError(fixtures.numbericSortDirection)).toEqual(
      'Rule: {"$..date":"is sorted 1"} has the wrong type of argument, did not expect 1'
    );
  });

  it('should return no error message when valid date is used with a date rule', () => {
    expect(getFirstValidationError(fixtures.validDate)).toBeUndefined();
  });

  it('should return appropriate error message when invalid sort directiion is used with a sorting rule', () => {
    expect(getFirstValidationError(fixtures.okSortDirection)).toBeUndefined();
  });
});

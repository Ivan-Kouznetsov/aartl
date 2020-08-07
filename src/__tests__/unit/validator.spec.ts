import { getFirstValidationError } from '../../validator/validator';
import * as fixtures from './fixtures/testObjects.fixtures';
describe('Validator', () => {
  it('should validate incorrect tests', () => {
    expect(getFirstValidationError(fixtures.noConditions)).toEqual('Must have conditions in last request');
    expect(getFirstValidationError(fixtures.noRequest)).toEqual('Must have at least one request');
    expect(getFirstValidationError(fixtures.nonUniqueValues)).toEqual('In request 1: @id is a non-unique value name');
    expect(getFirstValidationError(fixtures.nullUrl)).toEqual('In request 1: url is required');
    expect(getFirstValidationError(fixtures.passOn)).toEqual('Cannot have passed on values in last request');
    expect(getFirstValidationError(fixtures.waitInLast)).toEqual('Cannot have a wait in last request');
    expect(getFirstValidationError(fixtures.tooManyArgs)).toContain('has too many arguments');
    expect(getFirstValidationError(fixtures.nonUniquepassOnJsonPath)).toContain(
      '$..id is a non-unique Pass on JSON path'
    );
    expect(getFirstValidationError(fixtures.nonUniquepassOnNameValues)).toContain(
      '_id is a non-unique Pass on value name'
    );
  });

  it('should validate valid test', () => {
    expect(getFirstValidationError(fixtures.valid)).toBeUndefined();
    expect(getFirstValidationError(fixtures.notTooManyArgs)).toBeUndefined();
  });
});

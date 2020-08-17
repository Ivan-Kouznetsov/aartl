import * as parser from '../../parser/parser';
import { allRules } from './fixtures/validation.fixtures';
import { getFirstValidationError } from '../../validator/validator';

describe('Validator', () => {
  it('parse and validate all rules', () => {
    const preProc = parser.preProcess(allRules);
    const test = parser.splitTestIntoSections(preProc);
    const err = getFirstValidationError(test);

    expect(err).toBeUndefined();
  });
});

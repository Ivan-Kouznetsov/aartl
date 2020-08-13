import * as ruleParser from '../../parser/ruleParser';
import * as fixtures from './fixtures/request.fixtures';
import { NotFound } from '../../rules/matchers';

describe('Rule parser', () => {
  it('should parse rules', () => {
    const results = ruleParser.parseJsonRules(fixtures.requestWithOkRules);
    results.forEach((result) => {
      expect(typeof result.matching.factory).toEqual('function');
    });
  });

  it('should parse literal rules', () => {
    const results = ruleParser.parseJsonRules(fixtures.requestWithLiteralValueRule);
    expect(results[0].matching.factory()([42])).toBe(NotFound);
  });
});

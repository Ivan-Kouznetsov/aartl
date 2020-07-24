import * as ruleParser from '../../parser/ruleParser';
import * as fixtures from './fixtures/request.fixtures';

describe('Rule parser', () => {
  it('should parse rules', () => {
    const results = ruleParser.parseJsonRules(fixtures.requestWithOkRules);
    results.forEach((result) => {
      expect(typeof result.rule).toEqual('function');
    });
  });

  it('should parse literal rules', () => {
    const results = ruleParser.parseJsonRules(fixtures.requestWithLiteralValueRule);
    expect(results[0].rule).toEqual('42');
  });
});

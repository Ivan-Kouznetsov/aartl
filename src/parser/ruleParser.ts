import { aliasesedMatchers } from '../rules/matchers';
import { IRequest, Factory, MatcherFunction } from '../interfaces/test';
import { getArgs } from './util';

const parseRule = (rule: string): string | MatcherFunction => {
  const aliasesedMatcher = aliasesedMatchers.find(
    (am) =>
      rule.startsWith(am.alias) &&
      (am.argCount === getArgs(rule, am.alias).length ||
        (getArgs(rule, am.alias).length > 0 && am.argCount === Infinity))
  );

  if (aliasesedMatcher !== undefined) {
    if (aliasesedMatcher.argCount === 0) {
      return (<Factory>aliasesedMatcher.factory)();
    } else if (aliasesedMatcher.argCount === 1) {
      return (<Factory>aliasesedMatcher.factory)(getArgs(rule, aliasesedMatcher.alias)[0]);
    } else {
      return (<Factory>aliasesedMatcher.factory)(getArgs(rule, aliasesedMatcher.alias));
    }
  }

  return rule;
};

export const parseJsonRules = (
  request: IRequest
): {
  jsonpath: string;
  rule: string | MatcherFunction;
  originalRule: string | number | boolean;
}[] =>
  request.jsonRules.map((r) => {
    const key = Object.keys(r)[0];
    const rule = parseRule(r[key].toString());
    return { jsonpath: key, rule, originalRule: r[key] };
  });

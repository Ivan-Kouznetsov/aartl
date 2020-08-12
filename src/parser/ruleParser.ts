import { aliasedMatchers } from '../rules/aliasedMatchers';
import { IRequest, Factory, MatcherFunction } from '../interfaces/test';
import { getArgs } from './util';
import { ArgCount } from '../enums/argCount';

const parseRule = (rule: string): string | MatcherFunction => {
  const aliasesedMatcher = aliasedMatchers.find(
    (am) =>
      rule.startsWith(am.alias) &&
      ((getArgs(rule, am.alias).length === 0 && am.argCount === ArgCount.None) ||
        (getArgs(rule, am.alias).length === 1 && am.argCount === ArgCount.One) ||
        (getArgs(rule, am.alias).length > 0 && am.argCount === ArgCount.Many))
  );

  if (aliasesedMatcher !== undefined) {
    if (aliasesedMatcher.argCount === ArgCount.None) {
      return (<Factory>aliasesedMatcher.factory)();
    } else if (aliasesedMatcher.argCount === ArgCount.One) {
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

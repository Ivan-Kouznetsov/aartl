import { aliasedMatchers } from '../rules/aliasedMatchers';
import { IRequest, Factory, MatcherFunction } from '../interfaces/test';
import { getArgs } from './util';
import { ArgCount } from '../enums/argCount';

const parseRule = (rule: string): string | MatcherFunction => {
  const sortedAliasedMatchers = [...aliasedMatchers].sort((a, b) => b.alias.length - a.alias.length);

  for (const aliasedMatcher of sortedAliasedMatchers) {
    if (rule.startsWith(aliasedMatcher.alias)) {
      const args = getArgs(rule, aliasedMatcher.alias);
      if (
        (args.length === 0 && aliasedMatcher.argCount === ArgCount.None) ||
        (args.length === 1 && aliasedMatcher.argCount === ArgCount.One) ||
        (args.length > 0 && aliasedMatcher.argCount === ArgCount.Many)
      ) {
        if (aliasedMatcher.argCount === ArgCount.None) {
          return (<Factory>aliasedMatcher.factory)();
        } else if (aliasedMatcher.argCount === ArgCount.One) {
          return (<Factory>aliasedMatcher.factory)(getArgs(rule, aliasedMatcher.alias)[0]);
        } else {
          return (<Factory>aliasedMatcher.factory)(getArgs(rule, aliasedMatcher.alias));
        }
      }
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

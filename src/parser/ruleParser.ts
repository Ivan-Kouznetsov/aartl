import { IRequest, Primitive, IRule } from '../interfaces/test';
import { getArgs } from './util';
import { ArgCount } from '../enums/argCount';
import { aliasedMatchers } from './aliasedMatchers';
import { NotFound } from '../rules/notFound';

const parseRule = (rule: string): IRule => {
  const sortedAliasedMatchers = [...aliasedMatchers].sort((a, b) => b.alias.length - a.alias.length);

  for (const aliasedMatcher of sortedAliasedMatchers) {
    if (rule.startsWith(aliasedMatcher.alias)) {
      return {
        factory: aliasedMatcher.factory,
        args: getArgs(rule, aliasedMatcher.alias),
        expectedArgs: aliasedMatcher.argCount,
      };
    }
  }

  return {
    factory: () => (arr: Primitive[]) =>
      arr.find((i) => (i === null ? 'null' : i).toString() !== rule.toString()) ?? NotFound,
    args: [],
    expectedArgs: ArgCount.None,
  };
};

export const parseJsonRules = (
  request: IRequest
): {
  jsonpath: string;
  matching: IRule;
  originalRule: string | number | boolean;
}[] =>
  request.jsonRules.map((r) => {
    const key = Object.keys(r)[0];
    const matching = parseRule(r[key].toString());
    return { jsonpath: key, matching, originalRule: r[key] };
  });

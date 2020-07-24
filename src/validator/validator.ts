import { ITest } from '../interfaces/test';
import { getArgs } from '../parser/util';
import { aliasesedMatchers } from '../rules/matchers';

export const getFirstValidationError = (test: ITest): string => {
  for (let i = 0; i < test.usingValues.length; i++) {
    const key = Object.keys(test.usingValues[i])[0];
    if (test.usingValues.filter((uv) => typeof uv[key] !== 'undefined').length > 1)
      return `In request ${i + 1}: ${key} is a non-unique value name`;
  }
  for (let i = 0; i < test.requests.length; i++) {
    if (!test.requests[0].url) return `In request ${i + 1}: url is required`;
  }

  if (test.requests.length == 0) return 'Must have at least one request';
  if (test.requests[test.requests.length - 1].passOn.length > 0) return 'Cannot have passed on values in last request';
  if (
    test.requests[test.requests.length - 1].headerRules.length === 0 &&
    test.requests[test.requests.length - 1].expectedStatusCode === null &&
    test.requests[test.requests.length - 1].jsonRules.length === 0
  ) {
    return 'Must have conditions in last request';
  }

  if (test.requests[test.requests.length - 1].wait) return 'Cannot have a wait in last request';

  const sortedAliasedMatchers = [...aliasesedMatchers].sort((a, b) => b.alias.length - a.alias.length);

  for (const request of test.requests) {
    for (const rule of request.jsonRules) {
      for (const am of sortedAliasedMatchers) {
        const key = Object.keys(rule)[0];
        if (rule[key].toString().startsWith(am.alias)) {
          if (getArgs(rule[key].toString(), am.alias).length > am.argCount) {
            return `Rule: ${JSON.stringify(rule)} has too many arguments`;
          } else {
            break;
          }
        }
      }
    }
  }
};

import * as matchers from '../rules/matchers';
import { Factory } from '../interfaces/test';
import { ArgCount } from '../enums/argCount';

const validateArgNumber = (a: string | number): boolean => typeof a === 'number';
const validateArgString = (a: string | number): boolean => a.toString().length > 0;
const validateArgRegex = (a: string | number): boolean => {
  try {
    const r = new RegExp(a.toString());
    return !!r;
  } catch {
    return false;
  }
};
const validateArgDate = (a: string | number): boolean => typeof a === 'string' && !isNaN(new Date(a).valueOf());
const validateArgSortDir = (a: string | number): boolean =>
  typeof a === 'string' && ['ascending', 'descending', 'asc', 'desc'].includes(a.toLowerCase());

export const aliasedMatchers: {
  factory: Factory;
  alias: string;
  argCount: ArgCount;
  argValidator?: (a: string | number) => boolean;
}[] = [
  {
    factory: <Factory>matchers.validateNumber,
    alias: 'is a number',
    argCount: ArgCount.None,
  },
  {
    factory: <Factory>matchers.validateGreaterThan,
    alias: '>',
    argCount: ArgCount.One,
    argValidator: validateArgNumber,
  },
  {
    factory: <Factory>matchers.validateGreaterThanOrEqual,
    alias: '>=',
    argCount: ArgCount.One,
    argValidator: validateArgNumber,
  },
  { factory: <Factory>matchers.validateLessThan, alias: '<', argCount: ArgCount.One, argValidator: validateArgNumber },
  {
    factory: <Factory>matchers.validateLessThanOrEqual,
    alias: '<=',
    argCount: ArgCount.One,
    argValidator: validateArgNumber,
  },
  {
    factory: <Factory>matchers.validateNonEmptyString,
    alias: 'is text',
    argCount: ArgCount.None,
  },
  {
    factory: <Factory>matchers.validateStringContaining,
    alias: 'is text containing',
    argCount: ArgCount.One,
    argValidator: validateArgString,
  },
  {
    factory: <Factory>matchers.validateStringNotContaining,
    alias: 'is text not containing',
    argCount: ArgCount.One,
    argValidator: validateArgString,
  },
  {
    factory: <Factory>matchers.validateAnyOf,
    alias: 'is any of',
    argCount: ArgCount.Many,
    argValidator: validateArgString,
  },
  { factory: <Factory>matchers.validateNot, alias: 'is not', argCount: ArgCount.One, argValidator: validateArgString },
  {
    factory: <Factory>matchers.validateRegex,
    alias: 'matches',
    argCount: ArgCount.One,
    argValidator: validateArgRegex,
  },
  {
    factory: <Factory>matchers.validateCountEquals,
    alias: 'count =',
    argCount: ArgCount.One,
    argValidator: validateArgNumber,
  },
  {
    factory: <Factory>matchers.validateCountGreaterThan,
    alias: 'count >',
    argCount: ArgCount.One,
    argValidator: validateArgNumber,
  },
  {
    factory: <Factory>matchers.validateCountGreaterThanOrEqual,
    alias: 'count >=',
    argCount: ArgCount.One,
    argValidator: validateArgNumber,
  },
  {
    factory: <Factory>matchers.validateCountLessThan,
    alias: 'count <',
    argCount: ArgCount.One,
    argValidator: validateArgNumber,
  },
  {
    factory: <Factory>matchers.validateCountLessThanOrEqual,
    alias: 'count <=',
    argCount: ArgCount.One,
    argValidator: validateArgNumber,
  },
  {
    factory: <Factory>matchers.validateEachHasProp,
    alias: 'each has',
    argCount: ArgCount.One,
    argValidator: validateArgString,
  },
  {
    factory: <Factory>matchers.validateEachHasPropsLimitedTo,
    alias: 'properties limited to',
    argCount: ArgCount.Many,
    argValidator: validateArgString,
  },

  {
    factory: <Factory>matchers.validateAfter,
    alias: 'is after',
    argCount: ArgCount.One,
    argValidator: validateArgDate,
  },
  {
    factory: <Factory>matchers.validateAsEarlyAs,
    alias: 'is as early as',
    argCount: ArgCount.One,
    argValidator: validateArgDate,
  },
  {
    factory: <Factory>matchers.validateAsLateAs,
    alias: 'is as late as',
    argCount: ArgCount.One,
    argValidator: validateArgDate,
  },
  {
    factory: <Factory>matchers.validateDate,
    alias: 'is a date',
    argCount: ArgCount.None,
  },
  {
    factory: <Factory>matchers.validateEarlierThan,
    alias: 'is earlier than',
    argCount: ArgCount.One,
    argValidator: validateArgDate,
  },
  {
    factory: <Factory>matchers.validateSameDateAs,
    alias: 'is same date as',
    argCount: ArgCount.One,
    argValidator: validateArgDate,
  },
  {
    factory: <Factory>matchers.validateSameDateTimeAs,
    alias: 'is same date and time as',
    argCount: ArgCount.One,
    argValidator: validateArgDate,
  },
  {
    factory: <Factory>matchers.validateSorted,
    alias: 'is sorted',
    argCount: ArgCount.One,
    argValidator: validateArgSortDir,
  },
];

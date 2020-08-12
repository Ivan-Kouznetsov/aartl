import {
  validateNumber,
  validateGreaterThan,
  validateGreaterThanOrEqual,
  validateLessThan,
  validateLessThanOrEqual,
  validateNonEmptyString,
  validateStringContaining,
  validateStringNotContaining,
  validateAnyOf,
  validateNot,
  validateRegex,
  validateCountEquals,
  validateCountGreaterThan,
  validateCountGreaterThanOrEqual,
  validateCountLessThan,
  validateCountLessThanOrEqual,
  validateEachHasProp,
  validateEachHasPropsLimitedTo,
} from './matchers';
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

export const aliasedMatchers: {
  factory: Factory;
  alias: string;
  argCount: ArgCount;
  argValidator?: (a: string | number) => boolean;
}[] = [
  {
    factory: <Factory>validateNumber,
    alias: 'is a number',
    argCount: ArgCount.None,
  },
  { factory: <Factory>validateGreaterThan, alias: '>', argCount: ArgCount.One, argValidator: validateArgNumber },
  {
    factory: <Factory>validateGreaterThanOrEqual,
    alias: '>=',
    argCount: ArgCount.One,
    argValidator: validateArgNumber,
  },
  { factory: <Factory>validateLessThan, alias: '<', argCount: ArgCount.One, argValidator: validateArgNumber },
  { factory: <Factory>validateLessThanOrEqual, alias: '<=', argCount: ArgCount.One, argValidator: validateArgNumber },
  {
    factory: <Factory>validateNonEmptyString,
    alias: 'is text',
    argCount: ArgCount.None,
  },
  {
    factory: <Factory>validateStringContaining,
    alias: 'is text containing',
    argCount: ArgCount.One,
    argValidator: validateArgString,
  },
  {
    factory: <Factory>validateStringNotContaining,
    alias: 'is text not containing',
    argCount: ArgCount.One,
    argValidator: validateArgString,
  },
  { factory: <Factory>validateAnyOf, alias: 'is any of', argCount: ArgCount.Many, argValidator: validateArgString },
  { factory: <Factory>validateNot, alias: 'is not', argCount: ArgCount.One, argValidator: validateArgString },
  { factory: <Factory>validateRegex, alias: 'matches', argCount: ArgCount.One, argValidator: validateArgRegex },
  { factory: <Factory>validateCountEquals, alias: 'count =', argCount: ArgCount.One, argValidator: validateArgNumber },
  {
    factory: <Factory>validateCountGreaterThan,
    alias: 'count >',
    argCount: ArgCount.One,
    argValidator: validateArgNumber,
  },
  {
    factory: <Factory>validateCountGreaterThanOrEqual,
    alias: 'count >=',
    argCount: ArgCount.One,
    argValidator: validateArgNumber,
  },
  {
    factory: <Factory>validateCountLessThan,
    alias: 'count <',
    argCount: ArgCount.One,
    argValidator: validateArgNumber,
  },
  {
    factory: <Factory>validateCountLessThanOrEqual,
    alias: 'count <=',
    argCount: ArgCount.One,
    argValidator: validateArgNumber,
  },
  { factory: <Factory>validateEachHasProp, alias: 'each has', argCount: ArgCount.One, argValidator: validateArgNumber },
  {
    factory: <Factory>validateEachHasPropsLimitedTo,
    alias: 'properties limited to',
    argCount: ArgCount.Many,
    argValidator: validateArgString,
  },
];

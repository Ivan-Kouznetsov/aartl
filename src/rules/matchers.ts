import { Primitive, MatcherFunction, Factory } from '../interfaces/test';
import { ArgCount } from '../enums/argCount';
/**
 * Curring functions that return functions that take an array and return a non-compliant value if available.
 * For consistancy all functions are factories even ones that do not need an argument.
 */

/* Numbers */

const numberRegex = /^-{0,1}[0-9]+(\.\d+){0,1}$/;

export const validateNumber = (): MatcherFunction => (arr: Primitive[]): Primitive | undefined =>
  arr.find((item) => !numberRegex.test(item.toString()));

export const validateGreaterThan = (compareWith: number): MatcherFunction => (
  arr: Primitive[]
): Primitive | undefined =>
  arr.find((item) => !(numberRegex.test(item.toString()) && parseFloat(item.toString()) > compareWith));

export const validateGreaterThanOrEqual = (compareWith: number): MatcherFunction => (
  arr: Primitive[]
): Primitive | undefined =>
  arr.find((item) => !(numberRegex.test(item.toString()) && parseFloat(item.toString()) >= compareWith));

export const validateLessThan = (compareWith: number): MatcherFunction => (arr: Primitive[]): Primitive | undefined =>
  arr.find((item) => !(numberRegex.test(item.toString()) && parseFloat(item.toString()) < compareWith));

export const validateLessThanOrEqual = (compareWith: number): MatcherFunction => (
  arr: Primitive[]
): Primitive | undefined =>
  arr.find((item) => !(numberRegex.test(item.toString()) && parseFloat(item.toString()) <= compareWith));

/* Strings */

export const validateNonEmptyString = (): MatcherFunction => (arr: Primitive[]): Primitive | undefined =>
  arr.find((item) => typeof item !== 'string' || !(item.length > 0));
export const validateStringContaining = (str: string): MatcherFunction => (arr: Primitive[]): Primitive | undefined =>
  arr.find((item) => typeof item !== 'string' || !item.includes(str));
export const validateStringNotContaining = (str: string): MatcherFunction => (
  arr: Primitive[]
): Primitive | undefined => arr.find((item) => typeof item !== 'string' || item.includes(str));

/* Any Of */
export const validateAnyOf = (anyOf: Primitive[]): MatcherFunction => (arr: Primitive[]): Primitive | undefined =>
  arr.find((item) => !anyOf.includes(item));

/* Not */
export const validateNot = (not: string): MatcherFunction => (arr: Primitive[]): Primitive | undefined =>
  arr.find((item) => item === not);

/* Regex */
export const validateRegex = (regex: RegExp): MatcherFunction => (arr: Primitive[]): Primitive | undefined =>
  arr.find((item) => !regex.test(item.toString()));

/* Array Count */
export const validateCountEquals = (count: number): MatcherFunction => (arr: Primitive[]): Primitive | undefined =>
  arr.length !== count ? arr.length : undefined;
export const validateCountGreaterThan = (count: number): MatcherFunction => (arr: Primitive[]): Primitive | undefined =>
  !(arr.length > count) ? arr.length : undefined;
export const validateCountGreaterThanOrEqual = (count: number): MatcherFunction => (
  arr: Primitive[]
): Primitive | undefined => (!(arr.length >= count) ? arr.length : undefined);
export const validateCountLessThan = (count: number): MatcherFunction => (arr: Primitive[]): Primitive | undefined =>
  !(arr.length < count) ? arr.length : undefined;
export const validateCountLessThanOrEqual = (count: number): MatcherFunction => (
  arr: Primitive[]
): Primitive | undefined => (!(arr.length <= count) ? arr.length : undefined);

/* Array Props */
export const validateEachHasProp = (prop: string): MatcherFunction => (arr: Primitive[]): Primitive | undefined =>
  arr.find((item) => typeof item !== 'object' || typeof (<Record<string, unknown>>item)[prop] === 'undefined');

export const validateEachHasPropsLimitedTo = (props: string[]): MatcherFunction => (
  arr: Primitive[]
): Primitive | undefined =>
  arr.find((item) => typeof item !== 'object' || Object.keys(item).find((p) => !props.includes(p)));

export const aliasesedMatchers = [
  { factory: <Factory>validateNumber, alias: 'is a number', argCount: ArgCount.None },
  { factory: <Factory>validateGreaterThan, alias: '>', argCount: ArgCount.One },
  { factory: <Factory>validateGreaterThanOrEqual, alias: '>=', argCount: ArgCount.One },
  { factory: <Factory>validateLessThan, alias: '<', argCount: ArgCount.One },
  { factory: <Factory>validateLessThanOrEqual, alias: '<=', argCount: ArgCount.One },
  { factory: <Factory>validateNonEmptyString, alias: 'is text', argCount: ArgCount.None },
  { factory: <Factory>validateStringContaining, alias: 'is text containing', argCount: ArgCount.One },
  { factory: <Factory>validateStringNotContaining, alias: 'is text not containing', argCount: ArgCount.One },
  { factory: <Factory>validateAnyOf, alias: 'is any of', argCount: ArgCount.Many },
  { factory: <Factory>validateNot, alias: 'is not', argCount: ArgCount.One },
  { factory: <Factory>validateRegex, alias: 'matches', argCount: ArgCount.One },
  { factory: <Factory>validateCountEquals, alias: 'count =', argCount: ArgCount.One },
  { factory: <Factory>validateCountGreaterThan, alias: 'count >', argCount: ArgCount.One },
  { factory: <Factory>validateCountGreaterThanOrEqual, alias: 'count >=', argCount: ArgCount.One },
  { factory: <Factory>validateCountLessThan, alias: 'count <', argCount: ArgCount.One },
  { factory: <Factory>validateCountLessThanOrEqual, alias: 'count <=', argCount: ArgCount.One },
  { factory: <Factory>validateEachHasProp, alias: 'each has', argCount: ArgCount.One },
  { factory: <Factory>validateEachHasPropsLimitedTo, alias: 'properties limited to', argCount: ArgCount.Many },
];

import { Primitive, MatcherFunction, Factory } from '../interfaces/test';

/**
 * Curring functions that return functions that take an array and return a non-compliant value if available.
 * For consistancy all functions are factories even ones that do not need an argument.
 */

/* Numbers */

const numberRegex = /^-{0,1}[0-9]+(\.\d+){0,1}$/;

export const validateNumber = (): MatcherFunction => (arr: Primitive[]): Primitive =>
  arr.find((item) => !numberRegex.test(item.toString()));

export const validateGreaterThan = (compareWith: number): MatcherFunction => (arr: Primitive[]): Primitive =>
  arr.find((item) => !(numberRegex.test(item.toString()) && parseFloat(item.toString()) > compareWith));

export const validateGreaterThanOrEqual = (compareWith: number): MatcherFunction => (arr: Primitive[]): Primitive =>
  arr.find((item) => !(numberRegex.test(item.toString()) && parseFloat(item.toString()) >= compareWith));

export const validateLessThan = (compareWith: number): MatcherFunction => (arr: Primitive[]): Primitive =>
  arr.find((item) => !(numberRegex.test(item.toString()) && parseFloat(item.toString()) < compareWith));

export const validateLessThanOrEqual = (compareWith: number): MatcherFunction => (arr: Primitive[]): Primitive =>
  arr.find((item) => !(numberRegex.test(item.toString()) && parseFloat(item.toString()) <= compareWith));

/* Strings */

export const validateNonEmptyString = (): MatcherFunction => (arr: Primitive[]): Primitive =>
  arr.find((item) => typeof item !== 'string' || !(item.length > 0));
export const validateStringContaining = (str: string): MatcherFunction => (arr: Primitive[]): Primitive =>
  arr.find((item) => typeof item !== 'string' || !item.includes(str));
export const validateStringNotContaining = (str: string): MatcherFunction => (arr: Primitive[]): Primitive =>
  arr.find((item) => typeof item !== 'string' || item.includes(str));

/* Any Of */
export const validateAnyOf = (anyOf: Primitive[]): MatcherFunction => (arr: Primitive[]): Primitive =>
  arr.find((item) => !anyOf.includes(item));

/* Not */
export const validateNot = (not: string): MatcherFunction => (arr: Primitive[]): Primitive =>
  arr.find((item) => item === not);

/* Regex */
export const validateRegex = (regex: RegExp): MatcherFunction => (arr: Primitive[]): Primitive =>
  arr.find((item) => !regex.test(item.toString()));

/* Array Count */
export const validateCountEquals = (count: number): MatcherFunction => (arr: Primitive[]): Primitive =>
  arr.length !== count ? arr.length : undefined;
export const validateCountGreaterThan = (count: number): MatcherFunction => (arr: Primitive[]): Primitive =>
  !(arr.length > count) ? arr.length : undefined;
export const validateCountGreaterThanOrEqual = (count: number): MatcherFunction => (arr: Primitive[]): Primitive =>
  !(arr.length >= count) ? arr.length : undefined;
export const validateCountLessThan = (count: number): MatcherFunction => (arr: Primitive[]): Primitive =>
  !(arr.length < count) ? arr.length : undefined;
export const validateCountLessThanOrEqual = (count: number): MatcherFunction => (arr: Primitive[]): Primitive =>
  !(arr.length <= count) ? arr.length : undefined;

/* Array Props */
export const validateArrayHasProp = (props: string): MatcherFunction => (arr: Primitive[]): Primitive =>
  arr.find((item) => typeof item !== 'object' || typeof (<Record<string, unknown>>item)[props] === 'undefined');

export const aliasesedMatchers = [
  { factory: <Factory>validateNumber, alias: 'is a number', argCount: 0 },
  { factory: <Factory>validateGreaterThan, alias: '>', argCount: 1 },
  { factory: <Factory>validateGreaterThanOrEqual, alias: '>=', argCount: 1 },
  { factory: <Factory>validateLessThan, alias: '<', argCount: 1 },
  { factory: <Factory>validateLessThanOrEqual, alias: '<=', argCount: 1 },
  { factory: <Factory>validateNonEmptyString, alias: 'is text', argCount: 0 },
  { factory: <Factory>validateStringContaining, alias: 'is text containing', argCount: 1 },
  { factory: <Factory>validateStringNotContaining, alias: 'is text not containing', argCount: 1 },
  { factory: <Factory>validateAnyOf, alias: 'is any of', argCount: Infinity },
  { factory: <Factory>validateNot, alias: 'is not', argCount: 1 },
  { factory: <Factory>validateRegex, alias: 'matches', argCount: 1 },
  { factory: <Factory>validateCountEquals, alias: 'count =', argCount: 1 },
  { factory: <Factory>validateCountGreaterThan, alias: 'count >', argCount: 1 },
  { factory: <Factory>validateCountGreaterThanOrEqual, alias: 'count >=', argCount: 1 },
  { factory: <Factory>validateCountLessThan, alias: 'count <', argCount: 1 },
  { factory: <Factory>validateCountLessThanOrEqual, alias: 'count <=', argCount: 1 },
  { factory: <Factory>validateArrayHasProp, alias: 'each has a', argCount: 1 },
];

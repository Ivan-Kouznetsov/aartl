import { Primitive, MatcherFunction } from '../interfaces/test';

export const NotFound = Symbol.for('NotFound');

/**
 * Curring functions that return functions that take an array and return a non-compliant value if available.
 * For consistancy all functions are factories even ones that do not need an argument.
 */

/* Numbers */

const numberRegex = /^-{0,1}[0-9]+(\.\d+){0,1}$/;

export const validateNumber = (): MatcherFunction => (arr: Primitive[]): Primitive | typeof NotFound =>
  arr.find((item) => !numberRegex.test(item.toString())) ?? NotFound;

export const validateGreaterThan = (compareWith: number): MatcherFunction => (
  arr: Primitive[]
): Primitive | typeof NotFound =>
  arr.find((item) => !(numberRegex.test(item.toString()) && parseFloat(item.toString()) > compareWith)) ?? NotFound;

export const validateGreaterThanOrEqual = (compareWith: number): MatcherFunction => (
  arr: Primitive[]
): Primitive | typeof NotFound =>
  arr.find((item) => !(numberRegex.test(item.toString()) && parseFloat(item.toString()) >= compareWith)) ?? NotFound;

export const validateLessThan = (compareWith: number): MatcherFunction => (
  arr: Primitive[]
): Primitive | typeof NotFound =>
  arr.find((item) => !(numberRegex.test(item.toString()) && parseFloat(item.toString()) < compareWith)) ?? NotFound;

export const validateLessThanOrEqual = (compareWith: number): MatcherFunction => (
  arr: Primitive[]
): Primitive | typeof NotFound =>
  arr.find((item) => !(numberRegex.test(item.toString()) && parseFloat(item.toString()) <= compareWith)) ?? NotFound;

/* Strings */

export const validateNonEmptyString = (): MatcherFunction => (arr: Primitive[]): Primitive | typeof NotFound =>
  arr.find((item) => typeof item !== 'string' || !(item.length > 0)) ?? NotFound;
export const validateStringContaining = (str: string): MatcherFunction => (
  arr: Primitive[]
): Primitive | typeof NotFound => arr.find((item) => typeof item !== 'string' || !item.includes(str)) ?? NotFound;
export const validateStringNotContaining = (str: string): MatcherFunction => (
  arr: Primitive[]
): Primitive | typeof NotFound => arr.find((item) => typeof item !== 'string' || item.includes(str)) ?? NotFound;

/* Any Of */
export const validateAnyOf = (anyOf: Primitive[]): MatcherFunction => (arr: Primitive[]): Primitive | typeof NotFound =>
  arr.find((item) => !anyOf.includes(item)) ?? NotFound;

/* Not */
export const validateNot = (not: string): MatcherFunction => (arr: Primitive[]): Primitive | typeof NotFound =>
  arr.find((item) => item === not) ?? NotFound;

/* Regex */
export const validateRegex = (regex: string): MatcherFunction => (arr: Primitive[]): Primitive | typeof NotFound =>
  arr.find((item) => !new RegExp(regex).test(item.toString())) ?? NotFound;

/* Array Count */
export const validateCountEquals = (count: number): MatcherFunction => (
  arr: Primitive[]
): Primitive | typeof NotFound => (arr.length !== count ? arr.length : NotFound);
export const validateCountGreaterThan = (count: number): MatcherFunction => (
  arr: Primitive[]
): Primitive | typeof NotFound => (!(arr.length > count) ? arr.length : NotFound);
export const validateCountGreaterThanOrEqual = (count: number): MatcherFunction => (
  arr: Primitive[]
): Primitive | typeof NotFound => (!(arr.length >= count) ? arr.length : NotFound);
export const validateCountLessThan = (count: number): MatcherFunction => (
  arr: Primitive[]
): Primitive | typeof NotFound => (!(arr.length < count) ? arr.length : NotFound);
export const validateCountLessThanOrEqual = (count: number): MatcherFunction => (
  arr: Primitive[]
): Primitive | typeof NotFound => (!(arr.length <= count) ? arr.length : NotFound);

/* Array Props */
export const validateEachHasProp = (prop: string): MatcherFunction => (arr: Primitive[]): Primitive | typeof NotFound =>
  arr.find((item) => typeof item !== 'object' || typeof (<Record<string, unknown>>item)[prop] === 'undefined') ??
  NotFound;

export const validateEachHasPropsLimitedTo = (props: string[]): MatcherFunction => (
  arr: Primitive[]
): Primitive | typeof NotFound =>
  arr.find((item) => typeof item !== 'object' || Object.keys(item).find((p) => !props.includes(p))) ?? NotFound;

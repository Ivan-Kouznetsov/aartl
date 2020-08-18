import { Primitive, MatcherFunction } from '../interfaces/test';
import { NotFound } from './notFound';

/**
 * Curring functions that return functions that take an array and return a non-compliant value if available.
 * For consistancy all functions are factories even ones that do not need an argument.
 */

/* Numbers */

const numberRegex = /^-{0,1}\d+(\.\d+){0,1}$/;

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

/* Dates */
const sameDate = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

export const validateEarlierThan = (compareWith: string): MatcherFunction => (
  arr: Primitive[]
): Primitive | typeof NotFound => arr.find((item) => new Date(item.toString()) >= new Date(compareWith)) ?? NotFound;

export const validateAfter = (compareWith: string): MatcherFunction => (
  arr: Primitive[]
): Primitive | typeof NotFound => arr.find((item) => new Date(item.toString()) <= new Date(compareWith)) ?? NotFound;

export const validateSameDateAs = (compareWith: string): MatcherFunction => (
  arr: Primitive[]
): Primitive | typeof NotFound =>
  arr.find((item) => !sameDate(new Date(item.toString()), new Date(compareWith))) ?? NotFound;

export const validateSameDateTimeAs = (compareWith: string): MatcherFunction => (
  arr: Primitive[]
): Primitive | typeof NotFound =>
  arr.find((item) => new Date(item.toString()).valueOf() !== new Date(compareWith).valueOf()) ?? NotFound;

export const validateAsEarlyAs = (compareWith: string): MatcherFunction => (
  arr: Primitive[]
): Primitive | typeof NotFound => arr.find((item) => new Date(item.toString()) < new Date(compareWith)) ?? NotFound;

export const validateAsLateAs = (compareWith: string): MatcherFunction => (
  arr: Primitive[]
): Primitive | typeof NotFound => arr.find((item) => new Date(item.toString()) > new Date(compareWith)) ?? NotFound;

export const validateDate = (): MatcherFunction => (arr: Primitive[]): Primitive | typeof NotFound =>
  arr.find((item) => isNaN(new Date(item.toString()).valueOf())) ?? NotFound;

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

/* Sorting */

enum SortDirection {
  Ascending,
  Descending,
}

const isSorted = (arr: (number | string)[], direction: SortDirection) => {
  for (let i = 0; i < arr.length - 1; i++) {
    if (
      (direction === SortDirection.Descending && arr[i] < arr[i + 1]) ||
      (direction === SortDirection.Ascending && arr[i] > arr[i + 1])
    ) {
      return false;
    }
  }
  return true;
};

export const validateSorted = (direction: string) => (arr: Primitive[]): Primitive | typeof NotFound => {
  const isDateArray = validateNumber()(arr) !== NotFound && validateDate()(arr) === NotFound;
  const preProcessedArray = arr.map((item) => {
    const str = item.toString();
    if (isDateArray) {
      return new Date(str).valueOf();
    } else if (numberRegex.test(str)) {
      return parseFloat(str);
    } else {
      return str;
    }
  });
  const dir: SortDirection = direction.toLowerCase().startsWith('asc')
    ? SortDirection.Ascending
    : SortDirection.Descending;

  if (isSorted(preProcessedArray, dir)) return NotFound;
  return JSON.stringify(arr);
};

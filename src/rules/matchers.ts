import { Primitive, MatcherFunction, MatcherResult } from '../interfaces/test';
import { NotFound } from './notFound';

/**
 * Curring functions that return functions that take an array and return a non-compliant value if available.
 * For consistancy all functions are factories even ones that do not need an argument.
 */

/* Numbers */

const numberRegex = /^-{0,1}\d+(\.\d+){0,1}$/;

export const validateNumber = (): MatcherFunction => (arr: Primitive[]): MatcherResult =>
  arr.find((item) => !numberRegex.test(item.toString())) ?? NotFound;

export const validateGreaterThan = (compareWith: number): MatcherFunction => (arr: Primitive[]): MatcherResult =>
  arr.find((item) => !(numberRegex.test(item.toString()) && parseFloat(item.toString()) > compareWith)) ?? NotFound;

export const validateGreaterThanOrEqual = (compareWith: number): MatcherFunction => (arr: Primitive[]): MatcherResult =>
  arr.find((item) => !(numberRegex.test(item.toString()) && parseFloat(item.toString()) >= compareWith)) ?? NotFound;

export const validateLessThan = (compareWith: number): MatcherFunction => (arr: Primitive[]): MatcherResult =>
  arr.find((item) => !(numberRegex.test(item.toString()) && parseFloat(item.toString()) < compareWith)) ?? NotFound;

export const validateLessThanOrEqual = (compareWith: number): MatcherFunction => (arr: Primitive[]): MatcherResult =>
  arr.find((item) => !(numberRegex.test(item.toString()) && parseFloat(item.toString()) <= compareWith)) ?? NotFound;

/* Dates */

const sameDate = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

const toDate = (p: Primitive) => new Date(p.toString());
const now = () => new Date();
const isNotDate = (p: Primitive) => isNaN(toDate(p).valueOf());

export const validateEarlierThan = (compareWith: string): MatcherFunction => (arr: Primitive[]): MatcherResult =>
  arr.find((item) => isNotDate(item) || toDate(item) >= toDate(compareWith)) ?? NotFound;

export const validateAfter = (compareWith: string): MatcherFunction => (arr: Primitive[]): MatcherResult =>
  arr.find((item) => isNotDate(item) || toDate(item) <= toDate(compareWith)) ?? NotFound;

export const validateSameDateAs = (compareWith: string): MatcherFunction => (arr: Primitive[]): MatcherResult =>
  arr.find((item) => isNotDate(item) || !sameDate(toDate(item), toDate(compareWith))) ?? NotFound;

export const validateSameDateTimeAs = (compareWith: string): MatcherFunction => (arr: Primitive[]): MatcherResult =>
  arr.find((item) => isNotDate(item) || toDate(item).valueOf() !== toDate(compareWith).valueOf()) ?? NotFound;

export const validateAsEarlyAs = (compareWith: string): MatcherFunction => (arr: Primitive[]): MatcherResult =>
  arr.find((item) => isNotDate(item) || toDate(item) < toDate(compareWith)) ?? NotFound;

export const validateAsLateAs = (compareWith: string): MatcherFunction => (arr: Primitive[]): MatcherResult =>
  arr.find((item) => isNotDate(item) || toDate(item) > toDate(compareWith)) ?? NotFound;

export const validateDate = (): MatcherFunction => (arr: Primitive[]): MatcherResult =>
  arr.find((item) => isNotDate(item)) ?? NotFound;

export const validateToday = (): MatcherFunction => validateSameDateAs(now().toISOString());

export const validateAfterToday = (): MatcherFunction => (arr: Primitive[]): MatcherResult =>
  arr.find((item) => isNotDate(item) || sameDate(now(), toDate(item)) || toDate(item) < now()) ?? NotFound;

export const validateBeforeToday = (): MatcherFunction => (arr: Primitive[]): MatcherResult =>
  arr.find((item) => isNotDate(item) || sameDate(now(), toDate(item)) || toDate(item) > now()) ?? NotFound;

/* Strings */

export const validateNonEmptyString = (): MatcherFunction => (arr: Primitive[]): MatcherResult =>
  arr.find((item) => typeof item !== 'string' || !(item.length > 0)) ?? NotFound;

export const validateStringContaining = (str: string): MatcherFunction => (arr: Primitive[]): MatcherResult =>
  arr.find((item) => typeof item !== 'string' || !item.includes(str)) ?? NotFound;

export const validateStringNotContaining = (str: string): MatcherFunction => (arr: Primitive[]): MatcherResult =>
  arr.find((item) => typeof item !== 'string' || item.includes(str)) ?? NotFound;

/* Any Of */
export const validateAnyOf = (anyOf: Primitive[]): MatcherFunction => (arr: Primitive[]): MatcherResult =>
  arr.find((item) => !anyOf.includes(item)) ?? NotFound;

/* Not */
export const validateNot = (not: string): MatcherFunction => (arr: Primitive[]): MatcherResult =>
  arr.find((item) => item === not) ?? NotFound;

/* Regex */
export const validateRegex = (regex: string): MatcherFunction => (arr: Primitive[]): MatcherResult =>
  arr.find((item) => !new RegExp(regex).test(item.toString())) ?? NotFound;

/* Array Count */
export const validateCountEquals = (count: number): MatcherFunction => (arr: Primitive[]): MatcherResult =>
  arr.length !== count ? arr.length : NotFound;

export const validateCountGreaterThan = (count: number): MatcherFunction => (arr: Primitive[]): MatcherResult =>
  !(arr.length > count) ? arr.length : NotFound;

export const validateCountGreaterThanOrEqual = (count: number): MatcherFunction => (arr: Primitive[]): MatcherResult =>
  !(arr.length >= count) ? arr.length : NotFound;

export const validateCountLessThan = (count: number): MatcherFunction => (arr: Primitive[]): MatcherResult =>
  !(arr.length < count) ? arr.length : NotFound;

export const validateCountLessThanOrEqual = (count: number): MatcherFunction => (arr: Primitive[]): MatcherResult =>
  !(arr.length <= count) ? arr.length : NotFound;

/* Array Props */
export const validateEachHasProps = (props: string[]): MatcherFunction => (arr: Primitive[]): MatcherResult =>
  arr.find((item) => typeof item !== 'object' || props.find((p) => !Object.keys(item).includes(p))) ?? NotFound;

export const validateEachHasPropsLimitedTo = (props: string[]): MatcherFunction => (arr: Primitive[]): MatcherResult =>
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

export const validateSorted = (direction: string) => (arr: Primitive[]): MatcherResult => {
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

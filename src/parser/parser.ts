import { ITest, IKeyValuePair, IRequest } from '../interfaces/test';

/*
 * FP helper
 */

// eslint-disable-next-line @typescript-eslint/ban-types
function flow(ab: Function, bc: Function): (str: string) => string {
  return (...args) => bc(ab(...args));
}

/**
 * Functions used to transform text into different text and into objects
 */
const safeTrim = (str: string | undefined) => (typeof str === 'string' ? str.trim() : '');
const safeSplitIntoLines = (match: RegExpMatchArray) =>
  match && match.length === 1
    ? match[0]
        .trim()
        .split('\n')
        .map((s) => s.trim())
    : [];

const stringToTypedValue = (s: string): number | boolean | string => {
  if (/^\d*$/.test(s)) return parseFloat(s);
  if (/(true|false)/.test(s)) return JSON.parse(s);
  return s;
};
const regexMatchToString = (match: RegExpMatchArray) => (match && match.length === 1 ? safeTrim(match[0]) : undefined);
const arrayToPair = (arr?: string[]) =>
  arr ? { [removeQuotes(safeTrim(arr[0]))]: stringToTypedValue(safeTrim(arr[1])) } : undefined;
const splitStringByFirstColon = (s: string) =>
  s.includes(':') ? s.split(/:(.+)/, 2).map((s) => safeTrim(s)) : undefined;
const stringToPair = (s: string) => arrayToPair(splitStringByFirstColon(s) ?? undefined);
const passOnStringToPair = (text: string) =>
  text.includes('as') ? arrayToPair(text.split(/as(.+)/, 2)) : arrayToPair([text, text]);
const removeQuotes = (s: string) => s.replace(/"/g, '');

/**
 * Functions used by splitRequestIntoSections
 */

const endTerms = 'Wait|Expect|After|To|Pass on|$';
const regexMatcher = (regex: RegExp) => (text: string) => text.match(regex);

/**
 * Single match parsing functions
 */

const getMethod = flow(regexMatcher(/(?<=method:\s{0,}).+/), regexMatchToString);
const getUrl = flow(regexMatcher(/(?<=url:\s{0,}).+/), regexMatchToString);
const getBody = flow(
  regexMatcher(new RegExp(`(?<=body:\\s{0,})[\\s\\S]*?(?=(^\\s{0,}(headers:|method:|url:|${endTerms})))`, 'gm')),
  regexMatchToString
);
const getWait = flow(regexMatcher(/(?<=Wait\s{0,}).+/), regexMatchToString);
const getExpectedStatusCode = flow(regexMatcher(/(?<=To respond with status code\s{0,}).+/), regexMatchToString);

/**
 * Multi match parsing functions
 */

const getPassOn = (requestText: string) =>
  (requestText.match(new RegExp(`(?<=Pass on\\s{0,})[\\s\\S]*?(?=(${endTerms}))`, 'g')) ?? []).map((s) =>
    passOnStringToPair(s.trim())
  );
const getHeaders = (requestText: string) =>
  safeSplitIntoLines(requestText.match(/(?<=headers:)[\s\S]*?(?=method:)/g) ?? []).map((s) =>
    stringToPair(removeQuotes(s))
  );
const getJsonRules = (requestText: string) =>
  safeSplitIntoLines(
    requestText.match(new RegExp(`(?<=To match JSON rules)[\\s\\S]*?(?=(${endTerms}))`, 'g')) ?? []
  ).map((s) => stringToPair(s));
const getHeaderRules = (requestText: string) =>
  safeSplitIntoLines(
    requestText.match(new RegExp(`(?<=To match header rules\n)[\\s\\S]*?(?=(${endTerms}))`, 'g')) ?? []
  ).map((s) => stringToPair(removeQuotes(s)));

/**
 * Functions used by splitTestIntoSections
 */
const getName = flow(regexMatcher(/(?<=Test that it\s).+/), regexMatchToString);
const getUsingValues = (text: string): IKeyValuePair[] => <IKeyValuePair[]>safeSplitIntoLines(
    text.match(/(?<=Using values)[\s\S]+?(?=((After|Expect) HTTP request))/g) ?? []
  )
    .map((s) => stringToPair(s))
    .filter((pair) => pair !== undefined);

const splitRequestIntoSections = (requestText: string): IRequest => ({
  headers: <IKeyValuePair[]>getHeaders(requestText),
  method: getMethod(requestText),
  url: getUrl(requestText),
  body: getBody(requestText),
  passOn: <IKeyValuePair[]>getPassOn(requestText),
  wait: getWait(requestText),
  expectedStatusCode: getExpectedStatusCode(requestText),
  jsonRules: <IKeyValuePair[]>getJsonRules(requestText),
  headerRules: <IKeyValuePair[]>getHeaderRules(requestText),
});

const getRequests = (text: string) =>
  (text.match(/(?<=((After|Expect) HTTP request))[\s\S]+?(?=($|((After|Expect) HTTP request)))/g) ?? []).map((r) =>
    splitRequestIntoSections(r)
  );

/**
 * Exported functions
 */
export const preProcess = (text: string): string =>
  text
    .replace(/\r/g, '')
    .replace(/^\s*/gm, '')
    .replace(/\s*$/gm, '')
    .replace(/\/\*\*.+?\*\*\//gm, '');

export const splitTests = (text: string): RegExpMatchArray =>
  text.match(/Test that it[\s\S]*?(?=(Test that it|$))/g) ?? [];
export const splitTestIntoSections = (text: string): ITest => ({
  name: getName(text),
  usingValues: getUsingValues(text),
  requests: getRequests(text),
});

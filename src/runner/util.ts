import { ITest, IKeyValuePair, IRequest } from '../interfaces/test';
import { Chance } from 'chance';
import { getArgs } from '../parser/util';
import { Response } from 'node-fetch';
import { ITestResult } from '../interfaces/results';

export const randomSeed = process.hrtime()[0] * 1e9 + process.hrtime()[1];

const replaceMultipleValuesInString = (str: string, replacements: IKeyValuePair[]) => {
  if (str != null) {
    replacements.forEach((replacement) => {
      const key = Object.keys(replacement)[0];
      str = str.replace(key, replacement[key].toString());
    });
  }
  return str;
};

const replaceValueInKeyValuePair = (obj: IKeyValuePair, replaceStr: string, replaceWith: string): IKeyValuePair => {
  const key = Object.keys(obj)[0];
  const value = obj[key].toString().replace(replaceStr, replaceWith);
  return { [key]: value };
};

const replaceValueInKeyValuePairArray = (
  arr: IKeyValuePair[],
  replaceStr: string,
  replaceWith: string
): IKeyValuePair[] => arr.map((kv) => replaceValueInKeyValuePair(kv, replaceStr, replaceWith));

const replaceMultipleValuesInKeyValuePairArray = (
  arr: IKeyValuePair[],
  replacements: IKeyValuePair[]
): IKeyValuePair[] => {
  let result = [...arr];
  replacements.forEach((replacement) => {
    const key = Object.keys(replacement)[0];
    result = replaceValueInKeyValuePairArray(result, key, replacement[key].toString());
  });

  return result;
};

export const replaceValuesInRequest = (request: IRequest, replacements: IKeyValuePair[]): IRequest => {
  const body = replaceMultipleValuesInString(request.body, replacements);
  const url = replaceMultipleValuesInString(request.url, replacements);
  const headerRules = replaceMultipleValuesInKeyValuePairArray(request.headerRules, replacements);
  const headers = replaceMultipleValuesInKeyValuePairArray(request.headers, replacements);
  const jsonRules = replaceMultipleValuesInKeyValuePairArray(request.jsonRules, replacements);

  return {
    body,
    url,
    headerRules,
    headers,
    jsonRules,
    expectedStatusCode: request.expectedStatusCode,
    method: request.method,
    passOn: request.passOn,
    wait: request.wait,
  };
};

const replaceValuesInRequests = (requests: IRequest[], replacements: IKeyValuePair[]): IRequest[] => {
  const result = [];

  requests.forEach((request) => {
    result.push(replaceValuesInRequest(request, replacements));
  });

  return result;
};

export const applyValues = (test: ITest): ITest => {
  const usingValues = test.usingValues;
  const requests = replaceValuesInRequests(test.requests, usingValues);
  return { name: test.name, usingValues, requests };
};

/* 
  @id2: random number up to 100
  @txt: random string length 20
*/
export const applyRandomValues = (test: ITest, seed: number = randomSeed): ITest => {
  const chance = new Chance(seed);
  const randomString = 'random string length';
  const randomNumber = 'random number up to';
  const usingValues = test.usingValues.map((v) => {
    const key = Object.keys(v)[0];
    if (v[key].toString().startsWith(randomString)) {
      const args = getArgs(v[key].toString(), randomString);
      if (args.length === 1) {
        return { [key]: chance.string({ length: parseInt(args[0]) }) };
      }
    } else if (v[key].toString().startsWith(randomNumber)) {
      const args = getArgs(v[key].toString(), randomNumber);
      if (args.length === 1) {
        return { [key]: chance.integer({ min: 0, max: parseInt(args[0]) }).toString() };
      }
    }
    return v;
  });

  return { name: test.name, usingValues, requests: test.requests };
};

export const keyValuePairArrayTo2DArray = (arr: IKeyValuePair[]): string[][] =>
  arr.map((item) => {
    const key = Object.keys(item)[0].toString();
    return [key, item[key].toString()];
  });

export const wait = async (ms: number): Promise<unknown> => await new Promise((resolve) => setTimeout(resolve, ms));

// this function will throw if given invalid data
export const durationStringToMs = (duration: string): number => {
  if (/^\d+\s{1,}[A-Z]+$/i.test(duration)) {
    const num = parseInt(/\d+/.exec(duration)[0]);
    const unit = /[A-Z]+/i.exec(duration)[0].toLowerCase();
    if (unit.includes('second') || unit === 's') {
      return num * 1000;
    } else if (unit.includes('milisecond') || unit === 'ms') {
      return num;
    }
  }
  throw new Error('Invalid duration string');
};

export const keyValueToObject = (
  kv: IKeyValuePair
): {
  key: string;
  value: string | number | boolean;
} => ({ key: Object.keys(kv)[0], value: kv[Object.keys(kv)[0]] });

export const getResponseText = (response: Response): string => {
  const responseClone = response.clone();
  const body = responseClone.body.read();
  const headers = responseClone.headers.raw();
  const status = responseClone.status;
  const statusText = responseClone.statusText;
  const timeout = responseClone.timeout;
  const url = responseClone.url;

  return JSON.stringify({
    url,
    status,
    statusText,
    timeout,
    headers,
    body,
  });
};

export const bigIntToNumber = (bigInt: BigInt): number => {
  if (bigInt <= BigInt(Number.MAX_SAFE_INTEGER)) return Number(bigInt);
  return Infinity; // this is purely theoretical, Number.MAX_SAFE_INTEGER nanoseconds is 2501 hours / 100+ days
};

const createXmlTestCase = (result: ITestResult): string => `
<testcase name="${result.testName}" 
classname="${result.testName.replace(/\s/g, '_')}"  
status="${result.passed ? 'passed' : 'failed'}"
time="${(result.duration / 1e9).toFixed(2)}"
>
${result.failReasons.map((f) => `<failure message="${f}"></failure>`).join('')}
</testcase>`;

/**
 * Convert results to Apache Ant JUnit XML data
 * @param results
 */
export const resultsToXml = (suiteName: string, results: ITestResult[]): string => {
  const fileStart = '<?xml version="1.0" encoding="UTF-8"?>';
  const suiteStart = `<testsuite name="${suiteName}" tests="${results.length}" id="0" errors="0" failures="${
    results.filter((r) => r.passed === false).length
  }">`;
  const suiteEnd = '</testsuite>';

  return fileStart + '\n' + suiteStart + results.map((r) => createXmlTestCase(r)).join('') + '\n' + suiteEnd;
};

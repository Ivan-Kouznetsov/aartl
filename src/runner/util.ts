import { ITest, IKeyValuePair, IRequest } from '../interfaces/test';
import { getArgs } from '../parser/util';
import { getRngFunctions } from '../lib/rng';
import { ITestResult, IRequestLog } from '../interfaces/results';
const randomSeed = process.hrtime()[1];

const replaceMultipleValuesInString = (str: string, replacements: IKeyValuePair[]) => {
  replacements.forEach((replacement) => {
    const key = Object.keys(replacement)[0];
    str = str.replace(key, replacement[key].toString());
  });
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
  const headerRules = replaceMultipleValuesInKeyValuePairArray(request.headerRules, replacements);
  const headers = replaceMultipleValuesInKeyValuePairArray(request.headers, replacements);
  const jsonRules = replaceMultipleValuesInKeyValuePairArray(request.jsonRules, replacements);

  return {
    body: request.body === undefined ? undefined : replaceMultipleValuesInString(request.body, replacements),
    url: request.url === undefined ? undefined : replaceMultipleValuesInString(request.url, replacements),
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
  const result: IRequest[] = [];

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
  const rng = getRngFunctions(seed);

  const randomString = 'random string length';
  const randomNumber = 'random number up to';
  const usingValues = test.usingValues.map((v) => {
    const key = Object.keys(v)[0];
    if (v[key].toString().startsWith(randomString)) {
      const args = getArgs(v[key].toString(), randomString);
      if (args.length === 1) {
        return { [key]: rng.randomStr(<number>args[0]) };
      }
    } else if (v[key].toString().startsWith(randomNumber)) {
      const args = getArgs(v[key].toString(), randomNumber);
      if (args.length === 1) {
        return { [key]: rng.randomInt(<number>args[0]).toString() };
      }
    }
    return v;
  });

  return { name: test.name, usingValues, requests: test.requests };
};

export const keyValuePairArrayHashTable = (arr: IKeyValuePair[]): { [key: string]: string } => {
  const result: { [key: string]: string } = {};

  arr.forEach((item) => {
    const key = Object.keys(item)[0].toString();
    result[key] = item[key].toString();
  });
  return result;
};
export const wait = async (ms: number): Promise<unknown> => await new Promise((resolve) => setTimeout(resolve, ms));

// this function will throw if given invalid data
export const durationStringToMs = (duration: string): number => {
  if (/^\d+\s{1,}[A-Z]+$/i.test(duration)) {
    const numMatches = <RegExpExecArray>/\d+/.exec(duration);
    const unitMatches = <RegExpExecArray>/[A-Z]+/i.exec(duration);

    const num = parseInt(numMatches[0]);
    const unit = unitMatches[0].toLowerCase();

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

export const bigIntToNumber = (bigInt: BigInt): number => {
  if (bigInt <= BigInt(Number.MAX_SAFE_INTEGER)) return Number(bigInt);
  return Infinity; // this is purely theoretical, Number.MAX_SAFE_INTEGER nanoseconds is 2501 hours / 100+ days
};

export const shuffleArray = (array: unknown[]): void => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const prettyPrintRequestLog = (log: IRequestLog): string => {
  return `\n\nRequest ☎
  ${(log.sent.method ?? '').toUpperCase()} ${log.sent.url} ➥
  Duration: ${(log.duration / 1e6).toFixed(2)}ms
\t${Object.keys(log.sent.headers)
    .map((key) => `${key}: ${log.sent.headers[key]}`)
    .filter((l) => l.trim().length > 0)
    .join('\n\t')
    .trim()}
  ${log.sent.body ? log.sent.body.replace(/\s/g, '•') : ''}
  Response ⬎
  
  Status: ${log.received.status}
\t${Object.keys(log.received.headers)
    .map((key) => `${key}: ${log.received.headers[key]}`)
    .filter((l) => l.trim().length > 0)
    .join('\n\t')
    .trim()}
  ${log.received.string}`;
};

export const prettyPrintResult = (testResult: ITestResult, printLogs: boolean, color = false): string => {
  const redCode = '\u001b[31m';
  const greenCode = '\u001b[32m';
  const resetCode = '\u001b[0m';

  const passedMsg = color ? `${greenCode}+ Passed:${resetCode}` : '+ Passed:';
  const failedMsg = color ? `${redCode}- Failed:${resetCode}` : '- Failed:';

  return (
    `
${testResult.passed ? passedMsg : failedMsg} ${testResult.testName} 
Duration: ${(testResult.duration / 1e6).toFixed(2)}ms
${testResult.failReasons.length > 0 ? 'Failure Reasons:\n\t' + testResult.failReasons.join('\n\t').trim() : ''}` +
    (printLogs
      ? `
\t\t\tRequests${testResult.requestLogs.map((log) => prettyPrintRequestLog(log)).join('')}`
      : '')
  );
};

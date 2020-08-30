import { ITest, IKeyValuePair } from '../interfaces/test';
import { IRequestLog, ITestResult } from '../interfaces/results';
import * as util from './util';
import * as ruleParser from '../parser/ruleParser';
import * as http_promise from '../lib/http-promise';
import { jsonPath } from '../lib/jsonpath';
import { ArgCount } from '../enums/argCount';
import { NotFound } from '../rules/notFound';

export const runTest = async (test: ITest): Promise<ITestResult> => {
  const testWithValues = util.applyRandomValues(util.applyValues(test));

  const passOnValues: IKeyValuePair[] = [];
  const failReasons: string[] = [];
  const requestLogs: IRequestLog[] = [];

  const testStartTime = process.hrtime.bigint();

  for (const request of testWithValues.requests) {
    // replace passOn values
    const currentRequest = util.replaceValuesInRequest(request, passOnValues);
    try {
      const requestStartTime = process.hrtime.bigint();
      const requestLogSent = {
        url: currentRequest.url,
        body: currentRequest.body,
        headers: util.keyValuePairArrayHashTable(currentRequest.headers),
        method: currentRequest.method,
      };

      if (currentRequest.url === undefined) {
        return {
          testName: test.name,
          passed: false,
          failReasons: [`Cannot request an empty url`],
          duration: util.bigIntToNumber(process.hrtime.bigint() - testStartTime),
          requestLogs,
        };
      }

      const currentRequestResponse = await http_promise.request(
        currentRequest.url,
        currentRequest.method ?? 'get',
        util.keyValuePairArrayHashTable(currentRequest.headers),
        currentRequest.body
      );

      const requestEndTime = process.hrtime.bigint();

      requestLogs.push({
        sent: requestLogSent,
        received: currentRequestResponse,
        duration: util.bigIntToNumber(requestEndTime - requestStartTime),
      });

      if (currentRequest.wait) {
        const duration = util.durationStringToMs(currentRequest.wait);
        await util.wait(duration);
      }
      if (currentRequest.passOn.length > 0) {
        const json = currentRequestResponse.json;
        if (json === null) {
          return {
            testName: test.name,
            passed: false,
            failReasons: [`Cannot pass on value because response was not JSON or XML`],
            duration: util.bigIntToNumber(process.hrtime.bigint() - testStartTime),
            requestLogs,
          };
        }
        for (const passOn of currentRequest.passOn) {
          const passOnObj = util.keyValueToObject(passOn);
          const value = jsonPath(json, passOnObj.key);
          if (Array.isArray(value)) {
            passOnValues.push({ [passOnObj.value.toString()]: value[0] });
          } else {
            return {
              testName: test.name,
              passed: false,
              failReasons: [`Pass on JSON path: ${passOnObj.key} not found in response`],
              duration: util.bigIntToNumber(process.hrtime.bigint() - testStartTime),
              requestLogs,
            };
          }
        }
      }

      // if it has expectations
      if (currentRequest.expectedStatusCode) {
        if (currentRequestResponse.status !== parseInt(currentRequest.expectedStatusCode)) {
          failReasons.push(
            `Expected status code of ${currentRequest.expectedStatusCode}, received: ${currentRequestResponse.status}`
          );
        }
      }
      const headerNotPresentRule = 'must not be present';

      if (currentRequest.headerRules.length > 0) {
        currentRequest.headerRules.forEach((hr) => {
          const headerRule = util.keyValueToObject(hr);
          if (
            (headerRule.value === headerNotPresentRule &&
              typeof currentRequestResponse.headers[headerRule.key] !== 'undefined') ||
            (headerRule.value !== headerNotPresentRule &&
              currentRequestResponse.headers[headerRule.key] !== headerRule.value)
          ) {
            failReasons.push(
              `Expected header ${headerRule.key} to match ${headerRule.value}, received: ${
                currentRequestResponse.headers[headerRule.key] === undefined
                  ? 'nothing'
                  : currentRequestResponse.headers[headerRule.key]
              }`
            );
          }
        });
      }

      if (currentRequest.jsonRules.length > 0) {
        const parsedRules = ruleParser.parseJsonRules(currentRequest);
        const json = currentRequestResponse.json;
        if (json === null) {
          return {
            testName: test.name,
            passed: false,
            failReasons: [`Cannot check JSON rules because response was not JSON or XML`],
            duration: util.bigIntToNumber(process.hrtime.bigint() - testStartTime),
            requestLogs,
          };
        }
        parsedRules.forEach(async (rule) => {
          const data = jsonPath(json, rule.jsonpath);
          if (data === false) {
            if (rule.originalRule.toString().includes('count')) {
              const ruleCheckResult = rule.matching.factory(rule.matching.args[0])([]);
              if (ruleCheckResult !== NotFound) {
                failReasons.push(
                  `Expected ${rule.jsonpath} to match ${rule.originalRule}, received ${ruleCheckResult}`
                );
              }
            } else {
              failReasons.push(`Expected ${rule.jsonpath} to match ${rule.originalRule}, received nothing`);
            }
          } else {
            const nonCompliantValue =
              rule.matching.expectedArgs === ArgCount.One
                ? rule.matching.factory(rule.matching.args[0])(data)
                : rule.matching.factory(rule.matching.args)(data);
            if (nonCompliantValue !== NotFound) {
              failReasons.push(
                `Expected ${rule.jsonpath} to match ${rule.originalRule}, received ${JSON.stringify(nonCompliantValue)}`
              );
            }
          }
        });
      }
    } catch (ex) {
      failReasons.push(ex);
    }
  }

  return {
    testName: test.name,
    passed: failReasons.length === 0,
    failReasons,
    duration: util.bigIntToNumber(process.hrtime.bigint() - testStartTime),
    requestLogs,
  };
};

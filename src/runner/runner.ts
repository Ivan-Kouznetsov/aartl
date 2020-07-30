import { ITest, IKeyValuePair } from '../interfaces/test';
import { IRequestLog, ITestResult } from '../interfaces/results';
import * as util from './util';
import * as ruleParser from '../parser/ruleParser';
import fetch from 'node-fetch';
import { value, query } from 'jsonpath';

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
      const requestLogSent = JSON.stringify({
        url: currentRequest.url,
        body: currentRequest.body,
        headers: util.keyValuePairArrayTo2DArray(currentRequest.headers),
        method: currentRequest.method,
      });

      const currentRequestResponse = await fetch(currentRequest.url, {
        body: currentRequest.body,
        headers: util.keyValuePairArrayTo2DArray(currentRequest.headers),
        method: currentRequest.method,
      });

      const requestEndTime = process.hrtime.bigint();
      const responseText = await util.getResponseText(currentRequestResponse);

      requestLogs.push({
        sent: requestLogSent,
        received: responseText,
        duration: util.bigIntToNumber(requestEndTime - requestStartTime),
      });

      if (currentRequest.wait) {
        const duration = util.durationStringToMs(currentRequest.wait);
        await util.wait(duration);
      }
      if (currentRequest.passOn.length > 0) {
        const json = await currentRequestResponse.json();
        for (const passOn of currentRequest.passOn) {
          const passOnObj = util.keyValueToObject(passOn);
          passOnValues.push({ [passOnObj.value.toString()]: value(json, passOnObj.key) });
        }
      }

      // if it has expectations
      if (currentRequest.expectedStatusCode) {
        if (currentRequestResponse.status !== parseInt(currentRequest.expectedStatusCode)) {
          failReasons.push(
            `Expected status code of ${currentRequest.expectedStatusCode}, got: ${currentRequestResponse.status}`
          );
        }
      }

      if (currentRequest.headerRules.length > 0) {
        currentRequest.headerRules.forEach((hr) => {
          const headerRule = util.keyValueToObject(hr);
          if (
            !currentRequestResponse.headers.has(headerRule.key) ||
            !(currentRequestResponse.headers.get(headerRule.key) === headerRule.value)
          ) {
            failReasons.push(
              `Expected header ${headerRule.key} to be ${headerRule.value}, got: ${
                !currentRequestResponse.headers.has(headerRule.key)
                  ? 'nothing'
                  : currentRequestResponse.headers.get(headerRule.key)
              }`
            );
          }
        });
      }

      if (currentRequest.jsonRules.length > 0) {
        const parsedRules = ruleParser.parseJsonRules(currentRequest);
        const json = await currentRequestResponse.json();

        parsedRules.forEach(async (rule) => {
          const data = query(json, rule.jsonpath);

          if (typeof rule.rule === 'function') {
            const nonCompliantValue = rule.rule(data);
            if (nonCompliantValue !== undefined) {
              failReasons.push(
                `Expected ${rule.jsonpath} to be ${rule.originalRule}, got ${nonCompliantValue.toString()}`
              );
            }
          } else {
            data.forEach((item) => {
              if (rule.rule !== (item ?? 'null').toString()) {
                failReasons.push(`Expected ${rule.jsonpath} to be ${rule.originalRule}, got ${item}`);
              }
            });
          }
        });
      }
    } catch (ex) {
      failReasons.push(ex.message);
    }
  }

  const testEndTime = process.hrtime.bigint();

  return {
    testName: test.name,
    passed: failReasons.length === 0,
    failReasons,
    duration: util.bigIntToNumber(testEndTime - testStartTime),
    requestLogs,
  };
};

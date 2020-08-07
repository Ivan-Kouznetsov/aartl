import { runTest } from './runner';
import * as parser from '../parser/parser';
import { getFirstValidationError } from '../validator/validator';
import * as util from './util';
import { ITestResult } from '../interfaces/results';
import { ITest } from '../interfaces/test';
import { RateLimit } from '../lib/async-sema-3.0.0';

export const suiteRunner = async (args: {
  content: string;
  testName?: string;
  numberOfRuns: number;
  randomize: boolean;
  noValidation: boolean;
  realTimeLogger?: (result: ITestResult) => void;
  maxConcurrent?: number;
}): Promise<ITestResult[]> => {
  return new Promise(async (resolve, reject) => {
    const { content: contents, testName, numberOfRuns, randomize, noValidation, realTimeLogger, maxConcurrent } = args;

    const lim = RateLimit(maxConcurrent ?? 100);

    const preProcessedText = parser.preProcess(contents);
    const tests = parser.splitTests(preProcessedText);

    const parsedTests: ITest[] = [];

    for (const test of tests) {
      const parsedTest = parser.splitTestIntoSections(test);
      if (testName === undefined || parsedTest.name === testName) {
        if (!noValidation) {
          const validationError = getFirstValidationError(parsedTest);

          if (validationError) {
            reject(`${parsedTest.name}: ${validationError}`);
            return;
          }
        }
        parsedTests.push(parsedTest);
      }
    }

    const totalTestsToRun = parsedTests.length * numberOfRuns;
    const totalResults: ITestResult[] = [];
    for (let i = 0; i < numberOfRuns; i++) {
      if (randomize) {
        util.shuffleArray(parsedTests);
      }

      for (const parsedTest of parsedTests) {
        await lim();
        runTest(parsedTest).then((result) => {
          totalResults.push(result);
          if (realTimeLogger) realTimeLogger(result);

          if (totalResults.length === totalTestsToRun) {
            resolve(totalResults);
          }
        });
      }
    }
  });
};

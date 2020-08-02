import { runTest } from './runner';
import * as parser from '../parser/parser';
import { getFirstValidationError } from '../validator/validator';
import * as util from './util';
import { ITestResult, IReport } from '../interfaces/results';
import { ITest } from '../interfaces/test';
import { buildReport } from '../reportBuilder/reportBuilder';

export const suiteRunner = async (
  suiteName: string,
  contents: string,
  testName: string,
  numberOfRuns: number,
  randomize: boolean,
  outputXml: boolean,
  noValidation: boolean,
  report: boolean,
  realTimeLogger: (result: ITestResult) => void
): Promise<IReport | string | ITestResult[]> => {
  return new Promise((resolve, reject) => {
    const preProcessedText = parser.preProcess(contents);
    const tests = parser.splitTests(preProcessedText);

    let resultsPerRun: ITestResult[] = [];
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

    let totalResults: ITestResult[] = [];
    for (let i = 0; i < numberOfRuns; i++) {
      if (randomize) {
        util.shuffleArray(parsedTests);
      }

      for (const parsedTest of parsedTests) {
        runTest(parsedTest).then((result) => {
          resultsPerRun.push(result);
          if (!outputXml && !report) {
            realTimeLogger(result);
          }
          if (resultsPerRun.length === parsedTests.length) {
            totalResults = totalResults.concat([...resultsPerRun]);

            resultsPerRun = [];
            if (totalResults.length === parsedTests.length * numberOfRuns) {
              if (report) {
                resolve(buildReport(totalResults));
              } else if (outputXml) {
                resolve(util.resultsToXml(suiteName, totalResults));
              } else {
                resolve(totalResults);
              }
            }
          }
        });
      }
    }
  });
};

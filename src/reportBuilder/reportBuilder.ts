import { ITestResult, ITestReport, IReport } from '../interfaces/results';

/**
 * Math
 */

const median = (arr: number[]) => {
  const sortedArr = [...arr].sort();
  const middle = Math.ceil(arr.length / 2);
  return sortedArr.length % 2 === 0 ? (sortedArr[middle] + sortedArr[middle - 1]) / 2 : sortedArr[middle - 1];
};
const range = (arr: number[]) => ({ min: Math.min(...arr), max: Math.max(...arr) });

/*
 * Exported function
 */

export const buildReport = (testResults: ITestResult[]): IReport => {
  const testReports: ITestReport[] = [];
  const uniqueTestNames = new Set(testResults.map((t) => t.testName));
  uniqueTestNames.forEach((name) => {
    const runs = testResults.filter((test) => test.testName === name).length;
    const failures = testResults.filter((test) => test.testName === name).filter((test) => test.passed === false)
      .length;
    testReports.push({
      testName: name,
      runs,
      failures,
      failureRate: Math.round((failures / runs) * 100),
    });
  });
  const failureRates = testReports.map((t) => t.failureRate);
  return {
    testReports,
    rangeOfFailureRates: range(failureRates),
    medianFailureRate: median(failureRates),
  };
};

import { buildReport } from '../../reportBuilder/reportBuilder';
import { testResults1, testResults2 } from './fixtures/reportBuilder.fixtures';

describe('Report builder', () => {
  it('should return a report when given a test result array of 1', () => {
    const report = buildReport(testResults1);
    expect(report).toEqual({
      medianFailureRate: 0,
      rangeOfFailureRates: {
        max: 0,
        min: 0,
      },
      testReports: [
        {
          failureRate: 0,
          failures: 0,
          runs: 1,
          testName: 'should save a post and check id',
        },
      ],
    });
  });

  it('should return a report when given a test result array of 2', () => {
    const report = buildReport(testResults2);
    expect(report).toEqual({
      medianFailureRate: 50,
      rangeOfFailureRates: {
        max: 100,
        min: 0,
      },
      testReports: [
        {
          failureRate: 0,
          failures: 0,
          runs: 1,
          testName: 'should save a post and check id',
        },
        {
          failureRate: 100,
          failures: 1,
          runs: 1,
          testName: 'should save a post and check id1',
        },
      ],
    });
  });
});

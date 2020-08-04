import { buildReport, buildHtmlReport } from '../../reportBuilder/reportBuilder';
import { testResults1, testResults2 } from './fixtures/reportBuilder.fixtures';
import { rawResults } from './fixtures/htmlReport.fixtures';
import * as html_validator from 'html-validator';

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

  it('should produce valid html', async () => {
    const html = buildHtmlReport('Example', rawResults);

    expect(html.includes('[object')).toBe(false);
    expect(html.includes('undefined')).toBe(false);
    expect((await html_validator({ validator: 'WHATWG', data: html })).isValid).toBe(true);
  });
});

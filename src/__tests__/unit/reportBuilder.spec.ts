import { buildReport, buildHtmlReport, resultsToXml } from '../../reportBuilder/reportBuilder';
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

  it('should create xml', async () => {
    const xml = resultsToXml('suiteName', [
      {
        testName: 'should save a post',
        passed: true,
        failReasons: [],
        duration: 1047255601,
        requestLogs: [
          {
            sent: '{"url":"http://localhost:3000/posts","body":"Hello world","headers":[],"method":"post"}',
            received:
              '{"url":"http://localhost:3000/posts","status":200,"statusText":"OK","timeout":0,"headers":{"x-powered-by":["Express"],"content-type":["text/html; charset=utf-8"],"content-length":["25"],"etag":["W/\\"19-WqJLNHUKLP65kWWXKIgVc25j0fI\\""],"date":["Thu, 23 Jul 2020 05:32:44 GMT"],"connection":["close"]},"body":null}',
            duration: 33508557,
          },
          {
            sent:
              '{"url":"http://localhost:3000/posts/136","body":null,"headers":[["Accept-Encoding","*/*"]],"method":"get"}',
            received:
              '{"url":"http://localhost:3000/posts/136","status":200,"statusText":"OK","timeout":0,"headers":{"x-powered-by":["Express"],"content-type":["text/html; charset=utf-8"],"content-length":["31"],"etag":["W/\\"1f-8DNGmNfs9LspHaJxCAHXC2E6H+U\\""],"date":["Thu, 23 Jul 2020 05:32:45 GMT"],"connection":["close"]},"body":null}',
            duration: 3131221,
          },
        ],
      },
      {
        testName: 'should save a post and check id',
        passed: true,
        failReasons: [],
        duration: 3857430,
        requestLogs: [
          {
            sent: '{"url":"http://localhost:3000/posts","body":"Hello world","headers":[],"method":"post"}',
            received:
              '{"url":"http://localhost:3000/posts","status":200,"statusText":"OK","timeout":0,"headers":{"x-powered-by":["Express"],"content-type":["text/html; charset=utf-8"],"content-length":["25"],"etag":["W/\\"19-XrqDRehqDtmkOlxNShWc5e2fDSc\\""],"date":["Thu, 23 Jul 2020 05:32:45 GMT"],"connection":["close"]},"body":null}',
            duration: 2748467,
          },
        ],
      },
      {
        testName: 'should save a post and make sure id is less than 0',
        passed: false,
        failReasons: ['< 0: Did not expect $..id to be 138'],
        duration: 3279287,
        requestLogs: [
          {
            sent: '{"url":"http://localhost:3000/posts","body":"Hello world","headers":[],"method":"post"}',
            received:
              '{"url":"http://localhost:3000/posts","status":200,"statusText":"OK","timeout":0,"headers":{"x-powered-by":["Express"],"content-type":["text/html; charset=utf-8"],"content-length":["25"],"etag":["W/\\"19-Kvy5SgiMT9Rw2wrbF+mr7VyKqt8\\""],"date":["Thu, 23 Jul 2020 05:32:45 GMT"],"connection":["close"]},"body":null}',
            duration: 2636382,
          },
        ],
      },
    ]);

    expect(xml.replace(/\n/g, '')).toEqual(
      '<?xml version="1.0" encoding="UTF-8"?><testsuite name="suiteName" tests="3" id="0" errors="0" failures="1"><testcase name="should save a post" classname="should_save_a_post"  status="passed"time="1.05"></testcase><testcase name="should save a post and check id" classname="should_save_a_post_and_check_id"  status="passed"time="0.00"></testcase><testcase name="should save a post and make sure id is less than 0" classname="should_save_a_post_and_make_sure_id_is_less_than_0"  status="failed"time="0.00"><failure message="< 0: Did not expect $..id to be 138"></failure></testcase></testsuite>'
    );
  });
});

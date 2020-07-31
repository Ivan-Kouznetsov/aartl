import * as util from '../../runner/util';
import { IRequest } from '../../interfaces/test';
import * as fixtures from './fixtures/test.fixtures';
import * as parser from '../../parser/parser';

describe('Runner util', () => {
  it('should apply random values', () => {
    const randomSeed = 42;
    const test = parser.splitTestIntoSections(fixtures.usingRanomdValues);
    const result = util.applyRandomValues(test, randomSeed);

    expect(result.usingValues[0]).toEqual({ '@num': '1' });
    expect(result.usingValues[1]).toEqual({ '@postText': 'eqemnqxujf' });
  });

  it('should not apply random values if too many params', () => {
    const randomSeed = 42;
    const test = parser.splitTestIntoSections(fixtures.usingRandomValuesTooManyArgs);
    const result = util.applyRandomValues(test, randomSeed);

    expect(result.usingValues[0]).toEqual({ '@num': 'random number up to 10 12' });
    expect(result.usingValues[1]).toEqual({ '@postText': 'random string length 10 12' });
  });

  it('should apply values', () => {
    const test = parser.splitTestIntoSections(fixtures.usingValues);
    const result = util.applyValues(test);

    expect(result.requests[0].jsonRules[0]).toEqual({ '$..text': 'Hello world' });
  });

  it('should convert BigInt to number', () => {
    const ten = util.bigIntToNumber(BigInt(10));
    const infinity = util.bigIntToNumber(BigInt(Number.MAX_SAFE_INTEGER) + BigInt(Number.MAX_SAFE_INTEGER));

    expect(ten).toEqual(10);
    expect(infinity).toEqual(Infinity);
  });

  it('should convert duration string to ms', () => {
    const tenSeconds = util.durationStringToMs('10 seconds');
    const tenMiliseconds = util.durationStringToMs('10 ms');

    expect(tenSeconds).toEqual(10000);
    expect(tenMiliseconds).toEqual(10);
    expect(util.durationStringToMs).toThrowError('Invalid duration string');
    expect(() => {
      util.durationStringToMs('10 XX');
    }).toThrowError('Invalid duration string');
  });

  it('should convert key value pair array to 2d array', () => {
    const arr = util.keyValuePairArrayTo2DArray([{ 'Accept-Encoding': '*/*' }, { 'X-cache': true }]);

    expect(arr).toEqual([
      ['Accept-Encoding', '*/*'],
      ['X-cache', 'true'],
    ]);
  });

  it('should convert key value pair to object', () => {
    const obj = util.keyValueToObject({ 'Accept-Encoding': '*/*' });
    expect(obj).toEqual({ key: 'Accept-Encoding', value: '*/*' });
  });

  it('should replace values in request', () => {
    const request: IRequest = {
      body: '@body',
      expectedStatusCode: '200',
      headerRules: [{ 'X-ABC': '@header' }],
      headers: [{ 'X-ABC': '@header' }],
      jsonRules: [{ '$..id': '@id' }],
      method: 'get',
      passOn: [],
      url: 'http://example.org/@id',
      wait: null,
    };

    const requestWithValues = util.replaceValuesInRequest(request, [
      { '@body': 'BODY TEXT' },
      { '@header': 'YES' },
      { '@id': '123' },
    ]);

    expect(requestWithValues).toEqual({
      body: 'BODY TEXT',
      url: 'http://example.org/123',
      headerRules: [{ 'X-ABC': 'YES' }],
      headers: [{ 'X-ABC': 'YES' }],
      jsonRules: [{ '$..id': '123' }],
      expectedStatusCode: '200',
      method: 'get',
      passOn: [],
      wait: null,
    });
  });

  it('should wait', async () => {
    const start = process.hrtime.bigint();
    const waitTime = 100;
    await util.wait(waitTime);

    const duration = (process.hrtime.bigint() - start) / BigInt(1e6);
    expect(duration).toBeGreaterThanOrEqual(waitTime);
  });

  it('should create xml', async () => {
    const xml = util.resultsToXml('suiteName', [
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

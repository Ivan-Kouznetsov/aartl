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
    });
  });

  it('should wait', async () => {
    const start = process.hrtime.bigint();
    const waitTime = 100;
    await util.wait(waitTime);

    const duration = (process.hrtime.bigint() - start) / BigInt(1e6);
    expect(duration).toBeGreaterThanOrEqual(waitTime - 5);
  });

  it('should pretty print result', () => {
    const text = util.prettyPrintResult(
      {
        testName: 'should save a post and check id',
        passed: true,
        failReasons: [],
        duration: 50561014,
        requestLogs: [
          {
            sent: {
              url: 'http://localhost:3000/posts',
              headers: { 'Content-Length': '25' },
              body: 'Hello world',
              method: 'post',
            },
            received: {
              json: { id: 165, success: true },
              string: '{"id":165,"success":true}',
              headers: {
                'X-Powered-By': 'Express',
                'Content-Type': 'text/html; charset=utf-8',
                'Content-Length': '25',
                ETag: 'W/"19-J+GSUqHQuJXdHBtipmmPTNHvzqY"',
                Date: 'Thu, 06 Aug 2020 01:55:09 GMT',
                Connection: 'keep-alive',
              },
              status: 200,
            },
            duration: 45908175,
          },
        ],
      },
      true
    );

    const receivedLines = text
      .split('\n')
      .filter((l) => l.trim().length > 0)
      .map((l) => l.trim());

    expect(receivedLines).toEqual([
      '+ Passed: should save a post and check id',
      'Duration: 50.56ms',
      'Requests',
      'Request ☎',
      'POST http://localhost:3000/posts ➥',
      'Duration: 45.91ms',
      'Content-Length: 25',
      'Hello•world',
      'Response ⬎',
      'Status: 200',
      'X-Powered-By: Express',
      'Content-Type: text/html; charset=utf-8',
      'Content-Length: 25',
      'ETag: W/"19-J+GSUqHQuJXdHBtipmmPTNHvzqY"',
      'Date: Thu, 06 Aug 2020 01:55:09 GMT',
      'Connection: keep-alive',
      '{"id":165,"success":true}',
    ]);

    expect(text).toBeDefined();
  });

  it('should pretty print result without logs', () => {
    const text = util.prettyPrintResult(
      {
        testName: 'should save a post and check id',
        passed: true,
        failReasons: [],
        duration: 50561014,
        requestLogs: [
          {
            sent: {
              url: 'http://localhost:3000/posts',
              headers: { 'Content-Length': '25' },
              body: 'Hello world',
              method: 'post',
            },
            received: {
              json: { id: 165, success: true },
              string: '{"id":165,"success":true}',
              headers: {
                'X-Powered-By': 'Express',
                'Content-Type': 'text/html; charset=utf-8',
                'Content-Length': '25',
                ETag: 'W/"19-J+GSUqHQuJXdHBtipmmPTNHvzqY"',
                Date: 'Thu, 06 Aug 2020 01:55:09 GMT',
                Connection: 'keep-alive',
              },
              status: 200,
            },
            duration: 45908175,
          },
        ],
      },
      false
    );

    const receivedLines = text
      .split('\n')
      .filter((l) => l.trim().length > 0)
      .map((l) => l.trim());

    expect(receivedLines).toEqual(['+ Passed: should save a post and check id', 'Duration: 50.56ms']);

    expect(text).toBeDefined();
  });

  it('should pretty print result when fail reason provided and body and method are not', () => {
    const text = util.prettyPrintResult(
      {
        testName: 'should save a post and check id',
        passed: false,
        failReasons: ['hello'],
        duration: 50561014,
        requestLogs: [
          {
            sent: {
              url: 'http://localhost:3000/posts',
              headers: { 'Content-Length': '25' },
            },
            received: {
              json: { id: 165, success: true },
              string: '{"id":165,"success":true}',
              headers: {
                'X-Powered-By': 'Express',
                'Content-Type': 'text/html; charset=utf-8',
                'Content-Length': '25',
                ETag: 'W/"19-J+GSUqHQuJXdHBtipmmPTNHvzqY"',
                Date: 'Thu, 06 Aug 2020 01:55:09 GMT',
                Connection: 'keep-alive',
              },
              status: 200,
            },
            duration: 45908175,
          },
        ],
      },
      true
    );

    expect(text).toBeDefined();
  });

  it('should pretty print with colors', () => {
    const redCode = '\u001b[31m';
    const greenCode = '\u001b[32m';
    const resetCode = '\u001b[0m';

    const passed = util.prettyPrintResult(
      {
        testName: 'should save a post and check id',
        passed: true,
        failReasons: ['hello'],
        duration: 50561014,
        requestLogs: [],
      },
      false,
      true
    );

    const failed = util.prettyPrintResult(
      {
        testName: 'should save a post and check id',
        passed: false,
        failReasons: ['hello'],
        duration: 50561014,
        requestLogs: [],
      },
      false,
      true
    );

    expect(passed).toContain(`${greenCode}+ Passed:${resetCode}`);
    expect(failed).toContain(`${redCode}- Failed:${resetCode}`);
  });
});

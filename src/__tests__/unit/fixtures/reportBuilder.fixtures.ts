import { ITestResult } from '../../../interfaces/results';
export const testResults1: ITestResult[] = [
  {
    testName: 'should save a post and check id',
    passed: true,
    failReasons: [],
    duration: 34051628,
    requestLogs: [
      {
        sent: '{"url":"http://localhost:3000/posts","body":"Hello world","headers":{},"method":"post"}',
        received:
          '{"response":{"json":{"id":2,"success":true},"string":"{\\"id\\":2,\\"success\\":true}","headers":{"X-Powered-By":"Express","Content-Type":"text/html; charset=utf-8","Content-Length":"23","ETag":"W/\\"17-V613gjVCgAvtTH59CqJc2yyKjY\\"","Date":"Sun, 02 Aug 2020 18:05:07 GMT","Connection":"close"},"status":200},"error":null}',
        duration: 33351710,
      },
    ],
  },
];

export const testResults2: ITestResult[] = [
  {
    testName: 'should save a post and check id',
    passed: true,
    failReasons: [],
    duration: 34051628,
    requestLogs: [
      {
        sent: '{"url":"http://localhost:3000/posts","body":"Hello world","headers":{},"method":"post"}',
        received:
          '{"response":{"json":{"id":2,"success":true},"string":"{\\"id\\":2,\\"success\\":true}","headers":{"X-Powered-By":"Express","Content-Type":"text/html; charset=utf-8","Content-Length":"23","ETag":"W/\\"17-V613gjVCgAvtTH59CqJc2yyKjY\\"","Date":"Sun, 02 Aug 2020 18:05:07 GMT","Connection":"close"},"status":200},"error":null}',
        duration: 33351710,
      },
    ],
  },
  {
    testName: 'should save a post and check id1',
    passed: false,
    failReasons: [],
    duration: 34051628,
    requestLogs: [
      {
        sent: '{"url":"http://localhost:3000/posts","body":"Hello world","headers":{},"method":"post"}',
        received:
          '{"response":{"json":{"id":2,"success":true},"string":"{\\"id\\":2,\\"success\\":true}","headers":{"X-Powered-By":"Express","Content-Type":"text/html; charset=utf-8","Content-Length":"23","ETag":"W/\\"17-V613gjVCgAvtTH59CqJc2yyKjY\\"","Date":"Sun, 02 Aug 2020 18:05:07 GMT","Connection":"close"},"status":200},"error":null}',
        duration: 33351710,
      },
    ],
  },
];

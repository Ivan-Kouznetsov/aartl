export const rawResults = [
  {
    testName: 'should save a post and check id',
    passed: true,
    failReasons: [],
    duration: 41006809,
    requestLogs: [
      {
        sent: '{"url":"http://localhost:3000/posts","body":"Hello world","headers":{},"method":"post"}',
        received:
          '{"response":{"json":{"id":2,"success":true},"string":"{\\"id\\":2,\\"success\\":true}","headers":{"X-Powered-By":"Express","Content-Type":"text/html; charset=utf-8","Content-Length":"23","ETag":"W/\\"17-V613gjVCgAvtTH5+9CqJc2yyKjY\\"","Date":"Mon, 03 Aug 2020 07:38:09 GMT","Connection":"close"},"status":200},"error":null}',
        duration: 39961497,
      },
    ],
  },
  {
    testName: 'should save a post and make sure id is less than 0',
    passed: false,
    failReasons: ['Expected $..id to be < 0, got 3'],
    duration: 46692228,
    requestLogs: [
      {
        sent: '{"url":"http://localhost:3000/posts","body":"Hello world","headers":{},"method":"post"}',
        received:
          '{"response":{"json":{"id":3,"success":true},"string":"{\\"id\\":3,\\"success\\":true}","headers":{"X-Powered-By":"Express","Content-Type":"text/html; charset=utf-8","Content-Length":"23","ETag":"W/\\"17-MfPeEZSSuqFur/Lkfw3GsEpjdVM\\"","Date":"Mon, 03 Aug 2020 07:38:09 GMT","Connection":"close"},"status":200},"error":null}',
        duration: 46212608,
      },
    ],
  },
  {
    testName: 'should get apost with id of -1',
    passed: false,
    failReasons: ['Expected status code of 200, got: 404'],
    duration: 48126106,
    requestLogs: [
      {
        sent: '{"url":"http://localhost:3000/posts/-1","body":null,"headers":{},"method":"get"}',
        received:
          '{"response":{"json":null,"string":"Not Found","headers":{"X-Powered-By":"Express","Content-Type":"text/html; charset=utf-8","Content-Length":"9","ETag":"W/\\"9-0gXL1ngzMqISxa6S1zx3F4wtLyg\\"","Date":"Mon, 03 Aug 2020 07:38:09 GMT","Connection":"close"},"status":404},"error":null}',
        duration: 47985236,
      },
    ],
  },
  {
    testName: 'should check that post id is 0',
    passed: false,
    failReasons: ['Expected $..id to be 0, got 7'],
    duration: 52274970,
    requestLogs: [
      {
        sent: '{"url":"http://localhost:3000/posts","body":"Hello world","headers":{},"method":"post"}',
        received:
          '{"response":{"json":{"id":7,"success":true},"string":"{\\"id\\":7,\\"success\\":true}","headers":{"X-Powered-By":"Express","Content-Type":"text/html; charset=utf-8","Content-Length":"23","ETag":"W/\\"17-JBgFSXSbwr86Bgw13Hv+g+uSA0A\\"","Date":"Mon, 03 Aug 2020 07:38:09 GMT","Connection":"close"},"status":200},"error":null}',
        duration: 51995999,
      },
    ],
  },
  {
    testName: 'should check that post id is 1 - 5',
    passed: false,
    failReasons: ['Expected $..id to be is any of 1 2 3 4 5, got 0'],
    duration: 54242989,
    requestLogs: [
      {
        sent: '{"url":"http://localhost:3000/posts/0","body":null,"headers":{},"method":"get"}',
        received:
          '{"response":{"json":{"id":0,"text":"0th Post"},"string":"{\\"id\\":0,\\"text\\":\\"0th Post\\"}","headers":{"X-Powered-By":"Express","Content-Type":"text/html; charset=utf-8","Content-Length":"26","ETag":"W/\\"1a-V7YESHccve6KygRv1p/xSDihAMU\\"","Date":"Mon, 03 Aug 2020 07:38:09 GMT","Connection":"close"},"status":200},"error":null}',
        duration: 53817061,
      },
    ],
  },
  {
    testName: 'should check post id 0 - 5',
    passed: true,
    failReasons: [],
    duration: 60471406,
    requestLogs: [
      {
        sent: '{"url":"http://localhost:3000/posts/0","body":null,"headers":{},"method":"get"}',
        received:
          '{"response":{"json":{"id":0,"text":"0th Post"},"string":"{\\"id\\":0,\\"text\\":\\"0th Post\\"}","headers":{"X-Powered-By":"Express","Content-Type":"text/html; charset=utf-8","Content-Length":"26","ETag":"W/\\"1a-V7YESHccve6KygRv1p/xSDihAMU\\"","Date":"Mon, 03 Aug 2020 07:38:09 GMT","Connection":"close"},"status":200},"error":null}',
        duration: 60221494,
      },
    ],
  },
  {
    testName: 'should be null',
    passed: true,
    failReasons: [],
    duration: 65126458,
    requestLogs: [
      {
        sent: '{"url":"http://localhost:3000/null","body":null,"headers":{},"method":"get"}',
        received:
          '{"response":{"json":{"id":null},"string":"{\\"id\\":null}","headers":{"X-Powered-By":"Express","Content-Type":"text/html; charset=utf-8","Content-Length":"11","ETag":"W/\\"b-yHl5CkQW7JVvNHB+r5i4h6FZPGk\\"","Date":"Mon, 03 Aug 2020 07:38:09 GMT","Connection":"close"},"status":200},"error":null}',
        duration: 64024412,
      },
    ],
  },
  {
    testName: 'should have id greater than 50',
    passed: true,
    failReasons: [],
    duration: 66099260,
    requestLogs: [
      {
        sent: '{"url":"http://localhost:3000/random","body":null,"headers":{},"method":"get"}',
        received:
          '{"response":{"json":{"id":64,"text":"0.5794265166"},"string":"{\\"id\\":64,\\"text\\":\\"0.5794265166\\"}","headers":{"X-Powered-By":"Express","Content-Type":"text/html; charset=utf-8","Content-Length":"31","ETag":"W/\\"1f-wY4xlk0/DojrY2SqwG9ofteOjQs\\"","Date":"Mon, 03 Aug 2020 07:38:09 GMT","Connection":"close"},"status":200},"error":null}',
        duration: 65803683,
      },
    ],
  },
  {
    testName: 'should save a post',
    passed: true,
    failReasons: [],
    duration: 98364145,
    requestLogs: [
      {
        sent: '{"url":"http://localhost:3000/posts","body":"Hello world","headers":{},"method":"post"}',
        received:
          '{"response":{"json":{"id":1,"success":true},"string":"{\\"id\\":1,\\"success\\":true}","headers":{"X-Powered-By":"Express","Content-Type":"text/html; charset=utf-8","Content-Length":"23","ETag":"W/\\"17-T7TR06+V9gbucS1XFMf3C3HSYTU\\"","Date":"Mon, 03 Aug 2020 07:38:09 GMT","Connection":"close"},"status":200},"error":null}',
        duration: 54501204,
      },
      {
        sent: '{"url":"http://localhost:3000/posts/1","body":null,"headers":{"Accept-Encoding":"*/*"},"method":"get"}',
        received:
          '{"response":{"json":{"id":1,"text":"Hello world"},"string":"{\\"id\\":1,\\"text\\":\\"Hello world\\"}","headers":{"X-Powered-By":"Express","Content-Type":"text/html; charset=utf-8","Content-Length":"29","ETag":"W/\\"1d-4Ko5yeBtU8K9jLSbqD2x/kEXcO0\\"","Date":"Mon, 03 Aug 2020 07:38:09 GMT","Connection":"close"},"status":200},"error":null}',
        duration: 42383952,
      },
    ],
  },
  {
    testName: 'should save a post and cache it',
    passed: false,
    failReasons: ['Expected header X-Cache to be true, got: nothing'],
    duration: 80022351,
    requestLogs: [
      {
        sent: '{"url":"http://localhost:3000/posts","body":"Hello world","headers":{},"method":"post"}',
        received:
          '{"response":{"json":{"id":4,"success":true},"string":"{\\"id\\":4,\\"success\\":true}","headers":{"X-Powered-By":"Express","Content-Type":"text/html; charset=utf-8","Content-Length":"23","ETag":"W/\\"17-ljr/eMIDVB7SLLdy2nrJfQ2XQ5M\\"","Date":"Mon, 03 Aug 2020 07:38:09 GMT","Connection":"close"},"status":200},"error":null}',
        duration: 48759880,
      },
      {
        sent: '{"url":"http://localhost:3000/posts/4","body":null,"headers":{"Accept-Encoding":"*/*"},"method":"get"}',
        received:
          '{"response":{"json":{"id":4,"text":"Hello world"},"string":"{\\"id\\":4,\\"text\\":\\"Hello world\\"}","headers":{"X-Powered-By":"Express","Content-Type":"text/html; charset=utf-8","Content-Length":"29","ETag":"W/\\"1d-Qb3uALVuDDMKG99RUY/dg4NuzYk\\"","Date":"Mon, 03 Aug 2020 07:38:09 GMT","Connection":"close"},"status":200},"error":null}',
        duration: 30939773,
      },
    ],
  },
  {
    testName: 'should save a post and be powered by Express',
    passed: false,
    failReasons: ['Expected header x-powered-by to be Express, got: nothing'],
    duration: 81179472,
    requestLogs: [
      {
        sent: '{"url":"http://localhost:3000/posts","body":"Hello world","headers":{},"method":"post"}',
        received:
          '{"response":{"json":{"id":5,"success":true},"string":"{\\"id\\":5,\\"success\\":true}","headers":{"X-Powered-By":"Express","Content-Type":"text/html; charset=utf-8","Content-Length":"23","ETag":"W/\\"17-zXv/Sq2uY5CrlgNrxJK7HQwCXlY\\"","Date":"Mon, 03 Aug 2020 07:38:09 GMT","Connection":"close"},"status":200},"error":null}',
        duration: 49432399,
      },
      {
        sent: '{"url":"http://localhost:3000/posts/5","body":null,"headers":{"Accept-Encoding":"*/*"},"method":"get"}',
        received:
          '{"response":{"json":{"id":5,"text":"Hello world"},"string":"{\\"id\\":5,\\"text\\":\\"Hello world\\"}","headers":{"X-Powered-By":"Express","Content-Type":"text/html; charset=utf-8","Content-Length":"29","ETag":"W/\\"1d-8C28sooaDenWdwVN26wIeVWI4Fk\\"","Date":"Mon, 03 Aug 2020 07:38:09 GMT","Connection":"close"},"status":200},"error":null}',
        duration: 31533969,
      },
    ],
  },
  {
    testName: 'should save a post and be powered by XXXX',
    passed: false,
    failReasons: ['Expected header x-powered-by to be XXXX, got: nothing'],
    duration: 81919244,
    requestLogs: [
      {
        sent: '{"url":"http://localhost:3000/posts","body":"Hello world","headers":{},"method":"post"}',
        received:
          '{"response":{"json":{"id":6,"success":true},"string":"{\\"id\\":6,\\"success\\":true}","headers":{"X-Powered-By":"Express","Content-Type":"text/html; charset=utf-8","Content-Length":"23","ETag":"W/\\"17-cVIF2Jsc4cLIpE+ESVWd3qPR+sM\\"","Date":"Mon, 03 Aug 2020 07:38:09 GMT","Connection":"close"},"status":200},"error":null}',
        duration: 50562398,
      },
      {
        sent: '{"url":"http://localhost:3000/posts/6","body":null,"headers":{"Accept-Encoding":"*/*"},"method":"get"}',
        received: '{"response":null,"error":"ECONNREFUSED"}',
        duration: 31163669,
      },
    ],
  },
];

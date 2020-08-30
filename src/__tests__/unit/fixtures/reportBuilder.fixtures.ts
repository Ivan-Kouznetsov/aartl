import { ITestResult } from '../../../interfaces/results';

export const testResults: ITestResult[] = [
  {
    testName: 'should save a post and check id',
    passed: true,
    failReasons: [],
    duration: 50561014,
    requestLogs: [
      {
        sent: { url: 'http://localhost:3000/posts', body: 'Hello world', headers: {}, method: 'post' },
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
  {
    testName: 'should save a post and make sure id is less than 0',
    passed: false,
    failReasons: ['Expected $..id to match < 0, received 166'],
    duration: 55991817,
    requestLogs: [
      {
        sent: { url: 'http://localhost:3000/posts', body: 'Hello world', headers: {}, method: 'post' },
        received: {
          json: { id: 166, success: true },
          string: '{"id":166,"success":true}',
          headers: {
            'X-Powered-By': 'Express',
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Length': '25',
            ETag: 'W/"19-mEMUgSc9i6+LQmY2EA6NFxTxitw"',
            Date: 'Thu, 06 Aug 2020 01:55:09 GMT',
            Connection: 'keep-alive',
          },
          status: 200,
        },
        duration: 55550666,
      },
    ],
  },
  {
    testName: 'should get apost with id of -1',
    passed: false,
    failReasons: ['Cannot check JSON rules because response was not JSON'],
    duration: 57601989,
    requestLogs: [
      {
        sent: { url: 'http://localhost:3000/posts/-1', headers: {}, method: 'get' },
        received: {
          json: null,
          string: 'Not Found',
          headers: {
            'X-Powered-By': 'Express',
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Length': '9',
            ETag: 'W/"9-0gXL1ngzMqISxa6S1zx3F4wtLyg"',
            Date: 'Thu, 06 Aug 2020 01:55:09 GMT',
            Connection: 'keep-alive',
          },
          status: 404,
        },
        duration: 56960189,
      },
    ],
  },
  {
    testName: 'should check that post id is 0',
    passed: false,
    failReasons: ['Expected $..id to match 0, received 170'],
    duration: 59402017,
    requestLogs: [
      {
        sent: { url: 'http://localhost:3000/posts', body: 'Hello world', headers: {}, method: 'post' },
        received: {
          json: { id: 170, success: true },
          string: '{"id":170,"success":true}',
          headers: {
            'X-Powered-By': 'Express',
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Length': '25',
            ETag: 'W/"19-su0/IdDfZsNibulQp/IET7OC8wk"',
            Date: 'Thu, 06 Aug 2020 01:55:09 GMT',
            Connection: 'keep-alive',
          },
          status: 200,
        },
        duration: 59168987,
      },
    ],
  },
  {
    testName: 'should check that post id is 1 - 5',
    passed: false,
    failReasons: ['Expected $..id to match is any of 1 2 3 4 5, received 0'],
    duration: 57960389,
    requestLogs: [
      {
        sent: { url: 'http://localhost:3000/posts/0', headers: {}, method: 'get' },
        received: {
          json: { id: 0, text: '0th Post' },
          string: '{"id":0,"text":"0th Post"}',
          headers: {
            'X-Powered-By': 'Express',
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Length': '26',
            ETag: 'W/"1a-V7YESHccve6KygRv1p/xSDihAMU"',
            Date: 'Thu, 06 Aug 2020 01:55:09 GMT',
            Connection: 'keep-alive',
          },
          status: 200,
        },
        duration: 57736770,
      },
    ],
  },
  {
    testName: 'should check post id 0 - 5',
    passed: true,
    failReasons: [],
    duration: 56747087,
    requestLogs: [
      {
        sent: { url: 'http://localhost:3000/posts/0', headers: {}, method: 'get' },
        received: {
          json: { id: 0, text: '0th Post' },
          string: '{"id":0,"text":"0th Post"}',
          headers: {
            'X-Powered-By': 'Express',
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Length': '26',
            ETag: 'W/"1a-V7YESHccve6KygRv1p/xSDihAMU"',
            Date: 'Thu, 06 Aug 2020 01:55:09 GMT',
            Connection: 'keep-alive',
          },
          status: 200,
        },
        duration: 56582416,
      },
    ],
  },
  {
    testName: 'should be null',
    passed: true,
    failReasons: [],
    duration: 56907052,
    requestLogs: [
      {
        sent: { url: 'http://localhost:3000/null', headers: {}, method: 'get' },
        received: {
          json: { id: null },
          string: '{"id":null}',
          headers: {
            'X-Powered-By': 'Express',
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Length': '11',
            ETag: 'W/"b-yHl5CkQW7JVvNHB+r5i4h6FZPGk"',
            Date: 'Thu, 06 Aug 2020 01:55:09 GMT',
            Connection: 'keep-alive',
          },
          status: 200,
        },
        duration: 56003164,
      },
    ],
  },
  {
    testName: 'should save a post and cache it',
    passed: false,
    failReasons: ['Expected header X-Cache to match true, received: nothing'],
    duration: 67852239,
    requestLogs: [
      {
        sent: { url: 'http://localhost:3000/posts', body: 'Hello world', headers: {}, method: 'post' },
        received: {
          json: { id: 167, success: true },
          string: '{"id":167,"success":true}',
          headers: {
            'X-Powered-By': 'Express',
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Length': '25',
            ETag: 'W/"19-SCboOaSYkYS9U2iZoVQz15ncri8"',
            Date: 'Thu, 06 Aug 2020 01:55:09 GMT',
            Connection: 'keep-alive',
          },
          status: 200,
        },
        duration: 59027011,
      },
      {
        sent: { url: 'http://localhost:3000/posts/167', headers: { 'Accept-Encoding': '*/*' }, method: 'get' },
        received: {
          json: { id: 167, text: 'Hello world' },
          string: '{"id":167,"text":"Hello world"}',
          headers: {
            'X-Powered-By': 'Express',
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Length': '31',
            ETag: 'W/"1f-YUAf12d5kEasbsy6SJqjZErbQ08"',
            Date: 'Thu, 06 Aug 2020 01:55:09 GMT',
            Connection: 'keep-alive',
          },
          status: 200,
        },
        duration: 8220513,
      },
    ],
  },
  {
    testName: 'should save a post and be powered by Express',
    passed: true,
    failReasons: [],
    duration: 68366730,
    requestLogs: [
      {
        sent: { url: 'http://localhost:3000/posts', body: 'Hello world', headers: {}, method: 'post' },
        received: {
          json: { id: 168, success: true },
          string: '{"id":168,"success":true}',
          headers: {
            'X-Powered-By': 'Express',
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Length': '25',
            ETag: 'W/"19-B6jkaIDJM1is6Sf6lzTY03YmLy0"',
            Date: 'Thu, 06 Aug 2020 01:55:09 GMT',
            Connection: 'keep-alive',
          },
          status: 200,
        },
        duration: 60629157,
      },
      {
        sent: { url: 'http://localhost:3000/posts/168', headers: { 'Accept-Encoding': '*/*' }, method: 'get' },
        received: {
          json: { id: 168, text: 'Hello world' },
          string: '{"id":168,"text":"Hello world"}',
          headers: {
            'X-Powered-By': 'Express',
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Length': '31',
            ETag: 'W/"1f-AcQeA/BYy0I6MqGSyWWlV1nWt9Y"',
            Date: 'Thu, 06 Aug 2020 01:55:09 GMT',
            Connection: 'keep-alive',
          },
          status: 200,
        },
        duration: 7223081,
      },
    ],
  },
  {
    testName: 'should save a post and be powered by XXXX',
    passed: false,
    failReasons: ['Expected header X-Powered-By to match XXXX, received: Express'],
    duration: 66961634,
    requestLogs: [
      {
        sent: { url: 'http://localhost:3000/posts', body: 'Hello world', headers: {}, method: 'post' },
        received: {
          json: { id: 169, success: true },
          string: '{"id":169,"success":true}',
          headers: {
            'X-Powered-By': 'Express',
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Length': '25',
            ETag: 'W/"19-WhiGRSmCJjRJUYVwY0bOh0Q8HDk"',
            Date: 'Thu, 06 Aug 2020 01:55:09 GMT',
            Connection: 'keep-alive',
          },
          status: 200,
        },
        duration: 59632555,
      },
      {
        sent: { url: 'http://localhost:3000/posts/169', headers: { 'Accept-Encoding': '*/*' }, method: 'get' },
        received: {
          json: { id: 169, text: 'Hello world' },
          string: '{"id":169,"text":"Hello world"}',
          headers: {
            'X-Powered-By': 'Express',
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Length': '31',
            ETag: 'W/"1f-lP7xwPIH1pzHsGDfKSYNcINi0oY"',
            Date: 'Thu, 06 Aug 2020 01:55:09 GMT',
            Connection: 'keep-alive',
          },
          status: 200,
        },
        duration: 7096603,
      },
    ],
  },
  {
    testName: 'should save a post',
    passed: true,
    failReasons: [],
    duration: 82773316,
    requestLogs: [
      {
        sent: { url: 'http://localhost:3000/posts', body: 'Hello world', headers: {}, method: 'post' },
        received: {
          json: { id: 164, success: true },
          string: '{"id":164,"success":true}',
          headers: {
            'X-Powered-By': 'Express',
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Length': '25',
            ETag: 'W/"19-uUy3gs0KMUtEGF7yoa+KD7oG+EI"',
            Date: 'Thu, 06 Aug 2020 01:55:09 GMT',
            Connection: 'keep-alive',
          },
          status: 200,
        },
        duration: 52313439,
      },
      {
        sent: { url: 'http://localhost:3000/posts/164', headers: { 'Accept-Encoding': '*/*' }, method: 'get' },
        received: {
          json: { id: 164, text: 'Hello world' },
          string: '{"id":164,"text":"Hello world"}',
          headers: {
            'X-Powered-By': 'Express',
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Length': '31',
            ETag: 'W/"1f-vTIxa9tN6/BJ8/BV2zDtBpyWzrw"',
            Date: 'Thu, 06 Aug 2020 01:55:09 GMT',
            Connection: 'keep-alive',
          },
          status: 200,
        },
        duration: 24382015,
      },
      {
        sent: { url: 'http://localhost:3000/posts/164', headers: {}, method: 'DELETE' },
        received: {
          json: null,
          string: 'Ready',
          headers: {
            'X-Powered-By': 'Express',
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Length': '5',
            ETag: 'W/"5-IMfFUi/CjFgXVQ3YK8MnLrapkcc"',
            Date: 'Thu, 06 Aug 2020 01:55:09 GMT',
            Connection: 'keep-alive',
          },
          status: 200,
        },
        duration: 3981980,
      },
    ],
  },
];

export const xmlResult = `<?xml version="1.0" encoding="UTF-8"?>
<testsuite name="example" tests="11" id="0" errors="0" failures="6">
<testcase name="should save a post and check id"
classname="should_save_a_post_and_check_id"
status="passed"
time="0.05"
>

</testcase>
<testcase name="should save a post and make sure id is less than 0"
classname="should_save_a_post_and_make_sure_id_is_less_than_0"
status="failed"
time="0.06"
>
<failure message="Expected $..id to match < 0, received 166"></failure>
</testcase>
<testcase name="should get apost with id of -1"
classname="should_get_apost_with_id_of_-1"
status="failed"
time="0.06"
>
<failure message="Cannot check JSON rules because response was not JSON"></failure>
</testcase>
<testcase name="should check that post id is 0"
classname="should_check_that_post_id_is_0"
status="failed"
time="0.06"
>
<failure message="Expected $..id to match 0, received 170"></failure>
</testcase>
<testcase name="should check that post id is 1 - 5"
classname="should_check_that_post_id_is_1_-_5"
status="failed"
time="0.06"
>
<failure message="Expected $..id to match is any of 1 2 3 4 5, received 0"></failure>
</testcase>
<testcase name="should check post id 0 - 5"
classname="should_check_post_id_0_-_5"
status="passed"
time="0.06"
>

</testcase>
<testcase name="should be null"
classname="should_be_null"
status="passed"
time="0.06"
>

</testcase>
<testcase name="should save a post and cache it"
classname="should_save_a_post_and_cache_it"
status="failed"
time="0.07"
>
<failure message="Expected header X-Cache to match true, received: nothing"></failure>
</testcase>
<testcase name="should save a post and be powered by Express"
classname="should_save_a_post_and_be_powered_by_Express"
status="passed"
time="0.07"
>

</testcase>
<testcase name="should save a post and be powered by XXXX"
classname="should_save_a_post_and_be_powered_by_XXXX"
status="failed"
time="0.07"
>
<failure message="Expected header X-Powered-By to match XXXX, received: Express"></failure>
</testcase>
<testcase name="should save a post"
classname="should_save_a_post"
status="passed"
time="0.08"
>

</testcase>
</testsuite>`;

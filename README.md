# Agnostic API Reliability Testing Language

Agnostic API Reliability Testing Language (AARTL) is a platform-agnostic declarative domain-specific language for testing HTTP servers using the server’s API, it is implemented in TypeScript as a **dependency-free** Node.js application and can run on all major operating systems (Windows, macOS, Linux-based OSs and FreeBSD), it can also run on GraalVM, and can test servers irrespective of the platform used by the server. An AARTL test is a human-readable declaration of the expected response from a server endpoint given one or more requests.

## Design goals

1. To facilitate efficient testing of HTTP servers
2. To offer data matching rules on par with procedural test frameworks
3. To avoid procedural code in tests (as much as is practicable)
4. To avoid unobvious syntax such as semi colons, brackets, braces, and significant whitespace
5. To be easy to read for a person well-versed in HTTP and JSON irrespective of whether the person is a programmer

## Overview

    Test that it should save a post
      Using values
        @postText: Hello world
      After HTTP request
        method: post
        url: http://localhost:3000/posts
        body: @postText
        Pass on "$..id" as _id
      Expect HTTP request
        headers:
          "Accept-Encoding":"*/*"
        method: get
        url: http://localhost:3000/posts/_id
      To respond with status code 200 /** OK **/
      To match JSON rules
        "$..id": _id
        "$..text": @postText

A test consists of a name, optional constant values, optional “After” blocks, and a required "Expect" block. JSON data is referred to within AARTL using JSON paths. For more information about the JSON path standard you may refer to: [https://support.smartbear.com/alertsite/docs/monitors/api/endpoint/jsonpath.html](https://support.smartbear.com/alertsite/docs/monitors/api/endpoint/jsonpath.html)

An After block consists of:

- The data needed to make a request
- Optional statements about how to handle transitioning to the next request.

Data needed for an HTTP request is:

- headers **_Example_**: 'Accept-Encoding': '\*/\*'
- method **_Example_**: post
- url **_Example_**: http://example.org/things/123
- body **_Example_**: Hello World

Optional statements about how to handle transitioning to the next request are:

- Pass on – the Pass on statement can be used to pass on a value from a
  response to the next block. **_Example_**: Pass on “$..id” as _id, this
   means that we can refer to the id returned by this request in the
   next request using the _id symbol. The $..id is a JSON path.
- Wait – the Wait statement indicates that there will be a waiting
  period before the next request starts

An Expect block consists of:

- Data needed to make a request (same as an After block)
- Expectations for what the response should be, there are three types
  of expectations: - JSON data expectations - Header expectations - Status code expectation

JSON data expectations consist of:

- A JSON path and either a literal value or a rule.

The possible rules are (_x, y, x in the rules refer to parameters_):
| Rule | What it means |
|--|--|
| is a number | checks if every value that matches the JSON path is a number |
| > x | checks if every value that matches the JSON path is a number greater than x |
|>= x| checks if every value that matches the JSON path is a number greater than or equal to x|
|< x| checks if every value that matches the JSON path is a number less than x|
|<= x| checks if every value that matches the JSON path is a number less than or equal to x|
|is text| checks if every value that matches the JSON path is text of length 1 or longer|
|is text containing x| checks if every value that matches the JSON path is text that contains x|
|is text not containing x| checks if every value that matches the JSON path is text that does not contain x|
|is any of x y z| checks if every value that matches the JSON path is one of the values
|is not x| checks if every value that matches the JSON path is not x|
|matches x| checks if every value that matches the JSON path matches the regular expression x|
|count = x| checks if the number of values that matches the JSON path is x|
|count > x| checks if the number of values that matches the JSON path is greater than x|
|count >= x| checks if the number of values that matches the JSON path is greater than or equal to x|
|count > x| checks if the number of values that matches the JSON path is greater than x|
|count >= x| checks if the number of values that matches the JSON path is greater than or equal to x|
|count < x| checks if the number of values that matches the JSON path is less than x|
|count <= x| checks if the number of values that matches the JSON path is less than or equal to x|
|each has a x| checks if each of values that matches the JSON path is an object with a property called x|

## Comments

Comments can be written within `/** **/` and are ignored. Example:

    /** This is a comment **/

## Case sensitivity

The syntax is case sensitive, statements start with an upper-case letter, data items start with a lowercase letter.

## Benefits

- Few opportunities for writing bugs
- [Runs fast](https://github.com/Ivan-Kouznetsov/aartl/tree/benchmarks)
- Detailed logging
- Cross-platform
- Flexible matching rules
- Good test coverage

| File                      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s |
| ------------------------- | ------- | -------- | ------- | ------- | ----------------- |
| All files                 | 100     | 100      | 100     | 100     |
| &nbsp;parser              | 100     | 100      | 100     | 100     |
| &nbsp;&nbsp;parser.ts     | 100     | 100      | 100     | 100     |
| &nbsp;&nbsp;ruleParser.ts | 100     | 100      | 100     | 100     |
| &nbsp;&nbsp;util.ts       | 100     | 100      | 100     | 100     |
| rules                     | 100     | 100      | 100     | 100     |
| &nbsp;&nbsp;matchers.ts   | 100     | 100      | 100     | 100     |
| runner                    | 100     | 100      | 100     | 100     |
| &nbsp;&nbsp;runner.ts     | 100     | 100      | 100     | 100     |
| &nbsp;&nbsp;util.ts       | 100     | 100      | 100     | 100     |
| validator                 | 100     | 100      | 100     | 100     |
| &nbsp;&nbsp;validator.ts  | 100     | 100      | 100     | 100     |

## Setup and Use

1.  Ensure that git is installed
2.  Ensure that Node.js is installed
3.  Open a terminal

In the terminal:

    git clone https://github.com/Ivan-Kouznetsov/aartl.git
    cd aartl
    npm ci
    npm run build

And now you can run AARTL like so

    node dist/aartl.js -f path/to/file/with/tests.aartl

### CLI options

| Option           | What it means                                      |
| ---------------- | -------------------------------------------------- |
| \-\-hello        | Print the name of the program before running tests |
| \-\-xml          | Output results as JUnit XML                        |
| \-\-novalidation | Don't validate test file                           |
| \-\-r            | Randomize test order                               |
| \-n NUMBER       | Rerun the tests a number of times                  |

## Editor Support

A work in progress VSCode extension is available at: https://github.com/Ivan-Kouznetsov/aartl-vscode-extension

![VSCode Screenshot](https://raw.githubusercontent.com/Ivan-Kouznetsov/aartl-vscode-extension/master/vscodeScreenshot.png)

## Output

### JSON Example

    $ node dist/aartl.js -f example.aartl
    {
      testName: 'should save a post',
      passed: true,
      failReasons: [],
      duration: 1065204745,
      requestLogs: [
        {
          sent: '{"url":"http://localhost:3000/posts","body":"Hello world","headers":[],"method":"post"}',
          received: '{"url":"http://localhost:3000/posts","status":200,"statusText":"OK","timeout":0,"headers":{"x-powered-by":["Express"],"content-type":["text/html; charset=utf-8"],"content-length":["23"],"etag":["W/\\"17-T7TR06+V9gbucS1XFMf3C3HSYTU\\""],"date":["Thu, 30 Jul 2020 02:47:01 GMT"],"connection":["close"]},"body":"{\\"id\\":1,\\"success\\":true}"}',
          duration: 49788834
        },
        {
          sent: '{"url":"http://localhost:3000/posts/1","body":null,"headers":[["Accept-Encoding","*/*"]],"method":"get"}',
          received: '{"url":"http://localhost:3000/posts/1","status":200,"statusText":"OK","timeout":0,"headers":{"x-powered-by":["Express"],"content-type":["text/html; charset=utf-8"],"content-length":["29"],"etag":["W/\\"1d-4Ko5yeBtU8K9jLSbqD2x/kEXcO0\\""],"date":["Thu, 30 Jul 2020 02:47:02 GMT"],"connection":["close"]},"body":"{\\"id\\":1,\\"text\\":\\"Hello world\\"}"}',
          duration: 4943707
        }
      ]
    }
    {
      testName: 'should save a post and check id',
      passed: true,
      failReasons: [],
      duration: 5369636,
      requestLogs: [
        {
          sent: '{"url":"http://localhost:3000/posts","body":"Hello world","headers":[],"method":"post"}',
          received: '{"url":"http://localhost:3000/posts","status":200,"statusText":"OK","timeout":0,"headers":{"x-powered-by":["Express"],"content-type":["text/html; charset=utf-8"],"content-length":["23"],"etag":["W/\\"17-V613gjVCgAvtTH5+9CqJc2yyKjY\\""],"date":["Thu, 30 Jul 2020 02:47:02 GMT"],"connection":["close"]},"body":"{\\"id\\":2,\\"success\\":true}"}',
          duration: 3749778
        }
      ]
    }
    {
      testName: 'should save a post and make sure id is less than 0',
      passed: false,
      failReasons: [ 'Expected $..id to be < 0, got 3' ],
      duration: 6951579,
      requestLogs: [
        {
          sent: '{"url":"http://localhost:3000/posts","body":"Hello world","headers":[],"method":"post"}',
          received: '{"url":"http://localhost:3000/posts","status":200,"statusText":"OK","timeout":0,"headers":{"x-powered-by":["Express"],"content-type":["text/html; charset=utf-8"],"content-length":["23"],"etag":["W/\\"17-MfPeEZSSuqFur/Lkfw3GsEpjdVM\\""],"date":["Thu, 30 Jul 2020 02:47:02 GMT"],"connection":["close"]},"body":"{\\"id\\":3,\\"success\\":true}"}',
          duration: 5522129
        }
      ]
    }
    {
      testName: 'should get apost with id of -1',
      passed: false,
      failReasons: [
        'Expected status code of 200, got: 404',
        'invalid json response body at http://localhost:3000/posts/-1 reason: Unexpected token N in JSON at position 0'
      ],
      duration: 5722778,
      requestLogs: [
        {
          sent: '{"url":"http://localhost:3000/posts/-1","body":null,"headers":[],"method":"get"}',
          received: '{"url":"http://localhost:3000/posts/-1","status":404,"statusText":"Not Found","timeout":0,"headers":{"x-powered-by":["Express"],"content-type":["text/html; charset=utf-8"],"content-length":["9"],"etag":["W/\\"9-0gXL1ngzMqISxa6S1zx3F4wtLyg\\""],"date":["Thu, 30 Jul 2020 02:47:02 GMT"],"connection":["close"]},"body":"Not Found"}',
          duration: 3866016
        }
      ]
    }
    {
      testName: 'should save a post and cache it',
      passed: true,
      failReasons: [],
      duration: 1008741642,
      requestLogs: [
        {
          sent: '{"url":"http://localhost:3000/posts","body":"Hello world","headers":[],"method":"post"}',
          received: '{"url":"http://localhost:3000/posts","status":200,"statusText":"OK","timeout":0,"headers":{"x-powered-by":["Express"],"content-type":["text/html; charset=utf-8"],"content-length":["23"],"etag":["W/\\"17-ljr/eMIDVB7SLLdy2nrJfQ2XQ5M\\""],"date":["Thu, 30 Jul 2020 02:47:02 GMT"],"connection":["close"]},"body":"{\\"id\\":4,\\"success\\":true}"}',
          duration: 3992218
        },
        {
          sent: '{"url":"http://localhost:3000/posts/4","body":null,"headers":[["Accept-Encoding","*/*"]],"method":"get"}',
          received: '{"url":"http://localhost:3000/posts/4","status":200,"statusText":"OK","timeout":0,"headers":{"x-powered-by":["Express"],"content-type":["text/html; charset=utf-8"],"content-length":["29"],"etag":["W/\\"1d-Qb3uALVuDDMKG99RUY/dg4NuzYk\\""],"date":["Thu, 30 Jul 2020 02:47:03 GMT"],"connection":["close"]},"body":"{\\"id\\":4,\\"text\\":\\"Hello world\\"}"}',
          duration: 2944139
        }
      ]
    }
    {
      testName: 'should save a post and be powered by Express',
      passed: true,
      failReasons: [],
      duration: 1007823916,
      requestLogs: [
        {
          sent: '{"url":"http://localhost:3000/posts","body":"Hello world","headers":[],"method":"post"}',
          received: '{"url":"http://localhost:3000/posts","status":200,"statusText":"OK","timeout":0,"headers":{"x-powered-by":["Express"],"content-type":["text/html; charset=utf-8"],"content-length":["23"],"etag":["W/\\"17-zXv/Sq2uY5CrlgNrxJK7HQwCXlY\\""],"date":["Thu, 30 Jul 2020 02:47:03 GMT"],"connection":["close"]},"body":"{\\"id\\":5,\\"success\\":true}"}',
          duration: 3835850
        },
        {
          sent: '{"url":"http://localhost:3000/posts/5","body":null,"headers":[["Accept-Encoding","*/*"]],"method":"get"}',
          received: '{"url":"http://localhost:3000/posts/5","status":200,"statusText":"OK","timeout":0,"headers":{"x-powered-by":["Express"],"content-type":["text/html; charset=utf-8"],"content-length":["29"],"etag":["W/\\"1d-8C28sooaDenWdwVN26wIeVWI4Fk\\""],"date":["Thu, 30 Jul 2020 02:47:04 GMT"],"connection":["close"]},"body":"{\\"id\\":5,\\"text\\":\\"Hello world\\"}"}',
          duration: 2566919
        }
      ]
    }
    {
      testName: 'should save a post and be powered by XXXX',
      passed: true,
      failReasons: [],
      duration: 1009215173,
      requestLogs: [
        {
          sent: '{"url":"http://localhost:3000/posts","body":"Hello world","headers":[],"method":"post"}',
          received: '{"url":"http://localhost:3000/posts","status":200,"statusText":"OK","timeout":0,"headers":{"x-powered-by":["Express"],"content-type":["text/html; charset=utf-8"],"content-length":["23"],"etag":["W/\\"17-cVIF2Jsc4cLIpE+ESVWd3qPR+sM\\""],"date":["Thu, 30 Jul 2020 02:47:04 GMT"],"connection":["close"]},"body":"{\\"id\\":6,\\"success\\":true}"}',
          duration: 4255136
        },
        {
          sent: '{"url":"http://localhost:3000/posts/6","body":null,"headers":[["Accept-Encoding","*/*"]],"method":"get"}',
          received: '{"url":"http://localhost:3000/posts/6","status":200,"statusText":"OK","timeout":0,"headers":{"x-powered-by":["Express"],"content-type":["text/html; charset=utf-8"],"content-length":["29"],"etag":["W/\\"1d-tHhSnxiuD4bH0t3nc6az5XpOQKY\\""],"date":["Thu, 30 Jul 2020 02:47:05 GMT"],"connection":["close"]},"body":"{\\"id\\":6,\\"text\\":\\"Hello world\\"}"}',
          duration: 2888234
        }
      ]
    }
    {
      testName: 'should check that post id is 0',
      passed: false,
      failReasons: [ 'Expected $..id to be 0, got 7' ],
      duration: 4956715,
      requestLogs: [
        {
          sent: '{"url":"http://localhost:3000/posts","body":"Hello world","headers":[],"method":"post"}',
          received: '{"url":"http://localhost:3000/posts","status":200,"statusText":"OK","timeout":0,"headers":{"x-powered-by":["Express"],"content-type":["text/html; charset=utf-8"],"content-length":["23"],"etag":["W/\\"17-JBgFSXSbwr86Bgw13Hv+g+uSA0A\\""],"date":["Thu, 30 Jul 2020 02:47:05 GMT"],"connection":["close"]},"body":"{\\"id\\":7,\\"success\\":true}"}',
          duration: 3553005
        }
      ]
    }
    {
      testName: 'should check that post id is 1 - 5',
      passed: false,
      failReasons: [ 'Expected $..id to be is any of 1 2 3 4 5, got 0' ],
      duration: 3674500,
      requestLogs: [
        {
          sent: '{"url":"http://localhost:3000/posts/0","body":null,"headers":[],"method":"get"}',
          received: '{"url":"http://localhost:3000/posts/0","status":200,"statusText":"OK","timeout":0,"headers":{"x-powered-by":["Express"],"content-type":["text/html; charset=utf-8"],"content-length":["26"],"etag":["W/\\"1a-V7YESHccve6KygRv1p/xSDihAMU\\""],"date":["Thu, 30 Jul 2020 02:47:05 GMT"],"connection":["close"]},"body":"{\\"id\\":0,\\"text\\":\\"0th Post\\"}"}',
          duration: 2656035
        }
      ]
    }
    {
      testName: 'should check post id 0 - 5',
      passed: true,
      failReasons: [],
      duration: 4754129,
      requestLogs: [
        {
          sent: '{"url":"http://localhost:3000/posts/0","body":null,"headers":[],"method":"get"}',
          received: '{"url":"http://localhost:3000/posts/0","status":200,"statusText":"OK","timeout":0,"headers":{"x-powered-by":["Express"],"content-type":["text/html; charset=utf-8"],"content-length":["26"],"etag":["W/\\"1a-V7YESHccve6KygRv1p/xSDihAMU\\""],"date":["Thu, 30 Jul 2020 02:47:05 GMT"],"connection":["close"]},"body":"{\\"id\\":0,\\"text\\":\\"0th Post\\"}"}',
          duration: 3045432
        }
      ]
    }
    {
      testName: 'should be null',
      passed: true,
      failReasons: [],
      duration: 3934099,
      requestLogs: [
        {
          sent: '{"url":"http://localhost:3000/null","body":null,"headers":[],"method":"get"}',
          received: '{"url":"http://localhost:3000/null","status":200,"statusText":"OK","timeout":0,"headers":{"x-powered-by":["Express"],"content-type":["text/html; charset=utf-8"],"content-length":["11"],"etag":["W/\\"b-yHl5CkQW7JVvNHB+r5i4h6FZPGk\\""],"date":["Thu, 30 Jul 2020 02:47:05 GMT"],"connection":["close"]},"body":"{\\"id\\":null}"}',
          duration: 3163884
        }
      ]
    }

Durations are in nanoseconds.

### XML Example

    $ node dist/aartl.js -f example.aartl --xml
    <?xml version="1.0" encoding="UTF-8"?>
    <testsuite name="example" tests="11" id="0" errors="0" failures="4">
    <testcase name="should save a post"
    classname="should_save_a_post"
    status="passed"
    time="1.04"
    >

    </testcase>
    <testcase name="should save a post and check id"
    classname="should_save_a_post_and_check_id"
    status="passed"
    time="0.01"
    >

    </testcase>
    <testcase name="should save a post and make sure id is less than 0"
    classname="should_save_a_post_and_make_sure_id_is_less_than_0"
    status="failed"
    time="0.01"
    >
    <failure message="Expected $..id to be < 0, got 10"></failure>
    </testcase>
    <testcase name="should get apost with id of -1"
    classname="should_get_apost_with_id_of_-1"
    status="failed"
    time="0.01"
    >
    <failure message="Expected status code of 200, got: 404"></failure><failure message="invalid json response body at http://localhost:3000/posts/-1 reason: Unexpected token N in JSON at position 0"></failure>
    </testcase>
    <testcase name="should save a post and cache it"
    classname="should_save_a_post_and_cache_it"
    status="passed"
    time="1.01"
    >

    </testcase>
    <testcase name="should save a post and be powered by Express"
    classname="should_save_a_post_and_be_powered_by_Express"
    status="passed"
    time="1.01"
    >

    </testcase>
    <testcase name="should save a post and be powered by XXXX"
    classname="should_save_a_post_and_be_powered_by_XXXX"
    status="passed"
    time="1.01"
    >

    </testcase>
    <testcase name="should check that post id is 0"
    classname="should_check_that_post_id_is_0"
    status="failed"
    time="0.00"
    >
    <failure message="Expected $..id to be 0, got 14"></failure>
    </testcase>
    <testcase name="should check that post id is 1 - 5"
    classname="should_check_that_post_id_is_1_-_5"
    status="failed"
    time="0.00"
    >
    <failure message="Expected $..id to be is any of 1 2 3 4 5, got 0"></failure>
    </testcase>
    <testcase name="should check post id 0 - 5"
    classname="should_check_post_id_0_-_5"
    status="passed"
    time="0.00"
    >

    </testcase>
    <testcase name="should be null"
    classname="should_be_null"
    status="passed"
    time="0.00"
    >

    </testcase>
    </testsuite>

In XML output the times are in seconds.

## Licence

MIT

# Agnostic API Reliability Testing Language

Agnostic API Reliability Testing Language (AARTL) is a platform-agnostic declarative domain-specific language for testing HTTP servers using the server’s API, it is implemented in TypeScript and Node.js and can run on many popular platforms (such as Windows, macOS, Linux, and BSD) and can test servers irrespective of the platform used by the server. An AARTL test is a human-readable declaration of the expected response from a server endpoint given one or more requests.

## Design goals

1. To facilitate efficient testing of HTTP servers
2. To offer data matching rules on par with procedural test frameworks
3. To avoid procedural code such as loops
4. To avoid unobvious syntax such as semi colons, brackets, braces, and significant white space
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
      Wait 1 second
      Expect HTTP request
        headers:
          "Accept-Encoding":"*/*"
        method: get
        url: http://localhost:3000/posts/_id
      To respond with status code 200 /** OK **/
      To match JSON rules
        "$..id": _id
        "$..text": @postText

A test consists of a name, optional constant values, optional “After” blocks, a required "Expect" block. JSON data is referred to within AARTL using JSON paths. For more information about the JSON path standard you may refer to: [https://support.smartbear.com/alertsite/docs/monitors/api/endpoint/jsonpath.html](https://support.smartbear.com/alertsite/docs/monitors/api/endpoint/jsonpath.html)

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

- Runs fast (try to see for yourself)
- Detailed Logging
- Cross platform
- Flexible matching rules
- ESLint compliant (No recommended ESLint rules disabled)
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

1.  Download the source code
2.  Ensure that Node.js is installed
3.  Open a terminal

In the terminal:

    cd aartl
    npm install
    npm run build

And now you can run AARTL like so

    node dist/runFile.js -f C:\path\to\file\with\tests

### CLI options

| Option           | What it means                                      |
| ---------------- | -------------------------------------------------- |
| \-\-hello        | Print the name of the program before running tests |
| \-\-xml          | Output results as JUnit XML                        |
| \-\-novalidation | Don't validate test file                           |

## Output

### JSON Example

        C:\Users\Ivan\source\repos\aartl>node dist/runFile.js -f src\__tests__\e2e\fixtures\localhostTests.fixtures.ts
    { testName: 'should save a post',
      passed: true,
      failReasons: [],
      duration: 1054661602,
      requestLogs:
       [ { sent:
            '{"url":"http://localhost:3000/posts","body":"Hello world","headers":[],"method":"post"}',
           received:
            '{"url":"http://localhost:3000/posts","status":200,"statusText":"OK","timeout":0,"headers":{"x-powered-by":["Express"],"content-type":["text/html; charset=utf-8"],"content-length":["24"],"etag":["W/\\"18-gYADgj6/hK44mx4n4TgWiGlmEgw\\""],"date":["Fri, 24 Jul 2020 01:48:27 GMT"],"connection":["close"]},"body":null}',
           duration: 29488393 },
         { sent:
            '{"url":"http://localhost:3000/posts/39","body":null,"headers":[["Accept-Encoding","*/*"]],"method":"get"}',
           received:
            '{"url":"http://localhost:3000/posts/39","status":200,"statusText":"OK","timeout":0,"headers":{"x-powered-by":["Express"],"content-type":["text/html; charset=utf-8"],"content-length":["30"],"etag":["W/\\"1e-+MERKujWdU3zHwqHSA74SD3ZnUA\\""],"date":["Fri, 24 Jul 2020 01:48:29 GMT"],"connection":["close"]},"body":null}',
           duration: 5951370 } ] }
    { testName: 'should save a post and check id',
      passed: true,
      failReasons: [],
      duration: 8444667,
      requestLogs:
       [ { sent:
            '{"url":"http://localhost:3000/posts","body":"Hello world","headers":[],"method":"post"}',
           received:
            '{"url":"http://localhost:3000/posts","status":200,"statusText":"OK","timeout":0,"headers":{"x-powered-by":["Express"],"content-type":["text/html; charset=utf-8"],"content-length":["24"],"etag":["W/\\"18-NDueK83FTIAiAzJVlEo6QbGn0zc\\""],"date":["Fri, 24 Jul 2020 01:48:29 GMT"],"connection":["close"]},"body":null}',
           duration: 6558297 } ] }
    { testName: 'should save a post and make sure id is less than 0',
      passed: false,
      failReasons: [ '< 0: Did not expect $..id to be 41' ],
      duration: 3316926,
      requestLogs:
       [ { sent:
            '{"url":"http://localhost:3000/posts","body":"Hello world","headers":[],"method":"post"}',
           received:
            '{"url":"http://localhost:3000/posts","status":200,"statusText":"OK","timeout":0,"headers":{"x-powered-by":["Express"],"content-type":["text/html; charset=utf-8"],"content-length":["24"],"etag":["W/\\"18-/rT+JZ9UDCbHuGuB105I2SsovC0\\""],"date":["Fri, 24 Jul 2020 01:48:29 GMT"],"connection":["close"]},"body":null}',
           duration: 2723006 } ] }
    { testName: 'should get apost with id of -1',
      passed: false,
      failReasons:
       [ 'Expected status code of 200, got: 404',
         'invalid json response body at http://localhost:3000/posts/-1 reason: Unexpected token N in JSON at position 0' ],
      duration: 3638240,
      requestLogs:
       [ { sent:
            '{"url":"http://localhost:3000/posts/-1","body":null,"headers":[],"method":"get"}',
           received:
            '{"url":"http://localhost:3000/posts/-1","status":404,"statusText":"Not Found","timeout":0,"headers":{"x-powered-by":["Express"],"content-type":["text/html; charset=utf-8"],"content-length":["9"],"etag":["W/\\"9-0gXL1ngzMqISxa6S1zx3F4wtLyg\\""],"date":["Fri, 24 Jul 2020 01:48:29 GMT"],"connection":["close"]},"body":null}',
           duration: 2244218 } ] }
    { testName: 'should save a post and cache it',
      passed: true,
      failReasons: [],
      duration: 1006820108,
      requestLogs:
       [ { sent:
            '{"url":"http://localhost:3000/posts","body":"Hello world","headers":[],"method":"post"}',
           received:
            '{"url":"http://localhost:3000/posts","status":200,"statusText":"OK","timeout":0,"headers":{"x-powered-by":["Express"],"content-type":["text/html; charset=utf-8"],"content-length":["24"],"etag":["W/\\"18-+5YEqQ0R11sNRfwD0BgHi1evvWk\\""],"date":["Fri, 24 Jul 2020 01:48:29 GMT"],"connection":["close"]},"body":null}',
           duration: 2854189 },
         { sent:
            '{"url":"http://localhost:3000/posts/42","body":null,"headers":[["Accept-Encoding","*/*"]],"method":"get"}',
           received:
            '{"url":"http://localhost:3000/posts/42","status":200,"statusText":"OK","timeout":0,"headers":{"x-powered-by":["Express"],"content-type":["text/html; charset=utf-8"],"content-length":["30"],"etag":["W/\\"1e-FjyKOwyOh1yBnQUTyZFsJIkw3Q8\\""],"date":["Fri, 24 Jul 2020 01:48:30 GMT"],"connection":["close"]},"body":null}',
           duration: 2234532 } ] }
    { testName: 'should save a post and be powered by Express',
      passed: true,
      failReasons: [],
      duration: 1008842367,
      requestLogs:
       [ { sent:
            '{"url":"http://localhost:3000/posts","body":"Hello world","headers":[],"method":"post"}',
           received:
            '{"url":"http://localhost:3000/posts","status":200,"statusText":"OK","timeout":0,"headers":{"x-powered-by":["Express"],"content-type":["text/html; charset=utf-8"],"content-length":["24"],"etag":["W/\\"18-Nzkkf+gRkTwVxPYTu/ghigYOsMk\\""],"date":["Fri, 24 Jul 2020 01:48:30 GMT"],"connection":["close"]},"body":null}',
           duration: 2866919 },
         { sent:
            '{"url":"http://localhost:3000/posts/43","body":null,"headers":[["Accept-Encoding","*/*"]],"method":"get"}',
           received:
            '{"url":"http://localhost:3000/posts/43","status":200,"statusText":"OK","timeout":0,"headers":{"x-powered-by":["Express"],"content-type":["text/html; charset=utf-8"],"content-length":["30"],"etag":["W/\\"1e-XMMOkQgX6sbsFhxzE57lhEktOXg\\""],"date":["Fri, 24 Jul 2020 01:48:31 GMT"],"connection":["close"]},"body":null}',
           duration: 4766576 } ] }
    { testName: 'should save a post and be powered by XXXX',
      passed: true,
      failReasons: [],
      duration: 1008039220,
      requestLogs:
       [ { sent:
            '{"url":"http://localhost:3000/posts","body":"Hello world","headers":[],"method":"post"}',
           received:
            '{"url":"http://localhost:3000/posts","status":200,"statusText":"OK","timeout":0,"headers":{"x-powered-by":["Express"],"content-type":["text/html; charset=utf-8"],"content-length":["24"],"etag":["W/\\"18-3fkfcFlLnPf0CECnNzHdr/kSfTk\\""],"date":["Fri, 24 Jul 2020 01:48:31 GMT"],"connection":["close"]},"body":null}',
           duration: 5482267 },
         { sent:
            '{"url":"http://localhost:3000/posts/44","body":null,"headers":[["Accept-Encoding","*/*"]],"method":"get"}',
           received:
            '{"url":"http://localhost:3000/posts/44","status":200,"statusText":"OK","timeout":0,"headers":{"x-powered-by":["Express"],"content-type":["text/html; charset=utf-8"],"content-length":["30"],"etag":["W/\\"1e-dCDqChk7ixPm2kFI+5VUBdB3eXo\\""],"date":["Fri, 24 Jul 2020 01:48:32 GMT"],"connection":["close"]},"body":null}',
           duration: 2196892 } ] }
    { testName: 'should check that post id is 0',
      passed: false,
      failReasons: [ '0: Did not expect $..id to be 45' ],
      duration: 3149211,
      requestLogs:
       [ { sent:
            '{"url":"http://localhost:3000/posts","body":"Hello world","headers":[],"method":"post"}',
           received:
            '{"url":"http://localhost:3000/posts","status":200,"statusText":"OK","timeout":0,"headers":{"x-powered-by":["Express"],"content-type":["text/html; charset=utf-8"],"content-length":["24"],"etag":["W/\\"18-/6Okt6YsK6JZwXu+gPm3aswOJwY\\""],"date":["Fri, 24 Jul 2020 01:48:32 GMT"],"connection":["close"]},"body":null}',
           duration: 2640809 } ] }
    { testName: 'should check that post id is 1 - 5',
      passed: false,
      failReasons: [ 'is any of 1 2 3 4 5: Did not expect $..id to be 0' ],
      duration: 2628632,
      requestLogs:
       [ { sent:
            '{"url":"http://localhost:3000/posts/0","body":null,"headers":[],"method":"get"}',
           received:
            '{"url":"http://localhost:3000/posts/0","status":200,"statusText":"OK","timeout":0,"headers":{"x-powered-by":["Express"],"content-type":["text/html; charset=utf-8"],"content-length":["26"],"etag":["W/\\"1a-V7YESHccve6KygRv1p/xSDihAMU\\""],"date":["Fri, 24 Jul 2020 01:48:32 GMT"],"connection":["close"]},"body":null}',
           duration: 2001226 } ] }
    { testName: 'should check post id 0 - 5',
      passed: true,
      failReasons: [],
      duration: 4357253,
      requestLogs:
       [ { sent:
            '{"url":"http://localhost:3000/posts/0","body":null,"headers":[],"method":"get"}',
           received:
            '{"url":"http://localhost:3000/posts/0","status":200,"statusText":"OK","timeout":0,"headers":{"x-powered-by":["Express"],"content-type":["text/html; charset=utf-8"],"content-length":["26"],"etag":["W/\\"1a-V7YESHccve6KygRv1p/xSDihAMU\\""],"date":["Fri, 24 Jul 2020 01:48:32 GMT"],"connection":["close"]},"body":null}',
           duration: 3886490 } ] }

Durations are in nanoseconds.

### Xml

    C:\Users\Ivan\source\repos\aartl>node dist/runFile.js -f src\__tests__\e2e\fixtures\localhostTests.fixtures.ts --xml
    <?xml version="1.0" encoding="UTF-8"?>
    <testsuite name="localhostTests.fixtures" tests="10" id="0" errors="0" failures="4">
    <testcase name="should save a post"
    classname="should_save_a_post"
    status="passed"
    time="1.04"
    >

    </testcase>
    <testcase name="should save a post and check id"
    classname="should_save_a_post_and_check_id"
    status="passed"
    time="0.00"
    >

    </testcase>
    <testcase name="should save a post and make sure id is less than 0"
    classname="should_save_a_post_and_make_sure_id_is_less_than_0"
    status="failed"
    time="0.00"
    >
    <failure message="< 0: Did not expect $..id to be 48"></failure>
    </testcase>
    <testcase name="should get apost with id of -1"
    classname="should_get_apost_with_id_of_-1"
    status="failed"
    time="0.00"
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
    time="0.01"
    >
    <failure message="0: Did not expect $..id to be 52"></failure>
    </testcase>
    <testcase name="should check that post id is 1 - 5"
    classname="should_check_that_post_id_is_1_-_5"
    status="failed"
    time="0.00"
    >
    <failure message="is any of 1 2 3 4 5: Did not expect $..id to be 0"></failure>
    </testcase>
    <testcase name="should check post id 0 - 5"
    classname="should_check_post_id_0_-_5"
    status="passed"
    time="0.01"
    >

    </testcase>
    </testsuite>

Times are in seconds.

## Licence

MIT

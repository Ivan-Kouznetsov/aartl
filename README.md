[![Actions Status](https://github.com/Ivan-Kouznetsov/aartl/workflows/Node.js%20CI/badge.svg)](https://github.com/Ivan-Kouznetsov/aartl/actions)
[![100% coverage](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg)](https://github.com/Ivan-Kouznetsov/aartl/actions)
[![License][license-image]][license-url]

[license-url]: https://opensource.org/licenses/MIT
[license-image]: https://img.shields.io/npm/l/make-coverage-badge.svg

# Why?

Imagine you have a software-as-a-service product that includes multiple services that rely on each other. Each of the services is tested. Let's say for the sake of argument they have code coverage of between 85% and 95%, you may have some confidence that the services work.

What is your confidence that a specific end-to-end process that implicates several services works and has a low failure rate?

![Diagram showing multiple connected services](diagram.png)

## Possible solutions

| Approach                                                           | Downsides                                                                                                                                           |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Browser-based end-to-end tests                                     | 1. Slow <br />2. Cannot be run at a high rate (due to slowness) and thus cannot be used to ascertain failure rates <br />3. Easy to write bugs      |
| API-based end-to-end tests using common general-purpose frameworks | 1. Easy to write bugs<br />2. Common test frameworks are not designed to re-run tests and calculate failure rates<br />3. Significant start-up time |

# What?

## Agnostic API Reliability Testing Language

Agnostic API Reliability Testing Language (AARTL) is a platform-agnostic declarative domain-specific language for testing HTTP servers using the server’s API, it is implemented in TypeScript as a dependency-free high-performance Node.js application and can run on all major operating systems (Windows, macOS, Linux-based OSs and FreeBSD), it can also run on GraalVM, and can test servers irrespective of the platform used by the server. An AARTL test is a human-readable declaration of the expected response from a server endpoint given one or more requests. Its simple syntax offers fewer opportunities for writing bugs than a traditional test which may include any arbitrary code.

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
    - body can be loaded from a fixture file like so `body from fixture: myfixture`
    - this will load the content of fixtures/myfixture.fixture and use that as the body of the request

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

**Examples** of rules are (_x, y, z in the rules refer to parameters_):
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

For an up to date list of rules consult the wiki page on [rules](https://github.com/Ivan-Kouznetsov/aartl/wiki/Rules)

Header expectations consist of:

Header name followed by a colon and the expected value or a rule.
There is one header rule, it is "must not be present".
Examples:

    "X-Powered-By":"Express"
    "X-Powered-By": must not be present /* will fail if this header is sent */

## Comments

Comments can be written within `/** **/` and are ignored. Example:

    /** This is a comment **/

## Case sensitivity

The syntax is case sensitive, statements start with an upper-case letter, data items start with a lowercase letter.

## Benefits

- Few opportunities for writing bugs
- Runs fast
- Detailed logging
- Cross-platform
- Flexible matching rules
- 100% test coverage of all modules
- Human-readable reports

## How?

### Getting started

1. [Download a release](https://github.com/Ivan-Kouznetsov/aartl/releases)
2. Unzip it
3. Open a terminal window
4. Run the example file

   `aartl.exe -f example.aartl --report` on Windows
   `./aartl -f example.aartl --report` on Linux and macOS

5. Observe the output and open the report file

6. **Optionally** install [the Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=IvanKouznetsov.aartl-lang-server)

### CLI options

To see the CLI options run the program with no arguments, the key options are:

| Option           | What it means                                       |
| ---------------- | --------------------------------------------------- |
| \-\-hello        | Print the name of the program before running tests  |
| \-\-xml          | Output results as JUnit XML                         |
| \-\-novalidation | Don't validate test file                            |
| \-\-r            | Randomize test order                                |
| \-n N            | Rerun the tests a number of times                   |
| \-m N            | Maximum concurrent tests. Default: no limit         |
| \-\-report       | Output an html report with failure rates            |
| \-\-q            | Don't output real-time test results                 |
| \-\-log          | Output request logs                                 |
| \-\-ff           | Exit with error code 1 as as soon as one test fails |

## Performance

The "runs fast" claim refers to the following:

- Checking if a response passes the rules is as fast as 0.1 milliseconds
- HTTP requests are handled by a very lightweight wrapper over the native HTTP APIs
- Tests are executed asynchronously so while one test is "waiting" for a response, other tests are being executed
- Can send more concurrent requests than an Express-based server can handle and thus has to be throttled

The bottleneck is likely to be how many requests the server being tested can handle not how fast the tests are executed.

## License

MIT

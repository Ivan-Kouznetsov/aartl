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
- Runs fast
- Detailed logging
- Cross-platform
- Flexible matching rules
- Good test coverage

| File                         | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s |
| ---------------------------- | ------- | -------- | ------- | ------- | ----------------- |
| All files                    | 100     | 100      | 100     | 100     |
| &nbsp;parser                 | 100     | 100      | 100     | 100     |
| &nbsp;&nbsp;parser.ts        | 100     | 100      | 100     | 100     |
| &nbsp;&nbsp;ruleParser.ts    | 100     | 100      | 100     | 100     |
| &nbsp;&nbsp;util.ts          | 100     | 100      | 100     | 100     |
| reportBuilder                | 100     | 100      | 100     | 100     |
| &nbsp;&nbsp;reportBuilder.ts | 100     | 100      | 100     | 100     |
| rules                        | 100     | 100      | 100     | 100     |
| &nbsp;&nbsp;matchers.ts      | 100     | 100      | 100     | 100     |
| runner                       | 100     | 100      | 100     | 100     |
| &nbsp;&nbsp;runner.ts        | 100     | 100      | 100     | 100     |
| &nbsp;&nbsp;suiteRunner.ts   | 100     | 100      | 100     | 100     |
| &nbsp;&nbsp;util.ts          | 100     | 100      | 100     | 100     |
| validator                    | 100     | 100      | 100     | 100     |
| &nbsp;&nbsp;validator.ts     | 100     | 100      | 100     | 100     |

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

    node dist/aartl.js [-f path/to/file/with/tests.aartl] [-d path/to/dir/with/.aartl]

### CLI options

| Option           | What it means                                      |
| ---------------- | -------------------------------------------------- |
| \-\-hello        | Print the name of the program before running tests |
| \-\-xml          | Output results as JUnit XML                        |
| \-\-novalidation | Don't validate test file                           |
| \-\-r            | Randomize test order                               |
| \-n NUMBER       | Rerun the tests a number of times                  |
| \-\-report       | Output a report with failure rates                 |
| \-\-q            | Don't output realtime test results                 |

## Editor Support

A work in progress VSCode extension is available at: https://github.com/Ivan-Kouznetsov/aartl-vscode-extension

![VSCode Screenshot](https://raw.githubusercontent.com/Ivan-Kouznetsov/aartl-vscode-extension/master/vscodeScreenshot.png)

## Licence

MIT

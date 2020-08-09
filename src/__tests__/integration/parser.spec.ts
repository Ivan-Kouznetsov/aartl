import * as parser from '../../parser/parser';
import * as fixtures from './fixtures/parser.fixtures';

describe('Parser', () => {
  it('should split 10 tests', () => {
    const tenTests = parser.splitTests(fixtures.fairlyCompleteValid.repeat(10));
    expect(tenTests.length).toBe(10);
  });

  it('should split a test', () => {
    const preprocessedText = parser.preProcess(fixtures.fairlyCompleteValid);
    const test = parser.splitTestIntoSections(preprocessedText);

    expect(test.name).toEqual('should return stuff when queried');
    expect(test.requests.length).toBe(3);
    expect(test.usingValues.length).toBe(3);

    expect(test).toEqual({
      name: 'should return stuff when queried',
      usingValues: [{ '@id': 10 }, { '@id2': 'random number up to 100' }, { '@txt': 'random string length 20' }],
      requests: [
        {
          headers: [{ 'Accept-Encoding': '*/*' }],
          method: 'post',
          url: 'http://example.org/@id',
          body: 'hello',
          passOn: [{ '$..num': '_num' }, { '$..id': '_id' }],
          wait: '5 seconds',
          jsonRules: [],
          headerRules: [],
        },
        {
          headers: [{ 'Accept-Encoding': '*/*' }],
          method: 'post',
          url: 'http://example.org/things/@id2',
          body: 'hi',
          passOn: [],
          jsonRules: [],
          headerRules: [],
        },
        {
          headers: [{ 'Accept-Encoding': '*/*' }],
          method: 'get',
          url: 'http://example.org/@id',

          passOn: [],
          expectedStatusCode: '200',
          jsonRules: [
            { '$..id': '@id' },
            { '$..title': 'each is a non empty string' },
            { '$..num': 'each is > 10' },
            { '$..books': 'count is "$..bookCount"' },
          ],
          headerRules: [{ 'Accept-Encoding': '*/*' }, { 'X-cache': true }],
        },
      ],
    });
  });

  it('should not throw when parsing a test with invalid list items', () => {
    const preprocessedText = parser.preProcess(fixtures.fairlyCompleteInvalidLists);
    const test = parser.splitTestIntoSections(preprocessedText);

    expect(test).toBeDefined();
  });

  it('should not throw when parsing a test with no requests', () => {
    const preprocessedText = parser.preProcess(fixtures.noRequests);
    const test = parser.splitTestIntoSections(preprocessedText);

    expect(test).toBeDefined();
  });

  it('should not throw when parsing an empty string', () => {
    const arr = parser.splitTests('');

    expect(arr).toBeDefined();
  });

  it('should not throw when parsing invalid key value pairs', () => {
    const preprocessedText = parser.preProcess(fixtures.invalidKvPairs);
    const test = parser.splitTestIntoSections(preprocessedText);

    expect(test).toBeDefined();
  });
});

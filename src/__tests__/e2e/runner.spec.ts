import * as fixtures from './fixtures/localhostTests.fixtures';
import * as sortingFixtures from './fixtures/sorting.fixtures';
import { runTest } from '../../runner/runner';
import * as parser from '../../parser/parser';

/**
 * Helper
 */

const runTestThruAllSteps = async (testText: string) => {
  const preprocessedText = parser.preProcess(testText);
  const test = parser.splitTestIntoSections(preprocessedText);
  const result = await runTest(test);

  return result;
};

describe('Test runner', () => {
  it('should save a post and check that it is saved', async () => {
    const result = await runTestThruAllSteps(fixtures.saveAndCheckPost);

    expect(result.passed).toBe(true);
  });

  it('should fail if the pass on json path is not found', async () => {
    const result = await runTestThruAllSteps(fixtures.requestNonexistentPassOn);

    expect(result.passed).toBe(false);
    expect(result.failReasons[0]).toEqual('Pass on JSON path: $..XXXXX not found in response');
  });

  it('should save a post and check id', async () => {
    const result = await runTestThruAllSteps(fixtures.savePostCheckId);

    expect(result.passed).toBe(true);
  });

  it('should save a post and check id is not zero', async () => {
    const result = await runTestThruAllSteps(fixtures.savePostCheckIdLessThanZero);

    expect(result.passed).toBe(false);
  });

  it('should fail when getting a non existent post', async () => {
    const result = await runTestThruAllSteps(fixtures.requestNonexistentPost);

    expect(result.passed).toBe(false);
    expect(result.failReasons[0]).toEqual('Expected status code of 200, received: 404');
  });

  it('should fail when header rules does not exist', async () => {
    const result = await runTestThruAllSteps(fixtures.missingHeader);

    expect(result.passed).toBe(false);
    expect(result.failReasons[0]).toEqual('Expected header X-Cache to match true, received: nothing');
  });

  it('should pass when header rules do match', async () => {
    const result = await runTestThruAllSteps(fixtures.rightHeader);

    expect(result.passed).toBe(true);
  });

  it('should not pass when header rules do not match', async () => {
    const result = await runTestThruAllSteps(fixtures.wrongHeaderValue);

    expect(result.passed).toBe(false);
    expect(result.failReasons[0]).toEqual('Expected header X-Powered-By to match XXXX, received: Express');
  });

  it('should not pass when prohibited header is present', async () => {
    const result = await runTestThruAllSteps(fixtures.headerNotPresentFail);

    expect(result.passed).toBe(false);
    expect(result.failReasons[0]).toEqual(
      'Expected header X-Powered-By to match must not be present, received: Express'
    );
  });

  it('should pass when prohibited header is not present', async () => {
    const result = await runTestThruAllSteps(fixtures.headerNotPresentPass);

    expect(result.passed).toBe(true);
  });

  it('should fail when literal rules do not match', async () => {
    const result = await runTestThruAllSteps(fixtures.checkLiteral);

    expect(result.passed).toBe(false);
    expect(result.failReasons[0]).toContain('Expected $..id to match 0, received');
  });

  it('should fail when anyOf rules do not match', async () => {
    const result = await runTestThruAllSteps(fixtures.wrongCheckAnyOf);

    expect(result.passed).toBe(false);
    expect(result.failReasons[0]).toContain('Expected $..id to match is any of 1 2 3 4 5, received 0');
  });

  it('should pass when anyOf rules do match', async () => {
    const result = await runTestThruAllSteps(fixtures.rightCheckAnyOf);

    expect(result.passed).toBe(true);
  });

  it('should pass when id is null', async () => {
    const result = await runTestThruAllSteps(fixtures.getNull);

    expect(result.passed).toBe(true);
  });

  it('should catch exception when request is not valid', async () => {
    const result = await runTestThruAllSteps(fixtures.invalidUrl);

    expect(result.passed).toBe(false);
    expect(result.failReasons[0]).toEqual('Invalid url: http:///');
  });

  it('should return approppriate error when request url is not defined', async () => {
    const result = await runTestThruAllSteps(fixtures.noUrl);

    expect(result.passed).toBe(false);
    expect(result.failReasons[0]).toEqual('Cannot request an empty url');
  });

  it('should fail when passing on value from a response that is not JSON', async () => {
    const result = await runTestThruAllSteps(fixtures.passOnNonExistentValue);

    expect(result.passed).toBe(false);
    expect(result.failReasons[0]).toEqual('Cannot pass on value because response was not JSON or XML');
  });

  it('should fail when checking JSON rule against a non-JSON response', async () => {
    const result = await runTestThruAllSteps(fixtures.JsonRuleCheckWhenResponseIsNotJson);

    expect(result.passed).toBe(false);
    expect(result.failReasons[0]).toEqual('Cannot check JSON rules because response was not JSON or XML');
  });

  it('should defualt to get when method is not provided', async () => {
    const result = await runTestThruAllSteps(fixtures.noMethod);

    expect(result.passed).toBe(true);
  });

  it('should be able to use each has a with a root query', async () => {
    const badResult = await runTestThruAllSteps(fixtures.hasEachRootQueryFail);

    expect(badResult.passed).toBe(false);
    expect(badResult.failReasons[0]).toEqual('Expected $ to match each has XXX, received {"id":0,"text":"0th Post"}');

    const goodResult = await runTestThruAllSteps(fixtures.hasEachRootQueryPass);

    expect(goodResult.passed).toBe(true);
  });

  it('should be able to check count of 0', async () => {
    const badResult = await runTestThruAllSteps(fixtures.countFail);

    expect(badResult.passed).toBe(false);
    expect(badResult.failReasons[0]).toEqual('Expected $..text to match count >= 50, received 0');

    const goodResult = await runTestThruAllSteps(fixtures.countPass);

    expect(goodResult.passed).toBe(true);
  });

  it('should fail when checking JSON rule for a path that does not exist with a literal value', async () => {
    const badResult = await runTestThruAllSteps(fixtures.nonExistentJsonPath);

    expect(badResult.passed).toBe(false);
    expect(badResult.failReasons[0]).toEqual('Expected $..AAAAA to match 10, received nothing');
  });

  it('should fail when checking JSON rule for a path that does not exist with a rule', async () => {
    const badResult = await runTestThruAllSteps(fixtures.nonExistentJsonPathRule);

    expect(badResult.passed).toBe(false);
    expect(badResult.failReasons[0]).toEqual('Expected $..AAAAA to match > 10, received nothing');
  });

  it('should fail when extra properties are present', async () => {
    const badResult = await runTestThruAllSteps(fixtures.limitedPropsFail);

    expect(badResult.passed).toBe(false);
    expect(badResult.failReasons[0]).toEqual(
      'Expected $ to match properties limited to text, received {"id":0,"text":"0th Post"}'
    );
  });

  it('should pass when extra properties are not present', async () => {
    const result = await runTestThruAllSteps(fixtures.limitedPropsPass);

    expect(result.passed).toBe(true);
  });

  it('should have every rule pass when they match the data', async () => {
    const goodResult = await runTestThruAllSteps(fixtures.allRulesPass);

    expect(goodResult.passed).toBe(true);
  });

  it('should have every rule fail when they do not match the data', async () => {
    const preprocessedText = parser.preProcess(fixtures.allRulesFail);
    const test = parser.splitTestIntoSections(preprocessedText);
    const result = await runTest(test);

    expect(result.passed).toBe(false);
    expect(result.failReasons.length).toBe(test.requests[0].jsonRules.length);
  });

  it('should have sorted rule fail when dates are not sorted', async () => {
    const badResult = await runTestThruAllSteps(sortingFixtures.unsorted);

    expect(badResult.passed).toBe(false);
    expect(badResult.failReasons).toEqual([
      'Expected $..releaseDate to match is sorted asc, received "[\\"Jan 12, 2000\\",\\"Aug 1, 2000\\",\\"Feb 14, 2000\\"]"',
    ]);
  });

  it('should have sorted rule pass when dates are sorted asc', async () => {
    const result = await runTestThruAllSteps(sortingFixtures.sortedAsc);

    expect(result.passed).toBe(true);
  });

  it('should have sorted rule pass when dates are sorted desc', async () => {
    const result = await runTestThruAllSteps(sortingFixtures.sortedDesc);

    expect(result.passed).toBe(true);
  });

  it('should get xml as json and check a value', async () => {
    const result = await runTestThruAllSteps(fixtures.getXmlPass);

    expect(result.passed).toBe(true);

    const badResult = await runTestThruAllSteps(fixtures.getXmlFail);

    expect(badResult.passed).toBe(false);
    expect(badResult.failReasons[0]).toEqual('Expected $..make to match Not Cessna, received "Cessna"');
  });

  it('should do an authenticated request', async () => {
    const result = await runTestThruAllSteps(fixtures.loginAndGetUserData);

    expect(result.passed).toBe(true);
  });
});

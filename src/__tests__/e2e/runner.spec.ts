import * as fixtures from './fixtures/localhostTests.fixtures';
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
    expect(result.failReasons[0]).toEqual('Expected status code of 200, got: 404');
  });

  it('should fail when header rules does not exist', async () => {
    const result = await runTestThruAllSteps(fixtures.missingHeader);

    expect(result.passed).toBe(false);
    expect(result.failReasons[0]).toEqual('Expected header X-Cache to be true, got: nothing');
  });

  it('should pass when header rules do match', async () => {
    const result = await runTestThruAllSteps(fixtures.rightHeader);

    expect(result.passed).toBe(true);
  });

  it('should not pass when header rules do not match', async () => {
    const result = await runTestThruAllSteps(fixtures.wrongHeaderValue);

    expect(result.passed).toBe(false);
    expect(result.failReasons[0]).toEqual('Expected header X-Powered-By to be XXXX, got: Express');
  });

  it('should fail when literal rules do not match', async () => {
    const result = await runTestThruAllSteps(fixtures.checkLiteral);

    expect(result.passed).toBe(false);
    expect(result.failReasons[0]).toContain('Expected $..id to be 0, got');
  });

  it('should fail when anyOf rules do not match', async () => {
    const result = await runTestThruAllSteps(fixtures.wrongCheckAnyOf);

    expect(result.passed).toBe(false);
    expect(result.failReasons[0]).toContain('Expected $..id to be is any of 1 2 3 4 5, got 0');
  });

  it('should pass when anyOf rules do match', async () => {
    const result = await runTestThruAllSteps(fixtures.rightCheckAnyOf);

    expect(result.passed).toBe(true);
  });

  it('should pass when is null and text property is absent', async () => {
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
    expect(result.failReasons[0]).toEqual('Cannot pass on value because response was not JSON');
  });

  it('should fail when checking JSON rule against a non-JSON response', async () => {
    const result = await runTestThruAllSteps(fixtures.JsonRuleCheckWhenResponseIsNotJson);

    expect(result.passed).toBe(false);
    expect(result.failReasons[0]).toEqual('Cannot check JSON rules because response was not JSON');
  });

  it('should defualt to get when method is not provided', async () => {
    const result = await runTestThruAllSteps(fixtures.noMethod);

    expect(result.passed).toBe(true);
  });
});

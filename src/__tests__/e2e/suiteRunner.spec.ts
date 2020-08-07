import { exampleSuite, invalidExampleSuite } from './fixtures/suiteRunner.fixtures';
import { suiteRunner } from '../../runner/suiteRunner';
import { ITestResult } from '../../interfaces/results';

/**
 * Helpers
 */

const hasTestPassed = (testResults: ITestResult[], testName: string): boolean => {
  const testResult = testResults.find((r) => r.testName === testName);
  if (testResult === null || testResult === undefined) {
    return false;
  } else {
    return testResult.passed;
  }
};

describe('Suite Runner', () => {
  it('should run entire suite when default arguments are provided', async () => {
    const log: ITestResult[] = [];
    const result: ITestResult[] = <ITestResult[]>await suiteRunner({
      content: exampleSuite,
      testName: undefined,
      numberOfRuns: 1,
      randomize: false,
      noValidation: false,
      realTimeLogger: (result) => {
        log.push(result);
      },
    });
    result.forEach((result) => {
      expect(result.duration).toBeGreaterThan(0);
      result.failReasons.forEach((f) => {
        expect(f).toBeTruthy();
      });
      expect(result.passed).toBeDefined();
      expect(result.requestLogs).toBeDefined();
      expect(result.testName).toBeTruthy();
    });
    expect(log).toEqual(result);

    expect(hasTestPassed(result, 'should save a post')).toBe(true);
    expect(hasTestPassed(result, 'should save a post and check id')).toBe(true);
    expect(hasTestPassed(result, 'should save a post and make sure id is less than 0')).toBe(false);
    expect(hasTestPassed(result, 'should get apost with id of -1')).toBe(false);
    expect(hasTestPassed(result, 'should save a post and cache it')).toBe(false);
    expect(hasTestPassed(result, 'should save a post and be powered by Express')).toBe(true);
    expect(hasTestPassed(result, 'should save a post and be powered by XXXX')).toBe(false);
    expect(hasTestPassed(result, 'should check that post id is 0')).toBe(false);
    expect(hasTestPassed(result, 'should check that post id is 1 - 5')).toBe(false);
    expect(hasTestPassed(result, 'should check post id 0 - 5')).toBe(true);
    expect(hasTestPassed(result, 'should be null')).toBe(true);
  }, 20000);

  it('should run entire suite when tests are randomized', async () => {
    const log: ITestResult[] = [];
    const result: ITestResult[] = <ITestResult[]>await suiteRunner({
      content: exampleSuite,
      testName: undefined,
      numberOfRuns: 1,
      randomize: true,
      noValidation: false,
      realTimeLogger: (result) => {
        log.push(result);
      },
    });
    result.forEach((result) => {
      expect(result.duration).toBeGreaterThan(0);
      result.failReasons.forEach((f) => {
        expect(f).toBeTruthy();
      });
      expect(result.passed).toBeDefined();
      expect(result.requestLogs).toBeDefined();
      expect(result.testName).toBeTruthy();
    });
    expect(log).toEqual(result);

    expect(hasTestPassed(result, 'should save a post')).toBe(true);
    expect(hasTestPassed(result, 'should save a post and check id')).toBe(true);
    expect(hasTestPassed(result, 'should save a post and make sure id is less than 0')).toBe(false);
    expect(hasTestPassed(result, 'should get apost with id of -1')).toBe(false);
    expect(hasTestPassed(result, 'should save a post and cache it')).toBe(false);
    expect(hasTestPassed(result, 'should save a post and be powered by Express')).toBe(true);
    expect(hasTestPassed(result, 'should save a post and be powered by XXXX')).toBe(false);
    expect(hasTestPassed(result, 'should check that post id is 0')).toBe(false);
    expect(hasTestPassed(result, 'should check that post id is 1 - 5')).toBe(false);
    expect(hasTestPassed(result, 'should check post id 0 - 5')).toBe(true);
    expect(hasTestPassed(result, 'should be null')).toBe(true);
  }, 20000);

  it('should run a single test when test name is provided', async () => {
    const log: ITestResult[] = [];
    const result: ITestResult[] = <ITestResult[]>await suiteRunner({
      content: exampleSuite,
      testName: 'should save a post',
      numberOfRuns: 1,
      randomize: false,
      noValidation: false,
      realTimeLogger: (result) => {
        log.push(result);
      },
      maxConcurrent: 1,
    });
    result.forEach((result) => {
      expect(result.duration).toBeGreaterThan(0);
      result.failReasons.forEach((f) => {
        expect(f).toBeTruthy();
      });
      expect(result.passed).toBeDefined();
      expect(result.requestLogs).toBeDefined();
      expect(result.testName).toBeTruthy();
    });
    expect(log).toEqual(result);

    expect(hasTestPassed(result, 'should save a post')).toBe(true);
    // test that were not run:
    expect(hasTestPassed(result, 'should save a post and check id')).toBe(false);
    expect(hasTestPassed(result, 'should save a post and make sure id is less than 0')).toBe(false);
    expect(hasTestPassed(result, 'should get apost with id of -1')).toBe(false);
    expect(hasTestPassed(result, 'should save a post and cache it')).toBe(false);
    expect(hasTestPassed(result, 'should save a post and be powered by Express')).toBe(false);
    expect(hasTestPassed(result, 'should save a post and be powered by XXXX')).toBe(false);
    expect(hasTestPassed(result, 'should check that post id is 0')).toBe(false);
    expect(hasTestPassed(result, 'should check that post id is 1 - 5')).toBe(false);
    expect(hasTestPassed(result, 'should check post id 0 - 5')).toBe(false);
    expect(hasTestPassed(result, 'should be null')).toBe(false);
  }, 20000);

  it('should reject when there is a validation error', async (done) => {
    suiteRunner({
      content: invalidExampleSuite,
      testName: undefined,
      numberOfRuns: 1,
      randomize: false,
      noValidation: false,
    })
      .then(() => {
        fail('should not run test suite');
      })
      .catch((e) => {
        expect(e).toEqual('should save a post: In request 1: @postText is a non-unique value name');
        done();
      });
  }, 20000);

  it('should not reject when there is a validation error and no validation is true', async (done) => {
    suiteRunner({
      content: invalidExampleSuite,
      testName: undefined,
      numberOfRuns: 1,
      randomize: false,
      noValidation: true,
    })
      .then(() => {
        done();
      })
      .catch(() => {
        fail('should not run test suite');
      });
  }, 20000);
});

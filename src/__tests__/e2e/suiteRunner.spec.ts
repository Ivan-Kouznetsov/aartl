import { exampleSuite, invalidExampleSuite } from './fixtures/suiteRunner.fixtures';
import { suiteRunner } from '../../runner/suiteRunner';
import { ITestResult } from '../../interfaces/results';

describe('Suite Runner', () => {
  it('should run entire suite when default arguments are provided', async () => {
    const log: ITestResult[] = [];
    const result: ITestResult[] = <ITestResult[]>(
      await suiteRunner('example', exampleSuite, undefined, 1, false, false, false, false, (result) => {
        log.push(result);
      })
    );
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

    expect(result.find((r) => r.testName === 'should save a post').passed).toBe(true);
    expect(result.find((r) => r.testName === 'should save a post and check id').passed).toBe(true);
    expect(result.find((r) => r.testName === 'should save a post and make sure id is less than 0').passed).toBe(false);
    expect(result.find((r) => r.testName === 'should get apost with id of -1').passed).toBe(false);
    expect(result.find((r) => r.testName === 'should save a post and cache it').passed).toBe(false);
    expect(result.find((r) => r.testName === 'should save a post and be powered by Express').passed).toBe(true);
    expect(result.find((r) => r.testName === 'should save a post and be powered by XXXX').passed).toBe(false);
    expect(result.find((r) => r.testName === 'should check that post id is 0').passed).toBe(false);
    expect(result.find((r) => r.testName === 'should check that post id is 1 - 5').passed).toBe(false);
    expect(result.find((r) => r.testName === 'should check post id 0 - 5').passed).toBe(true);
    expect(result.find((r) => r.testName === 'should be null').passed).toBe(true);
  }, 20000);

  it('should run a single test when test name is provided', async () => {
    const log: ITestResult[] = [];
    const result: ITestResult[] = <ITestResult[]>(
      await suiteRunner('example', exampleSuite, 'should save a post', 1, false, false, false, false, (result) => {
        log.push(result);
      })
    );
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

    expect(result.find((r) => r.testName === 'should save a post').passed).toBe(true);
    expect(result.find((r) => r.testName === 'should save a post and check id')).toBeUndefined();
    expect(result.find((r) => r.testName === 'should save a post and make sure id is less than 0')).toBeUndefined();
    expect(result.find((r) => r.testName === 'should get apost with id of -1')).toBeUndefined();
    expect(result.find((r) => r.testName === 'should save a post and cache it')).toBeUndefined();
    expect(result.find((r) => r.testName === 'should save a post and be powered by Express')).toBeUndefined();
    expect(result.find((r) => r.testName === 'should save a post and be powered by XXXX')).toBeUndefined();
    expect(result.find((r) => r.testName === 'should check that post id is 0')).toBeUndefined();
    expect(result.find((r) => r.testName === 'should check that post id is 1 - 5')).toBeUndefined();
    expect(result.find((r) => r.testName === 'should check post id 0 - 5')).toBeUndefined();
    expect(result.find((r) => r.testName === 'should be null')).toBeUndefined();
  }, 20000);

  it('should reject when there is a validation error', async (done) => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    suiteRunner('example', invalidExampleSuite, undefined, 1, true, true, false, false, () => {})
      .then(() => {
        fail('should not run test suite');
      })
      .catch((e) => {
        expect(e).toEqual('should save a post: In request 1: @postText is a non-unique value name');
        done();
      });
  }, 20000);
});

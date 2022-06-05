import { test, multipleUseOfFixture } from './fixtures/preprocessor/test.fixtures';
import { applyFixtures } from '../../parser/preprocessor';
import * as path from 'path';

describe('Preprocessor', () => {
  it('should replace body from fixture:', () => {
    const result = applyFixtures(test, path.resolve('./src/__tests__/unit/fixtures/preprocessor/')).replace('\r', '');
    expect(result).toEqual(
      'Test that it should get data\nExpect HTTP request\n    url: http://localhost:3000/\n    method: POST\n    body: This is a\nnew post\nTo respond with status code 200'
    );
  });

  it('should throw when file is not found', () => {
    expect(() => {
      applyFixtures(test, path.resolve('./'));
    }).toThrow();
  });

  it('should not replace body from fixture: when it is not present', () => {
    const result = applyFixtures(
      test.replace(' from fixture', ''),
      path.resolve('./src/__tests__/unit/fixtures/preprocessor/')
    ).replace('\r', '');
    expect(result).toEqual(
      'Test that it should get data\nExpect HTTP request\n    url: http://localhost:3000/\n    method: POST\n    body: newpost\nTo respond with status code 200'
    );
  });

  it('should replace body from fixture: multiple times', () => {
    const result = applyFixtures(
      multipleUseOfFixture,
      path.resolve('./src/__tests__/unit/fixtures/preprocessor/')
    ).replace('\r', '');
    expect(result).toContain(
      'Test that it should get data\nExpect HTTP request\n    url: http://localhost:3000/\n    method: POST\n    body: This is a\nnew post\nTo respond with status code 200'
    );
  });
});

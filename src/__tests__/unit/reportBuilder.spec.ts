/* eslint-disable @typescript-eslint/ban-ts-comment */
import { testResults, xmlResult } from '../unit/fixtures/reportBuilder.fixtures';
import { buildHtmlReport, resultsToXml } from '../../reportBuilder/reportBuilder';
// @ts-ignore
import * as html_valdator from 'html-validator';

/*
 * Helpers
 */

const nsToMs = (ns: number) => (ns / 1e6).toFixed(2);
const escapeHtmlChars = (str: string) => (str ?? '').replace('&', '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

describe('Report builder', () => {
  it('should build html report', async () => {
    const html = buildHtmlReport('example', testResults);

    expect(html).toBeDefined();
    expect(html.includes('object]')).toBe(false);
    expect(html.includes('undefined')).toBe(false);
    testResults.forEach((testResult) => {
      expect(html).toContain(nsToMs(testResult.duration));
      expect(html).toContain(testResult.testName);
      testResult.failReasons.forEach((failReason) => {
        expect(html).toContain(escapeHtmlChars(failReason));
      });
      testResult.requestLogs.forEach((requestLog) => {
        expect(html).toContain(nsToMs(requestLog.duration));
        expect(html).toContain(JSON.stringify(requestLog.received.headers));
        expect(html).toContain(JSON.stringify(requestLog.sent.headers));
        expect(html).toContain(JSON.stringify(requestLog.received.status));
      });
    });

    expect((await html_valdator({ data: html, validator: 'WHATWG' })).isValid).toBe(true);
  });

  it('should build xml report', () => {
    const xml = resultsToXml('example', testResults);

    expect(xml).toEqual(xmlResult);
  });

  it('should execute with even results', () => {
    const html = buildHtmlReport('example', [...testResults].slice(0, 2));

    expect(html).toBeDefined();
  });
});

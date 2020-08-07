import { ITestResult, ITestReport, IReport, IRequestLog } from '../interfaces/results';

/**
 * Math
 */

const median = (arr: number[]) => {
  const sortedArr = [...arr].sort();
  const middle = Math.ceil(arr.length / 2);
  return sortedArr.length % 2 === 0 ? (sortedArr[middle] + sortedArr[middle - 1]) / 2 : sortedArr[middle - 1];
};
const range = (arr: number[]) => ({ min: Math.min(...arr), max: Math.max(...arr) });

/*
 * Exported functions
 */

export const buildReport = (testResults: ITestResult[]): IReport => {
  const testReports: ITestReport[] = [];
  const uniqueTestNames = new Set(testResults.map((t) => t.testName));
  uniqueTestNames.forEach((name) => {
    const runs = testResults.filter((test) => test.testName === name).length;
    const failures = testResults.filter((test) => test.testName === name).filter((test) => test.passed === false)
      .length;
    testReports.push({
      testName: name,
      runs,
      failures,
      failureRate: Math.round((failures / runs) * 100),
    });
  });
  const failureRates = testReports.map((t) => t.failureRate);
  return {
    testReports,
    rangeOfFailureRates: range(failureRates),
    medianFailureRate: median(failureRates),
  };
};

const escapeHtmlChars = (str: string) => str.replace('&', '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const requestLogToHtml = (log: IRequestLog): string => {
  const sent = log.sent;
  const rec = log.received;

  return `<h3>Request</h3><span class="requestDuration"> Duration: ${formatDuration(
    log.duration
  )} ms </span> <p>Sent: <br/>Url: ${sent.url}
  <br/>Headers: ${JSON.stringify(sent.headers)}  
  <br/>Method: ${sent.method}
  <br/>Body: ${sent.body ? escapeHtmlChars(sent.body) : 'None'}
  <br/>
  <p>Received
  <br/>Headers: ${JSON.stringify(rec.headers)}  
  <br/>${rec.json ? escapeHtmlChars(JSON.stringify(rec.json)) : escapeHtmlChars(rec.string)}
  <br/>Status: ${rec.status}
  <br/>Duration: ${formatDuration(log.duration)} ms   
  `;
};

const formatDuration = (ns: number) => (ns / 1e6).toFixed(2);

export const buildHtmlReport = (suiteName: string, testResults: ITestResult[]): string => {
  const newLine = '<br/>\n';
  let body = '<table id="summary">';
  const summary = buildReport(testResults);

  body += `<tr><td>Median Failure Rate:</td><td> ${summary.medianFailureRate}</td></tr>`;
  body += `<tr><td>Failure Rate Range:</td><td> ${summary.rangeOfFailureRates.min}-${summary.rangeOfFailureRates.max}</td></tr>`;

  body +=
    '</table><h2>Tests</h2><table id="tableOfContents"><tr><td>Test Name</td><td>Runs</td><td>Failures</td><td>Failure Rate</td></tr>';

  summary.testReports
    .sort((a, b) => b.failureRate - a.failureRate)
    .forEach((t) => {
      body += `<tr><td><a class="${t.failures === 0 ? 'hasNotFailed' : 'hasFailed'}" href="#${t.testName.replace(
        /\s/g,
        '_'
      )}">${t.testName}</a></td><td>${t.runs}</td><td>${t.failures}</td><td>${t.failureRate}%</td></tr>\n`;
    });

  body += `</table>
    <h2>Details</h2>
    <table id="details">
    <thead>
    <tr><td>Test Name</td><td>Passed</td><td>Duration</td><td>Fail Reasons</td><td class="requestLogColumn">Request Log</td></tr>
    </thead>
    <tbody>`;

  [...testResults]
    .sort((a, b) => (a.testName < b.testName ? -1 : 1))
    .forEach((t) => {
      body += `<tr id="${t.testName.replace(/\s/g, '_')}"><td>${t.testName}</td><td>${
        t.passed ? '<span class="passed">&check;</span>' : '<span class="failed">&#10060;</span>'
      }</td><td> ${formatDuration(t.duration)} ms</td><td> ${
        t.failReasons.length ? escapeHtmlChars(t.failReasons.join(',')) : 'None'
      }</td><td> ${t.requestLogs.map((r) => requestLogToHtml(r)).join(newLine)}</td></tr>`;
    });

  body += '</tbody></table>';
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <title>AARLT Test Report - ${suiteName}</title>
    <link rel="stylesheet" href="report.css">
  </head>
  
  <body>  
    <h1>AARLT Test Report - ${suiteName} - ${new Date().toString()}</h1>
    ${body}
  </body>
  </html>`;
};

const createXmlTestCase = (result: ITestResult): string => `
<testcase name="${result.testName}"
classname="${result.testName.replace(/\s/g, '_')}"
status="${result.passed ? 'passed' : 'failed'}"
time="${(result.duration / 1e9).toFixed(2)}"
>
${result.failReasons.map((f) => `<failure message="${f}"></failure>`).join('')}
</testcase>`;

/**
 * Convert results to Apache Ant JUnit XML data
 * @param results
 */
export const resultsToXml = (suiteName: string, results: ITestResult[]): string => {
  const fileStart = '<?xml version="1.0" encoding="UTF-8"?>';
  const suiteStart = `<testsuite name="${suiteName}" tests="${results.length}" id="0" errors="0" failures="${
    results.filter((r) => r.passed === false).length
  }">`;
  const suiteEnd = '</testsuite>';

  return fileStart + '\n' + suiteStart + results.map((r) => createXmlTestCase(r)).join('') + '\n' + suiteEnd;
};

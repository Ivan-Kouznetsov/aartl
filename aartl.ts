import * as fileSystem from 'fs';
import * as path from 'path';
import { suiteRunner } from './src/runner/suiteRunner';
import { arg } from './src/lib/arg';
import { exit } from 'process';
import { buildHtmlReport } from './src/reportBuilder/reportBuilder';
import { resultsToXml } from './src/runner/util';

const showUsage = () => {
  console.log('Usage: node aartl.js -f "path-to-test-file"');
  console.log('\nOptions:');
  console.log('-t "name of test" - run a single test');
  console.log('-n NUMBER - run the tests a number of times');
  console.log('--hello - display name of this program');
  console.log('--r - randomize test order');
  console.log('--xml - output results as JUnit XML');
  console.log('--novalidation - skip validation of tests');
  console.log(
    '--report - instead of outputing all results, output a report with failure rates and duration statistics, overrides --xml'
  );
};

const main = async (): Promise<void> => {
  let args;
  try {
    args = arg({
      '-f': String,
      '-t': String,
      '-n': Number,
      '--r': Boolean,
      '--hello': Boolean,
      '--xml': Boolean,
      '--novalidation': Boolean,
      '--report': Boolean,
    });
  } catch (ex) {
    console.log(ex.message);
    showUsage();
    exit(1);
  }
  if (args['--hello'] === true) console.log('Agnostic API Testing Language - Runner');

  const filePath = <string>args['-f'];
  const testName = <string>args['-t'];
  const numberOfRuns = <number>args['-n'] ?? 1;
  const randomize = <boolean>args['--r'];
  const outputXml = <boolean>args['--xml'];
  const noValidation = <boolean>args['--novalidation'];
  const report = <boolean>args['--report'];
  const suiteName = path.basename(filePath, path.extname(filePath));

  if (filePath === undefined) {
    showUsage();
    return;
  }

  let contents = '';
  try {
    contents = fileSystem.readFileSync(filePath, { encoding: 'utf-8' });
  } catch (ex) {
    if (ex.code === 'ENOENT') {
      console.error(`${filePath} does not exist`);
    } else {
      console.error(`${filePath} cannot be accessed`);
    }
    exit(1);
  }

  const results = await suiteRunner(
    suiteName,
    contents,
    testName,
    numberOfRuns,
    randomize,
    outputXml,
    noValidation,
    report,
    (str) => {
      console.log(str);
    }
  );

  const okDateTime = () => {
    const now = new Date();
    return now
      .toLocaleString()
      .replace('a.m.', 'AM')
      .replace('p.m.', 'PM')
      .replace(/:/g, '-')
      .replace(/(,|\s)/g, '_')
      .replace('__', '_');
  };

  if (outputXml) {
    console.log(resultsToXml(suiteName, results));
  } else if (report) {
    const fileName = `${suiteName}${okDateTime()}.html`;
    const html = buildHtmlReport(suiteName, results);
    fileSystem.writeFileSync(fileName, html);
    console.log(`Saved report to: ${fileName}`);
  }
};

main().catch((ex) => console.error(ex));

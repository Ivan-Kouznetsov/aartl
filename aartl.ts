import * as fileSystem from 'fs';
import * as path from 'path';
import { suiteRunner } from './src/runner/suiteRunner';
import { arg } from './src/lib/arg';
import { exit } from 'process';
import { buildHtmlReport, resultsToXml } from './src/reportBuilder/reportBuilder';
import { prettyPrintResult } from './src/runner/util';
import { applyFixtures } from './src/parser/preprocessor';

const showUsage = () => {
  console.log('Usage: node aartl.js -f "path-to-test-file"');
  console.log('\nOptions:');
  console.log('-t "name of test" - Run a single test');
  console.log('-d path - Run all files in directory');
  console.log('-n NUMBER - Run the tests a number of times');
  console.log('-m NUMBER - Maximum concurrent tests. Default: 100');
  console.log('--hello - Display name of this program');
  console.log('--r - Randomize test order');
  console.log('--xml - Output results as JUnit XML');
  console.log('--novalidation - Skip validation of tests');
  console.log("--q - Don't output realtime test results");
  console.log(
    '--report - Instead of outputing all results, output a report with failure rates and duration statistics, overrides --xml'
  );
  console.log('--ff - Exit with error code 1 as as soon as on test fails');
  console.log('--nocolor - Do not use color codes (useful if your console does not support color codes)');
};

const okDateTime = () => new Date().toISOString().replace(/:/g, '-');

const main = async (): Promise<void> => {
  let args;
  try {
    args = arg({
      '-f': String,
      '-t': String,
      '-n': Number,
      '--r': Boolean,
      '-d': String,
      '-m': Number,
      '--hello': Boolean,
      '--xml': Boolean,
      '--novalidation': Boolean,
      '--report': Boolean,
      '--q': Boolean,
      '--logs': Boolean,
      '--ff': Boolean,
      '--nocolor': Boolean,
    });
  } catch (ex) {
    console.log(ex.message);
    showUsage();
    exit(1);
  }
  if (args['--hello'] === true) console.log('Agnostic API Reliability Testing Language - Test Runner');

  const filePath = <string>args['-f'];
  const testName = <string>args['-t'];
  const numberOfRuns = <number>args['-n'] ?? 1;
  const randomize = <boolean>args['--r'];
  const outputXml = <boolean>args['--xml'];
  const noValidation = <boolean>args['--novalidation'];
  const report = <boolean>args['--report'];
  const directory = <string>args['-d'];
  const quiet = <boolean>args['--q'];
  const logs = <boolean>args['--logs'];
  const failFast = <boolean>args['--ff'];
  const maxConcurrent = <number>args['-m'];
  const noColor = <number>args['--nocolor'];

  if (directory && filePath) {
    console.log('Error: cannot specific both a file and a directory');
    exit(1);
  }

  if (directory === undefined && filePath === undefined) {
    showUsage();
    exit(1);
  }
  const filePaths: string[] = [];
  if (filePath) {
    filePaths.push(filePath);
  } else if (directory) {
    try {
      fileSystem.readdirSync(directory).forEach((f) => {
        if (f.endsWith('.aartl') && !fileSystem.statSync(f).isDirectory()) {
          console.log(f);
          filePaths.push(f);
        }
      });
    } catch {
      console.log('Cannot open directory:' + directory);
    }
  }

  const runSuite = (file?: string) => {
    if (!file) return;
    fileSystem.readFile(file, { encoding: 'utf-8' }, (err, content) => {
      if (err) {
        console.error(err.message);
      } else {
        try {
          content = applyFixtures(content, path.dirname(file));
        } catch (ex) {
          console.error(ex);
          exit(1);
        }
        suiteRunner({
          content,
          testName,
          numberOfRuns,
          randomize,
          noValidation,
          realTimeLogger: (result) => {
            if (!quiet) {
              console.log(prettyPrintResult(result, logs, !noColor));
            }

            if (failFast && !result.passed) {
              exit(1);
            }
          },
          maxConcurrent,
        })
          .then((testResults) => {
            const suiteName = path.basename(file, path.extname(file));
            if (outputXml) {
              console.log(resultsToXml(suiteName, testResults));
            } else if (report) {
              const fileName = `${suiteName}_${okDateTime()}.html`;
              const html = buildHtmlReport(suiteName, testResults);
              fileSystem.writeFileSync(fileName, html);
              console.log(`Saved report to: ${fileName}`);
            }
            if (filePaths.length > 0) runSuite(filePaths.shift());
          })
          .catch((reason) => {
            console.error(reason);
          });
      }
    });
  };
  runSuite(filePaths.shift());
};

main().catch((ex) => console.error(ex));

import * as fileSystem from 'fs';
import * as path from 'path';
import { suiteRunner } from './src/runner/suiteRunner';
import { arg } from './src/lib/arg';
import { exit } from 'process';
import { buildHtmlReport } from './src/reportBuilder/reportBuilder';
import { resultsToXml } from './src/reportBuilder/reportBuilder';

const showUsage = () => {
  console.log('Usage: node aartl.js -f "path-to-test-file"');
  console.log('\nOptions:');
  console.log('-t "name of test" - run a single test');
  console.log('-d path - run all files in directory');
  console.log('-n NUMBER - run the tests a number of times');
  console.log('-maxConcurrent NUMBER - Maximum concurrent tests. Default: 100');
  console.log('--hello - display name of this program');
  console.log('--r - randomize test order');
  console.log('--xml - output results as JUnit XML');
  console.log('--novalidation - skip validation of tests');
  console.log("--q - don't output realtime test results");
  console.log(
    '--report - instead of outputing all results, output a report with failure rates and duration statistics, overrides --xml'
  );
};

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
  const directory = <string>args['-d'];
  const quiet = <boolean>args['--q'];

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

  const runSuite = (file: string) => {
    fileSystem.readFile(file, { encoding: 'utf-8' }, (err, data) => {
      if (err) {
        console.error(err.message);
      } else {
        suiteRunner(data, testName, numberOfRuns, randomize, noValidation, (str) => {
          if (!quiet) console.log(str);
        })
          .then((testResults) => {
            const suiteName = path.basename(file, path.extname(file));
            if (outputXml) {
              console.log(resultsToXml(suiteName, testResults));
            } else if (report) {
              const fileName = `${suiteName}${okDateTime()}.html`;
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

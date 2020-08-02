import * as fileSystem from 'fs';
import * as path from 'path';
import { runTest } from './src/runner/runner';
import * as parser from './src/parser/parser';
import { arg } from './src/lib/arg';
import { exit } from 'process';
import { getFirstValidationError } from './src/validator/validator';
import * as util from './src/runner/util';
import { ITestResult } from './src/interfaces/results';
import { ITest } from './src/interfaces/test';
import { buildReport } from './src/reportBuilder/reportBuilder';

const shuffleArray = (array: unknown[]): void => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

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
  return new Promise((resolve) => {
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

    const preProcessedText = parser.preProcess(contents);
    const tests = parser.splitTests(preProcessedText);

    let resultsPerRun: ITestResult[] = [];
    const parsedTests: ITest[] = [];

    for (const test of tests) {
      const parsedTest = parser.splitTestIntoSections(test);
      if (testName === undefined || parsedTest.name === testName) {
        if (!noValidation) {
          const validationError = getFirstValidationError(parsedTest);

          if (validationError) {
            console.error(`${parsedTest.name}: ${validationError}`);
            exit(1);
          }
        }
        parsedTests.push(parsedTest);
      }
    }

    let totalResults: ITestResult[] = [];
    for (let i = 0; i < numberOfRuns; i++) {
      if (randomize) {
        shuffleArray(parsedTests);
      }

      for (const parsedTest of parsedTests) {
        runTest(parsedTest).then((result) => {
          resultsPerRun.push(result);
          if (!outputXml && !report) {
            console.log(result);
          } else if (resultsPerRun.length === parsedTests.length) {
            totalResults = totalResults.concat([...resultsPerRun]);
            resultsPerRun = [];
            if (!report && outputXml) {
              console.log(util.resultsToXml(path.basename(filePath, path.extname(filePath)), resultsPerRun));
            }

            if (totalResults.length === parsedTests.length * numberOfRuns) {
              if (report) {
                console.log(buildReport(totalResults));
              }
              resolve();
            }
          }
        });
      }
    }
  });
};

main().catch((ex) => console.error(ex));

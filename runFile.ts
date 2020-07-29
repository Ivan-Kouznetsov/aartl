import * as fileSystem from 'fs';
import * as path from 'path';
import { runTest } from './src/runner/runner';
import * as parser from './src/parser/parser';
import { argv } from 'yargs';
import { exit } from 'process';
import { getFirstValidationError } from './src/validator/validator';
import * as util from './src/runner/util';
import { ITestResult } from './src/interfaces/results';

const shuffleArray = (array: unknown[]): void => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const main = async () => {
  if (argv.hello === true) console.log('Agnostic API Testing Language - Runner');

  const filePath = <string>argv['f'];
  const testName = <string>argv['t'];
  const randomize = <boolean>argv['r'];

  console.log(testName);

  const contents = fileSystem.readFileSync(filePath, { encoding: 'utf-8' });

  const preProcessedText = parser.preProcess(contents);
  const tests = parser.splitTests(preProcessedText);
  if (randomize) {
    shuffleArray(tests);
  }

  const results: ITestResult[] = [];

  for (const test of tests) {
    const parsedTest = parser.splitTestIntoSections(test);
    if (testName === undefined || parsedTest.name === testName) {
      if (!argv['novalidation']) {
        const validationError = getFirstValidationError(parsedTest);

        if (validationError) {
          console.error(`${parsedTest.name}: ${validationError}`);
          exit(1);
        }
      }

      const result = await runTest(parsedTest);
      results.push(result);
      if (!argv.xml) {
        console.log(result);
      }
    }
  }

  if (argv.xml) {
    console.log(util.resultsToXml(path.basename(filePath, path.extname(filePath)), results));
  }
};

main().catch((ex) => console.error(ex));

import * as fileSystem from 'fs';
import * as path from 'path';
import { runTest } from './src/runner/runner';
import * as parser from './src/parser/parser';
import { argv } from 'yargs';
import { exit } from 'process';
import { getFirstValidationError } from './src/validator/validator';
import * as util from './src/runner/util';
import { ITestResult } from './src/interfaces/results';

const main = async () => {
  if (argv.hello === true) console.log('Agnostic API Testing Language - Runner');

  const filePath = <string>argv['f'];
  const contents = fileSystem.readFileSync(filePath, { encoding: 'utf-8' });

  const preProcessedText = parser.preProcess(contents);
  const tests = parser.splitTests(preProcessedText);
  const results: ITestResult[] = [];

  for (const test of tests) {
    const parsedTest = parser.splitTestIntoSections(test);
    const validationError = getFirstValidationError(parsedTest);

    if (validationError) {
      console.error(`${parsedTest.name}: ${validationError}`);
      exit(1);
    }

    const result = await runTest(parsedTest);
    results.push(result);
  }

  if (argv.xml) {
    console.log(util.resultsToXml(path.basename(filePath, path.extname(filePath)), results));
  } else {
    results.forEach((r) => console.log(r));
  }
};

main().catch((ex) => console.error(ex));

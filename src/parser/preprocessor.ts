import * as fileSystem from 'fs';
import { resolve } from 'path';

const fixtureCache: { [key: string]: string } = {};

const getFixture = (name: string, path: string): string => {
  try {
    const filePath = resolve(path, 'fixtures', name + '.fixture');
    return fixtureCache[filePath] || (fixtureCache[filePath] = fileSystem.readFileSync(filePath).toString('utf-8'));
  } catch (ex) {
    throw `Fixture file ${name}.fixture not found`;
  }
};

export const applyFixtures = (text: string, path: string): string => {
  const keyword = 'body from fixture:';
  const bodyFromFixtures = /(?<=body from fixture:\s{0,}).+/g;
  const fixtures = text.match(bodyFromFixtures) ?? [];

  fixtures.forEach((f) => {
    const fixtureName = f.trim();
    const textToReplace = new RegExp(`${keyword}\\s{0,}${fixtureName}`, 'g');
    const replacementText = `body: ${getFixture(fixtureName, path)}`;
    text = text.replace(textToReplace, replacementText);
  });

  return text;
};

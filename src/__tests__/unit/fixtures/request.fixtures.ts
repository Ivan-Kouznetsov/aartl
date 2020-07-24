import { IRequest } from '../../../interfaces/test';

export const requestWithOkRules: IRequest = {
  body: null,
  expectedStatusCode: null,
  method: 'get',
  passOn: [],
  url: 'http://example.org',
  wait: null,
  headerRules: [],
  headers: [],
  jsonRules: [{ '$..id': '> 10' }, { '$..id': 'is a number' }, { '$..id': 'is not Infinity' }],
};

export const requestWithLiteralValueRule: IRequest = {
  body: null,
  expectedStatusCode: null,
  method: 'get',
  passOn: [],
  url: 'http://example.org',
  wait: null,
  headerRules: [],
  headers: [],
  jsonRules: [{ '$..id': '42' }],
};

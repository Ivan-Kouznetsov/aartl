import { IRequest } from '../../../interfaces/test';

export const requestWithOkRules: IRequest = {
  method: 'get',
  passOn: [],
  url: 'http://example.org',

  headerRules: [],
  headers: [],
  jsonRules: [{ '$..id': '> 10' }, { '$..id': 'is a number' }, { '$..id': 'is not Infinity' }],
};

export const requestWithLiteralValueRule: IRequest = {
  method: 'get',
  passOn: [],
  url: 'http://example.org',

  headerRules: [],
  headers: [],
  jsonRules: [{ '$..id': '42' }],
};

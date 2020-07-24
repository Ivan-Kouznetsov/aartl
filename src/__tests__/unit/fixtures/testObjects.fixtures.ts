import { ITest } from '../../../interfaces/test';

export const nonUniqueValues: ITest = {
  name: 'should return stuff when queried',
  usingValues: [{ '@id': 10 }, { '@id': 'random number up to 100' }, { '@txt': 'random string length 20' }],
  requests: [
    {
      headers: [{ 'Accept-Encoding': '*/*' }],
      method: 'get',
      url: 'http://example.org/@id',
      body: null,
      passOn: [],
      wait: null,
      expectedStatusCode: '200',
      jsonRules: [
        { '$..id': '@id' },
        { '$..title': 'each is a non empty string' },
        { '$..num': 'each is > 10' },
        { '$..books': 'count is "$..bookCount"' },
      ],
      headerRules: [{ 'Accept-Encoding': '*/*' }, { 'X-cache': true }],
    },
  ],
};

export const nullUrl: ITest = {
  name: 'should return stuff when queried',
  usingValues: [{ '@id': 10 }],
  requests: [
    {
      headers: [{ 'Accept-Encoding': '*/*' }],
      method: 'get',
      url: null,
      body: null,
      passOn: [],
      wait: null,
      expectedStatusCode: '200',
      jsonRules: [
        { '$..id': '@id' },
        { '$..title': 'each is a non empty string' },
        { '$..num': 'each is > 10' },
        { '$..books': 'count is "$..bookCount"' },
      ],
      headerRules: [{ 'Accept-Encoding': '*/*' }, { 'X-cache': true }],
    },
  ],
};

export const noRequest: ITest = {
  name: 'should return stuff when queried',
  usingValues: [{ '@id': 10 }],
  requests: [],
};

export const passOn: ITest = {
  name: 'should return stuff when queried',
  usingValues: [{ '@id': 10 }],
  requests: [
    {
      headers: [{ 'Accept-Encoding': '*/*' }],
      method: 'get',
      url: 'http://example.org/@id',
      body: null,
      passOn: [{ '$..num': '_num' }, { '$..id': '_id' }],
      wait: null,
      expectedStatusCode: '200',
      jsonRules: [
        { '$..id': '@id' },
        { '$..title': 'each is a non empty string' },
        { '$..num': 'each is > 10' },
        { '$..books': 'count is "$..bookCount"' },
      ],
      headerRules: [{ 'Accept-Encoding': '*/*' }, { 'X-cache': true }],
    },
  ],
};

export const waitInLast: ITest = {
  name: 'should return stuff when queried',
  usingValues: [{ '@id': 10 }],
  requests: [
    {
      headers: [{ 'Accept-Encoding': '*/*' }],
      method: 'get',
      url: 'http://example.org/@id',
      body: null,
      passOn: [],
      wait: '5 seconds',
      expectedStatusCode: '200',
      jsonRules: [
        { '$..id': '@id' },
        { '$..title': 'each is a non empty string' },
        { '$..num': 'each is > 10' },
        { '$..books': 'count is "$..bookCount"' },
      ],
      headerRules: [{ 'Accept-Encoding': '*/*' }, { 'X-cache': true }],
    },
  ],
};

export const noConditions: ITest = {
  name: 'should return stuff when queried',
  usingValues: [{ '@id': 10 }],
  requests: [
    {
      headers: [{ 'Accept-Encoding': '*/*' }],
      method: 'get',
      url: 'http://example.org/@id',
      body: null,
      passOn: [],
      headerRules: [],
      expectedStatusCode: null,
      jsonRules: [],
      wait: null,
    },
  ],
};

export const valid: ITest = {
  name: 'should return stuff when queried',
  usingValues: [{ '@id': 10 }],
  requests: [
    {
      headers: [{ 'Accept-Encoding': '*/*' }],
      method: 'get',
      url: 'http://example.org/@id',
      body: null,
      passOn: [],
      wait: null,
      expectedStatusCode: '200',
      jsonRules: [
        { '$..id': '@id' },
        { '$..title': 'each is a non empty string' },
        { '$..num': 'each is > 10' },
        { '$..books': 'count is "$..bookCount"' },
      ],
      headerRules: [{ 'Accept-Encoding': '*/*' }, { 'X-cache': true }],
    },
  ],
};

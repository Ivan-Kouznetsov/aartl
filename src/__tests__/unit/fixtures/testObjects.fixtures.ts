import { ITest } from '../../../interfaces/test';

export const nonUniqueValues: ITest = {
  name: 'should return stuff when queried',
  usingValues: [{ '@id': 10 }, { '@id': 'random number up to 100' }, { '@txt': 'random string length 20' }],
  requests: [
    {
      headers: [{ 'Accept-Encoding': '*/*' }],
      method: 'get',
      url: 'http://example.org/@id',

      passOn: [],

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

      passOn: [],

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

      passOn: [{ '$..num': '_num' }, { '$..id': '_id' }],

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

      passOn: [],
      headerRules: [],

      jsonRules: [],
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

      passOn: [],

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

export const tooManyArgs: ITest = {
  name: 'should return stuff when queried',
  usingValues: [{ '@id': 10 }],
  requests: [
    {
      headers: [{ 'Accept-Encoding': '*/*' }],
      method: 'get',
      url: 'http://example.org/@id',

      passOn: [],
      headerRules: [],

      jsonRules: [{ '$..id': '>= 1 2' }],
    },
  ],
};

export const tooManyArgs1: ITest = {
  name: 'should return stuff when queried',
  usingValues: [{ '@id': 10 }],
  requests: [
    {
      headers: [{ 'Accept-Encoding': '*/*' }],
      method: 'get',
      url: 'http://example.org/@id',

      passOn: [],
      headerRules: [],

      jsonRules: [{ '$..id': 'is a number 1 2' }],
    },
  ],
};

export const isANumber: ITest = {
  name: 'should return stuff when queried',
  usingValues: [{ '@id': 10 }],
  requests: [
    {
      headers: [{ 'Accept-Encoding': '*/*' }],
      method: 'get',
      url: 'http://example.org/@id',

      passOn: [],
      headerRules: [],

      jsonRules: [{ '$..id': 'is a number' }],
    },
  ],
};

export const tooFewArgs: ITest = {
  name: 'should return stuff when queried',
  usingValues: [{ '@id': 10 }],
  requests: [
    {
      headers: [{ 'Accept-Encoding': '*/*' }],
      method: 'get',
      url: 'http://example.org/@id',

      passOn: [],
      headerRules: [],

      jsonRules: [{ '$..id': 'is any of' }],
    },
  ],
};

export const notTooManyArgs: ITest = {
  name: 'should return stuff when queried',
  usingValues: [{ '@id': 10 }],
  requests: [
    {
      headers: [{ 'Accept-Encoding': '*/*' }],
      method: 'get',
      url: 'http://example.org/@id',

      passOn: [],
      headerRules: [],

      jsonRules: [{ '$..id': '>= 1' }],
    },
  ],
};

export const nonUniquepassOnJsonPath: ITest = {
  name: 'should return stuff when queried',
  usingValues: [{ '@id': 10 }],
  requests: [
    {
      headers: [{ 'Accept-Encoding': '*/*' }],
      method: 'get',
      url: 'http://example.org/@id',

      passOn: [{ '$..id': '_id' }, { '$..id': '_id2' }],

      expectedStatusCode: '200',
      jsonRules: [
        { '$..id': '@id' },
        { '$..title': 'each is a non empty string' },
        { '$..num': 'each is > 10' },
        { '$..books': 'count is "$..bookCount"' },
      ],
      headerRules: [{ 'Accept-Encoding': '*/*' }, { 'X-cache': true }],
    },
    {
      headers: [{ 'Accept-Encoding': '*/*' }],
      method: 'get',
      url: 'http://example.org/@id',

      passOn: [],
      headerRules: [],

      jsonRules: [{ '$..id': 'hello' }],
    },
  ],
};

export const nonUniquepassOnNameValues: ITest = {
  name: 'should return stuff when queried',
  usingValues: [{ '@id': 10 }],
  requests: [
    {
      headers: [{ 'Accept-Encoding': '*/*' }],
      method: 'get',
      url: 'http://example.org/@id',

      passOn: [{ '$..id': '_id' }, { '$..id2': '_id' }],

      expectedStatusCode: '200',
      jsonRules: [
        { '$..id': '@id' },
        { '$..title': 'each is a non empty string' },
        { '$..num': 'each is > 10' },
        { '$..books': 'count is "$..bookCount"' },
      ],
      headerRules: [{ 'Accept-Encoding': '*/*' }, { 'X-cache': true }],
    },
    {
      headers: [{ 'Accept-Encoding': '*/*' }],
      method: 'get',
      url: 'http://example.org/@id',

      passOn: [],
      headerRules: [],

      jsonRules: [{ '$..id': 'hello' }],
    },
  ],
};

export const stringPassedToCount: ITest = {
  name: 'should return stuff when queried',
  usingValues: [{ '@id': 10 }],
  requests: [
    {
      headers: [{ 'Accept-Encoding': '*/*' }],
      method: 'get',
      url: 'http://example.org/@id',

      passOn: [],
      expectedStatusCode: '200',
      jsonRules: [{ '$..num': 'count > hello' }],
      headerRules: [{ 'Accept-Encoding': '*/*' }, { 'X-cache': true }],
    },
  ],
};

export const stringPassedToMatch: ITest = {
  name: 'should return stuff when queried',
  usingValues: [{ '@id': 10 }],
  requests: [
    {
      headers: [{ 'Accept-Encoding': '*/*' }],
      method: 'get',
      url: 'http://example.org/@id',

      passOn: [],
      expectedStatusCode: '200',
      jsonRules: [{ '$..num': 'matches ((((' }],
      headerRules: [{ 'Accept-Encoding': '*/*' }, { 'X-cache': true }],
    },
  ],
};

export const numberPassedToCount: ITest = {
  name: 'should return stuff when queried',
  usingValues: [{ '@id': 10 }],
  requests: [
    {
      headers: [{ 'Accept-Encoding': '*/*' }],
      method: 'get',
      url: 'http://example.org/@id',

      passOn: [],
      expectedStatusCode: '200',
      jsonRules: [{ '$..num': 'count > 0' }],
      headerRules: [{ 'Accept-Encoding': '*/*' }, { 'X-cache': true }],
    },
  ],
};

export const regexPassedToMatch: ITest = {
  name: 'should return stuff when queried',
  usingValues: [{ '@id': 10 }],
  requests: [
    {
      headers: [{ 'Accept-Encoding': '*/*' }],
      method: 'get',
      url: 'http://example.org/@id',

      passOn: [],
      expectedStatusCode: '200',
      jsonRules: [{ '$..num': 'matches /aaa/' }],
      headerRules: [{ 'Accept-Encoding': '*/*' }, { 'X-cache': true }],
    },
  ],
};

export const invalidDate: ITest = {
  name: 'should return stuff when queried',
  usingValues: [],
  requests: [
    {
      headers: [],
      method: 'get',
      url: 'http://example.org/',

      passOn: [],
      expectedStatusCode: '200',
      jsonRules: [{ '$..date': 'is as early as ((((' }],
      headerRules: [],
    },
  ],
};

export const numbericSortDirection: ITest = {
  name: 'should return stuff when queried',
  usingValues: [],
  requests: [
    {
      headers: [],
      method: 'get',
      url: 'http://example.org/',

      passOn: [],
      expectedStatusCode: '200',
      jsonRules: [{ '$..date': 'is sorted 1' }],
      headerRules: [],
    },
  ],
};

export const validDate: ITest = {
  name: 'should return stuff when queried',
  usingValues: [],
  requests: [
    {
      headers: [],
      method: 'get',
      url: 'http://example.org/',

      passOn: [],
      expectedStatusCode: '200',
      jsonRules: [{ '$..date': 'as early as Jan 10 2000' }],
      headerRules: [],
    },
  ],
};

export const okSortDirection: ITest = {
  name: 'should return stuff when queried',
  usingValues: [],
  requests: [
    {
      headers: [],
      method: 'get',
      url: 'http://example.org/',

      passOn: [],
      expectedStatusCode: '200',
      jsonRules: [{ '$..date': 'is sorted asc' }],
      headerRules: [],
    },
  ],
};

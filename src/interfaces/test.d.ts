import { ArgCount } from '../enums/argCount';
import { NotFound } from '../rules/notFound';

export interface IKeyValuePair {
  [key: string]: string | number | boolean;
}

export interface IRequest {
  headers: IKeyValuePair[];
  method?: string;
  url?: string;
  body?: string;
  passOn: IKeyValuePair[];
  wait?: string;
  expectedStatusCode?: string;
  jsonRules: IKeyValuePair[]; // notably an array not a hash map
  headerRules: IKeyValuePair[];
}

export interface ITest {
  name: string;
  usingValues: IKeyValuePair[];
  requests: IRequest[];
}

export interface IMatcher {
  factory: Factory;
  args: (string | number)[];
  expectedArgs: ArgCount;
}

export type Primitive = boolean | string | number | Record<string, unknown>;
export type MatcherResult = Primitive | typeof NotFound;
export type MatcherFunction = (arr: Primitive[]) => MatcherResult;
export type Factory = (arg?: Primitive | Primitive[]) => MatcherFunction;

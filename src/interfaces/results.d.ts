export interface IRequestLog {
  duration: number;
  sent: string;
  received: string;
}

export interface ITestResult {
  testName: string;
  passed: boolean;
  failReasons: string[];
  duration: number;
  requestLogs: IRequestLog[];
}

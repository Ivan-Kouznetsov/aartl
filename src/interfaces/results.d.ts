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

export interface ITestReport {
  testName: string;
  runs: number;
  failures: number;
  failureRate: number;
}

export interface IReport {
  testReports: ITestReport[];
  medianFailureRate: number;
  rangeOfFailureRates: { min: number; max: number };
}

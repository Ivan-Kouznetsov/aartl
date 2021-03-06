export interface IHashTable {
  [key: string]: string;
}
export interface IRequestLog {
  duration: number;
  sent: {
    url?: string;
    body?: string;
    headers: IHashTable;
    method?: string;
  };
  received: {
    json: Record<string, unknown> | null;
    string: string;
    headers: IHashTable;
    status?: number;
  };
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

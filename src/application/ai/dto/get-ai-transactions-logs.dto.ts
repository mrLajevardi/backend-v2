interface AiTransactionLogDto {
  id: string;
  serviceInstanceId: string;
  dateTime: Date;
  description: string;
  request: string;
  body: string;
  response: string;
  method: string;
  codeStatus: number;
  methodName: string;
  ip: string;
}

interface GetAiTransactionsLogsDto {
  aiTransactionsLogs: AiTransactionLogDto[];
  countAll: number;
}

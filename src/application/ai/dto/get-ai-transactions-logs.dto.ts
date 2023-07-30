interface AiTransactionLogDto {
  ID: string;
  ServiceInstanceID: string;
  DateTime: Date;
  Description: string;
  Request: string;
  Body: string;
  Response: string;
  Method: string;
  CodeStatus: number;
  MethodName: string;
  IP: string;
}

interface GetAiTransactionsLogsDto {
  aiTransactionsLogs: AiTransactionLogDto[];
  countAll: number;
}

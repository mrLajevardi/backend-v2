export interface GetAradAiDashoardDto {
  token: string;
  usedPerDay: number;
  allRequestused: number;
  usedPerMonth: MonthlyUsageDto[];
  creditUsed: number;
  creditRemaining: number | null;
  remainingDays: number;
  numberOfServiceCalled: Record<string, number>;
  QualityPlan: QualityPlanDto;
}

export interface MonthlyUsageDto {
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

export interface QualityPlanDto {
  qualityPlanCode: string;
  createdDate: Date;
  userId: string;
  duration: number;
  expireDate: Date;
  costPerRequest: number;
  costPerMonth: number;
  iat: number;
}

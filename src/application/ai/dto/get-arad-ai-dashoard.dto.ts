export interface GetAradAiDashoardDto {
  token: string;
  usedPerDay: number;
  allRequestused: number;
  usedPerMonth: number;
  creditUsed: number;
  creditRemaining: number | null;
  remainingDays: number;
  numberOfServiceCalled: Record<string, number>;
  QualityPlan: QualityPlanDto;
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

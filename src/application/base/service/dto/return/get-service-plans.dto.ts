import { Plans } from "src/infrastructure/database/entities/Plans";

export class GetServicePlansReturnDto {
  vdc: {
    servicePeriods: {
      oneMonthPeriod: Plans;
      sixMonthPeriod: Plans;
      threeMonthPeriod: Plans;
    };
    qualityPlans: {
      vdcBronze: Plans;
      vdcGold: Plans;
      vdcSilver: Plans;
    };
  };
}

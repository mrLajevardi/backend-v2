import { Injectable } from '@nestjs/common';
import { PlansService } from '../../../plans/plans.service';
import { ServiceChecksService } from '../../../service/service-instances/service/service-checks/service-checks.service';
import { MaxAvailableServiceException } from 'src/infrastructure/exceptions/max-available-service.exception';
import { InvalidQualityPlanException } from 'src/infrastructure/exceptions/invalid-quality-plan.exception';

@Injectable()
export class InvoicesChecksService {
  constructor(private readonly plansService: PlansService) {}

  async checkPlanCondition(data, serviceId, duration) {
    const plansList = await this.plansService.find();
    let matchedPlansList = [];
    data.forEach((el) =>
      matchedPlansList.push(plansList.find((element) => element.code == el)),
    );
    matchedPlansList = Array.from(new Set(matchedPlansList));

    if (matchedPlansList.includes(undefined)) {
      const error = new InvalidQualityPlanException();
      return Promise.reject(error);
    }

    // replacing condition keys
    matchedPlansList.forEach((el) => {
      el.Condition = el.Condition.replace('@ServiceTypeID', `'${serviceId}'`);
      el.Condition = el.Condition.replace('@duration', `${duration}`);
    });

    for (const item of matchedPlansList) {
      let planValidationSql = `SELECT Code, CASE  WHEN  parameters THEN 'true' ELSE 'false' END as approved  FROM [services].[Plans]`;
      planValidationSql = planValidationSql.replace(
        'parameters',
        item.Condition,
      );

      const executedSql = await this.plansService.serviceInstanceExe(
        planValidationSql,
      );
      if (executedSql[0].approved == 'false') {
        const err = new InvalidQualityPlanException();
        return Promise.reject(err);
      }
    }
    return matchedPlansList;
  }
}

import { Injectable } from '@nestjs/common';
import { InvalidQualityPlanException } from 'src/infrastructure/exceptions/invalid-quality-plan.exception';
import { PlansTableService } from '../../crud/plans-table/plans-table.service';
import { PlansQueryService } from '../../crud/plans-table/plans-query.service';

@Injectable()
export class InvoicesChecksService {
  constructor(
    private readonly plansTable: PlansTableService,
    private readonly plansQuery: PlansQueryService,
    ) {}

  async checkPlanCondition(data, serviceId, duration) {
    const plansList = await this.plansTable.find();
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

      const executedSql = await this.plansQuery.serviceInstanceExe(
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

import { BadRequestException, Injectable } from '@nestjs/common';
import { InvalidQualityPlanException } from 'src/infrastructure/exceptions/invalid-quality-plan.exception';
import { PlansTableService } from '../../crud/plans-table/plans-table.service';
import { PlansQueryService } from '../../crud/plans-table/plans-query.service';
import { MaxAvailableServiceException } from 'src/infrastructure/exceptions/max-available-service.exception';
import { ServiceItemsTableService } from '../../crud/service-items-table/service-items-table.service';

@Injectable()
export class InvoicesChecksService {
  constructor(
    private readonly plansTable: PlansTableService,
    private readonly plansQuery: PlansQueryService,
    private readonly serviceInstancesTable: ServiceItemsTableService,
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

  async checkInvoiceItems(itemTypes, items, serviceTypeId) {
    const convertedItemTypes = {};
    for (const item of items) {
      convertedItemTypes[item.itemCode] = item;
    }
    for (const itemType of itemTypes) {
      console.log(convertedItemTypes, itemType.Code);
      if (convertedItemTypes[itemType.Code]) {
        console.log(convertedItemTypes[itemType.Code]);
        const maxPerRequestRule =
          parseInt(convertedItemTypes[itemType.Code].quantity) >
          itemType.MaxPerRequest;
        const minPerRequestRule =
          parseInt(convertedItemTypes[itemType.Code].quantity) <
          itemType.MinPerRequest;
        if (maxPerRequestRule || minPerRequestRule) {
          throw new BadRequestException();
        }
      }
    }
  }

  async checkServiceMaxAvailable(
    unlimitedService,
    serviceTypeMaxAvailable,
    serviceId,
    userId,
  ) {
    const isMaxAvailable = await this.checkMaxService(
      unlimitedService,
      serviceTypeMaxAvailable,
      serviceId,
      userId,
    );
    if (!isMaxAvailable) {
      throw new MaxAvailableServiceException();
    }
  }

  // Moved from service checks
  async checkMaxService(unlimitedMax, serviceMaxAvailable, serviceId, userId) {
    // checks max service
    const userServiceCount = await this.serviceInstancesTable.count({
      where: {
        and: [{ UserID: userId }, { ServiceTypeID: serviceId }],
      },
    });
    if (
      serviceMaxAvailable <= userServiceCount &&
      serviceMaxAvailable !== unlimitedMax
    ) {
      return false;
    }
    return true;
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { InvalidQualityPlanException } from 'src/infrastructure/exceptions/invalid-quality-plan.exception';
import { PlansTableService } from '../../crud/plans-table/plans-table.service';
import { PlansQueryService } from '../../crud/plans-table/plans-query.service';
import { MaxAvailableServiceException } from 'src/infrastructure/exceptions/max-available-service.exception';
import { ServiceInstancesTableService } from '../../crud/service-instances-table/service-instances-table.service';
import { Plans } from 'src/infrastructure/database/entities/Plans';
import { CreatePlansDto } from '../../crud/plans-table/dto/create-plans.dto';
import { ItemTypes } from 'src/infrastructure/database/entities/ItemTypes';
import { InvoiceItemsDto } from '../dto/create-service-invoice.dto';

@Injectable()
export class InvoicesChecksService {
  constructor(
    private readonly plansTable: PlansTableService,
    private readonly plansQuery: PlansQueryService,
    private readonly serviceInstancesTable: ServiceInstancesTableService,
  ) {}

  /**
  async checkPlanCondition(
    data: string[],
    serviceId: string,
    duration: number,
  ): Promise<CreatePlansDto[]> {
    const plansList: Plans[] = await this.plansTable.find();
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
      el.condition = el.condition.replace('@ServiceTypeID', `'${serviceId}'`);
      el.condition = el.condition.replace('@duration', `${duration}`);
    });

    for (const item of matchedPlansList) {
      let planValidationSql = `SELECT * FROM [services].[Plans]`;
      planValidationSql = planValidationSql.replace(
        'parameters',
        item.condition,
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

  async checkInvoiceItems(
    itemTypes: ItemTypes[],
    items: InvoiceItemsDto[],
    //serviceTypeId: string,
  ): Promise<void> {
    const convertedItemTypes = {};
    for (const item of items) {
      convertedItemTypes[item.itemCode] = item;
    }
    for (const itemType of itemTypes) {
      if (convertedItemTypes[itemType.code]) {
        console.log(convertedItemTypes[itemType.code]);
        const maxPerRequestRule =
          parseInt(convertedItemTypes[itemType.code].quantity) >
          itemType.maxPerRequest;
        const minPerRequestRule =
          parseInt(convertedItemTypes[itemType.code].quantity) <
          itemType.minPerRequest;
        if (maxPerRequestRule || minPerRequestRule) {
          throw new BadRequestException();
        }
      }
    }
  }

  async checkServiceMaxAvailable(
    unlimitedService: number,
    serviceTypeMaxAvailable: number,
    serviceId: string,
    userId: number,
  ): Promise<void> {
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
  async checkMaxService(
    unlimitedMax: number,
    serviceMaxAvailable: number,
    serviceId: string,
    userId: number,
  ): Promise<boolean> {
    // checks max service
    const userServiceCount = await this.serviceInstancesTable.count({
      where: {
        userId,
        serviceTypeId: serviceId,
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
  */
}

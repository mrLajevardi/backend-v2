import { Injectable } from '@nestjs/common';
import { EntityLogTableService } from '../../crud/entity-log-table/entity-log-table.service';
import { SessionRequest } from '../../../../infrastructure/types/session-request.type';
import { FindManyOptions, Like } from 'typeorm';
import { isNil } from 'lodash';
import { EntityLog } from '../../../../infrastructure/database/entities/EntityLog';

@Injectable()
export class EntityLogService {
  constructor(private readonly EntityLogTableService: EntityLogTableService) {}

  async filter(
    options: SessionRequest,
    entityType: string,
    entityId: number,
    field?: string | null,
  ): Promise<EntityLog[] | null> {
    const filterConditions: any = {
      entityType: entityType,
      entityId: entityId,
    };
    if (!isNil(field)) {
      filterConditions.fields = Like(`%${field}%`);
    }
    const data = await this.EntityLogTableService.find({
      where: filterConditions,
      relations: ['user'],
    });
    return data;
  }
}

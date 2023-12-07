import {
  EntitySubscriberInterface,
  EventSubscriber,
  UpdateEvent,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ClsService, ClsServiceManager } from 'nestjs-cls';
import { EntityLog } from '../entities/EntityLog';
import { CreateEntityLogDto } from '../../../application/base/crud/entity-log-table/dto/create-entity-log.dto';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';

@Injectable()
@EventSubscriber()
export class EntitySubscriber implements EntitySubscriberInterface {
  private cls: ClsService;

  constructor() {
    this.cls = ClsServiceManager.getClsService();
  }

  async afterUpdate(event: UpdateEvent<any>) {
    console.log(event);
    const data: CreateEntityLogDto = {
      userId: parseInt(this.cls.get('userId')),
      entityType: event.entity.constructor.name.toString(),
      entityId: event.databaseEntity?.id,
      before: JSON.stringify(event.databaseEntity),
      after: JSON.stringify(event.entity),
    };
    console.log(data);
    const updatedColumns = [];

    event.updatedColumns.map((item: ColumnMetadata) => {
      updatedColumns.push(item.propertyName);
    });
    data.fields = JSON.stringify(updatedColumns);

    await event.manager.getRepository(EntityLog).save(data);
  }
}

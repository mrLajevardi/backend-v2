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
import { isNil } from 'lodash';

@Injectable()
@EventSubscriber()
export class EntitySubscriber implements EntitySubscriberInterface {
  private cls: ClsService;
  private model: any;
  constructor() {
    this.cls = ClsServiceManager.getClsService();
  }

  afterLoad(entity: any): Promise<any> | void {
    this.model = entity;
  }
  async beforeUpdate(event: UpdateEvent<any>) {
    this.cls.set('beforeEntityObject', JSON.stringify(this.model));
  }
  async afterUpdate(event: UpdateEvent<any>) {
    const entityName = event.metadata.tableName;

    const after: Partial<any> = Object.assign(
      event.databaseEntity ?? this.model,
      event.entity,
    );

    const before = this.cls.get('beforeEntityObject');

    const data: CreateEntityLogDto = {
      userId: parseInt(this.cls.get('userId')),
      entityType: entityName.toString(),
      entityId: event.databaseEntity ? event.databaseEntity.id : this.model?.id,
      before: !isNil(event.databaseEntity)
        ? JSON.stringify(event.databaseEntity)
        : before,
      after: JSON.stringify(after),
    };

    let updatedColumns = [];

    if (!isNil(event.updatedColumns) && event.updatedColumns.length > 0) {
      event.updatedColumns.map((item: ColumnMetadata) => {
        updatedColumns.push(item.propertyName);
      });
    } else {
      updatedColumns = Object.keys(event.entity);
    }

    data.fields = JSON.stringify(updatedColumns);

    await event.manager.getRepository(EntityLog).save(data);
  }
}

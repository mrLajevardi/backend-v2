import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServiceInstances } from './ServiceInstances';
import { ItemTypes } from './ItemTypes';

@Index('PK_AITransactionsLogs', ['id'], { unique: true })
@Entity('AITransactionsLogs', { schema: 'user' })
export class AiTransactionsLogs {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'ID' })
  id: string;
  @Column('uniqueidentifier', {
    name: 'ServiceInstanceID',
  })
  serviceInstanceId: string;

  @Column('datetime', { name: 'DateTime' })
  dateTime: Date;

  @Column('int', { name: 'ItemTypeID' })
  itemTypeId: number;

  @Column('nchar', { name: 'Description', nullable: true, length: 50 })
  description: string | null;

  @Column('nvarchar', { name: 'Request' })
  request: string;

  @Column('nvarchar', { name: 'Body' })
  body: string;

  @Column('nvarchar', { name: 'Response' })
  response: string;

  @Column('nvarchar', { name: 'Method' })
  method: string;

  @Column('int', { name: 'CodeStatus', default: () => '(200)' })
  codeStatus: number;

  @Column('nvarchar', { name: 'MethodName' })
  methodName: string;

  @Column('nvarchar', { name: 'IP' })
  ip: string;

  @ManyToOne(() => ItemTypes, (itemTypes) => itemTypes.aiTransactionsLogs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'ItemTypeID', referencedColumnName: 'id' }])
  itemType: ItemTypes;

  @ManyToOne(
    () => ServiceInstances,
    (serviceInstances) => serviceInstances.aiTransactionsLogs,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'ServiceInstanceID', referencedColumnName: 'id' }])
  serviceInstance: ServiceInstances;
}

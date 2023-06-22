import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ItemTypes } from './ItemTypes';
import { ServiceInstances } from './ServiceInstances';

@Index('PK_AITransactionsLogs', ['id'], { unique: true })
@Entity()
export class AiTransactionsLogs {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: string;

  @Column('datetime', { name: 'DateTime' })
  dateTime: Date;

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

  @Column('integer', { name: 'CodeStatus', default: () => '(200)' })
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

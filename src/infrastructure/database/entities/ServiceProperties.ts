import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServiceInstances } from './ServiceInstances';
import { isTestingEnv } from 'src/infrastructure/helpers/helpers';

@Index('IX_ServiceProperties', ['serviceInstanceId'], {})
@Index('PK_ServiceProperties', ['id'], { unique: true })
@Entity('ServiceProperties', { schema: 'user' })
export class ServiceProperties {
  @Column(isTestingEnv() ? 'text' : 'uniqueidentifier', {
    name: 'ServiceInstanceID',
  })
  serviceInstanceId: string;

  @Column('varchar', { name: 'PropertyKey', length: 50 })
  propertyKey: string;

  @Column('nvarchar', { name: 'Value', nullable: true })
  value: string | null;

  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @ManyToOne(
    () => ServiceInstances,
    (serviceInstances) => serviceInstances.serviceProperties,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'ServiceInstanceID', referencedColumnName: 'id' }])
  serviceInstance: ServiceInstances;
}

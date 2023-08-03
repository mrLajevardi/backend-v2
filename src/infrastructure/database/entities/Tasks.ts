import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServiceInstances } from './ServiceInstances';
import { randomUUID } from 'crypto';
import { isTestingEnv } from 'src/infrastructure/helpers/helpers';

@Index('PK__tasks__7C6949D195E39C4E', ['taskId'], { unique: true })
@Entity('Tasks', { schema: 'user' })
export class Tasks {
  @Column(isTestingEnv ? 'text' : 'uniqueidentifier', { name: 'TaskID', primary: true })
  taskId: string;

  @Column('int', { name: 'UserID' })
  userId: number;

  @Column('varchar', { name: 'Operation', length: 255 })
  operation: string;

  @Column('nvarchar', { name: 'Details', nullable: true })
  details: string | null;

  @Column('datetime', { name: 'StartTime', nullable: true })
  startTime: Date | null;

  @Column('datetime', { name: 'EndTime', nullable: true })
  endTime: Date | null;

  @Column('varchar', { name: 'Status', nullable: true, length: 255 })
  status: string | null;

  @Column('nvarchar', { name: 'Arguments', nullable: true })
  arguments: string | null;

  @Column('int', { name: 'StepCounts', nullable: true })
  stepCounts: number | null;

  @Column(isTestingEnv ? 'text' : 'uniqueidentifier', { name: 'ServiceInstanceID' })
  serviceInstanceId: string;

  //@Column('varchar', { name: 'CurrrentStep', nullable: true, length: 60 })
  //currrentStep: string | null;

  @ManyToOne(
    () => ServiceInstances,
    (serviceInstances) => serviceInstances.tasks,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn([{ name: 'ServiceInstanceID', referencedColumnName: 'id' }])
  serviceInstance: ServiceInstances;
  @BeforeInsert()
  setId() {
    this.taskId = randomUUID();
  }
}

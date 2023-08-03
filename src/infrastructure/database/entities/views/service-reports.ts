import { isTestingEnv } from 'src/infrastructure/helpers/helpers';
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({
  schema: 'user',
  name: 'ServiceReports',
})
export class ServiceReports {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'integer' })
  UserID: number;

  @Column({ type: isTestingEnv() ? 'date' : 'timestamp' })
  CreateDate: Date;

  @Column({ type: isTestingEnv() ? 'date' : 'timestamp' })
  ExpireDate: Date;

  @Column()
  ServiceName: string;

  @Column()
  ServiceTypeID: string;

  @Column()
  Name: string;

  @Column()
  Family: string;

  @Column()
  OrgName: string;

  @Column({ type: isTestingEnv() ? 'boolean' : 'bit' })
  IsExpired: boolean;
}

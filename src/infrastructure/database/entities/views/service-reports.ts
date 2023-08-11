import { isTestingEnv } from 'src/infrastructure/helpers/helpers';
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({
  schema: 'user',
  name: 'ServiceReports',
})
export class ServiceReports {

  @PrimaryColumn('nvarchar', { name: 'id', type: 'uuid' })
  id: string;

  @Column('int',{ name: 'UserID' })
  userId: number;

  @Column({ type: isTestingEnv() ? 'date' : 'timestamp', name: 'CreateDate' })
  createDate: Date;

  @Column({ type: isTestingEnv() ? 'date' : 'timestamp', name: 'ExpireDate' })
  expireDate: Date;

  @Column({name: 'ServiceName'})
  serviceName: string;

  @Column({name: 'ServiceTypeID'})
  serviceTypeId: string;

  @Column({name: 'Name'})
  name: string;

  @Column({name: 'Family'})
  family: string;

  @Column({name: 'OrgName'})
  orgName: string;

  @Column({ type: isTestingEnv() ? 'boolean' : 'bit', name: 'IsExpired' })
  isExpired: boolean;
}

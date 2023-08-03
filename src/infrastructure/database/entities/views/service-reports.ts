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

  @Column({ type: 'timestamp' })
  CreateDate: Date;

  @Column({ type: 'timestamp' })
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

  @Column({ type: 'bit' })
  IsExpired: boolean;
}

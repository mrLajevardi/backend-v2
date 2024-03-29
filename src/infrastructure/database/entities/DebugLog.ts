import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('PK__DataLog__3214EC2711DC71D1', ['id'], { unique: true })
@Entity('DebugLog', { schema: 'logs' })
export class DebugLog {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('int', { name: 'UserID', nullable: true })
  userId: number | null;

  @Column('datetime', { name: 'TimeStamp' })
  timeStamp: Date;

  @Column('nvarchar', { name: 'Url' })
  url: string;

  @Column('int', { name: 'StatusCode' })
  statusCode: number;

  @Column('nvarchar', { name: 'Request', nullable: true })
  request: string | null;

  @Column('nvarchar', { name: 'Response', nullable: true })
  response: string | null;

  @Column('varchar', { name: 'Method', nullable: true, length: 255 })
  method: string | null;

  @Column('varchar', { name: 'IP', nullable: true, length: 40 })
  ip: string | null;
}

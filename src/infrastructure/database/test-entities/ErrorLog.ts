import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('PK__ErrorLog__3213E83F8E8044CE', ['id'], { unique: true })
@Entity()
export class ErrorLog {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column('integer', { name: 'userId', nullable: true })
  userId: number | null;

  @Column('nvarchar', { name: 'message', nullable: true })
  message: string | null;

  @Column('nvarchar', { name: 'stackTrace', nullable: true })
  stackTrace: string | null;

  @Column('datetime', { name: 'timeStamp', nullable: true })
  timeStamp: Date | null;

  @Column('nvarchar', { name: 'request', nullable: true })
  request: string | null;
}

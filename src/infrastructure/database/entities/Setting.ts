import { isTestingEnv } from 'src/infrastructure/helpers/helpers';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('PK__Setting__3214EC07107FD346', ['id'], { unique: true })
@Entity('Setting', { schema: 'security' })
export class Setting {
  @PrimaryGeneratedColumn({ type: 'int', name: 'Id' })
  id: number;

  @Column('int', { name: 'UserId', nullable: true })
  userId: number | null;

  @Column('nvarchar', { name: 'Key', length: 50 })
  key: string;

  @Column(isTestingEnv() ? 'text' : 'ntext', { name: 'Value', nullable: true })
  value: string | null;

  @Column('datetime', { name: 'InsertTime', default: () => isTestingEnv() ? 'CURRENT_TIMESTAMP' : 'getdate()' })
  insertTime: Date;

  @Column('datetime', { name: 'UpdateTime', default: () => isTestingEnv() ? 'CURRENT_TIMESTAMP' : 'getdate()' })
  updateTime: Date;
}

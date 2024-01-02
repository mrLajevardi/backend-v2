import { Column, Entity } from 'typeorm';

// @Index('index_zare_IsDeleted', ['isDeleted'], {})
// @Index('PK_ServiceInstances', ['id'], { unique: true })
@Entity('V_Reports_User', { schema: 'security' })
export class VReportsUser {
  @Column('int', { name: 'UserID', primary: true })
  userId: number;

  @Column('int', { name: 'ServiceExpiredCount', nullable: true })
  serviceExpiredCount: number | null;

  @Column('int', { name: 'ActiveInvoices', nullable: true })
  activeInvoices: number | null;

  @Column('int', { name: 'ServiceNeedBudgetCount', nullable: true })
  serviceNeedBudgetCount: number | null;

  // @Column('int', { name: 'ServiceCount', nullable: true })
  // serviceCount: number | null;

  @Column('int', { name: 'TicketCount', nullable: true })
  ticketCount: number | null;

  guid: string;
  id: number;
}

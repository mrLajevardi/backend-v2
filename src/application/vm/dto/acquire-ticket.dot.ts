import { ApiProperty } from '@nestjs/swagger';

export class AcquireVappTicketReturnDto {
  @ApiProperty({ type: String, description: 'ticketId' })
  ticket: string | null;
}

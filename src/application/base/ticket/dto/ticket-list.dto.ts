import { ApiProperty } from '@nestjs/swagger';
import { TicketTopics } from '../../crud/tickets-table/enum/ticket-topics.enum';

export class TicketListDto {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  state: string;

  @ApiProperty({ enum: TicketTopics })
  topic: TicketTopics;

  @ApiProperty({ type: String })
  group: string;
}

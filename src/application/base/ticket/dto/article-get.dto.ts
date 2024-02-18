import { ArticleListDto } from './article-list.dto';
import { TicketTopics } from '../../crud/tickets-table/enum/ticket-topics.enum';

export class ArticleGetDto {
  topic?: TicketTopics;
  ticket_code?: number;
  group?: string;
  articles?: any[];
  state?: string;
  title?: string;
}

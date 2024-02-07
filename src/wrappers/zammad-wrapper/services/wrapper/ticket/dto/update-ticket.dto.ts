import { ZammadTicketStatesEnum } from '../enum/zammad-ticket-states.enum';

export interface UpdateTicketDto {
  title?: string;
  group?: string;
  state?: ZammadTicketStatesEnum;
  priority?: string;
  article?: Article;
  ticket_code?: number;
}

export interface Article {
  subject: string;
  body: string;
  internal: boolean;
}

export interface UpdateTicketDto {
  title: string;
  group: string;
  state: string;
  priority: string;
  article: Article;
}

export interface Article {
  subject: string;
  body: string;
  internal: boolean;
}

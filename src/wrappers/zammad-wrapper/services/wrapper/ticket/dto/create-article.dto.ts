import { ZammadArticleTypeEnum } from '../enum/zammad-article-type.enum';

export interface CreateArticleDto {
  ticket_id: number;
  to?: string;
  cc?: string;
  subject?: string;
  body: string;
  content_type?: string;
  type: ZammadArticleTypeEnum;
  internal?: boolean;
  time_unit?: string;
  attachments?: Attachment[];
}

export interface Attachment {
  filename: string;
  data: string;
  'mime-type': string;
}

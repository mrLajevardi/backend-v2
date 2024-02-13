import { ZammadArticleTypeEnum } from '../enum/zammad-article-type.enum';

export interface GetTicketArticlesDto {
  id: number;
  ticket_id: number;
  type_id: number;
  sender_id: number;
  from: string;
  to: string;
  cc: null;
  subject: null;
  reply_to: null;
  message_id: null;
  message_id_md5: null;
  in_reply_to: null;
  content_type: string;
  references: null;
  body: string;
  internal: boolean;
  preferences: {
    highlight: string;
  };
  updated_by_id: number;
  created_by_id: number;
  origin_by_id: null;
  created_at: Date;
  updated_at: Date;
  attachments: any[];
  type: ZammadArticleTypeEnum;
  sender: string;
  created_by: string;
  updated_by: string;
  time_unit?: null;
}

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

export interface CreateArticleResultDto {
  id: number;
  ticket_id: number;
  type_id: number;
  sender_id: number;
  from: string;
  to: null;
  cc: null;
  subject: string;
  reply_to: null;
  message_id: null;
  message_id_md5: null;
  in_reply_to: null;
  content_type: string;
  references: null;
  body: string;
  internal: boolean;
  preferences: any;
  updated_by_id: number;
  created_by_id: number;
  origin_by_id: null;
  created_at: Date;
  updated_at: Date;
  attachments: any[];
  type: string;
  sender: string;
  created_by: string;
  updated_by: string;
}

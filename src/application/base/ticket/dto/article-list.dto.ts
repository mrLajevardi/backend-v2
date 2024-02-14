import { ApiProperty } from '@nestjs/swagger';
import { ZammadArticleTypeEnum } from '../../../../wrappers/zammad-wrapper/services/wrapper/ticket/enum/zammad-article-type.enum';

class Attachment {
  @ApiProperty({ type: String })
  data: string;

  @ApiProperty({ type: String })
  'mime-type': string;

  @ApiProperty({ type: String })
  filename: string;
}
export class ArticleListDto {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: Number })
  ticket_id: number;

  @ApiProperty({ type: String })
  body: string;

  @ApiProperty({ type: Boolean })
  internal: boolean;

  preferences: null;

  attachments: Attachment[];

  @ApiProperty({ enum: ZammadArticleTypeEnum })
  type: ZammadArticleTypeEnum;
}

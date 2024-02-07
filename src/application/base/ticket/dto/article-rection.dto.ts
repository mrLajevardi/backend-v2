import { ApiProperty } from '@nestjs/swagger';
import { ArticleReactionEnum } from '../enum/article-reaction.enum';
import { IsEnum, IsNumber } from 'class-validator';

export class ArticleReactionDto {
  @IsEnum(ArticleReactionEnum)
  @ApiProperty({ enum: ArticleReactionEnum })
  reaction: ArticleReactionEnum;

  @ApiProperty({ type: Number })
  @IsNumber()
  articleId: number;
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsObject,
  IsOptional,
} from 'class-validator';
import { Attachment } from './create-ticket.dto';
import { Type } from 'class-transformer';

export class ReplyTicketDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ type: [Attachment] })
  @Type(() => Attachment)
  @ValidateNested({ each: true })
  @IsObject({ each: true })
  @IsOptional()
  attachments?: Attachment[];
}

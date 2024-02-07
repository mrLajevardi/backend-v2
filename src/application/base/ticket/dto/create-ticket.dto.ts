import {
  IsString,
  IsNotEmpty,
  IsEnum,
  ValidateNested,
  IsObject,
  IsOptional,
} from 'class-validator';
import { ZammadGroupsEnum } from '../../../../wrappers/zammad-wrapper/services/wrapper/user/enum/zammad-groups.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TicketTopics } from '../../crud/tickets-table/enum/ticket-topics.enum';

export class Attachment {
  @ApiProperty({ type: String })
  @IsString()
  filename: string;

  @ApiProperty({ type: String })
  @IsString()
  data: string;

  @ApiProperty({ type: String })
  @IsString()
  'mime-type': string;
}
export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  message: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  subject: string;

  @IsString()
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsOptional()
  serviceInstanceId?: string;

  @IsEnum(ZammadGroupsEnum)
  @ApiProperty({ enum: ZammadGroupsEnum })
  group: string;

  @ApiProperty({ type: [Attachment] })
  @Type(() => Attachment)
  @ValidateNested({ each: true })
  @IsObject({ each: true })
  @IsOptional()
  attachments?: Attachment[];

  @ApiProperty({ enum: TicketTopics })
  @IsEnum(TicketTopics)
  topic: TicketTopics;
}

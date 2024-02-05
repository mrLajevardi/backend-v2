import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ZammadGroupsEnum } from '../../../../wrappers/zammad-wrapper/services/wrapper/user/enum/zammad-groups.enum';
import { ApiProperty } from '@nestjs/swagger';

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
  serviceInstanceId: string;

  @IsEnum(ZammadGroupsEnum)
  @ApiProperty({ enum: ZammadGroupsEnum })
  group: string;
}

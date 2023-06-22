import { IsDate, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateGroupsMappingDto {
  @IsDate()
  @ApiProperty()
  updateDate?: Date;

  @IsInt()
  @ApiProperty()
  groupId?: number;

  @IsInt()
  @ApiProperty()
  userId?: number;
}

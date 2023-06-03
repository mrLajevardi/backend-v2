import { IsDate, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupsMappingDto {
  @IsDate()
  @ApiProperty()
  createDate: Date;

  @IsInt()
  @ApiProperty()
  groupId: number;

  @IsInt()
  @ApiProperty()
  userId: number;
}

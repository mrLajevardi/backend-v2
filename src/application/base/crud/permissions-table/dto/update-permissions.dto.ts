import { IsInt, IsString, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePermissionsDto {
  @IsInt()
  @ApiProperty()
  id?: number;

  @IsString()
  @ApiProperty()
  name?: string;

  @IsString()
  @ApiProperty()
  description?: string;

  @IsDate()
  @ApiProperty()
  updateDate?: Date;
}

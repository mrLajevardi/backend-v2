import { IsInt, IsString, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePermissionGroupDto {
  @IsInt()
  @ApiProperty()
  id?: number;

  @IsString()
  @ApiProperty()
  name?: string;

  @IsString()
  @ApiProperty({ required: false })
  description?: string | null;

  @IsDate()
  @ApiProperty({ type: String, format: 'date-time', required: false })
  updateDate?: Date | null;
}

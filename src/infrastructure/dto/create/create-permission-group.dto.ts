import { IsInt, IsString, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionGroupDto {
  @IsInt()
  @ApiProperty()
  id: number;

  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty({ required: false })
  description: string | null;

  @IsDate()
  @ApiProperty({ type: String, format: 'date-time', required: false })
  createDate: Date | null;
}

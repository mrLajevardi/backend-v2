import { IsInt, IsString, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMigrationDto {
  @IsInt()
  @ApiProperty()
  id: number;

  @IsString()
  @ApiProperty({ required: false })
  name: string | null;

  @IsInt()
  @ApiProperty({ required: false })
  batch: number | null;

  @IsDate()
  @ApiProperty({ type: String, format: 'date-time', required: false })
  migrationTime: Date | null;
}

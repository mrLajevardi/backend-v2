import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UpdateEntityLogDto {
  @IsString()
  @ApiProperty()
  @Expose()
  before?: string;

  @IsString()
  @ApiProperty()
  @Expose()
  after?: string;

  @IsString()
  @ApiProperty()
  @Expose()
  entityType: string;

  @IsNumber()
  @ApiProperty()
  @Expose()
  entityId: number;

  @IsNumber()
  @ApiProperty()
  @Expose()
  userId: number;
}

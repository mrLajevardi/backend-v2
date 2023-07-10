import { IsInt, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateServicePlansDto {
  @IsInt()
  @ApiProperty()
  serviceInstanceId?: string;

  @IsString()
  @ApiProperty()
  planCode?: string;

  @IsNumber()
  @ApiProperty()
  ratio?: number;

  @IsNumber()
  @ApiProperty()
  amount?: number;
}

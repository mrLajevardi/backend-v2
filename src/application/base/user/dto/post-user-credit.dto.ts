import { ApiParam, ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, IsPositive } from 'class-validator';

export class PostUserCreditDto {
  @IsNumber()
  @Min(1)
  @IsPositive()
  @ApiProperty()
  credit: number;
}

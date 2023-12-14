import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UpdateServicePaymentsDto {
  @IsInt()
  @ApiProperty()
  userId: number;

  @IsInt()
  @ApiProperty()
  invoiceId: number;

  @IsString()
  @ApiProperty()
  @Expose()
  serviceInstanceId: string;

  @IsInt()
  @ApiProperty()
  price: number;
}

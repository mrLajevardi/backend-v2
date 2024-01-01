import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreateServicePaymentsDto {
  @IsInt()
  @ApiProperty()
  userId: number;

  @IsInt()
  @ApiProperty()
  invoiceId?: number;

  @IsString()
  @ApiProperty()
  @Expose()
  serviceInstanceId: string;

  @IsInt()
  @ApiProperty()
  price: number;

  @IsInt()
  @ApiProperty()
  taxPercent?: number;

  @IsInt()
  paymentType: number;

  @IsString()
  @ApiProperty()
  @Expose()
  metaData?: string | null;
}

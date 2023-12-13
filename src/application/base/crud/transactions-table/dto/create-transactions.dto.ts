import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionsDto {
  @IsString()
  @ApiProperty()
  @IsOptional()
  id?: string;

  @IsDate()
  @ApiProperty()
  dateTime: Date;

  @IsNumber()
  @ApiProperty()
  value: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  invoiceId?: number | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  description?: string | null;

  @IsNumber()
  @ApiProperty()
  paymentType: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  paymentToken?: string | null;

  @IsOptional()
  @ApiProperty({ required: false })
  isApproved: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  serviceInstanceId?: string | null;

  @IsString()
  @ApiProperty()
  userId?: string;
}

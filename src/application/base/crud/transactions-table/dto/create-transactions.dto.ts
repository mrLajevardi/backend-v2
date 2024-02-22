import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentGatewayTypeEnum } from '../../../../payment/enum/payment-gateway-type.enum';

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

  @ApiProperty({
    type: PaymentGatewayTypeEnum,
    enum: PaymentGatewayTypeEnum,
    required: false,
  })
  @IsEnum(PaymentGatewayTypeEnum)
  paymentGatewayType?: PaymentGatewayTypeEnum;

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

  @IsString()
  @ApiProperty()
  metaData?: string;

  @IsNumber()
  @ApiProperty()
  refId?: number;
}

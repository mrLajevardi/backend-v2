import { IsInt, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateItemTypeDto {
  @IsInt()
  @ApiProperty()
  id?: number;

  @IsString()
  @ApiProperty()
  title?: string;

  @IsString()
  @ApiProperty()
  unit?: string;

  @IsNumber()
  @ApiProperty()
  fee?: number;

  @IsInt()
  @ApiProperty()
  maxAvailable?: number;

  @IsString()
  @ApiProperty()
  code?: string;

  @IsInt()
  @ApiProperty({ required: false })
  maxPerRequest?: number | null;

  @IsInt()
  @ApiProperty({ required: false })
  minPerRequest?: number | null;

  @IsInt({ each: true })
  @ApiProperty({ type: [Number], required: false })
  aiTransactionsLogs?: number[];

  @IsInt({ each: true })
  @ApiProperty({ type: [Number], required: false })
  invoiceItems?: number[];

  @IsInt()
  @ApiProperty()
  serviceTypeId?: number;

  @IsInt({ each: true })
  @ApiProperty({ type: [Number], required: false })
  serviceItems?: number[];
}

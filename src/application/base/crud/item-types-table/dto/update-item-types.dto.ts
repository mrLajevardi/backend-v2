import { IsInt, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AiTransactionsLogs } from 'src/infrastructure/database/entities/AiTransactionsLogs';
import { InvoiceItems } from 'src/infrastructure/database/entities/InvoiceItems';

export class UpdateItemTypesDto {
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

}

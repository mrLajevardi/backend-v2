import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VmPowerStateEventEnum } from 'src/wrappers/main-wrapper/service/user/vm/enum/vm-power-state-event.enum';

export class UpdateServiceInstancesDto {
  @IsString()
  @ApiProperty()
  id?: string;

  @IsNumber()
  @ApiProperty()
  userId?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  status?: number;

  @IsDate()
  @ApiProperty()
  updateDate?: Date;

  @IsDate()
  @ApiProperty()
  lastUpdateDate?: Date;

  @IsOptional()
  @IsDate()
  @ApiProperty()
  expireDate?: Date;

  @IsOptional()
  @IsDate()
  @ApiProperty()
  deletedDate?: Date;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  isDeleted?: boolean;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  index?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  warningSent?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  isDisabled?: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  planRatio?: number;

  @IsOptional()
  @IsDate()
  @ApiProperty()
  lastPayg?: Date;

  @IsOptional()
  @IsDate()
  @ApiProperty()
  nextPayg?: Date;

  @IsOptional()
  @IsNumber()
  retryCount?: number | null;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  autoPaid?: boolean;

  offset?: Date;

  lastState?: VmPowerStateEventEnum;
}

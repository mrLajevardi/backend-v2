import { IsString, IsBoolean, IsDate, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSessionDto {
  @IsString()
  @ApiProperty()
  sessionId: string;

  @IsString()
  @ApiProperty()
  token: string;

  @IsBoolean()
  @ApiProperty()
  active: boolean;

  @IsDate()
  @IsOptional()
  @ApiProperty({ type: Date, required: false })
  updateDate: Date | null;


  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  isAdmin: boolean | null;

  @IsNumber()
  @ApiProperty()
  orgId: number;
}

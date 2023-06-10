import { IsInt, IsString, IsDate, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganizationDto {
  @IsInt()
  @ApiProperty()
  @IsOptional()
  id?: number;
  
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty({ required: false })
  dsc: string | null;

  @IsString()
  @ApiProperty({ required: false })
  orgId: string | null;

  @IsDate()
  @ApiProperty({ type: String, format: 'date-time', required: false })
  createDate: Date | null;

  @IsDate()
  @ApiProperty({ type: String, format: 'date-time', required: false })
  updateDate: Date | null;

  @IsString()
  @ApiProperty({ required: false })
  status: string | null;

  @IsInt()
  @ApiProperty()
  userId: number;
}

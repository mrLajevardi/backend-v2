import { IsInt, IsString, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrganizationDto {
  @IsInt()
  @ApiProperty()
  id: number;

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
  updateDate: Date | null;

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

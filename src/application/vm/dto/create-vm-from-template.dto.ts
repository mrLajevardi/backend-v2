import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional } from 'class-validator';
export class CreateVmFromTemplate {
  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  description: string;
}

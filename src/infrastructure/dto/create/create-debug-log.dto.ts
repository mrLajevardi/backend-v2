import { IsNotEmpty, IsNumber, IsString, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDebugLogDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  userId: number;

  @IsNotEmpty()
  @IsDate()
  @ApiProperty()
  timeStamp: Date;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  url: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  statusCode: number;

  @IsString()
  @ApiProperty()
  request: string;

  @IsString()
  @ApiProperty()
  response: string;

  @IsString()
  @ApiProperty()
  method: string;

  @IsString()
  @ApiProperty()
  ip: string;
}

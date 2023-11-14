import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApplicationPortsProtocols } from 'src/wrappers/main-wrapper/service/user/applicationPortProfile/enum/application-ports-protocols.enum';

export class CreateApplicationPortDto {
  @ApiProperty({
    example: 'TCP',
    type: ApplicationPortsProtocols,
    enum: ApplicationPortsProtocols,
  })
  @IsEnum(ApplicationPortsProtocols)
  protocol: ApplicationPortsProtocols;

  @ApiProperty({ type: [String], example: [22] })
  @IsArray()
  @IsNumber()
  destinationPorts: number[];

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  name: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber } from 'class-validator';
import { ApplicationPortsProtocols } from 'src/wrappers/main-wrapper/service/user/applicationPortProfile/enum/application-ports-protocols.enum';

export class CreateApplicationPortDto {
  @ApiProperty({
    example: 'TCP',
    type: ApplicationPortsProtocols,
    enum: ApplicationPortsProtocols,
  })
  @IsEnum(ApplicationPortsProtocols)
  protocol: ApplicationPortsProtocols;

  @ApiProperty({ type: [Number], example: [22] })
  @IsArray()
  @IsNumber({}, { each: true })
  destinationPorts: number[];
}

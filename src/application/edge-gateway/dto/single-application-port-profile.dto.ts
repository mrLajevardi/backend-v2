import { ApiProperty } from '@nestjs/swagger';
import { ApplicationPortsDto } from './application-ports.dto';

export class SingleApplicationPortProfileDto {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: [ApplicationPortsDto] })
  applicationPorts: ApplicationPortsDto[];
}

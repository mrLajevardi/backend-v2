import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDefined, ValidateNested } from 'class-validator';
import { NetworkSubnetIpRangeDto } from 'src/application/networks/dto/network-subnet-ip-range.dto';
export class DhcpPoolsDto {
  @ApiProperty({ type: Boolean })
  @IsBoolean()
  @IsDefined()
  enabled: boolean;

  @ApiProperty({ type: NetworkSubnetIpRangeDto })
  @ValidateNested()
  @IsDefined()
  ipRange: NetworkSubnetIpRangeDto;
}

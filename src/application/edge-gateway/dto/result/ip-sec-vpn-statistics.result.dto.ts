import { BaseResultDto } from '../../../../infrastructure/dto/base.result.dto';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class IpSecVpnStatisticsResultType {
  @ApiResponseProperty({
    type: String,
  })
  localSubnet: string;

  @ApiResponseProperty({
    type: String,
  })
  peerSubnet: string;

  @ApiResponseProperty({
    type: Number,
  })
  packetsIn: number;

  @ApiResponseProperty({
    type: Number,
  })
  packetsOut: number;

  @ApiResponseProperty({
    type: Number,
  })
  bytesIn: number;

  @ApiResponseProperty({
    type: Number,
  })
  bytesOut: number;

  @ApiResponseProperty({
    type: Number,
  })
  packetsSentError: number;

  @ApiResponseProperty({
    type: Number,
  })
  packetsReceivedError: number;

  @ApiResponseProperty({
    type: Number,
  })
  packetsInDropped: number;

  @ApiResponseProperty({
    type: Number,
  })
  packetsOutDropped: number;

  @ApiResponseProperty({
    type: Number,
  })
  encryptionErrors: number;

  @ApiResponseProperty({
    type: Number,
  })
  decryptionErrors: number;

  @ApiResponseProperty({
    type: Number,
  })
  overflowErrors: number;

  @ApiResponseProperty({
    type: Number,
  })
  replayErrors: number;

  @ApiResponseProperty({
    type: Number,
  })
  integrityErrors: number;

  @ApiResponseProperty({
    type: Number,
  })
  saMismatchInErrors: number;

  @ApiResponseProperty({
    type: Number,
  })
  saMismatchOutErrors: number;

  @ApiResponseProperty({
    type: Number,
  })
  noMatchingPolicyErrors: number;
}
export class IpSecVpnStatisticsResultDto extends BaseResultDto {
  collection(items: IpSecVpnStatisticsResultType[]): any[] {
    return items.map((item: IpSecVpnStatisticsResultType) => {
      return this.toArray(item);
    });
  }

  toArray(item: IpSecVpnStatisticsResultType): IpSecVpnStatisticsResultType {
    return {
      localSubnet: item.localSubnet,
      peerSubnet: item.peerSubnet,
      packetsIn: item.packetsIn,
      packetsOut: item.packetsOut,
      bytesIn: item.bytesIn,
      bytesOut: item.bytesOut,
      packetsSentError: item.packetsSentError,
      packetsReceivedError: item.packetsReceivedError,
      packetsInDropped: item.packetsInDropped,
      packetsOutDropped: item.packetsOutDropped,
      encryptionErrors: item.encryptionErrors,
      decryptionErrors: item.decryptionErrors,
      overflowErrors: item.overflowErrors,
      replayErrors: item.replayErrors,
      integrityErrors: item.integrityErrors,
      saMismatchInErrors: item.saMismatchInErrors,
      saMismatchOutErrors: item.saMismatchOutErrors,
      noMatchingPolicyErrors: item.noMatchingPolicyErrors,
    };
  }
}

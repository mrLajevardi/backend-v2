import { ApiProperty } from '@nestjs/swagger';
import { BaseResultDto } from '../../../../infrastructure/dto/base.result.dto';
import { faker } from '@faker-js/faker';
import { VcloudMetadata } from '../type/vcloud-metadata.type';

class DatacenterGenerations {
  @ApiProperty({
    type: String,
    example: 'g1',
  })
  name: VcloudMetadata;

  @ApiProperty({
    type: String,
    example: 'urn:vcloud:providervdc:a5946545-eaee-4475-970b-35ecb54a0e9b',
  })
  id: string;

  @ApiProperty({
    type: Boolean,
  })
  enable: boolean;
}

export class StoragePolicies {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: String,
  })
  name: string;
}
export class DatacenterConfigGenResultDto extends BaseResultDto {
  @ApiProperty({
    type: String,
    example: 'amin',
  })
  datacenter: VcloudMetadata;

  @ApiProperty({
    type: Boolean,
  })
  enabled: boolean;

  @ApiProperty({
    type: Boolean,
  })
  enabledForBusiness: boolean;

  @ApiProperty({
    type: [DatacenterGenerations],
  })
  gens: DatacenterGenerations[];

  @ApiProperty({
    type: String,
    example: 'امین',
  })
  title: VcloudMetadata;

  @ApiProperty({
    type: String,
  })
  location: VcloudMetadata;

  @ApiProperty({
    type: [StoragePolicies],
  })
  storagePolicies: StoragePolicies[];
  constructor(datacenter: string, gens: DatacenterGenerations[]) {
    super();
    this.datacenter = datacenter;
    this.gens = gens;
  }

  static generateDatacenterConfigGenResultDtoMock(): DatacenterConfigGenResultDto[] {
    const fakes: DatacenterConfigGenResultDto[] = [];
    for (let i = 0; i < 5; i++) {
      const urn = 'urn:vcloud:providervdc:';
      const dto: DatacenterConfigGenResultDto =
        new DatacenterConfigGenResultDto(faker.person.fullName(), [
          {
            name: 'G1',
            id: urn + faker.string.uuid(),
            enable: true,
          },
          {
            name: 'G2',
            id: urn + faker.string.uuid(),
            enable: true,
          },
          {
            name: 'G3',
            id: urn + faker.string.uuid(),
            enable: true,
          },
        ]);
      fakes.push(dto);
    }
    return fakes;
  }
}

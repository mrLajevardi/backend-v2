import { ApiProperty } from '@nestjs/swagger';
import { BaseResultDto } from '../../../../infrastructure/dto/base.result.dto';
import { faker } from '@faker-js/faker';
class DatacenterGenerations {
  @ApiProperty({
    type: String,
    example: 'Amin-G1',
  })
  name: string;

  @ApiProperty({
    type: String,
    example: 'UUID',
  })
  id: string;
}
export class DatacenterConfigGenResultDto extends BaseResultDto {
  @ApiProperty({
    type: String,
    example: 'Amin',
  })
  name: string;

  @ApiProperty({
    type: [DatacenterGenerations],
    examples: [
      { name: 'G1', id: 'UUID' },
      { name: 'G2', id: 'UUID' },
    ],
  })
  gens: DatacenterGenerations[];

  constructor(name: string, gens: DatacenterGenerations[]) {
    super();
    this.name = name;
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
          },
          {
            name: 'G2',
            id: urn + faker.string.uuid(),
          },
          {
            name: 'G3',
            id: urn + faker.string.uuid(),
          },
        ]);
      fakes.push(dto);
    }
    return fakes;
  }
}

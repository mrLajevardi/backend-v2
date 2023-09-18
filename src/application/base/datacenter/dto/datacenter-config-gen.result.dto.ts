import { BaseResultDto } from '../../../../infrastructure/dto/base.result.dto';
import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
export class DatacenterConfigGenResultDto extends BaseResultDto {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: [String] })
  Gens: string[];

  constructor(id: string, name: string, Gens: string[]) {
    super();
    this.id = id;

    this.name = name;

    this.Gens = Gens;
  }

  static GenerateDatacenterConfigGenResultDtoMock(): DatacenterConfigGenResultDto[] {
    const fakes: DatacenterConfigGenResultDto[] = [];
    for (let i = 0; i < 5; i++) {
      const dto: DatacenterConfigGenResultDto =
        new DatacenterConfigGenResultDto(
          faker.string.uuid(),
          faker.person.fullName(),

          ['G1', 'G2', 'G3'],
        );
      fakes.push(dto);
    }
    return fakes;
  }
}

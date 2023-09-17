import { BaseResultDto } from '../../../../infrastructure/dto/base.result.dto';
import { faker } from '@faker-js/faker';
export class DatacenterConfigGenResultDto extends BaseResultDto {
  constructor(id: string, name: string, Gens: string[]) {
    super();
    this.id = id;
    this.name = name;
    this.Gens = Gens;
  }

  id: string;
  name: string;
  Gens: string[];

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

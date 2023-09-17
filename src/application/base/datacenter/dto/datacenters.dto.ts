import { ApiProperty } from '@nestjs/swagger';
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
export class DatacentersDto {
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
}

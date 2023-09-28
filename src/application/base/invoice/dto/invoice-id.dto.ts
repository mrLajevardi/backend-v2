import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { BaseResultDto } from 'src/infrastructure/dto/base.result.dto';

export class InvoiceIdDto extends BaseResultDto {
  static generateMock(): InvoiceIdDto {
    return {
      invoiceId: faker.number.int({ max: 10000 }),
    };
  }
  @ApiProperty({
    type: Number,
    example: 233,
  })
  invoiceId: number;
}

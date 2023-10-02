import { BaseResultDto } from '../../../../infrastructure/dto/base.result.dto';
import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';

export class ServiceItemDto extends BaseResultDto {
  @ApiProperty({ type: String })
  itemTypeCode: string;

  @ApiProperty({ type: Number })
  usage: number;

  @ApiProperty({ type: Number })
  quantity: number;

  constructor(itemTypeCode: string, usage: number, quantity: number) {
    super();
    this.itemTypeCode = itemTypeCode;
    this.usage = usage;
    this.quantity = quantity;
  }

  static GetMock(): ServiceItemDto[] {
    const res: ServiceItemDto[] = [];
    const quantity = faker.number.int({ min: 5, max: 32 });

    //const count = 5;
    res.push(
      new ServiceItemDto(
        'RAM',
        faker.number.int({ min: 2, max: quantity - 3 }) * 1024,
        quantity * 1024,
      ),
    );
    res.push(
      new ServiceItemDto(
        'DISK',
        faker.number.int({ min: 2, max: quantity - 3 }) * 1024,
        quantity * 1024,
      ),
    );
    res.push(
      new ServiceItemDto(
        'CPU',
        faker.number.int({ min: 2, max: quantity - 3 }),
        quantity,
      ),
    );

    res.push(
      new ServiceItemDto(
        'VM',
        faker.number.int({ min: 2, max: quantity - 3 }),
        quantity,
      ),
    );

    return res;
  }
}

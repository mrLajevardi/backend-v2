import { ApiProperty } from '@nestjs/swagger';
import { CreateNamedDiskDto } from './create-named-disk.dto';

export class updateNamedDiskDto extends CreateNamedDiskDto {
  @ApiProperty({ type: String })
  id: string;
}

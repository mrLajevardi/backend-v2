import { ApiProperty } from '@nestjs/swagger';
import { CreateNamedDiskDto } from './create-named-disk.dto';

export class UpdateNamedDiskDto extends CreateNamedDiskDto {
  @ApiProperty({ type: String })
  id: string;
}

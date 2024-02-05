import { BaseResultDto } from '../../../../infrastructure/dto/base.result.dto';

export class ProviderResultDto extends BaseResultDto {
  name: string;
  gens: { name: string; id: string }[];
}

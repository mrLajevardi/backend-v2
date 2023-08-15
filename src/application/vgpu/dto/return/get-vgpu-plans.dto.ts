import { Configs } from 'src/infrastructure/database/entities/Configs';
import { ItemTypes } from 'src/infrastructure/database/entities/ItemTypes';

export class GetVgpuPlansDto {
  vgpuPlans: Configs[];
  planCost: ItemTypes[];
}

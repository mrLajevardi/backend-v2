import { BaseService } from '../../../../infrastructure/service/BaseService';
import { IDatacenterService } from '../interface/IDatacenter.service';
import { DatacenterConfigGenResultDto } from '../dto/datacenter-config-gen.result.dto';
import { Injectable } from '@nestjs/common';
import { DatacenterConfigGenItemsResultDto } from '../dto/datacenter-config-gen-items.result.dto';
import { DatacenterConfigGenItemsQueryDto } from '../dto/datacenter-config-gen-items.query.dto';
import { DataCenterTableService } from '../../crud/datacenter-table/data-center-table.service';

@Injectable()
export class DatacenterService implements IDatacenterService, BaseService {
  constructor(private readonly datacenterTable: DataCenterTableService) {}
  GetDatacenterConfigWithGen(): Promise<DatacenterConfigGenResultDto[]> {
    // Temp
    const mocks: DatacenterConfigGenResultDto[] =
      DatacenterConfigGenResultDto.GenerateDatacenterConfigGenResultDtoMock();
    return Promise.resolve(mocks);
  }

  async GetDatacenterConfigWithGenItems(
    query: DatacenterConfigGenItemsQueryDto,
  ): Promise<DatacenterConfigGenItemsResultDto[]> {
    // const mocks: DatacenterConfigGenItemsResultDto[] =
    // DatacenterConfigGenItemsResultDto.GenerateDatacenterConfigGenItemsResultDtoMock();
    const models: DatacenterConfigGenItemsResultDto[] = [];
    const res = await this.datacenterTable.findBy(query.GenId, '');
    res.forEach((d) => {
      models.push(
        new DatacenterConfigGenItemsResultDto(
          d.id,
          d.title,
          d.price,
          d.percent,
          d.min,
          d.max,
          d.unit,
          d.parentId,
        ),
      );
    });

    const fres = this.Tree(models, 0);
    return Promise.resolve(fres);
    // return fres;
  }

  Tree(
    ItemTypesConfig: DatacenterConfigGenItemsResultDto[],
    parentId: number,
    res: DatacenterConfigGenItemsResultDto[] = [],
  ): DatacenterConfigGenItemsResultDto[] {
    // const res: DatacenterConfigGenItemsResultDto[] = [];
    const parents = ItemTypesConfig.filter((d) => d.ParentId == parentId);

    if (parents != null && parents.length > 0) {
      parents.forEach((e) => {
        const res2 = this.Tree(ItemTypesConfig, e.Id, e.SubItems);
        // if (childs != null && childs.length>0){
        //   childs.forEach(q=>{
        //     const sub = this.Tree(childs,q.parentId);
        //
        //   })
        // }
        if (res2 != null && res2.length > 0) {
          e.SubItems.concat(res2);
        }
        res.push(e);
      });
    }
    // res.concat(parents);

    return res;
  }
}

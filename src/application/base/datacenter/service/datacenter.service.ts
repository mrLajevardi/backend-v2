import { BaseService } from '../../../../infrastructure/service/BaseService';
import { Injectable } from '@nestjs/common';
import { DatacenterConfigGenItemsResultDto } from '../dto/datacenter-config-gen-items.result.dto';
import { DatacenterConfigGenItemsQueryDto } from '../dto/datacenter-config-gen-items.query.dto';
import { DataCenterTableService } from '../../crud/datacenter-table/data-center-table.service';
import { AdminVdcWrapperService } from 'src/wrappers/main-wrapper/service/admin/vdc/admin-vdc-wrapper.service';
import { SessionsService } from '../../sessions/sessions.service';
import { Value } from 'src/wrappers/main-wrapper/service/admin/vdc/dto/get-provider-vdcs.dto';
import { GetProviderVdcsMetadataDto } from 'src/wrappers/main-wrapper/service/admin/vdc/dto/get-provider-vdcs-metadata.dto';
import { DatacenterConfigGenResultDto } from '../dto/datacenter-config-gen.result.dto';
import { FoundDatacenterMetadata } from '../interface/datacenter.interface';

@Injectable()
export class DatacenterService implements BaseService {
  constructor(
    private readonly datacenterTable: DataCenterTableService,
    private readonly adminVdcWrapperService: AdminVdcWrapperService,
    private readonly sessionsService: SessionsService,
  ) {}

  public findTargetMetadata(
    metadata: GetProviderVdcsMetadataDto,
  ): FoundDatacenterMetadata {
    const targetMetadata = {
      datacenterName: null,
      generation: null,
    };
    for (const value of metadata.metadataEntry) {
      if (value.key === 'datacenter') {
        targetMetadata.datacenterName = value.typedValue.value;
      } else if (value.key === 'generation') {
        targetMetadata.generation = value.typedValue.value;
      }
    }
    return targetMetadata;
  }

  public async getDatacenterConfigWithGen(): Promise<
    DatacenterConfigGenResultDto[]
  > {
    const adminSession = await this.sessionsService.checkAdminSession();
    const params = {
      page: 1,
      pageSize: 10,
    };
    const providerVdcsList = await this.adminVdcWrapperService.getProviderVdcs(
      adminSession,
      params,
    );
    const { values } = providerVdcsList;
    const providerVdcsFilteredData: Pick<Value, 'id' | 'isEnabled'>[] =
      values.map((value) => {
        const { id, isEnabled } = value;
        return { id, isEnabled };
      });
    const datacenterConfigs: DatacenterConfigGenResultDto[] = [];
    for (const providerVdc of providerVdcsFilteredData) {
      const metadata = await this.adminVdcWrapperService.getProviderVdcMetadata(
        adminSession,
        providerVdc.id,
      );
      const targetMetadata = this.findTargetMetadata(metadata);
      console.log(targetMetadata, metadata);
      if (targetMetadata.datacenterName === null) {
        continue;
      }
      const targetConfig = datacenterConfigs.find((value) => {
        return value.name === targetMetadata.datacenterName;
      });
      const newGen = {
        name: targetMetadata.generation,
        id: providerVdc.id,
      };
      if (!targetConfig) {
        const config = {
          name: targetMetadata.datacenterName,
          gens: [newGen],
        };
        datacenterConfigs.push(config);
      } else {
        targetConfig.gens.push(newGen);
      }
    }
    return datacenterConfigs;
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

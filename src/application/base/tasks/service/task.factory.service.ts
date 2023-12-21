import { Injectable } from '@nestjs/common';
import { VmDetailFactoryService } from '../../../vm/service/vm-detail.factory.service';
import { VmTasksQueryDto } from '../../../vm/dto/vm-tasks.query.dto';
// import * as process from 'process';

@Injectable()
export class TaskFactoryService {
  constructor(
    private readonly vmDetailFactoryService: VmDetailFactoryService,
  ) {}
  setTaskFilter(query: VmTasksQueryDto) {
    let filterDate = '';
    if (
      query.dateFilter != null ||
      query.dateEnd != null ||
      query.dateBegin != null
    ) {
      filterDate = this.vmDetailFactoryService.filterDateVmDetails(
        query.dateBegin,
        query.dateEnd,
        query.dateFilter,
        'startDate',
      );
    }
    let vmVappFilter = '';
    if (query.vmId != null && query.vappId != null) {
      vmVappFilter = `((object==${process.env.VCLOUD_BASE_URL}/api/vApp/${query.vmId},object==${process.env.VCLOUD_BASE_URL}/api/vApp/${query.vappId.trim()}))`;
    }

    return `${vmVappFilter}${filterDate}`;
  }
}

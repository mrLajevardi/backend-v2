import { Injectable } from '@nestjs/common';
import { VcloudWrapperService } from 'src/wrappers/vcloud-wrapper/services/vcloud-wrapper.service';
import { EdgeGatewayWrapperService } from '../edgeGateway/edge-gateway-wrapper.service';

@Injectable()
export class TaskWrapperService {
  constructor(private readonly vcloudWrapperService: VcloudWrapperService) {}
  async cancelTask(authToken, taskId) {
    const endpoint = 'TasksEndpointService.cancelTaskEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    await this.vcloudWrapperService.request(
      wrapper({
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: { taskId },
      }),
    );
    return;
  }
  async getTask(authToken, taskId) {
    const endpoint = 'TasksEndpointService.getTaskEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const task = await this.vcloudWrapperService.request(
      wrapper({
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: { taskId },
      }),
    );
    return task;
  }
}

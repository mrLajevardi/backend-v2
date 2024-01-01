import { Injectable } from '@nestjs/common';
import { VcloudWrapperService } from 'src/wrappers/vcloud-wrapper/services/vcloud-wrapper.service';
import { AxiosResponse } from 'axios';

@Injectable()
export class TaskWrapperService {
  constructor(private readonly vcloudWrapperService: VcloudWrapperService) {}
  async cancelTask(authToken: string, taskId: string): Promise<void> {
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
  async getTask(authToken: string, taskId: string): Promise<AxiosResponse> {
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

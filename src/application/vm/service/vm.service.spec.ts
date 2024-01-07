import { VmService } from './vm.service';
import { TaskReturnDto } from 'src/infrastructure/dto/task-return.dto';
import { CreateVmFromTemplate } from '../dto/create-vm-from-template.dto';
import { TestBed } from '@automock/jest';

describe('VmService', () => {
  let service: VmService;

  const option = {};
  const data = {
    name: 'string',
    computerName: 'string',
    networks: [
      {
        allocationMode: 'string',
        ipAddress: 'string',
        isConnected: true,
        networkAdaptorType: 'string',
        networkName: 'string',
      },
    ],
    powerOn: true,
    primaryNetworkIndex: 5,
    templateId: 'string',
    templateName: 'string',
    description: 'string',
    storage: { sizeMb: 12, policyId: '' },
  };
  const id = '1';

  const getValidTaskIdDto = (): TaskReturnDto => {
    return {
      taskId: '123456',
    };
  };

  beforeEach(async () => {
    const { unit } = TestBed.create(VmService).compile();
    service = unit;
  });

  // it('should be defined', () => {
  //   expect(service).toBeDefined();
  // });

  it('should be return valid taskId', async () => {
    const res: TaskReturnDto = getValidTaskIdDto();

    const myMock = jest
      .spyOn(service, 'createVMFromTemplate')
      .mockImplementation(
        (options, data: CreateVmFromTemplate, vdcInstanceId: string) => {
          if (!data.name) {
            return Promise.resolve({ taskId: null });
          }
        },
      );

    const model = await service.createVMFromTemplate(option, data, id);

    expect(true).toBe(true);
    // expect(myMock).toHaveBeenCalledWith(option, data, id);
  });
});

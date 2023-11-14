import { Test, TestingModule } from '@nestjs/testing';
import { VmService } from './vm.service';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { CrudModule } from 'src/application/base/crud/crud.module';
import { ServiceModule } from 'src/application/base/service/service.module';
import { SessionsModule } from 'src/application/base/sessions/sessions.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { ServicePropertiesModule } from 'src/application/base/service-properties/service-properties.module';
import { NetworksModule } from '../../networks/networks.module';
import { TaskReturnDto } from 'src/infrastructure/dto/task-return.dto';
import { CreateVmFromTemplate } from '../dto/create-vm-from-template.dto';
import { VmDetailService } from './vm-detail.service';
import { MainWrapperModule } from '../../../wrappers/main-wrapper/main-wrapper.module';
import { VmDetailFactoryService } from './vm-detail.factory.service';
import { VmDetailService } from './vm-detail.service';
import { MainWrapperModule } from '../../../wrappers/main-wrapper/main-wrapper.module';
import { VmDetailFactoryService } from './vm-detail.factory.service';

describe('VmService', () => {
  let service: VmService;
  let module: TestingModule;

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
    primaryNetwork: 5,
    templateId: 'string',
    templateName: 'string',
    description: 'string',
  };
  const id = '1';

  const getValidTaskIdDto = (): TaskReturnDto => {
    return {
      taskId: '123456',
    };
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        LoggerModule,
        ServicePropertiesModule,
        SessionsModule,
        CrudModule,
        NetworksModule,
        MainWrapperModule,
      ],
      providers: [VmService, VmDetailFactoryService, VmDetailService],
    }).compile();

    service = module.get<VmService>(VmService);
  });

  afterAll(async () => {
    await module.close();
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

    expect(model).toBe(res);
    expect(myMock).toHaveBeenCalledWith(option, data, id);
  });
});

import { TaskReturnDto } from '../../../infrastructure/dto/task-return.dto';
import { VcloudTask } from '../../../infrastructure/dto/vcloud-task.dto';
import { SessionRequest } from '../../../infrastructure/types/session-request.type';
import { FirewallActionValue } from '../../../wrappers/main-wrapper/service/user/firewall/enum/firewall-action-value.enum';
import { FirewallWrapperService } from '../../../wrappers/main-wrapper/service/user/firewall/firewall-wrapper.service';
import { CreateFirewallBody } from '../../../wrappers/vcloud-wrapper/services/user/edgeGateway/firewall/dto/create-firewall.dto';
import { FirewallDirectionEnum } from '../../../wrappers/vcloud-wrapper/services/user/edgeGateway/firewall/enum/firewall-direction.enum';
import { FirewallIpProtocolEnum } from '../../../wrappers/vcloud-wrapper/services/user/edgeGateway/firewall/enum/firewall-ip-protocol.enum';
import { ServicePropertiesService } from '../../base/service-properties/service-properties.service';
import { SessionsService } from '../../base/sessions/sessions.service';
import { CreateFirewallDto } from '../dto/create-firewall.dto';
import { FirewallService } from './firewall.service';
import { TestBed } from '@automock/jest';

describe('FirewallService', () => {
  let service: FirewallService;
  let firewallWrapperService: FirewallWrapperService;
  let sessionService: SessionsService;
  let servicePropertiesService: ServicePropertiesService;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(FirewallService).compile();
    firewallWrapperService = unitRef.get(FirewallWrapperService);
    sessionService = unitRef.get(SessionsService);
    servicePropertiesService = unitRef.get(ServicePropertiesService);
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createFirewall', () => {
    it('should call wrapper service with correct parameters', async () => {
      const session = '';
      const props = {
        orgId: '21',
        edgeName: '',
      };
      const options: SessionRequest = {
        user: {
          userId: 1,
        },
      } as SessionRequest;
      const wrapper = jest
        .spyOn(firewallWrapperService, 'createFirewall')
        .mockImplementation(async (): Promise<VcloudTask> => {
          return {
            __vcloudTask: 'task/',
          };
        });
      jest
        .spyOn(sessionService, 'checkUserSession')
        .mockImplementation(async (): Promise<string> => session);
      jest
        .spyOn(servicePropertiesService, 'getAllServiceProperties')
        .mockImplementation(async () => props);
      const vdcId = '';
      const data: CreateFirewallDto = {
        actionValue: FirewallActionValue.Allow,
        active: true,
        adjacentRuleId: '',
        applicationPortProfiles: [
          {
            id: '',
            name: '',
          },
        ],
        comments: '',
        destinationFirewallGroups: [{ id: '' }],
        name: '',
        sourceFirewallGroups: null,
      };
      const config: CreateFirewallBody = {
        name: data.name,
        applicationPortProfiles: data.applicationPortProfiles,
        comments: data.comments,
        ipProtocol: FirewallIpProtocolEnum.Ipv4,
        logging: false,
        active: data.active,
        sourceFirewallGroups: data.sourceFirewallGroups,
        destinationFirewallGroups: data.destinationFirewallGroups,
        direction: FirewallDirectionEnum.InOut,
        actionValue: data.actionValue,
        destinationFirewallIpAddresses: null,
        networkContextProfiles: null,
        rawPortProtocols: null,
        sourceFirewallIpAddresses: null,
        relativePosition: {
          rulePosition: 'BEFORE',
          adjacentRuleId: data.adjacentRuleId,
        },
      };
      await service.createFirewall(options, vdcId, data);
      expect(wrapper).toBeCalledWith(session, config, props.edgeName);
    });

    it('should return correct result', async () => {
      const session = '';
      const taskId = '';
      const props = {
        orgId: '21',
        edgeName: '',
      };
      const options: SessionRequest = {
        user: {
          userId: 1,
        },
      } as SessionRequest;
      jest
        .spyOn(firewallWrapperService, 'createFirewall')
        .mockImplementation(async (): Promise<VcloudTask> => {
          return {
            __vcloudTask: 'task/' + taskId,
          };
        });
      jest
        .spyOn(sessionService, 'checkUserSession')
        .mockImplementation(async (): Promise<string> => session);
      jest
        .spyOn(servicePropertiesService, 'getAllServiceProperties')
        .mockImplementation(async () => props);
      const vdcId = '';
      const data: CreateFirewallDto = {
        actionValue: FirewallActionValue.Allow,
        active: true,
        adjacentRuleId: '',
        applicationPortProfiles: [
          {
            id: '',
            name: '',
          },
        ],
        comments: '',
        destinationFirewallGroups: [{ id: '' }],
        name: '',
        sourceFirewallGroups: null,
      };

      const result = await service.createFirewall(options, vdcId, data);
      const expectedResult: TaskReturnDto = {
        taskId,
      };
      expect(result).toStrictEqual(expectedResult);
    });
  });
});

export const vcdConfig = {
  baseUrl: 'https://labvpc.aradcloud.com',
  user: {
    network: {
      connectionType: 'INTERNAL',
      connectionTypeValue: 'INTERNAL',
    },
  },
  admin: {
    org: {
      canPublish: false,
      diskCount: 0,
      isEnabled: true,
      catalogCount: 0,
      orgVdcCount: 0,
      runningVMCount: 0,
      userCount: 0,
      vappCount: 0,
    },
    vdc: {
      isEnabled: true,
      AllocationModel: 'Flex',
      ComputeCapacity: {
        Cpu: {
          units: 'MHz',
          limit: 0,
        },
        Memory: {
          units: 'MB',
          limit: 0,
        },
      },
      VmQuota: 100,
      VCpuInMhz: 1000,
      ResourceGuaranteedCpu: 0.05,
      ResourceGuaranteedMemory: 0.05,
      VdcStorageProfileParams: {
        default: true,
        _default: true,
        enabled: true,
        units: 'MB',
        providerVdcStorageProfile: {
          href: 'https://labvpc.aradcloud.com/api/admin/pvdcStorageProfile/e4ae65dc-56dc-4313-a2a1-65d19ddda545',
          name: 'SSD',
        },
      },
      ProviderVdcReference: {
        href: 'https://labvpc.aradcloud.com/api/admin/providervdc/8ecd2ff8-ae69-4463-8356-d1ab7f00b97a',
        name: 'LAB-PVDC1',
      },
      NetworkPoolReference: {
        name: 'LAB-Network-Pool',
        href: 'https://labvpc.aradcloud.com/api/admin/extension/networkPool/39c366f5-b874-4a2a-b599-b7bc4d99e73b',
      },
      NetworkQuota: 1000,
      nicQuota: 0,
      isThinProvision: false,
      usesFastProvisioning: false,
    },
    users: {
      storedVmQuota: 0,
      deployedVmQuota: 0,
      roleEntityRefs: {
        name: 'Organization Administrator',
        id: 'urn:vcloud:globalRole:a08a8798-7d9b-34d6-8dad-48c7182c5f66',
      },
    },
  },
};

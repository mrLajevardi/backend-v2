module.exports = {
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
          href: 'https://vpc.aradcloud.com/api/admin/pvdcStorageProfile/fb21f4af-22c3-4733-958b-633526529e74',
          name: 'SSD',
        },
      },
      ProviderVdcReference: {
        href: 'https://vpc.aradcloud.com/cloudapi/1.0.0/providerVdcs/2c618f39-a98c-45e9-8ea0-a5189702325b',
        name: 'V1-Provider-VDC',
      },
      NetworkPoolReference: {
        name: 'V1-Network-Pool',
        href: 'https://vpc.aradcloud.com/api/admin/extension/networkPool/078fa1a3-b607-4055-85e7-00d6af5a42d0',
      },
      NetworkQuota: 1000,
      isThinProvision: false,
      usesFastProvisioning: false,

    },
    users: {
      'storedVmQuota': 0,
      'deployedVmQuota': 0,
      'roleEntityRefs': {
        name: 'Organization Administrator',
        id: 'urn:vcloud:globalRole:a08a8798-7d9b-34d6-8dad-48c7182c5f66',
      },
    },
  },
};

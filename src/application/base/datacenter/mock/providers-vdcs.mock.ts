import { GetProviderVdcsDto } from 'src/wrappers/main-wrapper/service/admin/vdc/dto/get-provider-vdcs.dto';

export const mockProviderVdcs: GetProviderVdcsDto = {
  resultTotal: 3,
  pageCount: 1,
  page: 1,
  pageSize: 10,
  associations: null,
  values: [
    {
      id: 'urn:vcloud:providervdc:a5946545-eaee-4475-970b-35ecb54a0e9b',
      name: 'Amin-G2-2.5',
      description: '',
      isEnabled: true,
      maxSupportedHwVersion: 'vmx-19',
      nsxTManager: {
        name: 'nsxmgr.v1.aradcloud.com',
        id: 'urn:vcloud:nsxtmanager:902366e4-c75e-47e5-9168-19b9cce649a1',
      },
      vimServer: {
        name: 'vc.v1.aradcloud.com',
        id: 'urn:vcloud:vimserver:4e4df81b-03c0-490a-af12-23befbb46dc9',
      },
    },
  ],
};

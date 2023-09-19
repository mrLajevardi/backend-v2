import { GetProviderVdcsMetadataDto } from 'src/wrappers/main-wrapper/service/admin/vdc/dto/get-provider-vdcs-metadata.dto';

export const mockDatacenterMetadata: GetProviderVdcsMetadataDto = {
  otherAttributes: {},
  link: [
    {
      otherAttributes: {},
      href: 'https://labvpc.aradcloud.com/api/admin/providervdc/8ecd2ff8-ae69-4463-8356-d1ab7f00b97a',
      id: null,
      type: 'application/vnd.vmware.admin.providervdc+xml',
      name: null,
      rel: 'up',
      model: null,
      vCloudExtension: [],
    },
  ],
  href: 'https://labvpc.aradcloud.com/api/admin/providervdc/8ecd2ff8-ae69-4463-8356-d1ab7f00b97a/metadata',
  type: 'application/vnd.vmware.vcloud.metadata+json',
  metadataEntry: [
    {
      otherAttributes: {},
      link: [
        {
          otherAttributes: {},
          href: 'https://labvpc.aradcloud.com/api/admin/providervdc/8ecd2ff8-ae69-4463-8356-d1ab7f00b97a/metadata',
          id: null,
          type: 'application/vnd.vmware.vcloud.metadata+xml',
          name: null,
          rel: 'up',
          model: null,
          vCloudExtension: [],
        },
      ],
      href: 'https://labvpc.aradcloud.com/api/admin/providervdc/8ecd2ff8-ae69-4463-8356-d1ab7f00b97a/metadata/datacenter',
      type: 'application/vnd.vmware.vcloud.metadata.value+json',
      domain: null,
      key: 'datacenter',
      typedValue: { _type: 'MetadataStringValue', value: 'Amin' },
      vCloudExtension: [],
    },
    {
      otherAttributes: {},
      link: [
        {
          otherAttributes: {},
          href: 'https://labvpc.aradcloud.com/api/admin/providervdc/8ecd2ff8-ae69-4463-8356-d1ab7f00b97a/metadata',
          id: null,
          type: 'application/vnd.vmware.vcloud.metadata+xml',
          name: null,
          rel: 'up',
          model: null,
          vCloudExtension: [],
        },
      ],
      href: 'https://labvpc.aradcloud.com/api/admin/providervdc/8ecd2ff8-ae69-4463-8356-d1ab7f00b97a/metadata/datacenter',
      type: 'application/vnd.vmware.vcloud.metadata.value+json',
      domain: null,
      key: 'generation',
      typedValue: { _type: 'MetadataStringValue', value: 'G1' },
      vCloudExtension: [],
    },
  ],
  vCloudExtension: [],
};

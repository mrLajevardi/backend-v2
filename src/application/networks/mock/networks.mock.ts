import { GetNetworkListDto } from 'src/wrappers/main-wrapper/service/user/network/dto/get-network-list.dto';
import { NetworkStatusEnum } from 'src/wrappers/main-wrapper/service/user/network/enum/network-status.enum';

export function generateNetworkMock(): GetNetworkListDto {
  const networksListMock = {
    resultTotal: 1,
    pageCount: 1,
    page: 1,
    pageSize: 10,
    associations: null,
    values: [
      {
        id: 'urn:vcloud:network:f85bfe24-b584-44b7-b7b7-9b44a63a8782',
        name: 'default-network',
        description: '',
        subnets: {
          values: [
            {
              gateway: '192.168.1.1',
              prefixLength: 24,
              dnsSuffix: '',
              dnsServer1: '',
              dnsServer2: '',
              ipRanges: {
                values: [
                  {
                    startAddress: '192.168.1.2',
                    endAddress: '192.168.1.11',
                  },
                ],
              },
              enabled: true,
              totalIpCount: 10,
              usedIpCount: 0,
            },
          ],
        },
        backingNetworkId: null,
        backingNetworkType: 'NSXT_FLEXIBLE_SEGMENT',
        parentNetworkId: null,
        networkType: 'NAT_ROUTED',
        orgVdc: {
          name: 'u-09389071489_org_vdc_14',
          id: 'urn:vcloud:vdc:d8c34b98-3b26-4b08-a5fd-6bc87c7acd95',
        },
        ownerRef: {
          name: 'u-09389071489_org_vdc_14',
          id: 'urn:vcloud:vdc:d8c34b98-3b26-4b08-a5fd-6bc87c7acd95',
        },
        orgVdcIsNsxTBacked: null,
        orgRef: {
          name: 'u-09389071489_org',
          id: 'urn:vcloud:org:2e158152-da2b-49f9-bf09-1b1fcf48dbb2',
        },
        connection: {
          routerRef: {
            name: 'u-09389071489_org_vdc_14_edge',
            id: 'urn:vcloud:gateway:d32daf92-ebb5-4921-ab74-6516db5f16db',
          },
          connectionType: 'INTERNAL',
          connectionTypeValue: 'INTERNAL',
          connected: true,
        },
        isDefaultNetwork: null,
        shared: false,
        enableDualSubnetNetwork: false,
        status: NetworkStatusEnum.Realized,
        lastTaskFailureMessage: null,
        guestVlanTaggingAllowed: false,
        retainNicResources: false,
        crossVdcNetworkId: null,
        crossVdcNetworkLocationId: null,
        overlayId: null,
        totalIpCount: 10,
        usedIpCount: 0,
        routeAdvertised: false,
        securityGroups: null,
        segmentProfileTemplateRef: null,
      },
    ],
  };
  return networksListMock;
}

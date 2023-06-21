import xml2js from 'xml2js';
import { vcloudQuery } from '../vdc/vcloudQuery';
import { isEmpty } from 'class-validator';
import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';
/**
 *
 * @param {String} authToken
 * @param {String} vdcId
 * @param {Object} config
 * @param {String} config.name
 * @param {String} config.computerName
 * @param {Boolean} config.primaryNetworkIndex
 * @param {Boolean} config.powerOn
 * @param {Array<Object>} config.networks
 * @param {String} config.networks.allocationMode
 * @param {String} config.networks.networkAdaptorType
 * @param {String} config.networks.ipAddress
 * @param {String} config.networks.networkName
 * @param {String} config.sourceHref
 * @param {String} config.sourceId
 * @param {String} config.sourceName
 */
export async function instantiateVmFromTemplateAdmin(
  authToken,
  vdcId,
  config,
  computePolicyId,
) {
  const formatedVdcId = vdcId.split(':').slice(-1);
  const query = await vcloudQuery(authToken, {
    type: 'adminOrgVdcStorageProfile',
    format: 'records',
    page: 1,
    pageSize: 128,
    filterEncoded: true,
    links: true,
    filter: `vdc==${vdcId}`,
  });
  const vdcStorageProfileLink = query.data.record[0].href;
  const networks = [];
  if (!isEmpty(config.networks)) {
    let index = 0;
    config.networks.forEach((network) => {
      const networkObj = {
        $: { network: network.networkName },
        'root:NetworkConnectionIndex': index,
        'root:IpAddress': network.ipAddress,
        'root:IsConnected': network.isConnected,
        'root:IpAddressAllocationMode': network.allocationMode,
        'root:NetworkAdapterType': network.networkAdaptorType,
      };
      index++;
      networks.push(networkObj);
    });
  }
  const request = {
    'root:InstantiateVmTemplateParams': {
      $: {
        'xmlns:root': 'http://www.vmware.com/vcloud/v1.5',
        'xmlns:ns0': 'http://schemas.dmtf.org/ovf/envelope/1',
        name: config.name,
        powerOn: config.powerOn,
      },
      'root:SourcedVmTemplateItem': {
        'root:Source': {
          $: {
            href: config.sourceHref,
            id: config.sourceId,
            name: config.sourceName,
            type: 'application/vnd.vmware.vcloud.vm+xml',
          },
        },
        'root:VmTemplateInstantiationParams': {
          'root:NetworkConnectionSection': {
            'ns0:Info': '',
            'root:PrimaryNetworkConnectionIndex': config.primaryNetworkIndex,
            'root:NetworkConnection': networks,
          },
          'root:GuestCustomizationSection': {
            'ns0:Info': 'Specifies Guest OS Customization Settings',
            'root:Enabled': true,
            'root:AdminPasswordAuto': true,
            'root:ComputerName': config.computerName,
          },
        },
        'root:StorageProfile': {
          $: {
            href: vdcStorageProfileLink,
            type: 'application/vnd.vmware.vcloud.vdcStorageProfile+xml',
          },
        },
      },
      'root:AllEULAsAccepted': true,
      'root:ComputePolicy': {
        'root:VmPlacementPolicy': {
          $: {
            href: computePolicyId,
            id: computePolicyId,
          },
        },
      },
    },
  };
  const builder = new xml2js.Builder();

  const xmlRequest = builder.buildObject(request);
  const options = {
    body: xmlRequest,
    headers: { Authorization: `Bearer ${authToken}` },
    urlParams: { vdcId: formatedVdcId },
  };
  const createdVm = await new VcloudWrapper().posts(
    'user.vm.instantiateVmFromTemplate',
    options,
  );
  return Promise.resolve({
    __vcloudTask: createdVm.headers['location'],
  });
}

module.exports = instantiateVmFromTemplateAdmin;

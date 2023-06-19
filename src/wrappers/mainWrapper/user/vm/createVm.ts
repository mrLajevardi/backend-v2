const xml2js = require('xml2js');
const builder = new xml2js.Builder();
const getVdcComputePolicy = require('../vdc/getVdcComputePolicy');
const vcloudQuery = require('../vdc/vcloudQuery');
import { isEmpty } from 'class-validator';
const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
/**
 *
 * @param {String} authToken
 * @param {String} vdcId
 * @param {Object} config
 * @param {String} config.name
 * @param {String} config.computerName
 * @param {Number} config.cpuNumber
 * @param {Number} config.coreNumber
 * @param {Number} config.ram
 * @param {Number} config.storage
 * @param {String} config.osType
 * @param {String} config.osType
 * @param {String} config.mediaName
 * @param {String} config.mediaHref
 * @param {number} config.primaryNetworkIndex
 * @param {Boolean} config.powerOn
 * @param {Array<Object>} config.networks
 * @param {String} config.networks.allocationMode
 * @param {String} config.networks.networkAdaptorType
 * @param {String} config.networks.ipAddress
 * @param {String} config.networks.networkName
 * @param {String} config.networks.isConnected
 */
export async function userCreateVm(authToken, vdcId, config) {
  const formattedVdcId = vdcId.split(':').slice(-1);
  const computePolicy = await getVdcComputePolicy(authToken, vdcId);
  const computePolicyId = computePolicy.values[0].id;
  const query = await vcloudQuery(authToken, {
    type: 'orgVdcStorageProfile',
    format: 'records',
    page: 1,
    pageSize: 128,
    filterEncoded: true,
    links: true,
    filter: `vdc==${vdcId}`,
  });
  const vdcStorageProfileLink = query.data.record[0].href;
  const networks = [];
  const storage = [];
  if (!isEmpty(config.networks)) {
    config.networks.forEach((network, index) => {
      const networkObj = {
        $: { network: network.networkName },
        'root:NetworkConnectionIndex': index,
        'root:IpAddress': network.ipAddress,
        'root:IsConnected': network.isConnected,
        'root:IpAddressAllocationMode': network.allocationMode,
        'root:NetworkAdapterType': network.networkAdaptorType,
      };
      networks.push(networkObj);
    });
  }
  const busCombination = [
    { busNumber: 0, unitNumber: 0 },
    { busNumber: 0, unitNumber: 1 },
    { busNumber: 0, unitNumber: 2 },
    { busNumber: 0, unitNumber: 3 },
    { busNumber: 0, unitNumber: 4 },
    { busNumber: 0, unitNumber: 5 },
    { busNumber: 0, unitNumber: 6 },
    { busNumber: 1, unitNumber: 0 },
    { busNumber: 1, unitNumber: 1 },
    { busNumber: 1, unitNumber: 1 },
  ];
  config.storage.forEach((storageElem, index) => {
    const storageObj = {
      'root:SizeMb': storageElem.sizeMb,
      'root:UnitNumber': busCombination[index].unitNumber,
      'root:BusNumber': busCombination[index].busNumber,
      'root:AdapterType': 7,
      'root:ThinProvisioned': 'true',
      'root:StorageProfile': {
        $: {
          href: vdcStorageProfileLink,
          type: 'application/vnd.vmware.vcloud.vdcStorageProfile+xml',
        },
      },
      'root:overrideVmDefault': 'true',
    };
    storage.push(storageObj);
  });
  const request = {
    'root:CreateVmParams': {
      $: {
        powerOn: config.powerOn,
        'xmlns:root': 'http://www.vmware.com/vcloud/v1.5',
        'xmlns:ns3': 'http://schemas.dmtf.org/ovf/envelope/1',
      },
      'root:Description': config.description,
      'root:CreateVm': {
        $: { name: config.name },
        'root:GuestCustomizationSection': {
          'ns3:Info': 'Specifies Guest OS Customization Settings',
          'root:ComputerName': config.computerName,
        },
        'root:NetworkConnectionSection': {
          'ns3:Info': 'Network Configuration for VM',
          'root:PrimaryNetworkConnectionIndex': config.primaryNetworkIndex,
          'root:NetworkConnection': networks,
        },
        'root:VmSpecSection': {
          $: { Modified: 'true' },
          'ns3:Info': 'Virtual Machine specification',
          'root:OsType': config.osType,
          'root:NumCpus': config.cpuNumber,
          'root:NumCoresPerSocket': config.coreNumber,
          'root:CpuResourceMhz': {
            'root:Configured': '0',
          },
          'root:MemoryResourceMb': {
            'root:Configured': config.ram,
          },
          'root:DiskSection': {
            'root:DiskSettings': storage,
          },
          'root:HardwareVersion': 'vmx-19',
          'root:VirtualCpuType': 'VM64',
        },
        'root:ComputePolicy': {
          'root:VmSizingPolicy': {
            $: {
              href: computePolicyId,
            },
          },
        },
      },
      'root:Media': {
        $: {
          href: config.mediaHref,
          name: config.mediaName,
        },
      },
    },
  };
  const xml = builder.buildObject(request);
  const createdVm = await new VcloudWrapper().posts('user.vm.createVm', {
    headers: { Authorization: `Bearer ${authToken}` },
    body: xml,
    urlParams: { vdcId: formattedVdcId },
  });
  return Promise.resolve({
    __vcloudTask: createdVm.headers['location'],
  });
}

module.exports = userCreateVm;

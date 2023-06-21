import xml2js from 'xml2js';
import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';

import { vcloudQuery } from '../vdc/vcloudQuery';
/**
 *
 * @param {String} authToken
 * @param {String} vAppId
 * @param {String} vAppAction
 * @return {Promise}
 */
export async function userCreateNamedDisk(
  authToken,
  vdcId,
  namedDiskProperties,
) {
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
  const formattedVdcId = vdcId.split(':').slice(-1);
  const request = {
    'root:DiskCreateParams': {
      $: {
        'xmlns:root': 'http://www.vmware.com/vcloud/v1.5',
      },
      'root:Disk': {
        $: {
          name: namedDiskProperties.name,
          busType: namedDiskProperties.busType,
          busSubType: namedDiskProperties.busSubType,
          sizeMb: namedDiskProperties.size,
          sharingType: namedDiskProperties.sharingType,
        },
        'root:Description': namedDiskProperties.description,
        'root:StorageProfile': {
          $: {
            href: vdcStorageProfileLink,
            type: 'application/vnd.vmware.vcloud.vdcStorageProfile+xml',
          },
        },
      },
    },
  };
  const builder = new xml2js.Builder();
  const xmlRequest = builder.buildObject(request);
  const options = {
    headers: { Authorization: `Bearer ${authToken}` },
    body: xmlRequest,
  };

  const action = await new VcloudWrapper().posts('user.vdc.createNamedDisk', {
    ...options,
    headers: { Authorization: `Bearer ${authToken}` },
    urlParams: { vdcId: formattedVdcId },
  });
  console.log(action.headers);
  return Promise.resolve({
    __vcloudTask: action.headers['location'],
  });
}
module.exports = userCreateNamedDisk;

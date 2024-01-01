import xml2js, { Builder } from 'xml2js';
import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';
import { vcloudQuery } from '../vdc/vcloudQuery';
/**
 *
 * @param {String} authToken
 * @param {String} vAppId
 * @param {String} vAppAction
 * @return {Promise}
 */
export async function userUpdateNamedDisk(
  authToken,
  vdcId,
  nameDiskID,
  namedDiskProperties,
) {
  // const vdcStorageProfileLink = query.data.record[0].href;
  const vdcStorageProfileLink = `${process.env.VCLOUD_BASE_URL}/api/vdcStorageProfile/${namedDiskProperties.policyId}`;

  const formattedVdcId = vdcId.split(':').slice(-1);
  const request = {
    'root:Disk': {
      $: {
        'xmlns:root': 'http://www.vmware.com/vcloud/v1.5',
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
  };
  const builder = new Builder();
  const xmlRequest = builder.buildObject(request);
  const options = {
    headers: { Authorization: `Bearer ${authToken}` },
    body: xmlRequest,
  };

  const action = await new VcloudWrapper().posts('user.vdc.updateNamedDisk', {
    ...options,
    headers: { Authorization: `Bearer ${authToken}` },
    urlParams: { vdcId: formattedVdcId, nameDiskID },
  });
  return Promise.resolve({
    __vcloudTask: action.headers['location'],
  });
}

import xml2js, { Builder } from 'xml2js';
import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';
import { vcdConfig } from '../../vcdConfig';
/**
 * insert or eject a media from vm
 * @param {String} authToken
 * @param {String} vAppId
 * @param {Boolean} insert determines if a media should be inserted
 * @param {String} mediaName
 * @param {String} mediaHref
 * @param {String} mediaId
 * @return {Promise}
 */
export async function userInsertOrEjectVappMedia(
  authToken,
  vAppId,
  insert,
  mediaName = null,
  mediaId = null,
) {
  const request = {
    'root:MediaInsertOrEjectParams': {
      $: {
        'xmlns:root': 'http://www.vmware.com/vcloud/v1.5',
      },
    },
  };
  let action = 'ejectMedia';
  if (insert) {
    request['root:MediaInsertOrEjectParams']['root:Media'] = {
      $: {
        href: `${vcdConfig.baseUrl}/api/media/${mediaId}`,
        id: mediaId,
        name: mediaName,
      },
    };
    action = 'insertMedia';
  }
  const builder = new Builder();
  const xmlRequest = builder.buildObject(request);
  const response = await new VcloudWrapper().posts('user.vm.insertOrEjectVm', {
    urlParams: {
      vmId: vAppId,
      action,
    },
    headers: { Authorization: `Bearer ${authToken}` },
    body: xmlRequest,
  });
  return Promise.resolve({
    __vcloudTask: response.headers['location'],
  });
}

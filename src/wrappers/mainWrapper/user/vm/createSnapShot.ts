import xml2js, { Builder } from 'xml2js';
import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';
/**
 *
 * @param {String} authToken
 * @param {String} vAppId
 * @param {Object} snapShotProperties
 * @return {Promise}
 */
export async function userCreateSnapShot(
  authToken,
  vAppId,
  snapShotProperties,
) {
  const request = {
    'root:CreateSnapshotParams': {
      $: {
        'xmlns:root': 'http://www.vmware.com/vcloud/v1.5',
        memory: snapShotProperties.memory,
        quiesce: snapShotProperties.quiesce,
      },
    },
  };
  const builder = new Builder();

  const xmlRequest = builder.buildObject(request);
  const options = {
    urlParams: { vmId: vAppId },
    headers: { Authorization: `Bearer ${authToken}` },
    body: xmlRequest,
  };

  const action = await new VcloudWrapper().posts('user.vm.createSnapShot', {
    ...options,
    headers: { Authorization: `Bearer ${authToken}` },
  });
  return Promise.resolve({
    __vcloudTask: action.headers['location'],
  });
}

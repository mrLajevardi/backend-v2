const vCloudConfig = require('../../vcdConfig');
const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
/**

   * @param {String} vdcId
   */
export async function enableVdc(vdcId, session) {
  const vdcConfig = vCloudConfig.admin.vdc;
  // convert from urn:vcloud:org:vdcId -> vdcId
  vdcId = vdcId.split(':').slice(-1);

  const options = {
    headers: { Authorization: `Bearer ${session}` },
    urlParams: { vdcId: vdcId },
    body: null,
  };
  await new VcloudWrapper().posts('admin.vdc.enableVdc', options);
}
module.exports = enableVdc;

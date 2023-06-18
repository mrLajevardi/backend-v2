const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
const getEdgeCluster = require('../edgeGateway/getEdgeCluster');
/**
   * @param {String} vdcId
   * @param {String} session
   */
export async function updateNetworkProfile(vdcId, session) {
  const edgeClusterId = await getEdgeCluster(vdcId, session);
  const options = {
    headers: {Authorization: `Bearer ${session}`},
    urlParams: {vdcId: vdcId},
    body: {
      primaryEdgeCluster: null,
      secondaryEdgeCluster: null,
      servicesEdgeCluster: {
        backingId: edgeClusterId,
      },
      vdcNetworkSegmentProfileTemplateRef: null,
      vappNetworkSegmentProfileTemplateRef: null,
    },
  };
  const networkProfile = await new VcloudWrapper().posts('admin.vdc.updateNetworkProfile', options);
  return {
    __vcloudTask: networkProfile.headers.location,
  };
}
module.exports = updateNetworkProfile;

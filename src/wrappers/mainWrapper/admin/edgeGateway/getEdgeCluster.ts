import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';
/**
 * get available ip addresses from vcloud
 * @param {String} externalNetworkId
 * @param {String} authToken
 */
export async function getEdgeCluster(vdcId, authToken) {
  const options = {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    params: {
      page: 1,
      pageSize: 25,
      filter: `orgVdcId==${vdcId}`,
    },
  };
  const edgeClusters = await new VcloudWrapper().posts(
    'admin.edgeGateway.getEdgeClusters',
    options,
  );
  return Promise.resolve(edgeClusters.data.values[0]?.id);
}
module.exports = getEdgeCluster;

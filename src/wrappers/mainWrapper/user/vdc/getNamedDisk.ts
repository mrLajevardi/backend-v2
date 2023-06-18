const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
const vcloudQuery = require('../vdc/vcloudQuery');
/**
 *
 * @param {String} authToken
 * @param {String} vAppId
 * @param {String} vAppAction
 * @return {Promise}
 */
export async function userGetNamedDisk(authToken, vdcId) {
  const formattedVdcId = vdcId.split(':').slice(-1);
  const query = await vcloudQuery(authToken, {
    type: 'disk',
    format: 'records',
    page: 1,
    pageSize: 128,
    filterEncoded: true,
    links: true,
    filter: `vdc==${formattedVdcId}`,
  });

  return query.data.record;
}
module.exports = userGetNamedDisk;

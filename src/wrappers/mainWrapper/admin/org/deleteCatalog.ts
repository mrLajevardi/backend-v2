const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
/**
   * @param {String} session
   * @param {String} catalogId
   * @return {void}
   */
export async function deleteCatalog(session, catalogId) {
  const options = {
    headers: {Authorization: `Bearer ${session}`},
    urlParams: {catalogId: catalogId},
  };

  return await new VcloudWrapper().posts('admin.org.deleteCatalog', options);
}
module.exports = deleteCatalog;

const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
/**
 * get a single vm
 * @param {String} authToken
 * @param {String} vAppId
 * @return {Promise}
 */
async function userGetMediaItem(authToken, mediaItemId) {
  const mediaItem = await new VcloudWrapper().posts('user.vm.getMediaItem', {
    urlParams: {mediaItemId},
    headers: {Authorization: `Bearer ${authToken}`},
  });
  return mediaItem.data;
};

module.exports = userGetMediaItem;

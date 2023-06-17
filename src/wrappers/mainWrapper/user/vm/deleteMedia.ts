const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
/**
 * delete media by given id
 * @param {String} authToken
 * @param {String} mediaId
 */
async function userDeleteMedia(authToken, mediaId) {
  const options = {
    headers: {Authorization: `Bearer ${authToken}`},
    urlParams: {mediaId},
  };
  const deletedMedia = await new VcloudWrapper().posts('user.vm.deleteMedia', options);
  return Promise.resolve({
    __vcloudTask: deletedMedia.headers['location'],
  });
};
module.exports = userDeleteMedia;

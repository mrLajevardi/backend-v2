const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
export async function userUpdateMedia(authToken, mediaId, name) {
  const request = {
    name,
  };
  const options = {
    urlParams: {mediaId},
    headers: {Authorization: `Bearer ${authToken}`},
    body: request,
  };
  const action = await new VcloudWrapper().posts('user.vm.updateMedia', options);
  return Promise.resolve({
    __vcloudTask: action.headers['location'],
  });
};
module.exports = userUpdateMedia;
